// server-files/client_packages/charcreator.js
console.log("[charcreator.js] geladen");
let charBrowser = null;

mp.events.add('showCharCreator', () => {
  console.log("[charcreator.js] showCharCreator");
  if (!charBrowser) {
    charBrowser = mp.browsers.new("package://veyron_charcreator/index.html");
    mp.gui.cursor.show(true, true);
  }
});

// Wenn Client UI fertig ist, CEF schließen
mp.events.add('charCreatorComplete', () => {
  console.log("[charcreator.js] charCreatorComplete");
  if (charBrowser) {
    charBrowser.destroy();
    charBrowser = null;
    mp.gui.cursor.show(false, false);
  }
});
