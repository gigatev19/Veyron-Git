<template>
    <div class="admin-overlay">
      <div class="admin-header">
        <img src="./assets/logo.png" alt="Logo" class="logo" />
        <h1>Admin Panel</h1>
      </div>
      <div class="admin-list">
        <label class="item" v-for="opt in pagedItems" :key="opt.action">
          <input v-if="opt.type==='toggle'" type="checkbox" v-model="toggles[opt.action]" />
          <span v-else class="button" @click="onAction(opt.action)">{{ opt.label }}</span>
          <span class="label">{{ opt.label }}</span>
        </label>
      </div>
      <div class="admin-footer">
        <button @click="prevPage" :disabled="page===1">‹</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page===totalPages">›</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminPanel',
    data() {
      return {
        page: 1,
        perPage: 7,
        toggles: { flyMode: false, ghosting: false },
        items: [
          { label: 'Fly Mode',   action: 'toggleFly',   type: 'toggle' },
          { label: 'Ghosting',    action: 'toggleGhost', type: 'toggle' },
          { label: 'Spielerliste',action: 'playerList',  type: 'button' },
          { label: 'Whitelist',   action: 'whitelist',   type: 'button' },
          { label: 'AFK Liste',   action: 'afkList',     type: 'button' },
          { label: 'Gangliste',   action: 'gangList',    type: 'button' },
          { label: 'Skin setzen', action: 'setSkin',     type: 'button' },
          // ... weitere Einträge ...
        ]
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.items.length / this.perPage)
      },
      pagedItems() {
        const start = (this.page - 1) * this.perPage
        return this.items.slice(start, start + this.perPage)
      }
    },
    methods: {
      onAction(action) {
        console.log('Admin Action:', action)
        if (window.mp && mp.trigger) mp.trigger(action)
      },
      prevPage() { if (this.page > 1) this.page-- },
      nextPage() { if (this.page < this.totalPages) this.page++ }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  
  .admin-overlay {
    position: absolute; top: 5%; left: 5%;
    width: 320px; height: 90%;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    display: flex; flex-direction: column;
    font-family: 'Poppins', sans-serif; color: #eee;
    padding: 16px; z-index: 9999;
  }
  .admin-header {
    display: flex; align-items: center; margin-bottom: 12px;
  }
  .logo { width: 32px; margin-right: 8px; }
  .admin-header h1 { font-size: 1.2rem; font-weight: 600; }
  
  .admin-list {
    flex: 1; overflow-y: auto;
  }
  .item {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px; margin-bottom: 8px;
    padding: 8px; cursor: pointer;
    transition: background 0.2s;
  }
  .item:hover { background: rgba(255,255,255,0.2); }
  .item .label { flex: 1; margin-left: 8px; }
  .item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #a020f0; }
  .item .button { flex: 1; text-align: left; }
  
  .admin-footer {
    display: flex; justify-content: center; align-items: center;
  }
  .admin-footer button {
    background: none; border: none; color: #fff; cursor: pointer;
    font-size: 1.2rem; padding: 4px 8px;
  }
  .admin-footer button:disabled { opacity: 0.3; cursor: default; }
  .admin-footer span { margin: 0 8px; }
  </style>
  