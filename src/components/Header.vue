<script setup>
import { useRouter } from "vue-router";
import {ref} from "vue";
import {searchByKeyword} from "../api/search";
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
    router.push('/profile');
}

function callSetting() {
  router.push('/settings');
}

function callSearch() {
    searchByKeyword({keyword: searchInput.value})
    .then(res => {
        console.log("true")
    })
    .catch(() => {
        console.log("false")
    })
}
</script>

<template>
    <div class="header">
        <div style="display: flex; flex-direction: row">
            <router-link to="/home" class="home-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </router-link>
            <router-link to="/manage" class="manage-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path></svg>
            </router-link>
        </div>
        
        <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" v-model="searchInput" placeholder="想播放什么？" @keyup.enter="callSearch" />
        </div>
        <div class="role-btn" @click="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </div>
        <div class="dropdown" v-show="showDropdown" style="z-index: 2147483647">
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
  height: 60px;
  /*background-color: rgba(17, 6, 58, 0.7);*/
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

.manage-btn {
    display: flex;
    align-items: center;
    margin-right: 10px;
    color: #fff;
    text-decoration: none;
}

.manage-btn svg {
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
  padding: 8px 12px;
  border-radius: 20px;
  margin: auto;
  width: 150%;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
}

input[type="text"]::placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

input[type="text"]:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  outline: none;
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
  z-index: 2147483647;
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
    z-index: 2147483647;
  color: #fff;
  text-align: left;
  font-size: 18px;
}

.dropdown button:last-child {
    z-index: 2147483647;
  margin-top: 1px;
  border-top: 1px solid #fff;
}
</style>
