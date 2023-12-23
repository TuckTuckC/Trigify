import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [vertices, setVertices] = useState([
    { x: 50, y: 50 }, // Vertex 1
    { x: 100, y: 150 }, // Vertex 2
    { x: 50, y: 150 } // Vertex 3
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingVertex, setDraggingVertex] = useState(-1);

  const drawTriangle = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas

    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#666666';
    ctx.stroke();
    ctx.fillStyle = "#FFCC00";
    ctx.fill();

    // Draw dots on vertices
    vertices.forEach((vertex, index) => {
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = draggingVertex === index ? 'red' : 'black';
      ctx.fill();
    });
  };

  const checkHover = (x, y) => {
    const hoverRadius = 5;
    return vertices.findIndex(vertex => {
      return Math.sqrt((vertex.x - x) ** 2 + (vertex.y - y) ** 2) < hoverRadius;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawTriangle(context);

    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      const hoverVertex = checkHover(x, y);
      if (hoverVertex !== -1) {
        setIsDragging(true);
        setDraggingVertex(hoverVertex);
      }
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      setVertices(prevVertices => {
        const updatedVertices = [...prevVertices];
        updatedVertices[draggingVertex] = { x, y };
        return updatedVertices;
      });

      drawTriangle(context);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggingVertex(-1);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggingVertex, vertices]);

  return (
    <div className="App">
      <header className="App-header">
        <canvas ref={canvasRef} width={200} height={200} />
      </header>
    </div>
  );
}

export default App;
