<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
          <v-img
            :src="require('@/assets/img/POPDCU_LOGO.svg')"
            class="my-3"
            contain
            height="150"
          />
          <div id="college"> {{ college }} </div>
          <div id="count"> {{ $store.state.clickedOrKeyedCount }} </div>

          <img v-if="$store.state.mouseClicked || $store.state.keyPressed" 
            id="DcuImage"
            :src="require('@/assets/img/DCU_Click.svg')"
            class="my-3"
            contain
            :style="{ transition: 'none', height: imageHeight }"
            @click="handleClick"
          />
          <img v-else 
            id="DcuImage" 
            :src="require('@/assets/img/DCU_NoneClick.svg')"
            class="my-3"
            contain
            :style="{ transition: 'none', height: imageHeight }"
            @click="handleClick"
          />
          
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { updateClickCount } from '@/api.js';

export default {
  name: 'main_component',

  data() {
    return {
      college: localStorage.getItem('UserCollege') || "None",
      imageHeight: '700px',
      audio: null,
      clickCooldown: false,
      currentClicks: 0,
      serverSyncInterval: null,
      clickCountBeforeSync: 0,
      isSyncing: false,
      clickStreak: 0, // 연속 클릭 보너스
      lastClickTime: 0, // 마지막 클릭 시간
    };
  },
  created() {
    this.audio = new Audio(require('@/assets/sound/jumping_sound2.mp3'));
    window.addEventListener('resize', this.adjustImageSize);
    this.adjustImageSize();
    
    if ('ontouchstart' in window) {
      window.addEventListener('touchstart', this.handleTouchStart);
      window.addEventListener('touchend', this.handleTouchEnd);
    } else {
      window.addEventListener('mousedown', this.handleMouseDown);
      window.addEventListener('mouseup', this.handleMouseUp);
    }
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    this.serverSyncInterval = setInterval(this.syncWithServer, 10000);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustImageSize);
    
    if ('ontouchstart' in window) {
      window.removeEventListener('touchstart', this.handleTouchStart);
      window.removeEventListener('touchend', this.handleTouchEnd);
    } else {
      window.removeEventListener('mousedown', this.handleMouseDown);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    
    if (this.serverSyncInterval) {
      clearInterval(this.serverSyncInterval);
    }
    
    this.syncWithServer();
  },
  methods: {
    adjustImageSize() {
      if (window.innerWidth < 768) {
        this.imageHeight = '300px';
      } else {
        this.imageHeight = '400px';
      }
    },
    handleClick() {
      if (!this.clickCooldown) {
        this.handleInteraction();
      }
    },
    handleMouseDown() {
      if (this.clickCooldown) return;
      this.handleInteraction();
    },
    handleMouseUp() {
      this.$store.commit('setMouseClicked', false);
    },
    handleTouchStart() {
      if (this.clickCooldown) return;
      this.handleInteraction();
    },
    handleTouchEnd() {
      this.$store.commit('setMouseClicked', false);
    },
    handleKeyDown(event) {
      if (event.repeat || this.clickCooldown) return;
      this.$store.commit('setKeyPressed', true);
      this.handleInteraction();
    },
    handleKeyUp() {
      this.$store.commit('setKeyPressed', false);
    },
    handleInteraction() {
      this.$store.commit('setMouseClicked', true);
      
      const now = Date.now();
      
      if (now - this.lastClickTime < 800) {
        this.clickStreak++;
        if (this.clickStreak > 10) {
          this.incrementClickCounter(2);
        } else {
          this.incrementClickCounter(1);
        }
      } else {
        this.clickStreak = 1;
        this.incrementClickCounter(1);
      }
      
      this.lastClickTime = now;
      this.playSound();
      this.setClickCooldown();
    },
    playSound() {
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
    },
    setClickCooldown() {
      this.clickCooldown = true;
      setTimeout(() => {
        this.clickCooldown = false;
      }, 50);
    },
    incrementClickCounter(amount = 1) {
      this.currentClicks += amount;
      this.clickCountBeforeSync += amount;
      
      for (let i = 0; i < amount; i++) {
        this.$store.commit('incrementClickedOrKeyedCount');
      }
    },
    async syncWithServer() {
      if (this.clickCountBeforeSync === 0 || this.isSyncing) return;
      
      const clicksToSync = this.clickCountBeforeSync;
      
      try {
        this.isSyncing = true;
        this.clickCountBeforeSync = 0;
        await updateClickCount(this.college, clicksToSync);
      } catch (error) {
        console.error('Error:', error);
        this.clickCountBeforeSync += clicksToSync;
      } finally {
        this.isSyncing = false;
      }
    }
  },
};
</script>

<style>
#college {
  cursor: default !important;
}
#count {
  /*position: absolute;*/
  cursor: default !important;
  font-size: 40px;
  font-weight: 900;
  color: #ffffff;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: rgb(0, 0, 0);
}
#DcuImage {
  position: relative;
  cursor: pointer;
  transform-origin: center bottom;
  transition: transform 0.1s ease-in-out;
}

#DcuImage:active {
  transform: scale(0.95);
}

@media screen and (max-width: 1100px) {
  #DcuImage {
    top: 10px;
  }
}

@media screen and (min-width: 1101px) {
  #DcuImage {
    top: 100px;
  }
}

/* 스크롤 영역만 숨기기 */
body {
  scrollbar-width: none;
}

body::-webkit-scrollbar {
  display: none;
}

.shake-animation {
  animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
