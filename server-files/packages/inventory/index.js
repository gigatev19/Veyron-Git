// Hier brauchst du den Import nicht mehr, da global.connection bereits definiert ist
// const connection = require('../../connection'); // Diese Zeile entfällt

/*mp.events.add("playerReady", (player) => {
    const socialClub = player.socialClub;
    global.connection.query(
      "SELECT * FROM player_inventory WHERE player_social = ?",
      [socialClub],
      (err, results) => {
        if (err) {
          console.error("Fehler beim Laden des Inventars:", err);
          return;
        }
        const items = results.map(item => ({
          name: item.item_name,
          image: item.item_image,
          quantity: item.quantity
        }));
        player.call("setInventoryData", [JSON.stringify(items)]);
      }
    );
  });
  */