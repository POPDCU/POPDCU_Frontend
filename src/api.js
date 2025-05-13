import axios from 'axios';

const apiUrl = 'http://localhost:8080/api';

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