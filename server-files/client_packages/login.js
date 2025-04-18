console.log("[login.js] geladen");

let loginBrowser = null;

// Öffne das Login-CEF
mp.events.add("showLogin", () => {
  if (loginBrowser) return;
  loginBrowser = mp.browsers.new("package://veyron_login/index.html");
  mp.gui.cursor.show(true, true);
});

// Client → Server: Registrierung
mp.events.add("startDiscordRegister", () => {
  console.log("[login.js] client‑Event startDiscordRegister empfangen");
  mp.events.callRemote("startDiscordRegister");
});

// Client → Server: Login (falls genutzt)
mp.events.add("startDiscordLogin", () => {
  console.log("[login.js] client‑Event startDiscordLogin empfangen");
  mp.events.callRemote("startDiscordLogin");
});

// Client → Server: Statusabfrage
mp.events.add("checkDiscordStatus", () => {
  console.log("[login.js] client‑Event checkDiscordStatus empfangen");
  mp.events.callRemote("checkDiscordStatus");
});

// Server → Client: Setze Status
mp.events.add("setDiscordStatus", (registered) => {
  console.log("[login.js] setDiscordStatus vom Server:", registered);
  if (registered && loginBrowser) {
    // 1) Schließe das Login‑Fenster
    loginBrowser.destroy();
    loginBrowser = null;
    mp.gui.cursor.show(false, false);
    // 2) Trigger Spawn/Einloggen
    mp.events.callRemote("finishLogin");
  } else if (loginBrowser) {
    // Weiterreichen an Vue in CEF
    loginBrowser.execute(`window.postMessage({ type: 'setDiscordStatus', registered: ${registered} }, '*');`);
  }
});

// Server → Client: OAuth‑Link öffnen
mp.events.add("openDiscordOAuth", (url) => {
  console.log("[login.js] openDiscordOAuth vom Server:", url);
  if (loginBrowser) {
    loginBrowser.execute(`window.postMessage({ type: 'openDiscordOAuth', url: "${url}" }, '*');`);
  }
});

// Server → Client: Login-Bestätigung
mp.events.add("notifyDiscordLogin", (msg) => {
  console.log("[login.js] notifyDiscordLogin vom Server:", msg);
  if (loginBrowser) {
    loginBrowser.execute(`window.postMessage({ type: 'notifyDiscordLogin', msg: "${msg}" }, '*');`);
  }
});
