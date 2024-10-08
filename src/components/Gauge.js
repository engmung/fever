import React, { useRef, useEffect } from "react";

const Gauge = ({ sensorValue, mode }) => {
  const gaugeRef = useRef(null);

  useEffect(() => {
    const ctx = gaugeRef.current.getContext("2d");
    const width = gaugeRef.current.width;
    const height = gaugeRef.current.height;

    // 게이지 색상 결정
    let gaugeColor;
    switch (mode) {
      case "idle":
        gaugeColor = "#46a3ff"; // 기본 색상
        break;
      case "active":
        gaugeColor = "#00cc00"; // 동작 색상
        break;
      case "complete":
        gaugeColor = "#ff0000"; // 완료 색상
        break;
      default:
        gaugeColor = "#46a3ff";
    }

    // 배경 그리기
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    // 게이지 그리기
    const gaugeWidth = (sensorValue / 100) * width;
    ctx.fillStyle = gaugeColor;
    ctx.fillRect(0, 0, gaugeWidth, height);

    // 텍스트 그리기
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Sensor Value: ${sensorValue}`, width / 2, height / 2);
  }, [sensorValue, mode]);

  return <canvas id="gauge" ref={gaugeRef} width={300} height={60}></canvas>;
};

export default Gauge;
