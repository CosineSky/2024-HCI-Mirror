<script setup>
import {computed, onMounted, ref} from "vue";
import playButton from "../icon/playButton.vue";
import dots from "../icon/dots.vue";
import checkMark from "../icon/checkMark.vue";
import {ElPopover} from "element-plus";
import {backgroundColor, updateBackground} from "../utils/getBackgroundColor";

const props = defineProps({
	albumInfo: {},
	musicList: {},
});
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value} , #1F1F1F 50%)`)

// const albumInfo = ref({
	// id: 1,
	// image: require('../assets/pictures/playlists/1.jpg'),
	// name: '歌单 1',
	// creator: 'Kriskyy',
	// songCount: 6,
	// totalTime: '20:54'
// });



// const musicList = ref([
// 	{
// 		id: 1,
// 		number: 1,
// 		name: "包好听的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// 	{
// 		id: 2,
// 		number: 2,
// 		name: "包难听的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// 	{
// 		id: 3,
// 		number: 3,
// 		name: "包不错的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// 	{
// 		id: 4,
// 		number: 4,
// 		name: "包OK的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// 	{
// 		id: 5,
// 		number: 5,
// 		name: "包没毛病的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// 	{
// 		id: 6,
// 		number: 6,
// 		name: "包NB的歌",
// 		author: "cossky",
// 		img: require("../assets/pictures/songs/1.jpg"),
// 		time: "3:30",
// 		album: "cos的专辑"
// 	},
// ]);

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);

// 放缩时的组件处理
const handleResize = () => {
	const albums = document.querySelectorAll(".music-album-info");
	const albumText = document.querySelectorAll(".album-text");
	if (window.innerWidth > 0)
		console.log(window.innerWidth);
	// 专辑隐藏
	if (window.innerWidth < 605) {
		albums.forEach(album => {
			album.style.visibility = "hidden";
		});
		albumText.forEach(album => {
			album.style.visibility = "hidden";
		});
		
	} else {
		albums.forEach(album => {
			album.style.visibility = "visible";
		});
		albumText.forEach(album => {
			album.style.visibility = "visible";
		});
	}
	const albumImage = document.querySelector(".album-image");
	const headerAlbumName = document.querySelector(".header-album-name");
	// 歌单图片和文字缩放
	if (window.innerWidth < 420) {
		albumImage.style.width = "140px";
		albumImage.style.height = "140px";
		headerAlbumName.style.fontSize = "60px";
		headerAlbumName.style.marginBottom = "20px";
	} else {
		albumImage.style.width = "220px";
		albumImage.style.height = "220px";
		headerAlbumName.style.fontSize = "100px";
		headerAlbumName.style.marginBottom = "35px";
	}
}
onMounted(() => {
	window.addEventListener("resize", handleResize)
})
window.onscroll = () => {
	const playArea = document.querySelector(".play-area");
	const fixedPlayArea = document.querySelector(".fixed-play-area");
	const tipArea = document.querySelector(".tips");
	const fixedTipArea = document.querySelector(".fixed-tips");
	const stickyPlayY = playArea.offsetTop;
	const stickyTipY = tipArea.offsetTop;
	
	if (window.scrollY >= stickyPlayY) {
		fixedPlayArea.style.opacity = "1";
	} else {
		fixedPlayArea.style.opacity = "0";
	}
	if (window.scrollY + fixedPlayArea.scrollHeight >= stickyTipY) {
		fixedTipArea.style.display = "flex";
		fixedTipArea.style.top = fixedPlayArea.scrollHeight + 'px';
	} else {
		fixedTipArea.style.display = "none";
	}
	
}

//TODO:
const enterPersonalSpace = () => {
}
const editAlbumDescription = () => {
}
const removeAlbum = () => {
}
const playFromStart = () => {
}

const playFromId = (musicId) => {
}
const addToFavorite = (musicId) => {
}
const removeMusicFromAlbum = (musicId) => {
}
const enterMusicDescription = (musicId) => {
}
const enterAuthorDescription = (authorName) => {
}
</script>

<template>
	<div class="album-content" :style="{backgroundImage: gradientColor}">
		<div class="header">
			<img src="../assets/pictures/songs/3.jpg" alt="" class="album-image" @load="updateBackground"/>
<!--			<img :src="albumInfo.image" alt="" class="album-image" @load="updateBackground"/>-->
			<div class="header-content">
				<p style="text-align: left;margin:20px 0 0 15px">歌单</p>
				<p class="header-album-name" style="font-weight: bolder;font-size:100px;margin:10px 0 35px 10px;">
					{{ albumInfo.title }}</p>
				<div class="header-content-detail">
					<p class="header-creator" @click="enterPersonalSpace">{{ albumInfo.description }}</p>
					<p>•</p>
					<p style="margin-left:6px">歌曲数量: {{ musicList.length }}</p>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="play-area">
				<div class="play-button">
					<play-button @click="playFromStart" style="position: absolute; top:20%;left:24%;color: #000000"/>
				</div>
				<el-popover
					style="border-radius: 10px;"
					:width="400"
					trigger="click"
					hide-after="0">
					<template #reference>
						<dots class="more-info"/>
					</template>
					<ul>
						<li @click="editAlbumDescription">编辑歌单详情</li>
						<li @click="removeAlbum">删除歌单</li>
					</ul>
				</el-popover>
			</div>
			<div class="fixed-play-area" :style="{background :`${backgroundColor}`}">
				<div class="opacity-wrapper">
					<div class="play-button">
						<play-button @click="playFromStart"
						             style="position: absolute; top:20%;left:24%;color: #000000"/>
					</div>
					<p style="padding-left: 10px;font-weight: bold;font-size: 26px">{{ albumInfo.name }}</p>
				</div>
			</div>
			<div class="tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p class="album-text" style="position:absolute; left:62%">专辑</p>
				<p style="margin-left: auto; margin-right:55px">时间</p>
			</div>
			<div class="fixed-tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p class="album-text" style="position:absolute; left:62%">专辑</p>
				<p style="margin-left: auto; margin-right:75px">时间</p>
			</div>
			
			<div class="musicList">
				<div class="music-item"
				     v-for="music in musicList"
				     :key="music.id"
				     :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
				     @mouseenter="()=>{musicHoveredIndex = music.id;}"
				     @mouseleave="()=>{musicHoveredIndex = null}"
				     @click="musicClickedIndex=music.id"
				     ondblclick="playFromId(music.id)"
				     :style="{backgroundColor: musicClickedIndex===music.id? '#404040': musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)' }"
				     :class="[musicClickedIndex === music.id ? 'music-after-click' : '']">
					
					<div :style="{visibility: musicHoveredIndex === music.id ? 'hidden' : 'visible' }">{{
							music.number
						}}
					</div>
					<play-button @click="playFromId(music.id)" style="position: absolute;left: 33px;cursor: pointer"
					             v-if="musicHoveredIndex === music.id"/>
					
					<div class="music-detailed-info">
						<!--TODO: img src to be changed-->
						<img class="music-image"
						     src="../assets/pictures/playlists/1.jpg"
						     alt="歌曲图片"/>
						<div class="music-name-author" style="padding-left: 5px;">
							<p @click="enterMusicDescription(music.id)" class="music-name">{{ music.title }}</p>
							<p @click="enterAuthorDescription(music.author)" class="music-author"
							   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
								{{ music.artist }}</p>
						</div>
					</div>
					
					<div class="music-album-info" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
						{{ music.album }}
					</div>
					<div class="music-right-info">
						<check-mark @onclick="addToFavorite(music.id)" class="check-mark"
						            :style="{visibility: musicHoveredIndex === music.id ? 'visible' : 'hidden'}"/>
						<div style="margin-left: auto;margin-right: 15px; color: #b2b2b2"
						     :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">{{ music.upload_time }}
						</div>
						<el-popover class="music-dropdown-options"
						            :width="400"
						            trigger="click"
						            hide-after="0">
							<template #reference>
								<dots class="music-more-info" :style="{}"/>
							</template>
							<ul>
								<li @click="removeMusicFromAlbum(music.id)">删除歌曲</li>
							</ul>
						</el-popover>
					
					</div>
				
				</div>
			
			</div>
			
			<div class="other-info">
				<h3>推荐歌曲</h3>
				<div class="music-item" v-for="music in musicList" :key="music.id + 'recommend'">
					<span>{{ music.number }}</span>
					<!--TODO: img src to be changed-->
					<img
						src="../assets/pictures/playlists/2.jpg"
						alt="推荐歌曲图片"
						class="music-image"
					/>
					<span>{{ music.title }}</span>
					<span>{{ music.artist }}</span>
					<span>{{ music.album }}</span>
					<span>{{ music.upload_time }}</span>
				</div>
			</div>
		
		</div>
	
	</div>
</template>

<style scoped>
li {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

p {
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
}

.header, .play-area, .tips, .musicList, .other-info {
	z-index: 10;
	padding: 20px;
	width: 100%;
	box-sizing: border-box;
}

.album-content {
	margin: 0;
	padding: 0;
	color: white;
	background-color: rgb(31, 31, 31);
	display: flex;
	flex-direction: column;
	width: 100%;
}


.header {
	display: flex;
	flex-direction: row;
}

.content {
	z-index: 1;
	background-color: rgba(0, 0, 0, 0.20);
}

.album-image {
	border-radius: 6%;
	width: 220px;
	height: 220px;
	margin-top: 30px;
	margin-left: 15px;
	margin-right: 20px;
}

.header-content {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
}

.header-content-detail {
	padding: 10px;
	align-items: center;
	display: flex;
	flex-direction: row;
}

.header-creator {
	margin: 0 6px;
	cursor: pointer;
	font-weight: bolder
}

.header-creator:hover {
	text-decoration: underline;
}

.play-area {
	position: relative;
}

.more-info {
	font-size: 35px;
	position: absolute;
	z-index: 13;
	top: 33px;
	left: 160px;
	transition: width 0.1s ease-in-out;
}

.more-info:focus {
	outline: none;
	
}

.more-info:hover {
	cursor: pointer;
	transform: scale(1.15);
}

.fixed-play-area {
	top: 0;
	z-index: 11;
	width: 100%;
	opacity: 0;
	transition: opacity 0.2s ease-out;
	position: fixed;
	display: flex;
	padding: 10px 0 10px 20px;
	
}

.opacity-wrapper {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	margin: -10px 0 -10px -20px;
	padding: 10px 0 10px 20px;
	background-color: rgba(0, 0, 0, 0.50);
}

.play-button {
	margin-left: 40px;
	background-color: green;
	border-radius: 50%;
	width: 60px;
	height: 60px;
	position: relative;
	align-items: center;
	justify-content: center;
	transition: all 0.1s;
}

.play-button:hover {
	cursor: pointer;
	transform: scale(1.05);
	background-color: lightgreen;
}


.tips {
	z-index: 0;
	display: flex;
	padding: 5px 8px 5px 8px;
}

.fixed-tips {
	z-index: 11;
	width: 100%;
	justify-content: space-between;
	display: none;
	padding: 10px 8px 10px 8px;
	position: fixed;
	background-color: #1f1f1f;
	border-bottom: 1px solid #363636;
}

.musicList, .other-info {
	border-top: 1px solid #eaeaea;
	margin-top: 10px;
}

/*每行音乐的样式*/
.music-item {
	border-radius: 10px;
	display: flex;
	align-items: center;
	padding: 10px 0 10px 25px;
}

/*音乐被点击后的样式*/
.music-after-click {
	background-color: #5d5b66;
}

/*左侧信息*/
.music-detailed-info {
	display: flex;
	flex-direction: row;
}

.music-image {
	padding-left: 30px;
	height: 50px;
	width: 50px; /* Adjust as needed */
	border-radius: 10px;
}

.music-name {
	padding-bottom: 5px;
	font-size: 18px
}

.music-name:hover {
	cursor: pointer;
	text-decoration: underline;
}

.music-author {
	color: #b2b2b2;
	font-size: 15px
}

.music-author:hover {
	cursor: pointer;
	text-decoration: underline;
}

/*专辑信息*/
.music-album-info {
	position: absolute;
	left: 60%;
	color: #b2b2b2;
}

.music-album-info:hover {
	cursor: pointer;
	text-decoration: underline;
}

/*右侧信息*/
.music-right-info {
	margin-left: auto;
	display: flex;
	align-items: center;
	flex-direction: row;
}

.check-mark {
	width: 20px;
	height: auto;
	margin-right: 40px;
	color: black;
	font-weight: bolder;
	border-radius: 50%;
}

.check-mark:hover {
	cursor: pointer;
}

.music-more-info {
	margin-right: 14px;
	font-size: 22px;
	transition: width 0.1s ease-in-out;
}

.music-more-info:focus {
	outline: none;
	transform: scale(1.05);
}

.music-more-info:hover {
	cursor: pointer;
}

.music-dropdown-options {
	border-radius: 6px;
}

ul {
	background-color: #282828;
	list-style-type: none;
	padding: 0;
	margin: 0;
	border-radius: 10px;
}

li {
	color: white;
	padding: 15px 12px;
}

li:hover {
	cursor: pointer;
	text-decoration: underline;
}

.other-info {
	margin-top: 20px;
}

</style>
