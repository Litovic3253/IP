const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const ip = require('ip');  // Модуль для работы с IP-адресами

// Создаем сервер с использованием Express
const app = express();
const server = http.createServer(app);

// Создаем WebSocket сервер
const wss = new WebSocket.Server({ server });

// Статическая папка с HTML
app.use(express.static('public'));

// Функция для получения IP-адреса клиента
function getClientIP(req) {
    // Сначала пытаемся получить IP из заголовка x-forwarded-for
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Если это локальный адрес (например, ::1 или 127.0.0.1), меняем на публичный IP
    if (ipAddress === '::1' || ipAddress === '127.0.0.1') {
        ipAddress = ip.address(); // Используем локальный IP-адрес устройства
    } else {
        // Если это IPv6 адрес, конвертируем его в IPv4
        ipAddress = ipAddress.split(',')[0];  // Берем первый IP, если он за прокси
    }

    return ipAddress;
}

// Обработчик WebSocket-соединений
wss.on('connection', (ws, req) => {
    const ip = getClientIP(req);  // Получаем IP-адрес клиента
    console.log('New connection from IP:', ip);
    
    // Отправляем IP-адрес клиенту в реальном времени
    ws.send(JSON.stringify({ ip: ip }));

    // Дополнительные события (например, получение сообщений от клиента)
    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Запуск сервера на порту 3000
server.listen(3000, () => {
    console.log('Server is running on https://litovic3253.github.io/IP/public/index.html');
});

// Функция для корректной остановки сервера
function stopServer() {
    console.log('Stopping the server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);  // Завершаем процесс Node.js
    });
}

// Обработка сигнала SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    stopServer();
});

// Обработка сигнала SIGTERM (например, когда сервер получает команду для остановки)
process.on('SIGTERM', () => {
    stopServer();
});
