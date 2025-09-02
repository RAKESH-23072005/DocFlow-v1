# DocFlow Deployment Guide

This guide explains how to deploy the separated DocFlow applications to Vercel (frontend) and Render (backend).

## Project Structure

After restructuring, you now have two separate applications:

- `client/` - Frontend (React + Vite) → Deploy to **Vercel**
- `server/` - Backend (Express + TypeScript) → Deploy to **Render**

## Frontend Deployment (Vercel)

### 1. Prepare the Client Repository

1. Create a new Git repository for the frontend:
   ```bash
   cd client
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/docflow-client.git
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and create a new project
2. Import your GitHub repository (`docflow-client`)
3. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in Vercel:

- `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com/api`)

### 4. Deploy

Vercel will automatically deploy your application. The frontend will be available at `https://your-app.vercel.app`.

## Backend Deployment (Render)

### 1. Prepare the Server Repository

1. Create a new Git repository for the backend:
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/docflow-server.git
   git push -u origin main
   ```

### 2. Set Up Environment Variables

1. Prepare your environment variables for the backend
2. Note down your frontend URL for CORS configuration

### 3. Deploy to Render

1. Go to [Render](https://render.com) and create a new Web Service
2. Connect your GitHub repository (`docflow-server`)
3. Configure the service:
   - **Name**: `docflow-server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 4. Environment Variables

Add these environment variables in Render:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-app.vercel.app`)
- `SESSION_SECRET`: A secure random string

### 5. Deploy

Render will build and deploy your application. The backend will be available at `https://your-service.onrender.com`.

## Connecting Frontend and Backend

### 1. Update Frontend API URL

Once your backend is deployed, update the frontend's environment variable:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Update `VITE_API_URL` to point to your Render backend:
   ```
   VITE_API_URL=https://your-service.onrender.com/api
   ```
4. Redeploy the frontend

### 2. Update Backend CORS

1. Go to your Render service dashboard
2. Navigate to Environment → Environment Variables
3. Update `CORS_ORIGIN` to your Vercel frontend URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
4. Redeploy the backend

## Testing the Deployment

1. **Frontend**: Visit your Vercel URL and verify the app loads
2. **Backend**: Test API endpoints at `https://your-service.onrender.com/api/health`
3. **Integration**: Verify frontend can communicate with backend APIs

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` is set correctly in backend
2. **API 404**: Check that API routes are prefixed with `/api/`
3. **Build Failures**: Check that all dependencies are in `package.json`

### Debugging

- **Frontend**: Check Vercel build logs for build errors
- **Backend**: Check Render logs for runtime errors
- **Network**: Use browser dev tools to inspect API requests

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Restrict CORS origins to your specific domains
3. **Rate Limiting**: Backend includes rate limiting by default
4. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Render**: Built-in logs and metrics
- **Database**: Monitor database performance and connections

## Updates and Maintenance

### Frontend Updates

1. Make changes in `client/` directory
2. Commit and push to GitHub
3. Vercel will automatically redeploy

### Backend Updates

1. Make changes in `server/` directory
2. Commit and push to GitHub
3. Render will automatically redeploy

### Backend Updates

1. Make changes in `server/` directory
2. Test locally with `npm run dev`
3. Deploy backend - Render will handle the deployment

## Cost Optimization

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month

## Support

- **Vercel**: [Documentation](https://vercel.com/docs)
- **Render**: [Documentation](https://render.com/docs)
