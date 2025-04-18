const { log } = require('../../logger.js');
const mysql = require('mysql2');
const config = require('../../config.json');

const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit MySQL:', err);
  } else {
    console.log('Erfolgreich mit der MySQL-Datenbank verbunden!');
  }
});

// Diese Verbindung wird global verfügbar gemacht
global.connection = connection;

// Event: Spieler tritt dem Server bei
mp.events.add("playerJoin", (player) => {
  log(`${player.name} ist dem Server beigetreten.`);
  player.notify("hey");
});

mp.events.add("playerReady", (player) => {
      player.call("showLogin");
  });
  
  