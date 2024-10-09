import React, { useRef, useEffect, useState } from "react";
import styles from "../../css/ver1/MainElement.module.css";

const MainElement = ({ sensorValue, mode }) => {
  const mainImageRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);
  const [hitEffects, setHitEffects] = useState([]);
  const [key, setKey] = useState(0);

  const lastValueRef = useRef(sensorValue);
  const cumulativeIncreaseRef = useRef(0);
  const lastHitTimeRef = useRef(0);

  const prevModeRef = useRef();

  const MIN_HIT_DELAY = 500; // 히트 이펙트 최소 발생 간격 (밀리초)

  // 히트 이펙트를 생성하는 함수
  const createHitEffect = () => {
    return { id: Date.now(), size: 25 }; // 크기 25% 고정 (필요 시 랜덤화 가능)
  };

  // 모드 변경에 따른 리셋 로직 실행
  useEffect(() => {
    if (prevModeRef.current === "complete" && mode !== "complete") {
      // 모드가 'complete'에서 다른 모드로 변경될 때
      setKey(prevKey => prevKey + 1); // key를 변경하여 컴포넌트 리렌더링 유도
      lastValueRef.current = 0;
      cumulativeIncreaseRef.current = 0;
      lastHitTimeRef.current = 0;
      setHitEffects([]);
      setIsShaking(false);
    }
    prevModeRef.current = mode;
  }, [mode]);

  // sensorValue와 mode에 따른 흔들림 및 히트 이펙트 로직
  useEffect(() => {
    if (mode === "active") {
      const currentValue = sensorValue;
      const lastValue = lastValueRef.current;
      const valueDifference = currentValue - lastValue;
      const currentTime = Date.now();

      if (valueDifference > 0) {
        // sensorValue가 증가한 경우 누적 증가량 업데이트
        cumulativeIncreaseRef.current += valueDifference;

        // 누적 증가량이 임계값 이상이고 흔들림 애니메이션이 진행 중이 아닐 때 흔들림 트리거
        if (cumulativeIncreaseRef.current >= 3 && !isShaking) {
          setIsShaking(true);
          cumulativeIncreaseRef.current = 0;

          if (mainImageRef.current) {
            mainImageRef.current.classList.add(styles.shaking);

            setTimeout(() => {
              if (mainImageRef.current) {
                mainImageRef.current.classList.remove(styles.shaking);
                setIsShaking(false);
              }
            }, 500); // 흔들림 애니메이션 지속 시간
          }
        }

        // 히트 이펙트 트리거 (최소 딜레이 적용)
        if (currentTime - lastHitTimeRef.current >= MIN_HIT_DELAY) {
          const newEffect = createHitEffect();
          setHitEffects(prev => [...prev, newEffect]);
          lastHitTimeRef.current = currentTime;

          // 히트 이펙트를 애니메이션 후 제거
          setTimeout(() => {
            setHitEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
          }, 2500); // 히트 이펙트 지속 시간
        }
      } else if (valueDifference < 0) {
        // sensorValue가 감소한 경우 누적 증가량 리셋
        cumulativeIncreaseRef.current = 0;
      }

      // 마지막 sensorValue 업데이트
      lastValueRef.current = currentValue;
    }
  }, [sensorValue, mode, isShaking]);

  // 완료 모드에서는 아무것도 렌더링하지 않음
  if (mode === "complete") {
    return null;
  }

  return (
    <div key={key} className={`${styles.mainElement} ${styles.squishyAppear}`}>
      {/* mode가 "active"가 아닐 때만 orbit 이미지를 렌더링 */}
      {mode !== "active" && (
        <img
          src="/images/orbit.png"
          alt="Orbit"
          className={`${styles.orbitImage} ${mode === "idle" ? styles.floatingOrbit : ''}`}
        />
      )}
      <img
        ref={mainImageRef}
        src="/images/main.png"
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
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MainElement;
