<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import {searchSongByKeyword, searchPlaylistByKeyword} from "../api/search";

const router = useRouter();
const emit = defineEmits(['headData']);

/*
 *  Search
 */
const showSearch = ref(true)
const searchInput = ref('');
const songResult = ref();
const playlistResult = ref();
const searchPlaceHolders = ref([
	"想播放什么？",
	"找找你的最爱！",
	"今天想听什么呢？",
	"搜索你喜欢的歌曲。",
	"在这里搜索歌曲或歌单吧！"
])

/*
 *  Icons
 */
const showIcons = ref(false)


function toggleIcons() {
	showIcons.value = !showIcons.value;
}

function exit() {
	// document.exitFullscreen();
	router.push('/login');
}

function callPersonalData() {
	router.push('/profile');
}

function callSetting() {
	router.push('/settings');
}

function callSearch() {
	songResult.value = [];
	playlistResult.value = [];
	showSearch.value = true

	searchSongByKeyword({
		keyword: searchInput.value
	}).then(res => {
		songResult.value = res.data.result || []
		emit('headData', {
			songResult: songResult.value,
			playlistResult: playlistResult.value,
			showSearch: showSearch.value
		});
	}).catch(() => {
		console.log("Failed to fetch songs!")
	})
	searchPlaylistByKeyword({
		keyword: searchInput.value
	}).then(res => {
		playlistResult.value = res.data.result || []
		emit('headData', {
			songResult: songResult.value,
			playlistResult: playlistResult.value,
			showSearch: showSearch.value
		});
	}).catch(() => {
		console.log("Failed to fetch playlists!")
	})
}
</script>

<template>
	<div class="header" @mouseleave="showIcons=false">
		<div style="display: flex; flex-direction: row"></div>
		
		
		<div class="search-box">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
			     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
			     class="feather feather-search">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
			<input type="text" v-model="searchInput" :placeholder="searchPlaceHolders[Math.floor(Math.random() * 5)]" @keyup.enter="callSearch"/>
		</div>
		
		<div style="display: flex; flex-direction: row">
			<router-link to="/manage" class="manage-btn header-btn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
					<path fill="currentColor"
					      d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path>
				</svg>
			</router-link>
			<router-link to="/home" class="home-btn header-btn">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				     class="feather feather-home">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
					<polyline points="9 22 9 12 15 12 15 22"></polyline>
				</svg>
			</router-link>
			<div @click="toggleIcons" class="role-btn header-btn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
					<path fill="currentColor"
					      d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32z"></path>
				</svg>
			</div>
			
			<!-- 新增的图标区域 -->
			<div class="icon-container" v-if="showIcons" style="display: flex; flex-direction: row">
				<div @click="callPersonalData" class="animated-icon header-btn" :style="{ animationDelay: `${0.1}s` }">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
					     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
					     class="feather feather-user">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				</div>
				<div @click="callSetting" class="animated-icon header-btn" :style="{ animationDelay: `${0.2}s` }">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
						<path fill="currentColor"
						      d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"></path>
					</svg>
				</div>
				<div @click="exit" class="animated-icon header-btn" :style="{ animationDelay: `${0.3}s` }">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
						<path fill="currentColor"
						      d="M352 159.872V230.4a352 352 0 1 0 320 0v-70.528A416.128 416.128 0 0 1 512 960a416 416 0 0 1-160-800.128z"></path>
						<path fill="currentColor" d="M512 64q32 0 32 32v320q0 32-32 32t-32-32V96q0-32 32-32"></path>
					</svg>
				</div>
			</div>
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
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
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
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
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

.animated-icon {
	margin: 10px 0;
	opacity: 0;
	transform: translateX(-20px); /* 初始位置稍微偏左 */
	animation: slideIn 0.5s forwards;
}

.animated-icon svg {
	color: #d5d5d5;
	width: 32px;
	height: 32px;
	margin-right: 10px;
}


.header-btn {
	border-radius: 50%;
	transition: width, color, background-color ease-in-out 0.2s;
}
.header-btn:hover {
	transform: scale(1.1);
	color: #efeeee;
	background-color: #404040;
}

@keyframes slideIn {
	to {
		opacity: 1;
		transform: translateX(0); /* 动画结束时回到原位 */
	}
}

.role-btn {
	position: relative; /* 让新图标相对于角色按钮显示 */
	cursor: pointer;
}

/* 按钮动画效果 */
.role-btn svg {
	transition: transform 0.3s ease;
}

.role-btn:hover svg {
	transform: rotate(90deg);
}
</style>
