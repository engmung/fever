// File: src/App.js

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from './components/Layout'; // Layout 컴포넌트 import
import Particle from "./components/Particle";
import './App.css';

// Import version 1 components
import Background from "./components/ver1/Background";
import Gauge from "./components/ver1/Gauge";
import MainElement from "./components/ver1/MainElement";

// Import version 2 components
import BackgroundV2 from "./components/ver2/Background";
import GaugeV2 from "./components/ver2/Gauge";
import MainElementV2 from "./components/ver2/MainElement";

// Import version 3 components
import BackgroundV3 from "./components/ver3/Background";
import GaugeV3 from "./components/ver3/Gauge";
import MainElementV3 from "./components/ver3/MainElement";

// Import version 4 components
import BackgroundV4 from "./components/ver4/Background";
import GaugeV4 from "./components/ver4/Gauge";
import MainElementV4 from "./components/ver4/MainElement";

// Import Controls (백업 컴포넌트)
import Controls from "./components/Controls";

const VersionedComponents = React.memo(({ BackgroundComponent, GaugeComponent, MainElementComponent, sensorValue, mode }) => (
  <>
    <BackgroundComponent mode={mode} />
    <div className="content-wrapper">
      <GaugeComponent sensorValue={sensorValue} mode={mode} />
      <MainElementComponent sensorValue={sensorValue} mode={mode} />
      <Particle sensorValue={sensorValue} mode={mode} />
    </div>
  </>
));

function App() {
  const [sensorValue, setSensorValue] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const getMode = useCallback((value) => {
    if (isCompleted) return "complete";
    if (value === 100) return "complete";
    if (value > 0) return "active";
    return "idle";
  }, [isCompleted]);

  const mode = useMemo(() => getMode(sensorValue), [getMode, sensorValue]);

  useEffect(() => {
    let timer;
    if (sensorValue === 100) {
      setIsCompleted(true);
      timer = setTimeout(() => {
        setIsCompleted(false);
        setSensorValue(0);
      }, 10000); // 10초 후 초기화
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [sensorValue]);

  const versionProps = useMemo(() => ({
    sensorValue,
    mode
  }), [sensorValue, mode]);

  return (
    <Router>
      <Routes>
        {/* Layout 컴포넌트로 모든 경로를 감쌉니다 */}
        <Route path="/" element={<Layout sensorValue={sensorValue} setSensorValue={setSensorValue} mode={mode} />}>
          {/* 인덱스 라우트 추가: 루트 경로('/')에 접근 시 '/ver1'으로 리다이렉트 */}
          <Route index element={<Navigate to="/ver1" replace />} />

          {/* Version 1 Routes */}
          <Route path="ver1" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={Background}
              GaugeComponent={Gauge}
              MainElementComponent={MainElement}
            />
          } />
          <Route path="ver1/x" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={Background}
              GaugeComponent={Gauge}
              MainElementComponent={MainElement}
            />
          } />

          {/* Version 2 Routes */}
          <Route path="ver2" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV2}
              GaugeComponent={GaugeV2}
              MainElementComponent={MainElementV2}
            />
          } />
          <Route path="ver2/x" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV2}
              GaugeComponent={GaugeV2}
              MainElementComponent={MainElementV2}
            />
          } />

          {/* Version 3 Routes */}
          <Route path="ver3" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV3}
              GaugeComponent={GaugeV3}
              MainElementComponent={MainElementV3}
            />
          } />
          <Route path="ver3/x" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV3}
              GaugeComponent={GaugeV3}
              MainElementComponent={MainElementV3}
            />
          } />

          {/* Version 4 Routes */}
          <Route path="ver4" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV4}
              GaugeComponent={GaugeV4}
              MainElementComponent={MainElementV4}
            />
          } />
          <Route path="ver4/x" element={
            <VersionedComponents
              {...versionProps}
              BackgroundComponent={BackgroundV4}
              GaugeComponent={GaugeV4}
              MainElementComponent={MainElementV4}
            />
          } />

          {/* 알 수 없는 경로는 /ver1으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/ver1" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
