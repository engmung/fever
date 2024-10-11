import React, { useState, useCallback, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from './components/Layout';
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
  const [showCredit, setShowCredit] = useState(false);

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
        setShowCredit(true);
      }, 1000);

      // 15초 후에 모든 상태 초기화
      setTimeout(() => {
        setIsCompleted(false);
        setSensorValue(0);
        setShowCredit(false);
      }, 15000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sensorValue]);

  const versionProps = useMemo(() => ({
    sensorValue,
    mode
  }), [sensorValue, mode]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Layout sensorValue={sensorValue} setSensorValue={setSensorValue} mode={mode} />}>
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

            <Route path="*" element={<Navigate to="/ver1" replace />} />
          </Route>
        </Routes>
        {showCredit && (
          <>
            <div className="dimmed-background" />
            <img 
              src="/images/credit.png" 
              alt="Credit" 
              className="credit-image"
            />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;