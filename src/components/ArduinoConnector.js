import React, { useEffect, useState, useCallback } from "react";

const ArduinoConnector = ({ setSensorValue }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCompletion = useCallback(() => {
    setIsCompleted(true);
    setSensorValue(100);
    
    // 16초 후에 초기화
    setTimeout(() => {
      setIsCompleted(false);
      setSensorValue(0);
    }, 15000);
  }, [setSensorValue]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const receivedValue = parseInt(event.data);
      if (!isNaN(receivedValue) && !isCompleted) {
        if (receivedValue >= 100) {
          handleCompletion();
        } else {
          setSensorValue(receivedValue);
        }
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [setSensorValue, isCompleted, handleCompletion]);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 1000,
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '5px',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isConnected ? (
        <p>Connected to Arduino</p>
      ) : (
        <p>Connecting to Arduino...</p>
      )}
    </div>
  );
};

export default ArduinoConnector;