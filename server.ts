import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API for "New Softwares" or projects
  app.get("/api/softwares", (req, res) => {
    res.json([
      { id: 1, name: "VS Code", category: "IDE", icon: "Code" },
      { id: 2, name: "Postman", category: "API Testing", icon: "Globe" },
      { id: 3, name: "Docker", category: "Containerization", icon: "Layout" },
      { id: 4, name: "Figma", category: "Design", icon: "Palette" },
      { id: 5, name: "Git", category: "Version Control", icon: "Github" },
      { id: 6, name: "PostgreSQL", category: "Database", icon: "Database" },
      { id: 7, name: "Redis", category: "Caching", icon: "Zap" },
      { id: 8, name: "Vercel", category: "Deployment", icon: "Globe" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
