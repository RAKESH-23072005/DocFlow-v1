# DocFlow Server

Backend API server for DocFlow, built with Express and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Environment Variables

Copy `env.example` to `.env` and configure:

- `PORT`: Server port (default: 5137)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend URL for CORS (e.g., `https://your-frontend.vercel.app`)
- `SESSION_SECRET`: Secret key for sessions
- `SMTP_*`: Email configuration (optional)

## API Routes

All API routes are prefixed with `/api/*`.

## Deployment

This project is configured for Render deployment. The build command is `npm run build` and the start command is `npm start`.
