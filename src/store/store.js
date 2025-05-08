import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    clickedOrKeyedCount: JSON.parse(localStorage.getItem('clickedOrKeyedCount')) || 0,
    mouseClicked: false,
    keyPressed: false,
  },
  mutations: {
    setMouseClicked(state, value) {
      state.mouseClicked = value;
    },
    setKeyPressed(state, value) {
      state.keyPressed = value;
    },
    incrementClickedOrKeyedCount(state) {
      state.clickedOrKeyedCount++;
      localStorage.setItem('clickedOrKeyedCount', JSON.stringify(state.clickedOrKeyedCount));
    },
    setClickedOrKeyedCount(state, value) {
      state.clickedOrKeyedCount = value;
      localStorage.setItem('clickedOrKeyedCount', JSON.stringify(value));
    },
  },
  actions: {
    resetClickedOrKeyedCount({ commit }) {
      commit('setClickedOrKeyedCount', 0);
    },
  },
});
