import { useEffect, useState } from "react";

function App() {
  const [distancia, setDistancia] = useState(0);

  // Cambia esta URL por la de tu backend en Render
  const API_URL = "https://api-motor.onrender.com"; 

  // Polling para actualizar distancia cada 500 ms
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/sensor`);
        const data = await res.json();
        if (data.distancia !== undefined) setDistancia(data.distancia);
      } catch (err) {
        console.error("Error al obtener distancia:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [API_URL]);

  // Función para enviar comandos al motor
  const enviarComando = async (comando) => {
    try {
      await fetch(`${API_URL}/motor/${comando}`, { method: "POST" });
    } catch (err) {
      console.error("Error al enviar comando:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Distancia en tiempo real: {distancia} cm</h1>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => enviarComando("derecha")}>Derecha</button>
        <button onClick={() => enviarComando("izquierda")}>Izquierda</button>
        <button onClick={() => enviarComando("detener")}>Detener</button>
        <button onClick={() => enviarComando("auto")}>Automático</button>
      </div>
    </div>
  );
}

export default App;
