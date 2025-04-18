<template>
  <div class="overlay">
    <div class="header"><h2>Char Creator (Schritt {{ step }}/3)</h2></div>
    <div class="body">
      <!-- Schritt 1: Basisdaten -->
      <div v-if="step===1" class="step">
        <input v-model="first_name" placeholder="Vorname" />
        <input v-model="last_name"  placeholder="Nachname" />
        <!-- Geburtsdatum statt Alter -->
        <label class="date-label">Geburtsdatum</label>
        <input 
          v-model="birthdate" 
          type="date" 
          :max="today" 
        />
        <select v-model="gender">
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
        </select>
      </div>

      <!-- Schritt 2: Aussehen anpassen -->
      <div v-else-if="step===2" class="step">
        <div v-for="attr in appearanceAttrs" :key="attr" class="slider">
          <label>{{ attr }}</label>
          <input
            type="range"
            :min="0" :max="100"
            v-model.number="appearance[attr]"
            @input="onAppearanceChange(attr, appearance[attr])"
          />
        </div>
      </div>

      <!-- Schritt 3: Kleidung -->
      <div v-else class="step">
        <div v-for="(choices, part) in clothingOptions" :key="part" class="dropdown">
          <label>{{ part }}</label>
          <select
            v-model="clothing[part]"
            @change="onClothingChange(part, clothing[part])"
          >
            <option v-for="c in choices" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="footer">
      <button @click="prev" :disabled="step===1">‹</button>
      <button v-if="step<3" @click="next">Weiter</button>
      <button v-else @click="finish">Fertig</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharCreator',
  data() {
    const today = new Date().toISOString().split('T')[0];
    return {
      step: 1,
      first_name: '', 
      last_name: '', 
      birthdate: '',    // neu
      gender: '',
      appearanceAttrs: ['face','eyes','hair','skin'],
      appearance: { face:50, eyes:50, hair:50, skin:50 },
      clothingOptions: {
        head: ['Mütze','Hut','Basecap'],
        top:  ['T-Shirt','Jacke','Hemd'],
        pant: ['Jeans','Shorts','Chino'],
        shoe: ['Sneaker','Stiefel','Sandalen']
      },
      clothing: { head:'Mütze', top:'T-Shirt', pant:'Jeans', shoe:'Sneaker' },
      today               // für das max‑Attribut im Date‑Picker
    };
  },
  methods: {
    next() { this.step++ },
    prev() { this.step-- },

    onAppearanceChange(attr, val) {
      if (!window.mp || !mp.trigger) return;
      switch(attr) {
        case 'face':
          mp.trigger('updateHeadBlend', 0, 0, val/100);
          break;
        case 'eyes':
          const eyeColor = Math.round(val/100*31);
          mp.trigger('updateEyeColor', eyeColor);
          break;
        case 'hair':
          const hairDrawable = Math.floor(val/100*(this.hairStyles.length-1));
          mp.trigger('updateHairStyle', hairDrawable, 0);
          break;
        case 'skin':
          const prim = Math.round(val/100*63);
          mp.trigger('updateHairColor', prim, 0);
          break;
      }
    },

    onClothingChange(part, choice) {
      if (!window.mp || !mp.trigger) return;
      const drawable = this.clothingOptions[part].indexOf(choice);
      mp.trigger('updateClothing', part, drawable, 0);
    },

    finish() {
      const payload = {
        first_name: this.first_name,
        last_name:  this.last_name,
        birthdate:  this.birthdate,   // neues Feld
        gender:     this.gender,
        appearance: this.appearance,
        clothing:   this.clothing
      };
      mp.trigger('submitCharacter', JSON.stringify(payload));
    }
  },
  computed: {
    hairStyles() {
      return Array.from({ length: 10 }, (_, i) => i);
    }
  },
  mounted() {
    window.addEventListener('message', (e) => {
      if (e.data.type !== 'setCharacterData') return;
      const d = e.data.data;
      this.first_name = d.first_name;
      this.last_name  = d.last_name;
      this.birthdate  = d.birthdate;
      this.gender     = d.gender;
      this.appearance = d.appearance;
      this.clothing   = d.clothing;
      this.step = 3;
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.overlay {
  position: fixed; top:5%; left:5%;
  width: 400px; height:90%;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border:1px solid rgba(255,255,255,0.2);
  border-radius:12px;
  display:flex; flex-direction:column;
  font-family:'Poppins',sans-serif;color:#fff;
  padding:16px; z-index:9999;
}
.header { text-align:center; margin-bottom:12px; }
.body { flex:1; overflow-y:auto; }
.step { display:flex; flex-direction:column; gap:8px; }
input, select, button { width:100%; padding:8px; border:none; border-radius:6px; }
input, select { background:rgba(255,255,255,0.1); color:#fff; }
input[type="date"] { accent-color:#a020f0; }
input[type=range] { accent-color:#a020f0; }
.date-label { font-size:0.9rem; margin-top:4px; color:#ccc; }
.footer { display:flex; justify-content:space-between; margin-top:12px; }
button { background:#800080;color:#fff;cursor:pointer; }
button:disabled { opacity:0.4;cursor:default; }
</style>
