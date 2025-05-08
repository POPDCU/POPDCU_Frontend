import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers/router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import store from './store/store'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(routers)
  .use(store)
  .mount('#app')
