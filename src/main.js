import { createApp } from 'vue'
import {router} from './router'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'

axios.defaults.baseURL = ("http://localhost:8081")
axios.defaults.timeout = 30000;

createApp(App).use(ElementPlus).use(router).mount('#app')