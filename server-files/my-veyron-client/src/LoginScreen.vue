<template>
  <div class="login-container">
    <div class="login-box">
      <img src="./assets/logo.png" class="logo" />
      <h1>Login</h1>
      <p v-if="!discordRegistered">Du bist noch nicht registriert.</p>
      <button v-if="!discordRegistered" @click="registerWithDiscord">
        Mit Discord registrieren
      </button>
      <button v-else @click="loginWithDiscord">
        Mit Discord einloggen
      </button>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return { discordRegistered: false };
  },
  methods: {
    registerWithDiscord() {
      console.log('[LoginScreen] registerWithDiscord');
      mp.trigger('startDiscordRegister');
    },
    loginWithDiscord() {
      console.log('[LoginScreen] loginWithDiscord');
      mp.trigger('startDiscordLogin');
    }
  },
  mounted() {
    console.log('[LoginScreen] mounted');
    window.addEventListener('message', (e) => {
      const d = e.data;
      if (d.type === 'setDiscordStatus') {
        console.log('[LoginScreen] setDiscordStatus:', d.registered);
        this.discordRegistered = d.registered;
      }
      if (d.type === 'openDiscordOAuth') {
        console.log('[LoginScreen] openOAuth URL:', d.url);
        window.location.href = d.url;
      }
      if (d.type === 'notifyDiscordLogin') {
        console.log('[LoginScreen] notifyDiscordLogin:', d.msg);
        alert(d.msg);
      }
    });
    // Um den initialen Status zu bekommen, triggern wir hier:
    mp.trigger('checkDiscordStatus');
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: transparent;
}

.login-box {
  background: rgba(34, 34, 34, 0.8);
  padding: 20px;
  border: 2px solid #800080;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

button {
  background-color: #800080;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s;
  margin-top: 15px;
}

button:hover {
  background-color: #a020f0;
}

p {
  font-size: 14px;
  margin-top: 10px;
  color: #ccc;
}
</style>
