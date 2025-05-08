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
      clickStreak: 0, // POPCAT처럼 연속 클릭 시 보너스 포인트
      lastClickTime: 0, // 마지막 클릭 시간
    };
  },
  created() {
    this.audio = new Audio(require('@/assets/sound/jumping_sound2.mp3'));

    // 화면 너비에 따라 이미지 높이를 조정
    window.addEventListener('resize', this.adjustImageSize);
    this.adjustImageSize();
    
    if ('ontouchstart' in window) {
      // 모바일 환경일 경우에만 터치 이벤트 리스너 등록
      window.addEventListener('touchstart', this.handleTouchStart);
      window.addEventListener('touchend', this.handleTouchEnd);
    } else {
      // 모바일이 아닌 환경에서는 마우스 이벤트 리스너 등록
      window.addEventListener('mousedown', this.handleMouseDown);
      window.addEventListener('mouseup', this.handleMouseUp);
    }
    
    // 키보드 이벤트 리스너 등록
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // 서버와 주기적으로 동기화 (10초마다)
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
    
    // 서버 동기화 인터벌 정리
    if (this.serverSyncInterval) {
      clearInterval(this.serverSyncInterval);
    }
    
    // 페이지 나가기 전에 마지막으로 서버와 동기화
    this.syncWithServer();
  },
  methods: {
    adjustImageSize() {
      // 화면 너비에 따라 이미지 높이를 동적으로 조정
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
      // 클릭 상태 업데이트
      this.$store.commit('setMouseClicked', true);
      
      // 현재 시간 기록
      const now = Date.now();
      
      // 연속 클릭 처리
      if (now - this.lastClickTime < 800) { // 0.8초 이내 클릭은 연속 클릭으로 간주
        this.clickStreak++;
        if (this.clickStreak > 10) { // 연속 클릭 10번 이상이면 보너스 포인트
          this.incrementClickCounter(2); // 보너스 포인트
        } else {
          this.incrementClickCounter(1);
        }
      } else {
        this.clickStreak = 1;
        this.incrementClickCounter(1);
      }
      
      this.lastClickTime = now;
      this.playSound();
      
      // 연속 클릭 방지를 위한 쿨다운 (50ms)
      this.setClickCooldown();
    },
    playSound() {
      if (this.audio) {
        // 소리가 아직 재생 중이면 처음부터 다시 재생
        this.audio.currentTime = 0;
        this.audio.play();
      }
    },
    setClickCooldown() {
      this.clickCooldown = true;
      setTimeout(() => {
        this.clickCooldown = false;
      }, 50); // 짧은 쿨다운으로 설정
    },
    incrementClickCounter(amount = 1) {
      this.currentClicks += amount;
      this.clickCountBeforeSync += amount;
      
      // 로컬 상태 업데이트
      for (let i = 0; i < amount; i++) {
        this.$store.commit('incrementClickedOrKeyedCount');
      }
    },
    async syncWithServer() {
      // 서버와 동기화할 클릭 수가 없으면 리턴
      if (this.clickCountBeforeSync === 0 || this.isSyncing) return;
      
      // 동기화할 클릭 수 보관
      const clicksToSync = this.clickCountBeforeSync;
      
      try {
        this.isSyncing = true;
        this.clickCountBeforeSync = 0; // 동기화 전에 카운트 초기화
        
        // 서버로 클릭 수 전송
        await updateClickCount(this.college, clicksToSync);
        console.log(`${clicksToSync} clicks synced with server`);
      } catch (error) {
        console.error('Error syncing clicks with server:', error);
        // 동기화 실패 시 카운트 복구
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
