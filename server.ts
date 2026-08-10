import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", (data) => {
      console.log("Message received:", data);
      // Broadcast to all clients
      io.emit("message", {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });

      // Simulate an agent response if it's a user message
      if (data.sender === "user") {
        setTimeout(() => {
          io.emit("message", {
            text: "¡Hola! Gracias por contactarnos. Un asesor de EliteDrive se pondrá en contacto contigo en breve.",
            sender: "agent",
            id: (Date.now() + 1).toString(),
            timestamp: new Date().toISOString(),
          });
        }, 1500);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
