import React, { useEffect, useState } from 'react';

const Gauge = ({ sensorValue, mode }) => {
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    // 센서 값이 0~100 사이인지 확인
    const clampedValue = Math.max(0, Math.min(sensorValue, 100));
    setFillWidth(clampedValue);
  }, [sensorValue]);

  if (mode === 'idle' || mode === 'complete') {
    return null;
  }

  // 그라데이션 ID를 고유하게 설정하여 여러 게이지가 있을 경우 충돌 방지
  const gradientId = "gaugeGradient";

  return (
    <div
      style={{
        position: 'absolute',
        top: '86%', // 수직 중앙
        left: '50%', // 수평 중앙
        transform: 'translate(-50%, -50%)', // 정확한 중앙 정렬
        width: '100%', // 필요에 따라 비율 조정
        height: 'auto', // 높이를 자동으로 설정
      }}
    >
      <svg width="100%" height="auto" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* 그라데이션 정의 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="120%" y2="0%">
            <stop offset="60%" stopColor="#0069FD" />
            <stop offset="100%" stopColor="#78DBFF" />
          </linearGradient>

          {/* 마스크 정의 */}
          <mask id="gaugeMask">
            <image 
              href="/images/ver4/gauge.png" // public 폴더 내의 이미지 경로
              width="100%" 
              height="100%" 
              preserveAspectRatio="xMidYMid meet" 
              transform="translate(200 25) scale(1.5) translate(-200 -25)"
            />
          </mask>
        </defs>

        {/* 기본 게이지 색상 설정 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#EFFFE9"
          mask="url(#gaugeMask)"
        />

        {/* 그라데이션을 적용한 게이지 채우기 */}
        <rect
          x="0"
          y="0"
          width={`${fillWidth}%`}
          height="100%"
          fill={`url(#${gradientId})`}
          mask="url(#gaugeMask)"
          style={{
            transition: 'width 0.4s ease',
          }}
        />
      </svg>
    </div>
  );
};

export default Gauge;
