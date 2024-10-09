import React, { useRef, useEffect, useState } from "react";
import styles from "../css/Particle.module.css";

const Particle = ({ sensorValue, mode, initialParticleCount = 40, maxParticleCount = 100 }) => {
  const [particles, setParticles] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const createParticle = (x, y, type) => ({
    x,
    y,
    type,
    vx: 0,
    vy: 0,
    baseSpeed: Math.random() * 20 + 10,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
  });

  const createConfetti = () => ({
    x: Math.random() * window.innerWidth,
    y: -20,
    type: Math.floor(Math.random() * 3) + 1,
    speedY: Math.random() * 3 + 2,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 5 - 2.5,
    isLarge: Math.random() < 0.1,
    delay: Math.random() * 3000, // Add a random delay up to 3 seconds
  });

  useEffect(() => {
    const centerY = window.innerHeight / 2;

    if (mode === "idle" || mode === "active") {
      setParticles(prev => {
        const particleCount = Math.min(
          initialParticleCount + (mode === "active" ? Math.floor(sensorValue / 2) : 0),
          maxParticleCount
        );
        return Array(particleCount).fill().map((_, index) => {
          if (index < prev.length && (mode === "idle" ? prev[index].type !== 3 : true)) {
            return prev[index];
          } else {
            const type = mode === "idle" ? (Math.random() < 0.5 ? 1 : 2) 
                       : (Math.random() < 0.7 ? (Math.random() < 0.5 ? 1 : 2) : 3);
            return createParticle(
              Math.random() * window.innerWidth,
              centerY + (Math.random() - 0.5) * (window.innerHeight / 4),
              type
            );
          }
        });
      });
      setConfetti([]);
    } else if (mode === "complete") {
      setParticles([]);
      setConfetti(Array(100).fill().map(createConfetti));
    }
  }, [mode, sensorValue, initialParticleCount, maxParticleCount]);

  const animateParticles = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;

      if (mode === "idle" || mode === "active") {
        setParticles(prevParticles =>
          prevParticles.map(particle => {
            const speedFactor = 7 + (sensorValue / 100)*0.5*50;
            const frequencyX = 0.5 * Math.PI;
            const frequencyY = 0.7 * Math.PI;
            
            particle.vx = Math.cos(frequencyX * time / 1000 + particle.phaseX) * particle.baseSpeed * speedFactor;
            particle.vy = Math.sin(frequencyY * time / 1000 + particle.phaseY) * particle.baseSpeed * speedFactor / 3;

            let x = particle.x + particle.vx * deltaTime;
            let y = particle.y + particle.vy * deltaTime;

            x = (x + window.innerWidth) % window.innerWidth;
            y = (y + window.innerHeight) % window.innerHeight;

            return { ...particle, x, y };
          })
        );
      } else if (mode === "complete") {
        setConfetti(prevConfetti =>
          prevConfetti.map(confetti => {
            if (time < confetti.delay) return confetti;

            confetti.y += confetti.speedY;
            confetti.x += confetti.speedX;
            confetti.rotation += confetti.rotationSpeed;

            if (confetti.y > window.innerHeight) {
              confetti.y = -40;
              confetti.x = Math.random() * window.innerWidth;
            }

            return confetti;
          })
        );
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mode, sensorValue]);

  return (
    <div className={styles.particleContainer}>
      {particles.map((particle, index) => (
        <div
          key={`particle-${index}`}
          className={`${styles.particle} ${styles[`particle${particle.type}`]}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
          }}
        />
      ))}
      {confetti.map((conf, index) => (
        <div
          key={`confetti-${index}`}
          className={`${styles.particle} ${styles[`particle${conf.type}`]}`}
          style={{
            left: `${conf.x}px`,
            top: `${conf.y}px`,
            transform: `rotate(${conf.rotation}deg) scale(${conf.isLarge ? 2 : 1})`,
          }}
        />
      ))}
    </div>
  );
};

export default Particle;