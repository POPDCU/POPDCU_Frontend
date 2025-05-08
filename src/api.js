import axios from 'axios';

const apiUrl = 'http://localhost:8080/api';

// 인증 토큰을 헤더에 추가하는 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getCollegeList = async () => {
  try {
    console.log('Calling API:', `${apiUrl}/ranking`);
    const response = await axios.get(`${apiUrl}/ranking`);
    console.log('API response:', response);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching ranking data:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 관리자 로그인
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${apiUrl}/admin/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
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
    console.error('Error creating college:', error);
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
    console.error('Error updating college:', error);
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
    console.error('Error deleting college:', error);
    throw error;
  }
};

// 클릭 카운트 증가
export const updateClickCount = async (collegeName, count) => {
  try {
    const response = await axios.patch(`${apiUrl}/count/name/${collegeName}/${count}`);
    return response.data;
  } catch (error) {
    console.error('Error updating click count:', error);
    throw error;
  }
};