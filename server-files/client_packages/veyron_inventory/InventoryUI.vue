<template>
    <div class="inventory-container">
      <div class="inventory-grid">
        <div class="slot" v-for="(item, index) in inventory" :key="index">
          <img v-if="item.image" :src="item.image" :alt="item.name" />
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "InventoryUI",
    data() {
      return {
        inventory: [
          { name: "Burger", image: require("@/assets/burger.png") },
          { name: "Wasser", image: require("@/assets/wasser.png") },
          { name: "Handy", image: require("@/assets/handy.png") },
          { name: "Medikit", image: require("@/assets/medikit.png") }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .inventory-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    background: #222;
    border: 2px solid #800080;
    border-radius: 10px;
    color: #fff;
  }
  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(5, 100px);
    gap: 10px;
  }
  .slot {
    width: 100px;
    height: 100px;
    background: #333;
    border: 2px solid #800080;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .slot img {
    max-width: 70%;
    max-height: 70%;
  }
  </style>
  