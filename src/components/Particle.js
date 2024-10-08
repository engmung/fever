import React, { useRef, useEffect } from "react";

const Particle = ({ sensorValue, mode }) => {
  const canvasRef = useRef(null);
  const particlesArrayRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticle = (x, y) => {
      return {
        x,
        y,
        radius: Math.random() * 2 + 1,
        color: getParticleColor(),
        velocity: {
          x: ((Math.random() - 0.5) * sensorValue) / 25,
          y: ((Math.random() - 0.5) * sensorValue) / 25,
        },
        life: Math.random() * 40 + 40,
      };
    };

    const getParticleColor = () => {
      switch (mode) {
        case "idle":
          return `rgba(70, 163, 255, ${Math.random() * 0.5 + 0.5})`; // 기본 색상
        case "active":
          return `rgba(0, 204, 0, ${Math.random() * 0.5 + 0.5})`; // 동작 색상
        case "complete":
          return `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.5})`; // 완료 색상
        default:
          return `rgba(70, 163, 255, ${Math.random() * 0.5 + 0.5})`;
      }
    };

    const updateAndDrawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 새 파티클 생성
      if (sensorValue > 50) {
        const particlesToAdd = Math.floor((sensorValue - 50) / 5);
        for (let i = 0; i < particlesToAdd; i++) {
          particlesArrayRef.current.push(
            createParticle(canvas.width / 2, canvas.height / 2)
          );
        }
      }

      // 파티클 업데이트 및 그리기
      for (let i = particlesArrayRef.current.length - 1; i >= 0; i--) {
        const p = particlesArrayRef.current[i];
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.life--;

        if (p.life <= 0) {
          particlesArrayRef.current.splice(i, 1);
          continue;
        }

        const scaledRadius = p.radius * (1 + (sensorValue - 50) / 100);

        ctx.beginPath();
        ctx.arc(p.x, p.y, scaledRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      requestAnimationFrame(updateAndDrawParticles);
    };

    updateAndDrawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [sensorValue, mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    ></canvas>
  );
};

export default Particle;
