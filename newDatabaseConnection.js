import mysql from 'mysql2/promise';

// Създаване на Pool (басейн) от връзки, който работи с async/await
const dbPool = mysql.createPool({
  host: '127.0.0.1',     // Използвайте 127.0.0.1 вместо localhost за избягване на проблеми с IPv6
  user: 'root',          // Потребителско име
  password: '',          // Парола
  database: 'piraeus',   // Името на базата данни
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Проверка дали връзката е успешна при стартиране
dbPool.getConnection()
  .then((conn) => {
    console.log('Успешно свързване с базата данни Piraeus!');
    conn.release(); // Освобождаваме връзката обратно в басейна
  })
  .catch((err) => {
    console.error('Грешка при свързване с базата данни:', err);
  });

export default dbPool;