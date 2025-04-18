let adminBrowser = null;
let isAdmin = false;

// F6: Adminpanel ein-/ausschalten
mp.keys.bind(0x75, false, function() {
  if (isAdmin) {
    if (!adminBrowser) {
      adminBrowser = mp.browsers.new("package://veyron_adminpanel/index.html");
      mp.gui.cursor.show(true, false);
    } else {
      adminBrowser.destroy();
      adminBrowser = null;
      mp.gui.cursor.show(false, false);
    }
  }
});

mp.events.add("closeAdminPanel", () => {
  if (adminBrowser) {
    adminBrowser.destroy();
    adminBrowser = null;
    mp.gui.cursor.show(false, false);
  }
});
