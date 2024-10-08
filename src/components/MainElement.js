import React, { useRef, useEffect, useState } from "react";
import styles from "../css/MainElement.module.css";

const MainElement = ({
  sensorValue,
  mode,
  particleArea = { width: 1080, height: 1920 },
}) => {
  const canvasRef = useRef(null);
  const mainImageRef = useRef(null);
  const orbitImageRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // 파티클 초기화
    const initParticles = () => {
      const newParticles = [];
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * particleArea.width,
          y: Math.random() * particleArea.height,
          size: Math.random() < 0.33 ? 5 : 3,
          color: Math.random() < 0.33 ? "#FF0000" : "#0000FF",
          vx: (Math.random() - 0.5) * 0.1, // 속도를 더 느리게 조정
          vy: (Math.random() - 0.5) * 0.1, // 속도를 더 느리게 조정
        });
      }
      setParticles(newParticles);
    };

    initParticles();

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      setParticles((prevParticles) => {
        let newParticles = [...prevParticles];

        if (mode === "active") {
          if (Math.random() < sensorValue / 2000) {
            // 파티클 생성 빈도 감소
            newParticles.push({
              x: Math.random() * particleArea.width,
              y: Math.random() * particleArea.height,
              size: Math.random() * 5 + 5,
              color: "#00FF00",
              vx: (Math.random() - 0.5) * 0.2, // 새 파티클의 속도도 조정
              vy: (Math.random() - 0.5) * 0.2,
            });
          }
        }

        return newParticles.map((particle) => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // 영역 경계에 도달하면 반대 방향으로 이동
          if (newX < 0 || newX > particleArea.width) {
            particle.vx *= -1;
            newX = particle.x + particle.vx;
          }
          if (newY < 0 || newY > particleArea.height) {
            particle.vy *= -1;
            newY = particle.y + particle.vy;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            // 속도 변경 확률을 매우 낮게 설정하여 부드러운 움직임 유지
            vx:
              Math.random() < 0.001 ? (Math.random() - 0.5) * 0.1 : particle.vx,
            vy:
              Math.random() < 0.001 ? (Math.random() - 0.5) * 0.1 : particle.vy,
          };
        });
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sensorValue, mode, particleArea]);

  useEffect(() => {
    if (mode === "active" && sensorValue % 10 === 0 && sensorValue !== 0) {
      if (mainImageRef.current) {
        mainImageRef.current.classList.add(styles.shake);
        setTimeout(() => {
          if (mainImageRef.current) {
            mainImageRef.current.classList.remove(styles.shake);
          }
        }, 500);
      }
    }
  }, [sensorValue, mode]);

  return (
    <div className={styles.mainElement}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      {mode !== "complete" && (
        <>
          <img
            ref={orbitImageRef}
            src="/path-to-orbit-image.png"
            alt="Orbit"
            className={styles.orbitImage}
          />
          <img
            ref={mainImageRef}
            src="/path-to-main-image.png"
            alt="Main"
            className={`${styles.mainImage} ${
              mode === "idle" ? styles.floating : ""
            }`}
          />
        </>
      )}
    </div>
  );
};

export default MainElement;
