# DocFlow

A document management application with separated frontend and backend for easy deployment.

## Project Structure

This project has been restructured into two separate, deployable applications:

- **`client/`** - Frontend (React + Vite) → Deploy to **Vercel**
- **`server/`** - Backend (Express + TypeScript) → Deploy to **Render**

## Quick Start

### Frontend Development
```bash
cd client
npm install
npm run dev
```

### Backend Development
```bash
cd server
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Frontend (Vercel)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL`

### Backend (Render)
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables: `CORS_ORIGIN`, `SESSION_SECRET`

## Features

- ✅ **No Database Required** - Uses in-memory storage
- ✅ **Separate Deployments** - Frontend and backend can be deployed independently
- ✅ **CORS Configured** - Cross-origin requests properly handled
- ✅ **Environment Variables** - Easy configuration for different environments
- ✅ **TypeScript** - Full type safety across both applications

## Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Restructure Summary](./RESTRUCTURE_SUMMARY.md) - Details of the project restructuring

## Development

Each application has its own:
- `package.json` with specific dependencies
- TypeScript configuration
- Build and development scripts
- Environment variable templates
- Deployment configurations

## Notes

- No database setup required
- Both applications are completely independent
- Environment variables need to be configured in deployment platforms
- CORS must be set up between frontend and backend URLs
