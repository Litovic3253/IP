const https = require('https'); // Стандартный модуль Node.js для работы с HTTPS запросами

// Функция для получения IP-адреса
function getIP() {
    https.get('https://api.ipify.org?format=json', (response) => {
        let data = '';

        // Получение данных
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Когда весь ответ получен
        response.on('end', () => {
            try {
                const ip = JSON.parse(data).ip; // Разбираем JSON и получаем IP
                console.log('Your public IP address is:', ip); // Выводим IP-адрес в командной строке
            } catch (error) {a
                console.error('Error parsing response:', error);
            }
        });
    }).on('error', (error) => {
        console.error('Error fetching IP:', error); // В случае ошибки
    });
}

// Запускаем функцию
getIP();
