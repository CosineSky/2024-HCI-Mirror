<script setup>
import {defineEmits, onMounted, ref} from "vue";
import musicAlbumOpened from "../icon/musicAlbumOpened.vue";
import musicAlbumClosed from "../icon/musicAlbumClosed.vue";
import searchIcon from "../icon/searchIcon.vue";
import plusIcon from "../icon/plusIcon.vue";
import playButton from "../icon/playButton.vue";
import {getPlaylistsByUser} from "../api/playlist";
import {ElPopover} from "element-plus";

const emit = defineEmits();

const musicAlbums = ref([
	{id: 1, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1'},
	{id: 2, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2'},
	{id: 3, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3'},
	{id: 4, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1'},
	{id: 5, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2'},
	{id: 6, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3'},
	{id: 7, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1'},
	{id: 8, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2'},
	{id: 9, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3'},
	{id: 10, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1'},
	{id: 11, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2'},
	{id: 12, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3'},
	// 更多歌单
]);

let albumHoveredIndex = ref(null);
let hoverOnAlbum = ref(false);
let isSideBarOpen = ref(true);
let sideBarWidth = ref(180);
let user = ref("HanG");
const criticalWidth = 180;
const minWidth = 75;

function toggleSideBar() {
	isSideBarOpen = !isSideBarOpen;
	sideBarWidth.value = isSideBarOpen ? criticalWidth : minWidth;
}

function startResizing(event) {
	event.preventDefault();
	const initialWidth = sideBarWidth.value;
	const initialMouseX = event.clientX;
	
	const onMouseMove = (moveEvent) => {
		sideBarWidth.value = initialWidth + (moveEvent.clientX - initialMouseX);
		// 确保宽度不小于最小值
		if (sideBarWidth.value <= criticalWidth) {
			isSideBarOpen = false;
			sideBarWidth.value = minWidth;
		} else
			isSideBarOpen = true;
	};
	
	const onMouseUp = () => {
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);
}

function addAlbum() {
	//TODO：添加新的空歌单
}

function toggleSearchBar() {
	const input = document.querySelector(".search-input");
	input.classList.toggle('active'); // 切换输入框的显示状态
	input.focus(); // 点击搜索图标后聚焦输入框
}

function blurSearchBar() {
	const input = document.querySelector(".search-input");
	if (input.classList.contains('active'))
		input.classList.remove('active');
	
}

function searchAlbum() {
	const input = document.querySelector(".search-input").value;
	// TODO:提交表单
}

onMounted(() => {
	getPlaylistsByUser({
		user_id: 1,
	}).then(res => {
		musicAlbums.value = res.data.result || []
	}).catch(e => {
	
	})
})

defineProps({
	callParentFunction: Function
})
</script>

<template>
	<nav class="main-menu resizable-box" :style="{ width: sideBarWidth + 'px'}">
		<div class="top-control">
			<div class="toggle-button" @click="toggleSideBar">
				<music-album-opened v-if="isSideBarOpen"/>
				<music-album-closed v-if="!isSideBarOpen"/>
				<p style="margin-left: 15px;font:normal small-caps bold 20px Arial, sans-serif ;" v-if="isSideBarOpen">
					音乐库</p>
			</div>
			
			<el-popover class="dropdown-options"
			            :width="200"
			            trigger="click"
			            hide-after="0">
				<template #reference v-if="isSideBarOpen">
					<div class="add-album">
						<plus-icon class="plus-icon"/>
					</div>
				</template>
				<ul>
					<li @click="addAlbum">添加歌单</li>
				</ul>
			</el-popover>
		
		</div>
		<div class="search-container">
			<div class="search-album" v-if="isSideBarOpen" @click="toggleSearchBar">
				<search-icon class="search-icon"/>
			</div>
			<input type="text" class="search-input" placeholder="输入搜索歌单" @keydown.enter="searchAlbum"
			       @blur="blurSearchBar"/>
		</div>
		
		
		<div class="musicAlbums"
		     @mouseenter="()=>{hoverOnAlbum=true}"
		     @mouseleave="()=>{hoverOnAlbum=false}"
		     :style="{ scrollbarWidth : hoverOnAlbum? 'auto':'none'}">
			
			<div v-if="musicAlbums !== undefined" v-for="album in musicAlbums"
			     :key="album.id"
			     @mouseenter="()=>{albumHoveredIndex = album.id}"
			     @mouseleave="()=>{albumHoveredIndex = null}"
			     :style="{backgroundColor: albumHoveredIndex === album.id ? '#1F1F1F' : '#121212' }"
			     class="musicAlbum-item">
				<img
					:src="album.picPath"
					alt="playlist"
					class="musicAlbum-image"
					:style="{opacity:albumHoveredIndex === album.id ? 0.4 :1}"
				/>
				<play-button @click="emit('setCurrentPlaylist', album);" v-if="albumHoveredIndex === album.id"
				             class="play-button"/>
				
				<div class="musicAlbum-description">
					<p style="padding-bottom: 5px;font-size: 18px">{{ album.title }}</p>
					<p style="color: #b2b2b2;font-size: 13px">歌单 • {{ user }}</p>
				</div>
			</div>
		</div>
		<div class="resizer" @mousedown="startResizing"></div>
	
	</nav>
</template>

<style scoped>

*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

ul {
	background-color: #282828;
	list-style-type: none;
	margin: 0;
	border-radius: 10px;
	padding: 12px 8px;
}

li {
	color: white;
	padding: 10px 12px;
}

li:hover {
	cursor: pointer;
	background-color: #404040;
	text-decoration: underline;
}

nav {
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
}


.main-menu.resizable-box {
	position: relative; /*使得子元素的absotute是相对于该元素*/
	/*display: flex;
	flex-direction: column;
	*/
	
	border-radius: 15px 0 0 15px;
	border-right: 1px solid rgba(255, 255, 255, 0.5);
	padding: 12px 0 20px;
	overflow: hidden;
	font-family: inherit;
	background-color: #121212;
	
}

.top-control {
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.add-album {
	color: #b2b2b2;
	margin-top: 5px;
	margin-right: 10px;
	width: 30px;
	cursor: pointer;
}

.search-container {
	margin: 12px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.search-icon {
	font-size: 24px;
	transition: margin-right 0.3s ease;
}

.search-input {
	background-color: #404040;
	font-size: 15px;
	color: #ffffff;
	height: 35px;
	border: none;
	width: 0;
	opacity: 0;
	transition: width 0.3s ease, opacity 0.3s ease;
	padding: 5px;
	border-radius: 4px;
	outline: none;
}

.search-input.active {
	width: 70%; /* 设置输入框拉伸后的宽度 */
	opacity: 1;
}

.search-album {
	display: flex;
	color: #b2b2b2;
	width: 35px;
	height: 35px;
	cursor: pointer;
	align-items: center;
	justify-content: center;
}

.plus-icon {
	border-radius: 50%;
	transition: width, color, background-color ease-in-out 0.2s;
}

.plus-icon:hover {
	transform: scale(1.1);
	color: #efeeee;
	background-color: #404040;
}

.search-icon {
	padding: 3px;
	border-radius: 50%;
	transition: width, color, background-color ease-in-out 0.2s;
}

.search-icon:hover {
	transform: scale(1.05);
	color: #efeeee;
	background-color: #404040;
}

.toggle-button:hover {
	color: #efeeee;
}

.toggle-button {
	display: flex;
	align-items: center;
	width: 120px;
	margin: 0 0 0 16px;
	background-color: transparent;
	cursor: pointer;
	transition: color 0.2s ease;
	color: #b2b2b2;
}

.resizer {
	position: absolute;
	width: 5px;
	height: 100%;
	right: 0;
	top: 0;
	cursor: ew-resize; /* 水平调整光标 */
	background-color: transparent; /* 透明背景 */
}

.musicAlbums {
	height: 100%;
	padding: 0 10px 0 10px;
	overflow: auto;
	/*默认情况 滚动条消失*/
	
}

/*滑动条*/
.musicAlbums::-webkit-scrollbar {
	width: 12px; /* 滚动条宽度 */
}

.musicAlbums::-webkit-scrollbar:window-inactive {

}

.musicAlbums::-webkit-scrollbar-track {
	background: transparent; /* 滚动条背景 */
}

.musicAlbums::-webkit-scrollbar-thumb {
	background: #888; /* 滚动条颜色 */
	border-radius: 10px; /* 圆角 */
	
}

.musicAlbums::-webkit-scrollbar-thumb:hover {
	background-color: #555; /* 悬停时的颜色 */
}

.musicAlbum-item {
	display: flex;
	position: relative;
	align-items: center;
	border-radius: 10px;
	padding: 10px 0;
	color: #f6f6f6;
}

.musicAlbum-description {
	text-align: left;
	display: flex;
	flex-direction: column;
	
}

.musicAlbum-image {
	width: 55px; /* 调整图片大小 */
	height: 55px; /* 调整图片大小 */
	margin-right: 10px;
	border-radius: 10px;
}

.play-button {
	position: absolute;
	top: 20px;
	left: 10px;
	color: #f1f1f1; /* 播放键的颜色 */
	cursor: pointer; /* 鼠标移动到播放键上时显示为点击手型 */
	transition: transform 0.3s ease;
}

.play-button:hover {
	transform: scale(1.1);
}

.musicAlbum-description {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; /* 单行显示文本 */
}


</style>