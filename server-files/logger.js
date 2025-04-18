// logger.js
const fs = require('fs');
const path = require('path');

// Ordner 'logs' im Projektstamm
const logDir = path.join(__dirname, '..', 'logs');

// Verzeichnis anlegen, falls es noch nicht existiert
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// debug.log in diesem Ordner
const logFilePath = path.join(logDir, 'debug.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFile(logFilePath, logMessage, err => {
    if (err) console.error("Fehler beim Schreiben ins Log:", err);
  });
  console.log(logMessage);
}

module.exports = { log };
