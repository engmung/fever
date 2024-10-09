import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/ver2/MainElement.module.css";

const MainElement = React.memo(({ sensorValue, mode }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hitEffects, setHitEffects] = useState([]);
  const [key, setKey] = useState(0);

  const lastValueRef = useRef(sensorValue);
  const lastHitTimeRef = useRef(0);
  const prevModeRef = useRef();

  const MIN_HIT_DELAY = 500;
  const TOTAL_IMAGES = 4;
  const ROTATION_THRESHOLD = 5;

  const createHitEffect = () => {
    const size = Math.random() * 10 + 20;
    const x = Math.random() * 60 - 30;
    const y = Math.random() * 60 - 30;
    return { id: Date.now(), size, x, y };
  };

  useEffect(() => {
    if (prevModeRef.current === "complete" && mode !== "complete") {
      setKey(prevKey => prevKey + 1);
      lastValueRef.current = 0;
      lastHitTimeRef.current = 0;
      setHitEffects([]);
      setCurrentImageIndex(0);
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
        const newIndex = Math.floor(currentValue / ROTATION_THRESHOLD) % TOTAL_IMAGES;
        setCurrentImageIndex(newIndex);

        if (currentTime - lastHitTimeRef.current >= MIN_HIT_DELAY) {
          const newEffects = [];
          newEffects.push(createHitEffect());
          
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
  }, [sensorValue, mode]);

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
      <img
        src={`/images/ver2/main${currentImageIndex + 1}.png`}
        alt={`Main ${currentImageIndex + 1}`}
        className={`${styles.mainImage} ${mode === "idle" ? styles.floatingMain : ''}`}
      />
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