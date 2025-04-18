// Beispiel: Teleportiere Admin zu einem Spieler
mp.events.add("adminTpToPlayer", (player, targetId) => {
    if (player.admin_level < 1) {
      player.kick("Unauthorized admin action");
      return;
    }
    // Logik zum Teleportieren: Finde den Zielspieler und teleportiere den Admin dorthin
  });
  
  // Weitere Admin-Funktionen: adminGiveHealthArmor, adminGiveItems, adminTpToPreset, adminTpPlayerToMe, adminRevivePlayer
  