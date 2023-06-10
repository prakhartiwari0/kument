<template>
  <div class="mainAppDiv" :class="this.currentMode">

    <button class="material-symbols-rounded modeSwitcherButton"
            ref="modeSwitcherButton"
            @click="switchMode">
      {{ currentMode == 'light_mode' ? 'dark_mode' : 'light_mode' }}
    </button>


    <RouterView />

  </div>
</template>


<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  data() {
    return {
      currentMode: '',
    }
  },

  mounted() {
    window.addEventListener('beforeunload', this.saveMode);

    const storedMode = localStorage.getItem('currentMode'); // Retrieve the mode from localStorage
    if (storedMode) {
      this.currentMode = storedMode;
    } else {
      // Set a default mode if no mode is stored
      this.currentMode = 'light_mode';
    }

  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.saveMode);
  },

  methods: {
    switchMode() {
      if (this.currentMode == 'light_mode') {
        this.currentMode = 'dark_mode'}
      else {
        this.currentMode = 'light_mode'}
    },
    saveMode() {
      localStorage.setItem('currentMode', this.currentMode); // Save the mode to localStorage
    },
  }


}



</script>

<style>
.mainAppDiv {
  position: relative;
    background-color: var(--white);
}


.modeSwitcherButton {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  background-color: transparent;
  color: var(--black);
  border-bottom: 2px solid var(--black);
  border-left: 2px solid var(--black);
  border-right: 2px solid var(--black);
  font-size: 1rem;
  padding: .3rem;
  padding-inline: .5rem;
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
  user-select: none;
  cursor: pointer;
  opacity: .3;
}
  .modeSwitcherButton:hover {
    opacity: 1;
  }
</style>
