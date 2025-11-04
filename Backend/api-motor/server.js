import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const IP_ARDUINO = "10.238.6.10"; // La IP de tu Arduino

// Rutas para controlar motor desde React
app.post("/motor/:comando", async (req, res) => {
  const comando = req.params.comando;
  console.log("Comando recibido:", comando);

  try {
    const response = await fetch(`http://${IP_ARDUINO}/motor/${comando}`, { method: "POST" });
    const text = await response.text();
    res.send(`Arduino respondió: ${text}`);
  } catch (err) {
    console.error("Error conectando al Arduino:", err);
    res.status(500).send("No se pudo enviar comando al Arduino");
  }
});

const server = app.listen(PORT, () => {
  console.log(`API HTTP corriendo en puerto ${PORT}`);
});

// WebSocket para enviar distancia en tiempo real a React
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("WebSocket conectado");

  const interval = setInterval(async () => {
    try {
      // Pedimos la distancia al Arduino
      const response = await fetch(`http://${IP_ARDUINO}/distancia`);
      const data = await response.json(); // Arduino debe responder { distancia: 50 }
      ws.send(JSON.stringify({ distancia: data.distancia }));
    } catch {
      ws.send(JSON.stringify({ distancia: 0 }));
    }
  }, 1000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("WebSocket desconectado");
  });
});
