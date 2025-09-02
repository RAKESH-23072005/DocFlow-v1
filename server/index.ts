import express from "express";
import { registerRoutes } from "./routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();

// Environment check
const isDevelopment = process.env.NODE_ENV === "development";

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  strictTransportSecurity: false,
  xContentTypeOptions: true,
  xFrameOptions: true,
  xXssProtection: true,
}));

// --- CORS ---
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isDevelopment || !origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// --- Rate Limiting ---
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
}));

// --- Body Parsing ---
app.use(express.json({
  limit: "10mb",
}));
app.use(express.urlencoded({
  extended: false,
  limit: "10mb",
  parameterLimit: 100,
}));

// --- Logging Middleware ---
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')?.substring(0, 100),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };
    
    if (isDevelopment) {
      console.log('Request:', logData);
    }
  });
  
  next();
});

// --- Routes ---
const server = await registerRoutes(app);

// --- Error Handling ---
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// --- 404 Handler ---
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;

// --- Server Startup ---
const port = process.env.PORT || 5137;

// Ensure server is ready before starting
try {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    if (isDevelopment) {
      console.log(`Dev server: http://localhost:${port}`);
    }
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
