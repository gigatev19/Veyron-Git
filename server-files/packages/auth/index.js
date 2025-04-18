// server-files/packages/auth/index.js

// 0) ENV & Imports
require('dotenv').config();  
const { log } = require('../../logger.js');          // Passe Pfad an, wenn nötig
const db = require('../common');
const http    = require('http');

// 1) Konfiguration aus .env
const {
  CLIENT_ID,          // z.B. 1361002724904141101
  REDIRECT_URI,       // z.B. http://localhost:3002/callback
  RAGE_CALLBACK_PORT  // z.B. 22005
} = process.env;

// 2) PlayerReady: Account anlegen/prüfen & Login‑CEF öffnen
mp.events.add('playerReady', async (player) => {
  const scid = player.socialClub;
  log(`[playerReady] ${player.name} SCID=${scid}`);

  try {
    const [rows] = await db.query(
      "SELECT discord_id FROM accounts WHERE socialclub = ?",
      [scid]
    );

    if (rows.length === 0) {
      // Neuer Account
      await db.query(
        "INSERT INTO accounts (socialclub, admin_level) VALUES (?,0)",
        [scid]
      );
      log(`[playerReady] Created new account for SCID=${scid}`);
      player.call('setDiscordStatus', [false]);
    } else {
      const registered = !!rows[0].discord_id;
      log(`[playerReady] Existing account, registered=${registered}`);
      player.call('setDiscordStatus', [registered]);
    }

    // Immer Login‑CEF öffnen
    player.call('showLogin');

  } catch (err) {
    log(`[playerReady] DB-Error: ${err}`);
  }
});

// 3) Check-Event: Abfrage des Registrierungsstatus
mp.events.add('checkDiscordStatus', async (player) => {
  const scid = player.socialClub;
  log(`[checkDiscordStatus] ${player.name} SCID=${scid}`);

  try {
    const [rows] = await db.query(
      "SELECT discord_id FROM accounts WHERE socialclub = ?",
      [scid]
    );
    const registered = rows.length > 0 && rows[0].discord_id;
    log(`[checkDiscordStatus] registered=${!!registered}`);
    player.call('setDiscordStatus', [!!registered]);
  } catch (err) {
    log(`[checkDiscordStatus] DB-Error: ${err}`);
  }
});

// 4) Registrierungsstart: OAuth‑URL an Client senden
mp.events.add('startDiscordRegister', (player) => {
  const scid = player.socialClub;
  log(`[startDiscordRegister] ${player.name} SCID=${scid}`);

  const oauthUrl =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify` +
    `&state=${scid}`;

  player.call('openDiscordOAuth', [oauthUrl]);
  log(`[startDiscordRegister] Sent OAuth URL to ${player.name}`);
});

mp.events.add('finishLogin', async (player) => {
  const scid = player.socialClub;
  log(`[finishLogin] ${player.name} SCID=${scid}`);

  try {
    // 1) Account & char_created abfragen
    const [[acct]] = await db.query(
      "SELECT id, char_created FROM accounts WHERE socialclub = ?",
      [scid]
    );
    if (!acct) {
      log(`[finishLogin] Kein Account gefunden für SCID=${scid}`);
      return;
    }

    if (acct.char_created === 0) {
      // noch kein Charakter → CharCreator öffnen
      player.call('showCharCreator');
      log(`[finishLogin] Opening CharCreator for ${player.name}`);
    } else {
      // Charakter existiert → Daten laden
      const [rows] = await db.query(
        "SELECT first_name, last_name, birthdate, gender, appearance, clothing FROM characters WHERE account_id = ?",
        [acct.id]
      );
      if (rows.length === 0) {
        log(`[finishLogin] Kein Charakter‐Datensatz für Account ${acct.id}`);
        player.call('showCharCreator');
        return;
      }

      const charData = rows[0];
      // 2) Sende Charakterdaten an Client
      player.call('setCharacterData', [ JSON.stringify(charData) ]);
      log(`[finishLogin] Sent character data to ${player.name}`);

      // 3) Schließe CEF falls offen & spawn
      player.call('charCreatorComplete');
      player.spawn(new mp.Vector3(0, 0, 72));
      log(`[finishLogin] ${player.name} spawned with loaded character`);
    }
  } catch (err) {
    log(`[finishLogin] Fehler: ${err}`);
  }
});


mp.events.add('submitCharacter', async (player, jsonData) => {
  log(`[submitCharacter] Daten von ${player.name}: ${jsonData}`);
  let data;
  try {
    data = JSON.parse(jsonData);
  } catch (err) {
    log(`[submitCharacter] JSON-Fehler: ${err}`);
    return;
  }

  const { first_name, last_name, birthdate, gender, appearance, clothing } = data;
  const scid = player.socialClub;

  try {
    // Speichere alles in die DB
    await db.query(
      `UPDATE accounts
         SET char_created = 1,
             first_name   = ?,
             last_name    = ?,
             birthdate    = ?,
             gender       = ?,
             appearance   = ?,
             clothing     = ?
       WHERE socialclub = ?`,
      [
        first_name,
        last_name,
        data.birthdate,
        gender,
        JSON.stringify(appearance),
        JSON.stringify(clothing),
        scid
      ]
    );
    log(`[submitCharacter] DB‑Update erfolgreich für ${player.name}`);
    // Schließe UI und spawn
    player.call('charCreatorComplete');
  } catch (err) {
    log(`[submitCharacter] DB‑Error: ${err}`);
  }
});

// 6) HTTP‑Listener für OAuth‑Callback (Node‑Core)
if (!global._oauthHttpServer) {
  global._oauthHttpServer = http.createServer((req, res) => {
    log(`[HTTP] ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url === '/oauth/callback') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        log('[HTTP] Body vollständig: ' + body);
        let data;
        try {
          data = JSON.parse(body);
        } catch (err) {
          log('[HTTP] JSON.parse Fehler: ' + err);
          res.writeHead(400); return res.end('Ungültiges JSON');
        }
        const { socialClub, discordId } = data;
        log(`[HTTP] SCID=${socialClub}, DiscordID=${discordId}`);
        try {
          const [result] = await db.query(
            "UPDATE accounts SET discord_id = ? WHERE socialclub = ?",
            [discordId, socialClub]
          );
          log(`[HTTP] DB-Update affectedRows=${result.affectedRows}`);
        } catch (err) {
          log('[HTTP] DB-Fehler: ' + err);
          res.writeHead(500); return res.end('DB-Fehler');
        }
        const player = mp.players.toArray().find(p => p.socialClub === socialClub);
        log('[HTTP] Spieler gefunden: ' + (player ? player.name : 'kein'));
        if (player) player.call('setDiscordStatus', [true]);
        res.writeHead(200); res.end('OK');
      });
      req.on('error', err => {
        log('[HTTP] Request-Error: ' + err);
        res.writeHead(500); res.end('Request-Fehler');
      });
    } else {
      res.writeHead(404); res.end('Nicht gefunden');
    }
  }).listen(RAGE_CALLBACK_PORT, () => {
    log(`[HTTP] OAuth‑Callback listener läuft auf Port ${RAGE_CALLBACK_PORT}`);
  });
}