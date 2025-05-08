<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>관리자 로그인</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                label="아이디"
                prepend-icon="mdi-account"
                :rules="usernameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="비밀번호"
                type="password"
                prepend-icon="mdi-lock"
                :rules="passwordRules"
                required
              ></v-text-field>
            </v-form>
            <v-alert v-if="errorMessage" type="error" dense>
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :loading="loading">로그인</v-btn>
            <v-btn color="secondary" @click="goToMain">메인으로</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { adminLogin } from '@/api.js';

export default {
  name: 'AdminLogin',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      password: '',
      errorMessage: '',
      usernameRules: [
        v => !!v || '아이디를 입력해주세요',
      ],
      passwordRules: [
        v => !!v || '비밀번호를 입력해주세요',
      ],
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;
      
      try {
        this.loading = true;
        this.errorMessage = '';
        
        // 관리자 로그인 시도
        const response = await adminLogin(this.username, this.password);
        
        // 성공적으로 토큰을 받았는지 확인
        if (response && response.token) {
          // 토큰과 사용자 정보 저장
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('adminUsername', response.username);
          
          // 대시보드로 이동
          this.$router.push('/admin/dashboard');
        } else {
          // 토큰이 없는 경우 오류 표시
          this.errorMessage = '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else {
          this.errorMessage = '로그인 중 오류가 발생했습니다.';
        }
      } finally {
        this.loading = false;
      }
    },
    goToMain() {
      this.$router.push('/');
    }
  }
};
</script>
