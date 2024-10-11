// File: src/components/Layout.js

import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import ArduinoConnector from './ArduinoConnector';
import Controls from './Controls';

const Layout = ({ sensorValue, setSensorValue, mode }) => {
  const location = useLocation();
  const isBackupMode = location.pathname.endsWith("/x");

  return (
    <>
      {!isBackupMode ? (
        <ArduinoConnector setSensorValue={setSensorValue} />
      ) : (
        <Controls sensorValue={sensorValue} setSensorValue={setSensorValue} mode={mode} />
      )}
      <Outlet />
    </>
  );
};

export default Layout;
