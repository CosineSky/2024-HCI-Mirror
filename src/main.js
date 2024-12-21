import { createApp } from 'vue'
import {router} from './router'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import pinia from './store/store'
import 'element-plus/dist/index.css'
import '@/style/ElStyle.css'
// const { app, BrowserWindow } = require('electron');
// // const path = require('path');
//
// let mainWindow;
//
// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true
//         }
//     });
//
//     mainWindow.loadURL('http://localhost:8081'); // 这里指向 Spring Boot 后端服务
//     mainWindow.on('closed', () => {
//         mainWindow = null;
//     });
// }
//
// app.whenReady().then(() => {
//     createWindow();
//
//     app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//         }
//     });
// });
//
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });



axios.defaults.baseURL = ("http://localhost:8081")
// axios.defaults.baseURL = ("http://172.29.4.13:8081")
axios.defaults.timeout = 30000;

createApp(App).use(ElementPlus).use(router).use(pinia).mount('#app')