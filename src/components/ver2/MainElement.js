import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "../../css/ver2/MainElement.module.css";

const MainElement = React.memo(({ sensorValue, mode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [hitEffects, setHitEffects] = useState([]);
  const [key, setKey] = useState(0);

  const lastValueRef = useRef(sensorValue);
  const lastHitTimeRef = useRef(0);
  const rotationTimeoutRef = useRef(null);
  const rotationIntervalRef = useRef(null);
  const prevModeRef = useRef();
  const rotationCountRef = useRef(0);

  const MIN_HIT_DELAY = 500;
  const TOTAL_IMAGES = 4;
  const ROTATION_DURATION = 300; // 1 second for full rotation
  const ROTATION_INTERVAL = ROTATION_DURATION / TOTAL_IMAGES;

  const createHitEffect = useCallback(() => {
    const size = Math.random() * 10 + 20;
    const x = Math.random() * 60 - 30;
    const y = Math.random() * 60 - 30;
    return { id: `${Date.now()}-${Math.random()}`, size, x, y };
  }, []);

  const startRotation = useCallback(() => {
    if (isRotating) return;
    
    setIsRotating(true);
    rotationCountRef.current = 0;
    
    const rotate = () => {
      rotationCountRef.current += 1;
      if (rotationCountRef.current >= TOTAL_IMAGES) {
        setIsRotating(false);
        return;
      }

      setCurrentImageIndex(prevIndex => (prevIndex + 1) % TOTAL_IMAGES);
      rotationTimeoutRef.current = setTimeout(rotate, ROTATION_INTERVAL);
    };

    rotate();
  }, [isRotating, TOTAL_IMAGES, ROTATION_INTERVAL]);

  useEffect(() => {
    if (prevModeRef.current === "complete" && mode !== "complete") {
      setKey(prevKey => prevKey + 1);
      lastValueRef.current = 0;
      lastHitTimeRef.current = 0;
      setHitEffects([]);
      setCurrentImageIndex(0);
      setIsRotating(false);
      rotationCountRef.current = 0;
    }
    prevModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (mode === "active") {
      const currentValue = sensorValue;
      const lastValue = lastValueRef.current;
      const valueDifference = currentValue - lastValue;
      const currentTime = Date.now();

      if (valueDifference > 0) {
        startRotation();

        if (currentTime - lastHitTimeRef.current >= MIN_HIT_DELAY) {
          const newEffects = [createHitEffect()];
          if (Math.random() < 0.5) {
            newEffects.push(createHitEffect());
          }

          setHitEffects(prev => [...prev, ...newEffects]);
          lastHitTimeRef.current = currentTime;

          setTimeout(() => {
            setHitEffects(prev => prev.filter(effect => !newEffects.includes(effect)));
          }, 1000);
        }
      }

      lastValueRef.current = currentValue;
    }
  }, [sensorValue, mode, startRotation, createHitEffect]);

  useEffect(() => {
    return () => {
      if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    };
  }, []);

  if (mode === "complete") {
    return null;
  }

  return (
    <div key={key} className={`${styles.mainElement} ${styles.squishyAppear}`}>
      {mode !== "active" && (
        <>
          <img
            src="/images/ver2/orbit.png"
            alt="Orbit Front"
            className={`${styles.orbitImage} ${styles.orbitFront} ${mode === "idle" ? styles.floatingOrbit : ''}`}
          />
          <img
            src="/images/ver2/orbit2.png"
            alt="Orbit Back"
            className={`${styles.orbitImage} ${styles.orbitBack} ${mode === "idle" ? styles.floatingOrbit : ''}`}
          />
        </>
      )}
      <div className={styles.mainImageContainer}>
        <img
          src={`/images/ver2/main${currentImageIndex + 1}.png`}
          alt={`Main ${currentImageIndex + 1}`}
          className={`${styles.mainImage} ${mode === "idle" ? styles.floatingMain : ''}`}
        />
      </div>
      <div className={styles.hitEffect}>
        {hitEffects.map(effect => (
          <div
            key={effect.id}
            className={styles.hitCircle}
            style={{
              width: `${effect.size}%`,
              paddingBottom: `${effect.size}%`,
              left: `calc(50% + ${effect.x}%)`,
              top: `calc(50% + ${effect.y}%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default MainElement;