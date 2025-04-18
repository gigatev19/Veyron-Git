let adminBrowser = null;
let isAdmin      = false;

// 1) Admin‑Status empfangen
mp.events.add('setAdminLevel', (level) => {
  isAdmin = level > 0;
  console.log(`[admin.js] setAdminLevel: isAdmin=${isAdmin}`);
});

// 2) F6 nur für Admins
mp.keys.bind(0x75, false, () => { // F6  
  if (!isAdmin) return;          // kein Zugriff
  if (!adminBrowser) {
    adminBrowser = mp.browsers.new('package://veyron_adminpanel/index.html');
    mp.gui.cursor.show(true, true);
  } else {
    adminBrowser.destroy();
    adminBrowser = null;
    mp.gui.cursor.show(false, false);
  }
});

// 3) Clean‑up, falls Server das Panel schließen will
mp.events.add('closeAdminPanel', () => {
  if (adminBrowser) {
    adminBrowser.destroy();
    adminBrowser = null;
    mp.gui.cursor.show(false, false);
  }
});