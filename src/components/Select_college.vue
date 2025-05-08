<template>
  <v-dialog v-model="showModal" max-width="600px" persistent>
    <v-card class="pa-4">
      <!-- 제목 섹션 -->
      <v-card-title class="text-h5 mb-2">
        단과대 선택
      </v-card-title>

      <!-- 제목과 선택창을 나누는 구분선 -->
      <v-divider class="mb-4"></v-divider>

      <!-- 선택창 섹션 -->
      <div v-if="isLoading" class="loading-overlay text-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else>
        <v-card class="mx-auto">
          <v-list>
            <v-list-item-group v-if="collegeNames.length > 0">
              <v-list-item v-for="(college, index) in collegeNames" :key="index" @click="handleSelection(college)">
                <v-hover v-slot="{ hover }">
                  <v-list-item-content :class="{ 'blue--text': hover }">
                    <v-list-item-title>{{ college }}</v-list-item-title>
                  </v-list-item-content>
                </v-hover>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>선택 가능한 단과대가 없습니다.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { getCollegeList } from '@/api.js';

export default {
  data() {
    return {
      isLoading: true,
      showModal: true,
      collegeList: [],
      collegeNames: [],
    };
  },
  mounted() {
    this.fetchCollegeData();
  },
  methods: {
    async fetchCollegeData() {
      try {
        this.isLoading = true;
        this.collegeList = await getCollegeList();
        this.collegeNames = this.collegeList.map(college => college.collegeName);
        this.isLoading = false;
        console.log(this.collegeList);
      } catch (error) {
        console.log('Error in component:', error);
      }
    },
    handleSelection(option) {

      console.log('Selected option:', option);
      localStorage.setItem('UserCollege', option);
      this.$store.dispatch('resetClickedOrKeyedCount'); // 카운팅 초기화
      this.$router.push('/');
    },
  },
};
</script>

<style>
.loading-overlay {
  height: 150px; /* 로딩 중일 때의 높이 조절 */
}

/* 선택 가능한 단과대가 없을 때의 스타일 */
v-list-item[disabled] {
  cursor: not-allowed;
  color: grey;
}
.v-card.mt-5 {
  background-color: #f8f8f8;
}
</style>