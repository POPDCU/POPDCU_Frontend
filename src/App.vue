<template>
  <v-app id="app">
    <v-main class="background-image">
      <router-view/>
      <LeaderBoard></LeaderBoard>
      
      <!-- 관리자 로그인 버튼 -->
      <v-btn
        v-if="!isAdmin"
        fab
        small
        color="primary"
        class="admin-button"
        @click="goToAdmin"
      >
        <v-icon>mdi-account-cog</v-icon>
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import LeaderBoard from '@/components/LeaderBoard.vue';

export default {
  name: 'App',
  components: {
    LeaderBoard
  },
  data: () => ({
  }),
  computed: {
    isAdmin() {
      return this.$route.path.includes('/admin');
    }
  },
  methods: {
    goToAdmin() {
      this.$router.push('/admin');
    }
  }
}
</script>
<style scoped>
  .background-image {
    background-image: url('@/assets/img/winter_background_img.png');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    height: 100vh; /* 화면 높이의 100%로 설정하여 세로 중앙 정렬을 수행 */
  }
  
  .admin-button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
  }

  .app {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
</style>