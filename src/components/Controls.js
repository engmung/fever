// File: src/components/Controls.js

import React from "react";

const Controls = ({ sensorValue, setSensorValue, mode }) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    // sensorValue가 100 미만이거나 새로운 값이 100 이상일 때만 업데이트
    if (sensorValue < 100 || newValue >= 100) {
      setSensorValue(newValue);
    }
  };

  // 모드에 따른 배경색 변경 로직 제거하고 고정된 반투명 배경색 사용
  const controlBackground = "rgba(255, 255, 255, 0.8)"; // 반투명 흰색

  // sensorValue가 100 이상인지 확인
  const isMax = sensorValue >= 100;

  return (
    <div
      id="controls"
      style={{
        backgroundColor: controlBackground,
        padding: '10px',
        borderRadius: '5px',
        opacity: 0.4, // 항상 반투명하게 보이도록 설정
        position: 'absolute',
        top: '1vw',
        left: '1.9vw',
        zIndex: 10,
        pointerEvents: 'auto', // 마우스 이벤트 활성화
      }}
    >
      <label htmlFor="sensorSlider">Sensor Value: {sensorValue}</label>
      <input
        type="range"
        id="sensorSlider"
        min={isMax ? 100 : 0} // sensorValue가 100 이상일 때 min을 100으로 설정
        max="100"
        value={sensorValue}
        onChange={handleChange}
        style={{
          width: '18.5vw',
          cursor: isMax ? 'not-allowed' : 'pointer', // 비활성화 시 커서 변경
        }}
      />
    </div>
  );
};

export default Controls;
