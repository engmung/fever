import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/ver4/MainElement.module.css";

const MainElement = React.memo(({ sensorValue, mode }) => {
  const mainImageRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hitEffects, setHitEffects] = useState([]);
  const [key, setKey] = useState(0);

  const lastValueRef = useRef(sensorValue);
  const cumulativeIncreaseRef = useRef(0);
  const lastHitTimeRef = useRef(0);
  const prevModeRef = useRef();

  const MIN_HIT_DELAY = 500;
  const SHAKE_THRESHOLD = 3;

  const createHitEffect = () => {
    const size = Math.random() * 10 + 20;
    const x = Math.random() * 90 - 60;
    const y = Math.random() * 160 - 120;
    return { id: Date.now(), size, x, y };
  };

  useEffect(() => {
    if (prevModeRef.current === "complete" && mode !== "complete") {
      setKey(prevKey => prevKey + 1);
      lastValueRef.current = 0;
      cumulativeIncreaseRef.current = 0;
      lastHitTimeRef.current = 0;
      setHitEffects([]);
      setIsShaking(false);
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
        cumulativeIncreaseRef.current += valueDifference;

        if (cumulativeIncreaseRef.current >= SHAKE_THRESHOLD && !isShaking) {
          setIsShaking(true);
          cumulativeIncreaseRef.current = 0;

          if (mainImageRef.current) {
            mainImageRef.current.classList.add(styles.shaking);

            setTimeout(() => {
              if (mainImageRef.current) {
                mainImageRef.current.classList.remove(styles.shaking);
                setIsShaking(false);
              }
            }, 1000);
          }
        }

        if (currentTime - lastHitTimeRef.current >= MIN_HIT_DELAY) {
          const newEffects = [];
          newEffects.push(createHitEffect());
          
          if (Math.random() < 0.3) {
            newEffects.push(createHitEffect());
          }

          setHitEffects(prev => [...prev, ...newEffects]);
          lastHitTimeRef.current = currentTime;

          setTimeout(() => {
            setHitEffects(prev => prev.filter(effect => !newEffects.includes(effect)));
          }, 6000);
        }
      } else if (valueDifference < 0) {
        cumulativeIncreaseRef.current = 0;
      }

      lastValueRef.current = currentValue;
    }
  }, [sensorValue, mode, isShaking]);

  if (mode === "complete") {
    return null;
  }

  return (
    <div key={key} className={`${styles.mainElement} ${styles.squishyAppear}`}>
      {mode !== "active" && (
        <>
          <img
            src="/images/ver4/orbit.png"
            alt="Orbit Front"
            className={`${styles.orbitImage} ${styles.orbitFront} ${mode === "idle" ? styles.floatingOrbit : ''}`}
          />
          <img
            src="/images/ver4/orbit2.png"
            alt="Orbit Back"
            className={`${styles.orbitImage} ${styles.orbitBack} ${mode === "idle" ? styles.floatingOrbit : ''}`}
          />
        </>
      )}
      <div className={styles.movingElements}>
        <img
          ref={mainImageRef}
          src="/images/ver4/main.png"
          alt="Main"
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
    </div>
  );
});

export default MainElement;