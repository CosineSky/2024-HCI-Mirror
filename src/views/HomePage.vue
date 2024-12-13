/* eslint-disable */
<script setup>
import {onMounted, ref} from "vue"
import {LOOP_MODE, NORMAL_MODE, PAUSE, PLAY, RANDOM_MODE} from "../assets/base64";
import Header from "../components/Header";
import Comment from "../components/Comment";
import LeftSideBar from "../components/LeftSideBar";
import {useTheme} from "../store/theme";
import defaultBg from '../assets/pictures/Eason.png'
import {getSongsByPlaylist} from "../api/song";
import {getPlaylistsByUser} from "../api/playlist";
import MusicAlbumView from "../components/MusicAlbumView.vue";
import SearchView from "@/components/SearchView.vue";

const theme = useTheme()
const album_selected = ref(false);
const showRightContent = ref(false)

const selectAlbum = () => {
	console.log("selectAlbum");
	album_selected.value = true;
}
const unSelectAlbum = () => {
	console.log("unSelectAlbum");
	album_selected.value = false;
}


/*
    ORIGINAL DESIGNS
 */
// main-elements
let song;
let progress;
let songName;
let artistName;

// buttons
let playPauseButton;
let forwardButton;
let backwardButton;
let playModeButton;
let shareButton;

// icons
let controlIcon;
let playModeIcon;


/*
    USER
 */
const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));
const currentUserId = ref(userToken.value.id);


/*
    SONGS
 */
// Playing Status
const songs = ref([]);
const isPaused = ref(false);
const playingMode = ref(0); /* 0 - Normal, 1 - Loop, 2 - Random */

// Current Playing
const currentSongId = ref(1);
const currentSongIndex = ref(0);


/*
    PLAYLISTS
 */
const playlists = ref([]);
const currentPlaylist = ref(1);
const currentPlaylistId = ref(1);
const receivePlaylistId = (value) => {
	currentPlaylist.value = value;
	currentPlaylistId.value = value.id;
	console.log("Current Playlist Id:", currentPlaylistId.value)
	getSongsByPlaylist({
		playlist_id: currentPlaylistId.value,
	}).then((res) => {
		songs.value = res.data.result;
		console.log("Songs:", res.data.result);
	}).catch(e => {
		console.log("Failed to get songs!");
	});
};


/*
    SEARCH
 */
const songResult = ref();
const playlistResult = ref();

function receiveDataFromHeader(data) {
	songResult.value = data.songResult;
	playlistResult.value = data.playlistResult;
	setMidComponents(3);
}

/*
    MID COMPONENTS
    1 - Music Albums
    2 - Comments
    3 - Search Results
 */
const midComponents = ref(1);
const setMidComponents = (val) => {
	midComponents.value = val;
}

onMounted(() => {
	/*
        DOMS & EVENTS
	 */
	theme.change(defaultBg)
	const navItems = document.querySelectorAll(".nav-item");
	
	navItems.forEach((navItem) => {
		navItem.addEventListener("click", () => {
			navItems.forEach((item) => {
				item.className = "nav-item";
			});
			navItem.className = "nav-item active";
		});
	});
	
	const containers = document.querySelectorAll(".containers");
	
	containers.forEach((container) => {
		let isDragging = false;
		let startX;
		let scrollLeft;
		
		container.addEventListener("mousedown", (e) => {
			isDragging = true;
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
		});
		
		container.addEventListener("mousemove", (e) => {
			if (!isDragging) {
				return;
			}
			e.preventDefault();
			
			const x = e.pageX - container.offsetLeft;
			const step = (x - startX) * 0.6;
			container.scrollLeft = scrollLeft - step;
		});
		
		container.addEventListener("mouseup", () => {
			isDragging = false;
		});
		
		container.addEventListener("mouseleave", () => {
			isDragging = false;
		});
		
		container.addEventListener('wheel', (e) => {
			container.scrollLeft += e.deltaY / 2;
		});
	});
	
	song = document.getElementById("song");
	progress = document.getElementById("progress");
	controlIcon = document.getElementById("controlIcon");
	playModeIcon = document.getElementById("playModeIcon");
	playPauseButton = document.querySelector(".play-pause-btn");
	forwardButton = document.querySelector(".controls button.forward");
	backwardButton = document.querySelector(".controls button.backward");
	playModeButton = document.querySelector(".play-mode-btn");
	shareButton = document.querySelector(".share-btn");
	songName = document.querySelector(".music-info h2");
	artistName = document.querySelector(".music-info p");
	
	function updateSongInfo() {
		if (songName && artistName) {
			songName.textContent = songs[currentSongIndex.value].title;
			artistName.textContent = songs[currentSongIndex.value].name;
		}
		song.addEventListener("loadeddata", function () {
		});
	}
	
	song.addEventListener("loadedmetadata", function () {
		progress.max = song.duration;
		progress.value = song.currentTime;
	});
	
	song.addEventListener("ended", function () {
		currentSongIndex.value = (currentSongIndex.value + 1) % songs.length;
		updateSongInfo();
		playPause();
	});
	
	song.addEventListener("timeupdate", function () {
		if (!song.paused) {
			progress.value = song.currentTime;
		}
	});
	
	function shareSong() {
		console.log("Hello!");
	}
	
	function playPause() {
		isPaused.value = !isPaused.value;
		if (song.paused) {
			song.play();
			controlIcon.src = PLAY;
		} else {
			song.pause();
			controlIcon.src = PAUSE;
		}
	}
	
	function switchPlayMode() {
		playingMode.value = (playingMode.value + 1) % 3
		switch (playingMode.value) {
			case 0:
				playModeIcon.src = NORMAL_MODE;
				break;
			case 1:
				playModeIcon.src = LOOP_MODE;
				break;
			case 2:
				playModeIcon.src = RANDOM_MODE;
				break;
			default:
				break;
		}
	}
	
	shareButton.addEventListener("click", shareSong);
	playPauseButton.addEventListener("click", playPause);
	playModeButton.addEventListener("click", switchPlayMode);
	
	progress.addEventListener("input", function () {
		song.currentTime = progress.value;
	});
	
	progress.addEventListener("change", function () {
		song.play();
	});
	
	forwardButton.addEventListener("click", function () {
		currentSongIndex.value = (currentSongIndex.value + 1) % songs.length;
		updateSongInfo();
		playPause();
	});
	
	backwardButton.addEventListener("click", function () {
		currentSongIndex.value = (currentSongIndex.value - 1 + songs.length) % songs.length;
		updateSongInfo();
		playPause();
	});
	
	updateSongInfo();
	
	/*
		API
	 */
	getPlaylistsByUser({
		user_id: currentUserId.value,
	}).then((res) => {
		playlists.value = res.data.result;
		currentPlaylist.value = playlists.value[0];
		currentPlaylistId.value = currentPlaylist.value.id;
		getSongsByPlaylist({
			playlist_id: currentPlaylistId.value,
		}).then((res) => {
			songs.value = res.data.result;
			console.log("Songs:", res.data.result);
		}).catch(e => {
			console.log("Failed to get songs!");
		});
		console.log("Playlists:", res.data.result);
	}).catch(e => {
		console.log("Failed to get playlists!");
	});
	
})
</script>

<template>
	<body>
	<Header @headData="receiveDataFromHeader"/>
	<main @click="unSelectAlbum">
		<left-side-bar @setCurrentPlaylist="receivePlaylistId"/>
		<section class="content" :class="{ 'full-width': !showRightContent }">
			<div class="left-content" :class="{ 'expanded': !showRightContent }">
				<el-container v-if="midComponents == 1" class="playlist-container" style="overflow: auto; height: 698px">
					<MusicAlbumView :album-info="currentPlaylist" :music-list="songs"/>
				</el-container>
				<el-container v-if="midComponents == 2" class="playlist-container" style="overflow: auto; height: 668px">
					<Comment :song-id=currentSongId :user-id=currentUserId></Comment>
				</el-container>
				<el-container v-if="midComponents == 3" class="playlist-container" style="overflow: auto; height: 698px">
					<el-button class="exit-search" @click="setMidComponents(1)"></el-button>
					<SearchView :songResult="songResult" :playlistResult="playlistResult"/>
				</el-container>
			</div>
			<div v-if="showRightContent" class="right-content">
				<div class="music-player music-info">
					<a href="#play" style="margin: 10px 0 0 0;">
						<div class="album-cover">
							<img src="../assets/pictures/songs/2.jpg" id="rotatingImage" alt=""/>
							<span class="point"></span>
						</div>
					</a>
					<h2>ウミユリ海底譚</h2>
					<p>n-buna</p>
				</div>
				
				<div class="current-playlist" style="margin-top: 20px">
					<el-container class="playlist-container" style="height: 64px">
						<div class="playlist-item" style="display: flex; flex-direction: row">
							<img src="../assets/icons/add.png" alt="" style=""/>
							<div style="display: flex; flex-direction: column; align-items: center; margin-left: 10px">
								<p class="playlist-container-desc" style="
											color: white;
											font-size: 16px;
											text-align: left;
											margin-top: 16px;
										">New Song</p>
							</div>
						</div>
					</el-container>
					<el-container class="playlist-container" style="overflow: auto; height: 320px">
						<div v-for="song in songs" class="playlist-item" style="display: flex; flex-direction: row">
							<div>
								<img src="../assets/pictures/bg1.jpg" alt=""/>
							</div>
							<div style="display: flex; flex-direction: column; margin-left: 10px">
								<p class="playlist-container-desc" style="
											color: white;
											font-size: 16px;
											text-align: left;
											overflow: auto;
											width: 240px;
											height: 24px
										">{{ song.title }}</p>
								<p class="playlist-container-desc" style="
											color: white;
											font-size: 12px;
											text-align: left;
											overflow: auto;
											width: 240px;
											height: 18px
										">{{ song.artist }}</p>
							</div>
						</div>
					</el-container>
				</div>
			</div>
		</section>
	</main>
	<footer>
		<div class="bottom-description bottom-component"
		     style="display: flex; flex-direction: row; justify-content: center;">
			<div>
				<a href="#play">
					<div>
						<img src="../assets/pictures/songs/2.jpg" alt=""
						     style="
									     width: 60px;
									     margin: 0 0 0 10px;
									     border-radius: 5%;
										 border: 2px solid rgba(222, 215, 255, 0.9);
										 max-width: 120px;
										 box-shadow: 0 10px 60px rgba(200, 187, 255);
									"/>
						<audio id="song">
							<source src="../assets/audio/2.mp3" type="audio/mpeg"/>
						</audio>
					</div>
				</a>
			</div>
			<div style="display: flex; flex-direction: column; justify-content: center;">
				<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
					ウミユリ海底譚</p>
				<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
					n-buna</p>
			</div>
		</div>
		
		<div class="comment-icon bottom-component" style="
					position: absolute;
					left: 15%;
					transform: translateX(-50%);
					color: white;
					cursor: pointer;
				">
			<img src="../assets/icons/comment/comment.png" alt="" style="width: 24px; height: 24px;"
			     @click="setMidComponents(2)">
		</div>
		<el-card class="bottom-controller bottom-component" style="
					position: absolute;
				    left: 50%;
				    transform: translateX(-50%);
				">
			<div class="controls" style="display: flex; flex-direction: row; margin: 10px 0 0 0">
				<button class="share-btn" style="margin: 0">
					<img src="../assets/icons/controller/share.png" alt="" style="width: 60%">
				</button>
				<button class="backward" style="margin: 0 10px 0 10px">
					<img src="../assets/icons/controller/last.png" alt="" style="width: 60%">
				</button>
				<button class="play-pause-btn" style="margin: 0 10px 0 10px">
					<img id="controlIcon" src="../assets/icons/controller/play.png" alt="" style="width: 60%">
				</button>
				<button class="forward" style="margin: 0 10px 0 10px">
					<img src="../assets/icons/controller/next.png" alt="" style="width: 60%">
				</button>
				<button class="play-mode-btn" style="margin: 0">
					<img id="playModeIcon" src="../assets/icons/controller/normal.png" alt="" style="width: 60%">
				</button>
			</div>
			<input type="range" value="0" id="progress" style="margin: 0 0 10px 0; width: 500px"/>
		</el-card>
		<div class="queue-icon bottom-component" style="
					position: absolute;
					left: 85%;
					transform: translateX(-50%);
					color: white;
					cursor: pointer;
				">
			<img src="../assets/icons/queue.png" alt="" style="width: 24px; height: 24px;"
			     @click="showRightContent = !showRightContent">
		</div>
	</footer>
	</body>
</template>

<style scoped>

*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

nav {
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
}

nav ul,
nav ul li {
	outline: 0;
}

nav ul li a {
	text-decoration: none;
}

img {
	width: 100%;
}

h1 {
	font-size: clamp(1.2rem, 3vw, 1.5rem);
}

body {
	font-family: "Nunito", sans-serif;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	min-height: 100vh;
	background-color: rgba(0, 0, 0, 1);
	background-repeat: no-repeat;
	background-size: cover;
	overflow: hidden;
}

/* MAIN MENU */

main {
	display: grid;
	grid-template-columns: 11% 89%;
	height: 700px;
	width: 95%;
	margin: 20px 0 0 0;
	/*background: rgba(16, 21, 61, 0.6);*/
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
	box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
	0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
	z-index: 10;
}

footer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 75px;
	width: 100%;
	margin: 20px 0 0 0;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

.transparent-btn {
	background-color: transparent !important;
	border-color: transparent !important;
	color: #333;
}

.main-menu {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 15px 0 0 15px;
	border-right: 1px solid rgba(255, 255, 255, 0.5);
	padding: 12px 0 20px;
	overflow: hidden;
	font-family: inherit;
}

.user-info img {
	padding: 12px 24px 6px;
	border-radius: 50%;
}

.user-info p {
	color: #fff;
	font-size: clamp(0.8rem, 3vw, 1rem);
	font-weight: 500;
	text-align: center;
	line-height: 1;
	padding: 0 6px 32px;
}

.nav-item {
	display: block;
}

.nav-item a {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 1rem;
	padding: 12px 0;
	margin: 0 8px;
	border-radius: 5px;
}

.nav-item.active a {
	background: rgba(106, 109, 155, 0.5);
	text-decoration: none;
}

.nav-icon {
	width: 40px;
	height: 20px;
	font-size: 1.1rem;
}


/* CONTENT */

.content {
	display: grid;
	grid-template-columns: 75% 25%;
	transition: all 0.3s ease;
}

.content.full-width {
	grid-template-columns: 100% !important;
}

/* LEFT CONTENT */

.left-content > {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #e5e5e5;
	transition: all 0.3s ease;
	margin: 0;
	padding: 0;
}

.left-content.expanded {
	margin: 0;
	padding: 0;
	width: 100%;
}

.swiper-slide img {
	border-radius: 20px;
	height: 300px;
	object-fit: cover;
	border: 2px solid rgba(159, 160, 168, 0.5);
}

/* Containers of Artist and Albums */

.containers {
	display: flex;
	align-items: center;
	padding: 0 0 12px;
	overflow-x: auto;
	cursor: grab;
}


/* ALBUMS */
.albums {
	animation: fadeIn 0.5s ease-in-out;
}

.playlist-item img {
	inset: 0;
	width: 60px;
	object-fit: cover;
	transition: transform 0.8s;
	pointer-events: none;
	aspect-ratio: 1/1;
	border: 2px solid rgba(169, 150, 253, 0.5);
	border-radius: 10px;
	box-shadow: rgba(221, 221, 221, 0.3) 0px 8px 18px -3px,
	rgba(221, 221, 221, 0.2) 0px -3px 0px inset;
}

.playlist-item:hover img {
	transform: rotate(3deg) scale(1.14514);
}

.album-container {
	column-gap: 24px;
}

.album {
	display: grid;
	grid-auto-flow: dense;
	grid-template-rows: 5fr 2fr;
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	height: 240px;
}

.album-frame {
	position: relative;
	width: 144px;
	aspect-ratio: 1/1;
	border: 2px solid rgba(169, 150, 253, 0.5);
	border-radius: 10px;
	box-shadow: rgba(221, 221, 221, 0.3) 0px 8px 18px -3px,
	rgba(221, 221, 221, 0.2) 0px -3px 0px inset;
	overflow: hidden;
}

.album-frame img {
	position: absolute;
	inset: 0;
	height: 100%;
	object-fit: cover;
	transition: transform 0.8s;
	pointer-events: none;
}

.album-frame:hover img {
	transform: rotate(3deg) scale(1.2);
}

.album h2 {
	font-size: clamp(0.9rem, 4vw, 1.1rem);
	font-weight: 500;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	max-width: 150px;
	
	@supports (-webkit-line-clamp: 2) {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}

.album p {
	font-size: clamp(0.9rem, 4vw, 1rem);
	opacity: 0.5;
}

/* Containers Scrollbar Style */
.playlist-container::-webkit-scrollbar {
	height: 10px;
	display: none;
}

.playlist-container-desc::-webkit-scrollbar {
	height: 10px;
	display: none;
}

.album-container::-webkit-scrollbar {
	height: 10px;
	display: none;
}

.album-container::-webkit-scrollbar-track {
	box-shadow: inset 0 0 0.3rem rgb(79, 78, 78);
	border-radius: 40px;
}

.album-container::-webkit-scrollbar-thumb {
	box-shadow: inset 0 0 0.5rem rgb(116, 116, 116);
	background-color: rgba(25, 43, 206, 0.2);
	outline: none;
	border-radius: 40px;
}

/* RIGHT CONTENT */

.right-content {
	display: flex;
	flex-direction: column;
	border-radius: 0 15px 15px 0;
	border-left: 1px solid rgba(255, 255, 255, 0.5);
	padding: 30px 20px;
	color: #e5e5e5;
}

/* SONGS */
.song-img img {
	aspect-ratio: 4/3;
	border-radius: inherit;
	object-fit: cover;
	border: 2px solid rgba(159, 160, 168, 0.5);
	box-shadow: rgba(221, 221, 221, 0.3) 0px 6px 18px -3px,
	rgba(221, 221, 221, 0.2) 0px -3px 0px inset;
}

.song-img .overlay {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 92%;
	background-color: rgba(169, 150, 253, 0.6);
	border-radius: inherit;
	font-size: 1.75rem;
	opacity: 0;
	transition: all 0.4s linear;
	cursor: pointer;
}

.song-img:hover .overlay {
	opacity: 1;
}

.song h2 {
	font-size: 1rem;
}

.song p,
.song span {
	font-size: 0.8rem;
	font-weight: 300;
}

.song p {
	opacity: 0.8;
}

/* MUSIC PLAYER */

.music-player {
	display: flex;
	flex-direction: column;
	color: #fff;
	background: rgba(188, 184, 198, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow: inset 2px -2px 6px rgba(214, 214, 214, 0.2),
	inset -3px 3px 3px rgba(255, 255, 255, 0.3);
	border-radius: 16px;
	height: 200px;
}

.album-cover {
	position: relative;
}

.album-cover img {
	border-radius: 50%;
	border: 2px solid rgba(222, 215, 255, 0.9);
	max-width: 120px;
	aspect-ratio: 1/1;
	object-fit: cover;
	box-shadow: 0 10px 60px rgba(200, 187, 255);
	transition: transform 0.5s ease-out;
	pointer-events: none;
	user-select: none;
}

.point {
	position: absolute;
	top: 50%;
	left: 50%;
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	width: 16px;
	background-color: rgba(17, 6, 58, 0.7);
	border: 2px solid rgba(222, 215, 255, 0.9);
	aspect-ratio: 1/1;
	border-radius: 50%;
	z-index: 2;
}

.music-player h2 {
	font-size: 1.2rem;
	font-weight: 500;
	margin: 8px 0 0 0;
}

.music-player p {
	font-size: 1rem;
	font-weight: 300;
	margin-bottom: 26px;
	opacity: 0.8;
}

/* Music Player Controls */

#progress {
	appearance: none;
	-webkit-appearance: none;
	width: 100%;
	height: 6px;
	background: rgba(200, 187, 255, 0.6);
	border-radius: 4px;
	margin-bottom: 16px;
	cursor: pointer;
}

#progress::-webkit-slider-thumb {
	appearance: none;
	-webkit-appearance: none;
	background: rgb(77, 58, 162);
	width: 20px;
	aspect-ratio: 1/1;
	border-radius: 50%;
	border: 4px solid rgb(234, 229, 255);
	box-shadow: 0 6px 10px rgba(200, 187, 255, 0.4);
}

.controls {
	display: flex;
	justify-content: center;
	align-items: center;
}

.controls button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	aspect-ratio: 1/1;
	margin: 20px;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 50%;
	border: 0;
	outline: 0;
	color: #fff;
	font-size: 1.1rem;
	box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
	cursor: pointer;
	transition: all 0.3s linear;
}

.controls button:is(:hover, :focus-visible) {
	transform: scale(0.96);
}

.controls button:nth-child(3) {
	transform: scale(1.3);
}

.controls button:nth-child(3):is(:hover, :focus-visible) {
	transform: scale(1.25);
}

.controls button:nth-child(1) {
	transform: scale(0.8);
}

.controls button:nth-child(5) {
	transform: scale(0.8);
}

/* MEDIA QUERIES */
@media (max-width: 1500px) {
	main {
		grid-template-columns: 15% 85%;
	}
	
	.user-info img {
		border-radius: 50%;
		padding: 12px 12px 6px;
	}
	
	.nav-icon {
		text-align: center;
		transform: translateY(2px);
	}
	
	.content {
		grid-template-columns: 70% 30%;
	}
}

@media (max-width: 1310px) {
	main {
		grid-template-columns: 8% 92%;
		margin: 30px;
	}
}

@media (max-width: 1250px) {
	.swiper-slide {
		width: 500px;
	}
	
	.swiper-slide img {
		border-radius: 16px;
		height: 280px;
	}
	
	.album-frame {
		width: 160px;
	}
	
	.song {
		grid-template-columns: 29% auto 10%;
	}
	
	.controls button {
		margin: 15px;
	}
}

@media (max-width: 1100px) {
	.content:not(.full-width) {
		grid-template-columns: 60% 40%;
	}
	
	.left-content {
		padding: 40px 20px 20px;
	}
	
	.swiper-slide {
		width: 410px;
	}
	
	.swiper-slide img {
		height: 220px;
	}
	
	.album {
		grid-template-rows: 4fr 2fr;
	}
	
	.album-frame {
		width: 130px;
	}
	
	.song {
		grid-template-columns: 26% auto 10%;
	}
	
	.song:nth-child(8),
	.song:nth-child(9) {
		display: none;
	}
}

@media (max-width: 910px) {
	main {
		grid-template-columns: 10% 90%;
		margin: 20px;
	}
	
	.left-content {
		padding: 30px 20px 20px;
	}
	
	.swiper-slide img {
		height: 180px;
	}
	
	.album {
		grid-template-rows: 3fr 2fr;
	}
	
	.album-frame {
		width: 100px;
	}
	
	.right-content {
		grid-template-rows: 55% 45%;
	}
	
}

@media (max-width: 825px) {
	.content:not(.full-width) {
		grid-template-columns: 52% 48%;
	}
	
	.swiper-slide {
		width: 280px;
	}
	
	.swiper-slide img {
		height: 200px;
	}
	
	.slide-overlay button {
		padding: 8px 12px;
	}
	
}

@media (max-width: 750px) {
	main {
		grid-template-columns: 15% 85%;
	}
	
	.content:not(.full-width) {
		grid-template-columns: 100%;
		grid-template-areas:
        "leftContent"
        "rightContent";
	}
	
	.left-content {
		grid-area: leftContent;
	}
	
	.album {
		grid-template-rows: 3fr 2fr;
	}
	
	.album-frame {
		width: 140px;
	}
	
	.right-content {
		grid-area: rightContent;
		border-left: unset;
		grid-template-rows: 60% 40%;
		row-gap: 16px;
	}
	
	#progress {
		width: 60%;
	}
	
	.controls button {
		margin: 20px;
	}
}

@media (max-width: 580px) {
	.swiper-slide {
		width: 290px;
	}
	
	.swiper-slide img {
		height: 180px;
	}
	
	.artist img {
		width: 80px;
	}
	
	.album {
		grid-template-rows: 3fr 2fr;
	}
	
	.album-frame {
		width: 100px;
	}
	
}

@media (max-width: 450px) {
	.user-info img {
		border-radius: 50%;
		padding: 6px 6px 2px;
	}
	
}

/* 动画：专辑列表移到顶部 */
.move-up {
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	justify-content: center;
	gap: 15px;
}

/* 专辑简介 */
.album-details {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	animation: fadeIn 0.5s ease-in-out;
}

.album-details img {
	width: 150px;
	height: 150px;
	border-radius: 10px;
}

.details-text {
	text-align: center;
}

.details-text h2 {
	margin: 10px 0;
	font-size: 24px;
}

.details-text p {
	font-size: 16px;
	color: #bbb;
}

/* 动画：淡入效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.queue-icon,
.comment-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	transition: all 0.3s ease;
}

.queue-icon:hover,
.comment-icon:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateX(-50%) scale(1.1);
}

/* 退出搜索图标 */
.exit-search {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 30px;
	height: 30px;
	background-color: transparent;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 999;
	transition: background-color 0.3s ease;
	border: 2px solid #fff;
}

.exit-search:hover {
	background-color: rgba(255, 0, 0, 0.8);
}

.exit-search::before {
	content: "\2716";
	font-size: 20px;
	color: #fff;
}

.exit-search:hover::after {
	content: "Exit";
	position: absolute;
	top: 35px;
	right: 0;
	background-color: #fff;
	color: #000;
	padding: 5px 10px;
	border-radius: 5px;
	font-size: 14px;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.exit-search:hover::after {
	opacity: 1;
}
</style>
