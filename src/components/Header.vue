<script setup>
import { useRouter } from "vue-router";
import {ref} from "vue";
import {search} from "@/api/search";
import {userInfo} from "@/api/user";

const router = useRouter();
const searchInput = ref('');

const showDropdown = ref(false);
function toggleDropdown() {
  showDropdown.value =!showDropdown.value;
}

function exit() {
  router.push('/login');
}

function callPersonalData() {

}

function callSetting() {
  router.push('/settings');
}

function callSearch() {
  search(searchInput.value).then(res => {

  })
}
</script>

<template>
  <div class="header">
    <router-link to="/home" class="home-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </router-link>
    <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" v-model="searchInput" placeholder="想播放什么？" @keyup.enter="search" />
    </div>
    <div class="role-btn" @click="toggleDropdown">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div class="dropdown" v-show="showDropdown">
      <button @click="callPersonalData">个人资料</button>
      <button @click="callSetting">设置</button>
      <button @click="exit">退出</button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 100px;
  background-color: rgba(17, 6, 58, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
  border: 1px solid #fff;
}

.home-btn {
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: #fff;
  text-decoration: none;
}

.home-btn svg {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: #fff;
  text-decoration: none;
}

.search-box svg {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

input[type="text"] {
  padding: 5px;
  border-radius: 5px;
  margin: auto;
  width: 150%;
  height: 150%;
  background-color: rgba(200, 187, 255, 0.6);
  border: 2px solid rgba(222, 215, 255, 0.9);
  box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
  color: #fff;
  font-size: 18px;
}

input[type="text"]::placeholder {
  color: #fff;
  opacity: 0.7;
  font-size: 18px;
}

input[type="text"]:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #fff;
}

.role-btn {
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}

.role-btn svg {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: rgba(17, 6, 58, 0.7);
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 120px;
}

.dropdown button {
  width: 100%;
  padding: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: rgba(17, 6, 58, 0.7);
  color: #fff;
  text-align: left;
  font-size: 18px;
}

.dropdown button:last-child {
  margin-top: 1px;
  border-top: 1px solid #fff;
}
</style>
