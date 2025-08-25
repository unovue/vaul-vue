import router from '@/router'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

const app = createApp(App)

app.use(router)
// app.config.performance = true

app.mount('#app')
