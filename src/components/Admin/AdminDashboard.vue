<template>
  <v-container>
    <v-row class="mb-5">
      <v-col cols="12">
        <div class="d-flex align-center">
          <h1 class="text-h4">관리자 대시보드</h1>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="goToMain">메인으로</v-btn>
          <v-btn class="ml-2" color="error" @click="logout">로그아웃</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card class="mb-5">
      <v-card-title>
        단과대학 추가
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-form ref="addForm" v-model="addFormValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCollege.name"
                label="단과대학명"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="newCollege.count"
                label="초기 카운트"
                type="number"
                :rules="countRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="success" @click="addCollege" :loading="loading.add">추가</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="headline">
        단과대학 관리
      </v-card-title>

      <v-card-text>
        <div v-if="loading.fetch" class="text-center my-5">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-2">단과대학 목록을 불러오는 중...</div>
        </div>
        
      <div v-else-if="colleges.length === 0" class="text-center my-5">
          <v-icon large color="grey lighten-1">mdi-school</v-icon>
          <div class="mt-2 text-body-1 grey--text">단과대학 정보가 없습니다</div>
          
          <v-btn 
            color="secondary" 
            class="mt-4" 
            @click="addTestData"
          >
            테스트 데이터 추가
          </v-btn>
        </div>
        
        <v-simple-table v-else>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">단과대학명</th>
                <th class="text-left">클릭 수</th>
                <th class="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(college, index) in colleges" :key="index">
                <td>{{ college.id }}</td>
                <td>{{ college.collegeName }}</td>
                <td>{{ college.countNumber }}</td>
                <td class="text-center">
                  <v-btn small color="primary" @click="openEditDialog(college)" class="mr-2">수정</v-btn>
                  <v-btn small color="error" @click="confirmDelete(college)">삭제</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        
        <v-btn color="primary" @click="refreshColleges" class="mt-4">
          <v-icon left>mdi-refresh</v-icon> 새로고침
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 수정 다이얼로그 -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>단과대학 정보 수정</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field
              v-model="editedItem.collegeName"
              label="단과대학명"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="editedItem.countNumber"
              label="카운트"
              type="number"
              :rules="countRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">취소</v-btn>
          <v-btn color="blue darken-1" text @click="saveEdit" :loading="loading.edit">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 삭제 확인 다이얼로그 -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">정말 삭제하시겠습니까?</v-card-title>
        <v-card-text>
          이 작업은 되돌릴 수 없습니다. <strong>{{ deleteItem.collegeName }}</strong> 단과대학을 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">취소</v-btn>
          <v-btn color="red darken-1" text @click="confirmDeleteCollege" :loading="loading.delete">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 알림 스낵바 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">닫기</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { getCollegeList, createCollege, updateCollege, deleteCollege } from '@/api.js';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      colleges: [],
      headers: [
        { text: 'ID', value: 'id', width: '10%' },
        { text: '단과대학명', value: 'collegeName', align: 'start', width: '40%' },
        { text: '클릭 수', value: 'countNumber', width: '30%' },
        { text: '관리', value: 'actions', sortable: false, width: '20%' }
      ],
      loading: {
        fetch: false,
        add: false,
        edit: false,
        delete: false
      },
      newCollege: {
        name: '',
        count: 0
      },
      editDialog: false,
      editedItem: {
        id: null,
        collegeName: '',
        countNumber: 0
      },
      deleteDialog: false,
      deleteItem: {},
      addFormValid: false,
      editFormValid: false,
      nameRules: [
        v => !!v || '단과대학명을 입력해주세요',
        v => (v && v.length >= 2) || '최소 2글자 이상 입력해주세요'
      ],
      countRules: [
        v => v !== '' || '숫자를 입력해주세요',
        v => v >= 0 || '0 이상의 숫자만 입력 가능합니다'
      ],
      snackbar: {
        show: false,
        text: '',
        color: ''
      }
    };
  },
  created() {
    this.fetchColleges();
    
    // 60초마다 데이터 새로고침
    this.refreshInterval = setInterval(() => {
      if (this.$route.path === '/admin/dashboard') {
        this.fetchColleges();
      }
    }, 60000);
  },
  
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    // 단과대학 목록 불러오기
    async fetchColleges() {
      try {
        this.loading.fetch = true;
        const response = await getCollegeList();
        
        if (Array.isArray(response)) {
          this.colleges = response;
        } else {
          this.colleges = [];
        }
      } catch (error) {
        console.error('Error:', error);
        this.showSnackbar('단과대학 목록 로드 실패', 'error');
        this.colleges = [];
      } finally {
        this.loading.fetch = false;
      }
    },
    // 데이터 새로고침
    refreshColleges() {
      this.fetchColleges();
      this.showSnackbar('데이터 새로고침 완료', 'info');
    },
    // 단과대학 추가
    async addCollege() {
      if (!this.$refs.addForm.validate()) return;
      
      try {
        this.loading.add = true;
        await createCollege(this.newCollege.name, this.newCollege.count);
        
        this.showSnackbar('단과대학 추가 완료', 'success');
        await this.fetchColleges();
        
        this.newCollege.name = '';
        this.newCollege.count = 0;
        this.$refs.addForm.reset();
      } catch (error) {
        console.error('Error:', error);
        this.showSnackbar('단과대학 추가 실패', 'error');
      } finally {
        this.loading.add = false;
      }
    },
    // 수정 다이얼로그 열기
    openEditDialog(item) {
      this.editedItem = JSON.parse(JSON.stringify(item));
      this.editDialog = true;
    },
    // 수정 다이얼로그 닫기
    closeEditDialog() {
      this.editDialog = false;
      this.$nextTick(() => {
        this.editedItem = {
          id: null,
          collegeName: '',
          countNumber: 0
        };
      });
    },
    // 단과대학 수정 저장
    async saveEdit() {
      if (!this.$refs.editForm.validate()) return;
      
      try {
        this.loading.edit = true;
        await updateCollege(
          this.editedItem.id, 
          this.editedItem.collegeName, 
          this.editedItem.countNumber
        );
        
        this.showSnackbar('단과대학 수정 완료', 'success');
        await this.fetchColleges();
        this.closeEditDialog();
      } catch (error) {
        console.error('Error:', error);
        this.showSnackbar('단과대학 수정 실패', 'error');
      } finally {
        this.loading.edit = false;
      }
    },
    // 삭제 확인 다이얼로그 열기
    confirmDelete(item) {
      this.deleteItem = item;
      this.deleteDialog = true;
    },
    // 삭제 확인 다이얼로그 닫기
    closeDeleteDialog() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.deleteItem = {};
      });
    },
    // 단과대학 삭제 실행
    async confirmDeleteCollege() {
      try {
        this.loading.delete = true;
        await deleteCollege(this.deleteItem.id);
        
        this.showSnackbar('단과대학 삭제 완료', 'success');
        await this.fetchColleges();
        this.closeDeleteDialog();
      } catch (error) {
        console.error('Error:', error);
        this.showSnackbar('단과대학 삭제 실패', 'error');
      } finally {
        this.loading.delete = false;
      }
    },
    // 알림 표시
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    // 메인으로 이동
    goToMain() {
      this.$router.push('/');
    },
    // 로그아웃
    logout() {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      this.$router.push('/admin');
      this.showSnackbar('로그아웃 완료', 'info');
    },
    // 테스트 데이터 추가
    addTestData() {
      this.colleges = [
        { id: 1, collegeName: '공과대학', countNumber: 1000 },
        { id: 2, collegeName: '인문대학', countNumber: 800 },
        { id: 3, collegeName: '경영대학', countNumber: 1200 },
        { id: 4, collegeName: '사회과학대학', countNumber: 950 },
        { id: 5, collegeName: '자연과학대학', countNumber: 1100 }
      ];
      this.showSnackbar('테스트 데이터 추가 완료', 'info');
    }
  }
};
</script>
