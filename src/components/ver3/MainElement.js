import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/ver3/MainElement.module.css";

const MainElement = React.memo(({ sensorValue, mode }) => {
  const mainImageRef = useRef(null);
  const [hitEffects, setHitEffects] = useState([]);
  const [key, setKey] = useState(0);

  const lastValueRef = useRef(sensorValue);
  const lastHitTimeRef = useRef(0);
  const prevModeRef = useRef();

  const MIN_HIT_DELAY = 500;

  const createHitEffect = () => {
    return { id: Date.now() };
  };

  useEffect(() => {
    if (prevModeRef.current === "complete" && mode !== "complete") {
      setKey(prevKey => prevKey + 1);
      lastValueRef.current = 0;
      lastHitTimeRef.current = 0;
      setHitEffects([]);
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
        if (currentTime - lastHitTimeRef.current >= MIN_HIT_DELAY) {
          const newEffect = createHitEffect();
          setHitEffects(prev => [...prev, newEffect]);
          lastHitTimeRef.current = currentTime;

          setTimeout(() => {
            setHitEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
          }, 3000);
        }
      }

      lastValueRef.current = currentValue;
    }
  }, [sensorValue, mode]);

  const movingElementsStyle = {
    transform: `translateY(${-sensorValue}px)`,
    transition: 'transform 0.3s ease-out'
  };

  if (mode === "complete") {
    return null;
  }

  return (
    <div key={key} className={`${styles.mainElement} ${styles.squishyAppear}`}>
      {mode !== "active" && (
        <img
          src="/images/ver3/orbit2.png"
          alt="Orbit Back"
          className={`${styles.orbitImage} ${styles.orbitBack} ${mode === "idle" ? styles.floatingOrbit : ''}`}
        />
      )}
      <div className={styles.movingElements} style={movingElementsStyle}>
        <img
          ref={mainImageRef}
          src="/images/ver3/main.png"
          alt="Main"
          className={`${styles.mainImage} ${mode === "idle" ? styles.floatingMain : ''}`}
        />
        <div className={styles.hitEffect}>
          {hitEffects.map(effect => (
            <div key={effect.id} className={styles.hitCircle} />
          ))}
        </div>
      </div>
      {mode !== "active" && (
        <img
          src="/images/ver3/orbit.png"
          alt="Orbit Front"
          className={`${styles.orbitImage} ${styles.orbitFront} ${mode === "idle" ? styles.floatingOrbit : ''}`}
        />
      )}
    </div>
  );
});

export default MainElement;