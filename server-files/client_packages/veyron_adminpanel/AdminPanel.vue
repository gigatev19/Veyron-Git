<template>
    <div class="admin-overlay">
      <div class="panel">
        <!-- Übersichts-/Navigationsseite -->
        <div v-if="currentView === 'overview'" class="overview">
          <h2 class="title">Adminpanel</h2>
          <ul class="nav-buttons">
            <li @click="goTo('dashboard')">Dashboard</li>
            <li @click="goTo('online')">Online-Spieler</li>
            <li @click="goTo('accounts')">Accounts</li>
            <li @click="goTo('inventory')">Inventar</li>
          </ul>
        </div>
  
        <!-- Detailansicht (Subview) -->
        <div v-else class="subview">
          <button class="back-button" @click="backToOverview">← Zurück</button>
          <component :is="currentComponent" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // Dummy-Komponenten als Platzhalter – später durch echte Inhalte ersetzen
  const Dashboard = { template: '<div>Dashboard-Inhalt</div>' };
  const OnlinePlayers = {
    template: `
      <div>
        <h3>Online-Spieler</h3>
        <p>Hier erscheint die Spieler-Liste mit Aktionen.</p>
      </div>
    `
  };
  const Accounts = { template: '<div>Accounts verwalten</div>' };
  const InventoryManager = { template: '<div>Inventar verwalten</div>' };
  
  export default {
    name: "AdminPanel",
    data() {
      return {
        currentView: "overview" // Startet in der Übersichts-/Navigationsansicht
      };
    },
    computed: {
      currentComponent() {
        switch (this.currentView) {
          case "dashboard": return Dashboard;
          case "online": return OnlinePlayers;
          case "accounts": return Accounts;
          case "inventory": return InventoryManager;
          default: return null;
        }
      }
    },
    methods: {
      goTo(view) {
        this.currentView = view;
      },
      backToOverview() {
        this.currentView = "overview";
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  
  * {
    font-family: 'Poppins', sans-serif;
  }
  
  .admin-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 320px; /* Breite des Overlays */
    height: 100vh;
    background: rgba(40, 40, 40, 0.85);
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }
  
  .panel {
    height: 100%;
    padding: 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .overview {
    text-align: center;
    width: 100%;
  }
  
  .title {
    font-size: 26px;
    margin-bottom: 20px;
  }
  
  .nav-buttons {
    list-style: none;
    padding: 0;
    width: 100%;
  }
  
  .nav-buttons li {
    background: rgba(255, 255, 255, 0.1);
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  
  .nav-buttons li:hover {
    background: rgba(128, 0, 128, 0.7);
    transform: scale(1.02);
  }
  
  .subview {
    width: 100%;
  }
  
  .back-button {
    background: rgba(128, 0, 128, 0.5);
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background 0.3s;
  }
  
  .back-button:hover {
    background: rgba(128, 0, 128, 0.7);
  }
  </style>
  