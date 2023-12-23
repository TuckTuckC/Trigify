import React, { useRef, useEffect } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  const drawTriangle = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(50, 50); // This is the first vertex of the triangle
    ctx.lineTo(100, 150); // Second vertex
    ctx.lineTo(50, 150); // Third vertex
    ctx.closePath();

    // the outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawTriangle(context);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <canvas ref={canvasRef} width={200} height={200} />
      </header>
    </div>
  );
}

export default App;
