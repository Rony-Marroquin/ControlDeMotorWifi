import { useEffect, useState } from "react";

function App() {
  const [distancia, setDistancia] = useState(0);
  const [wsConectado, setWsConectado] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket conectado");
      setWsConectado(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.distancia !== undefined) setDistancia(data.distancia);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setWsConectado(false);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado");
      setWsConectado(false);
    };

    return () => ws.close();
  }, []);

  const enviarComando = async (comando) => {
    await fetch(`http://localhost:3000/motor/${comando}`, { method: "POST" });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Distancia en tiempo real: {distancia} cm</h1>
      {!wsConectado && <p style={{ color: "red" }}>WebSocket desconectado</p>}

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
