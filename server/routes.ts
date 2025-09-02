import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

// Enhanced file validation
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

function isValidImageFile(file: any): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` };
  }
  
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: `File type ${file.mimetype} not allowed. Only images are permitted.` };
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return { valid: false, error: `File extension ${fileExtension} not allowed` };
  }
  
  return { valid: true };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 && !/[\r\n]/.test(email);
}

function sanitizeText(input: string, maxLen: number): string {
  const truncated = input.slice(0, maxLen);
  return truncated.replace(/[&<>"]+/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m] as string));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced rate limiting for different endpoints
  const contactLimiter = rateLimit({ 
    windowMs: 10 * 60 * 1000, 
    max: 20, 
    standardHeaders: true, 
    legacyHeaders: false,
    message: 'Too many contact form submissions, please try again later.'
  });
  
  const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 uploads per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many uploads, please try again later.'
  });

  // Health check endpoint for smoke testing
  app.get("/api/health", (req: any, res: any) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Enhanced contact endpoint with better validation
  app.post("/api/contact", contactLimiter, async (req: any, res: any, next: any) => {
    try {
      const { name, email, subject, message } = req.body ?? {};
      
      // Enhanced validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          message: "Missing required fields",
          required: ['name', 'email', 'subject', 'message'],
          received: Object.keys(req.body || {}).filter((key: string) => req.body[key])
        });
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Enhanced sanitization
      const safeName = sanitizeText(String(name), 100);
      const safeSubject = sanitizeText(String(subject), 150);
      const safeMessage = sanitizeText(String(message), 5000);
      
      // Email configuration
      const to = process.env.TO_EMAIL || "docflowimagecompressor.dev@gmail.com";
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: process.env.SMTP_TLS === "true" ? {
          rejectUnauthorized: false,
        } : undefined,
      });

      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || "docflowimagecompressor.dev@gmail.com",
        replyTo: email,
        to,
        subject: `[Contact] ${safeSubject}`,
        text: `From: ${safeName} <${email}>\n\n${String(message).slice(0, 5000)}`,
        html: `<p><strong>From:</strong> ${safeName} &lt;${email}&gt;</p><p>${safeMessage.replace(/\n/g, "<br/>")}</p>`,
      });

      return res.json({ 
        message: "Message sent successfully", 
        id: info.messageId,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  });

  // Image upload endpoint with validation
  app.post("/api/upload", uploadLimiter, async (req: any, res: any, next: any) => {
    try {
      // This would be implemented with multer for file uploads
      // For now, return a placeholder response
      res.json({ 
        message: "Upload endpoint configured",
        maxFileSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        allowedTypes: ALLOWED_MIME_TYPES,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
