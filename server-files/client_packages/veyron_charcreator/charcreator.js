console.log("[charcreator.js] geladen");
let ccBrowser = null;

mp.events.add('setCharacterData', (json) => {
  console.log('[charcreator.js] setCharacterData empfangen:', json);
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return console.error('Invalid JSON in setCharacterData');
  }

  // 1) Basisdaten (optional im UI anzeigen)
  // console.log(data.first_name, data.last_name, data.birthdate, data.gender);

  // 2) Aussehen anwenden
  const app = data.appearance;
  mp.events.call('updateHeadBlend', 0, 0, app.face  / 100);
  mp.events.call('updateEyeColor',   Math.round(app.eyes  / 100 * 31));
  mp.events.call('updateHairStyle',  Math.floor(app.hair  / 100 * 9), 0);
  mp.events.call('updateHairColor',  Math.round(app.skin  / 100 * 63), 0);

  // 3) Kleidung anwenden
  const cloth = data.clothing;
  mp.events.call('updateClothing', 'head', cloth.headIdx, 0);
  mp.events.call('updateClothing', 'top',  cloth.topIdx,  0);
  mp.events.call('updateClothing', 'pant', cloth.pantIdx, 0);
  mp.events.call('updateClothing', 'shoe', cloth.shoeIdx, 0);
});

mp.events.add('showCharCreator', () => {
  if (ccBrowser) return;

  // Cache­-Bust hilft gegen alten Cache
  const url = `package://veyron_charcreator/index.html?cache=${Date.now()}`;
  

  // Manchmal braucht CEF einen kleinen Augenblick...
  setTimeout(() => {
  ccBrowser = mp.browsers.new(url);

  // Maus & Keyboard nur für die CEF aktivieren
  mp.gui.cursor.show(true, true);

  // Chat verstecken, damit man die CEF ungestört sieht
  mp.gui.chat.show(false);
    mp.gui.cursor.show(true, true);
  }, 100);
});

// Live‑Preview: Erscheinungsbild
mp.events.add('updateAppearance', (attr, value) => {
  const player = mp.players.local;
  switch(attr) {
    case 'face':
      // Face Feature 0 (Nase), Beispiel:
      mp.game.invoke('0xdeface01', player.handle, 0, value / 100); 
      break;
    case 'eyes':
      // Augenfarbe ändern:
      player.setEyeColor(Math.round(value/100*31)); 
      break;
    case 'hair':
    // hair, skin… implementiere nach GTA-Natives
  }
});

// Live‑Preview: Kleidung
mp.events.add('updateClothing', (part, choice) => {
  const player = mp.players.local;
  const map = {
    head: { component: 0, list: ['hat1','hat2','hat3'] },
    top:  { component: 11, list: ['torso1','torso2','torso3'] },
    pant: { component: 4, list: ['leg1','leg2','leg3'] },
    shoe: { component: 6, list: ['shoe1','shoe2','shoe3'] },
  };
  const cfg = map[part];
  const idx = cfg.list.indexOf(choice);
  if (idx>=0) player.setComponentVariation(cfg.component, idx, 0, 0);
});

// CEF schließen und Spawn
mp.events.add('charCreatorComplete', () => {
  if (!ccBrowser) return;
  ccBrowser.destroy();
  ccBrowser = null;
  mp.gui.cursor.show(false, false);
  mp.gui.chat.show(true);
});