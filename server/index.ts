import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static Angular files from www directory (production build)
app.use(express.static(path.join(process.cwd(), 'www')));

// Serve static assets from assets directory
app.use('/assets', express.static(path.join(process.cwd(), 'src/assets')));

// Serve Ionic/Angular resources
app.use('/svg', express.static(path.join(process.cwd(), 'node_modules/ionicons/dist/ionicons/svg')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve Angular index.html for all non-API routes
  app.get('*', (req, res) => {
    // Try to serve from www first (production build), fall back to src (development)
    const wwwPath = path.join(process.cwd(), 'www/index.html');
    const srcPath = path.join(process.cwd(), 'src/index.html');
    
    // Using fs API without require since we're using ESM
    import('fs').then(fs => {
      if (fs.existsSync(wwwPath)) {
        res.sendFile(wwwPath);
      } else {
        res.sendFile(srcPath);
      }
    }).catch(() => {
      // Default fallback
      res.sendFile(srcPath);
    });
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
