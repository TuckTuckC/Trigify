import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [vertices, setVertices] = useState([
    { x: 50, y: 50 }, // Vertex 1
    { x: 100, y: 150 }, // Vertex 2
    { x: 50, y: 150 } // Vertex 3
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingVertex, setDraggingVertex] = useState(-1);

  const drawText = (ctx, text, x, y) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#5FBDFF';
    ctx.fillText(text, x, y);
  };
  
  const calculateAngles = (vertices) => {
    const length = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const a = length(vertices[1], vertices[2]);
    const b = length(vertices[0], vertices[2]);
    const c = length(vertices[0], vertices[1]);
  
    // Calculate angles using the law of cosines
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
    const angleC = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI);
  
    return [angleA, angleB, angleC];
  };

  const drawTriangle = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
  
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.closePath();
  
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  
    // Draw dots on vertices
    vertices.forEach((vertex, index) => {
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = draggingVertex === index ? '#5FBDFF' : 'white';
      ctx.fill();
    });
  
    const angles = calculateAngles(vertices);
  
    // Draw text for angles
    drawText(ctx, `${angles[0].toFixed(1)}°`, vertices[0].x + 10, vertices[0].y - 10);
    drawText(ctx, `${angles[1].toFixed(1)}°`, vertices[1].x + 10, vertices[1].y - 10);
    drawText(ctx, `${angles[2].toFixed(1)}°`, vertices[2].x + 10, vertices[2].y - 10);
  
    const midpoints = [
      { x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 },
      { x: (vertices[1].x + vertices[2].x) / 2, y: (vertices[1].y + vertices[2].y) / 2 },
      { x: (vertices[0].x + vertices[2].x) / 2, y: (vertices[0].y + vertices[2].y) / 2 }
    ];
  
    drawText(ctx, 'Face 1', midpoints[0].x, midpoints[0].y);
    drawText(ctx, 'Face 2', midpoints[1].x, midpoints[1].y);
    drawText(ctx, 'Face 3', midpoints[2].x, midpoints[2].y);
  };
  

  const checkHover = (x, y) => {
    const hoverRadius = 5;
    return vertices.findIndex(vertex => {
      return Math.sqrt((vertex.x - x) ** 2 + (vertex.y - y) ** 2) < hoverRadius;
    });
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
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
