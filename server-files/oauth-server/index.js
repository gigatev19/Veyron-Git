// oauth-server/index.js
import 'dotenv/config';
import express from 'express';
import fetch   from 'node-fetch';
import { Client, GatewayIntentBits } from 'discord.js';

const {
  DISCORD_BOT_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  PORT = 3002,
} = process.env;

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
});

bot.login(DISCORD_BOT_TOKEN)
   .then(() => console.log(`Discord‑Bot logged in as ${bot.user.tag}`))
   .catch(err => {
     console.error("Bot‑Login fehlgeschlagen:", err);
     process.exit(1);
   });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// (dein /login-Endpunkt bleibt unverändert, wenn du ihn nutzt)

// OAuth‑Callback:
app.get('/callback', async (req, res) => {
  const { code, state: socialClub } = req.query;
  console.log(`[OAuth] Callback received code=${code} state=${socialClub}`);

  try {
    // Token-Tausch
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  REDIRECT_URI
      })
    });
    const tokenData = await tokenRes.json();
    // User-Daten
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();
    const discordId = userData.id;
    console.log(`[OAuth] DiscordID=${discordId}`);

    // Callback an RAGE MP-Server
    await fetch(`http://localhost:22005/oauth/callback`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ socialClub, discordId })
    });

    // HTML mit Auto-Close
    return res.send(`
      <!DOCTYPE html>
      <html lang="de">
      <head><meta charset="UTF-8"><title>Erfolgreich!</title></head>
      <body>
        <script>window.close();</script>
        <p>Registrierung abgeschlossen! Wenn sich das Fenster nicht schließt, kannst du es manuell schließen.</p>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("[OAuth] Error:", err);
    return res.status(500).send("Fehler im OAuth‑Callback.");
  }
});

app.listen(PORT, () => {
  console.log(`OAuth‑Server listening on http://localhost:${PORT}`);
});
