import axios from 'axios';

// 기본 API 주소를 환경 변수에서 가져오고, 없으면 현재 도메인 기준으로 동작하도록 수정
// 이렇게 하면 로컬 개발 환경과 배포 환경 모두에서 별도 수정 없이 동작합니다.
const apiUrl = process.env.VUE_APP_API_URL || '/api';

// 토큰 헤더 설정
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 단과대학 목록 조회
export const getCollegeList = async () => {
  try {
    const response = await axios.get(`${apiUrl}/ranking`);
    return response.data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// 관리자 로그인
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 단과대학 추가
export const createCollege = async (collegeName, countNumber) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(`${apiUrl}/admin/colleges`, 
      { collegeName, countNumber },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 단과대학 수정
export const updateCollege = async (id, collegeName, countNumber) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.put(`${apiUrl}/admin/colleges/${id}`, 
      { collegeName, countNumber },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 단과대학 삭제
export const deleteCollege = async (id) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.delete(`${apiUrl}/admin/colleges/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 클릭 카운트 업데이트
export const updateClickCount = async (collegeName, count) => {
  try {
    const response = await axios.patch(`${apiUrl}/count/name/${collegeName}/${count}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};