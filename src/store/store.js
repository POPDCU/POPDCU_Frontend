import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    clickedOrKeyedCount: JSON.parse(localStorage.getItem('clickedOrKeyedCount')) || 0,
    mouseClicked: false,
    keyPressed: false,
  },
  mutations: {
    // 마우스 클릭 상태 설정
    setMouseClicked(state, value) {
      state.mouseClicked = value;
    },
    // 키보드 클릭 상태 설정
    setKeyPressed(state, value) {
      state.keyPressed = value;
    },
    // 클릭 카운트 증가
    incrementClickedOrKeyedCount(state) {
      state.clickedOrKeyedCount++;
      localStorage.setItem('clickedOrKeyedCount', JSON.stringify(state.clickedOrKeyedCount));
    },
    // 클릭 카운트 지정
    setClickedOrKeyedCount(state, value) {
      state.clickedOrKeyedCount = value;
      localStorage.setItem('clickedOrKeyedCount', JSON.stringify(value));
    },
  },
  actions: {
    // 카운트 초기화
    resetClickedOrKeyedCount({ commit }) {
      commit('setClickedOrKeyedCount', 0);
    },
  },
});
