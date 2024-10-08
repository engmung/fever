import React, { useState } from "react";
import Background from "./components/Background";
import Gauge from "./components/Gauge";
import MainElement from "./components/MainElement";
import Particle from "./components/Particle";
import Controls from "./components/Controls";

function App() {
  const [sensorValue, setSensorValue] = useState(50);

  // 모드 결정: 기본(대기), 동작(0~99), 완료(100)
  const getMode = (value) => {
    if (value === 100) return "complete";
    if (value > 0) return "active";
    return "idle";
  };

  const mode = getMode(sensorValue);

  return (
    <div className="App">
      <Background mode={mode} />
      <Gauge sensorValue={sensorValue} mode={mode} />
      <MainElement sensorValue={sensorValue} mode={mode} />
      <Particle sensorValue={sensorValue} mode={mode} />
      <Controls
        sensorValue={sensorValue}
        setSensorValue={setSensorValue}
        mode={mode}
      />
    </div>
  );
}

export default App;
