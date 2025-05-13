<template>
  <div>
    <v-btn
      @click="toggleLeaderboard"
      color="deep-purple accent-4"
      text
      class="leaderboard-toggle"
    >
      랭킹보기
    </v-btn>

    <v-dialog v-model="leaderboardVisible" width="500">
      <v-card>
        <v-card-title class="headline primary white--text">대학 랭킹</v-card-title>
        <v-card-text class="pa-4">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="ma-5"
          ></v-progress-circular>
          <v-list v-else>
            <v-list-item v-for="(college, index) in colleges" :key="index" :class="college.collegeName === userCollege ? 'highlight-user' : ''">
              <v-list-item-avatar>
                <v-avatar color="primary" size="36">
                  <span class="white--text">{{ index + 1 }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ college.collegeName }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <span class="text-h6">{{ formatNumber(college.countNumber) }}</span>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="refreshLeaderboard">
            새로고침
          </v-btn>
          <v-btn color="primary" text @click="leaderboardVisible = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getCollegeList } from '@/api.js';

export default {
  data() {
    return {
      leaderboardVisible: false,
      colleges: [],
      loading: false,
      userCollege: localStorage.getItem('UserCollege') || '',
    };
  },
  mounted() {
    this.fetchColleges();
  },
  methods: {
    // 랭킹보기 토글
    toggleLeaderboard() {
      this.leaderboardVisible = !this.leaderboardVisible;
      if (this.leaderboardVisible) {
        this.fetchColleges();
      }
    },
    // 단과대학 랭킹 로드
    async fetchColleges() {
      try {
        this.loading = true;
        this.colleges = await getCollegeList();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    // 랭킹 새로고침
    refreshLeaderboard() {
      this.fetchColleges();
    },
    // 숫자 포맷팅
    formatNumber(number) {
      return new Intl.NumberFormat().format(number);
    }
  }
};
</script>

<style scoped>
.leaderboard-toggle {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 0 20px;
}

.highlight-user {
  background-color: rgba(103, 58, 183, 0.1);
}
</style>
