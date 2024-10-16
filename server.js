const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 알려진 Arduino 및 유사 보드의 VID:PID 목록
const KNOWN_DEVICES = [
  { name: 'Arduino UNO', vendorId: '2341', productId: '0043' },
  { name: 'Arduino Mega', vendorId: '2341', productId: '0010' },
  { name: 'Arduino Nano', vendorId: '0403', productId: '6001' },
  { name: 'CH340 Chip', vendorId: '1a86', productId: '7523' },
  { name: 'CP2102 Chip', vendorId: '10c4', productId: 'ea60' },
  { name: 'FTDI Chip', vendorId: '0403', productId: '6001' },
  // 필요한 경우 여기에 더 많은 장치를 추가할 수 있습니다.
];

const RECONNECT_INTERVAL = 3000; // 3초마다 재연결 시도

async function findArduinoPorts() {
  const ports = await SerialPort.list();
  return ports.filter(port => 
    KNOWN_DEVICES.some(device => 
      port.vendorId && port.vendorId.toLowerCase() === device.vendorId.toLowerCase() &&
      port.productId && port.productId.toLowerCase() === device.productId.toLowerCase()
    )
  );
}

function setupSerialConnection(portInfo) {
  const port = new SerialPort({ path: portInfo.path, baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  console.log(`Connected to device on ${portInfo.path}`);

  parser.on('data', (data) => {
    const numericData = parseFloat(data);
    if (!isNaN(numericData)) {
      console.log(`Data from ${portInfo.path}:`, numericData);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(numericData.toString());
        }
      });
    }
  });

  port.on('error', (err) => {
    console.error(`Error on ${portInfo.path}:`, err.message);
    setTimeout(() => reconnect(portInfo), RECONNECT_INTERVAL);
  });

  port.on('close', () => {
    console.log(`Connection closed for ${portInfo.path}`);
    setTimeout(() => reconnect(portInfo), RECONNECT_INTERVAL);
  });

  return port;
}

function reconnect(portInfo) {
  console.log(`Attempting to reconnect to ${portInfo.path}...`);
  setupSerialConnection(portInfo);
}

async function setupSerialConnections() {
  try {
    const arduinoPorts = await findArduinoPorts();
    
    if (arduinoPorts.length === 0) {
      console.log('No Arduino or compatible devices found');
      setTimeout(setupSerialConnections, RECONNECT_INTERVAL);
      return;
    }

    arduinoPorts.forEach(portInfo => {
      setupSerialConnection(portInfo);
    });

    wss.on('connection', (ws) => {
      console.log('Client connected');
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

  } catch (error) {
    console.error('Error setting up serial connections:', error.message);
    setTimeout(setupSerialConnections, RECONNECT_INTERVAL);
  }
}

setupSerialConnections();

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});