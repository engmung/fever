// File: C:\Users\yc231\Desktop\이승훈.작업자료\2024\2학기\웹\fever-main\src\components\Controls.js

import React from "react";

const Controls = ({ sensorValue, setSensorValue, mode }) => {
  const handleChange = (e) => {
    setSensorValue(parseInt(e.target.value));
  };

  // 모드에 따라 컨트롤의 배경색 변경 (옵션)
  let controlBackground;
  switch (mode) {
    case "idle":
      controlBackground = "#ffffff"; // 기본 색상
      break;
    case "active":
      controlBackground = "#ccffcc"; // 동작 색상
      break;
    case "complete":
      controlBackground = "#ffcccc"; // 완료 색상
      break;
    default:
      controlBackground = "#ffffff";
  }

  return (
    <div id="controls" style={{ backgroundColor: controlBackground, padding: '10px', borderRadius: '5px' }}>
      <label htmlFor="sensorSlider">Sensor Value: {sensorValue}</label>
      <input
        type="range"
        id="sensorSlider"
        min="0"
        max="100"
        value={sensorValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default Controls;
