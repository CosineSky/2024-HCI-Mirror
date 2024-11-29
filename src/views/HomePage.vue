/* eslint-disable */
<script setup>
import {ref} from "vue"
import {onMounted} from "vue";
import {fullScreenLoadingShort} from "@/utils/visuals.js";
import {ElLoading} from "element-plus";

const current_view = ref();
const album_selected = ref(false);

const selectAlbum = () => {
	console.log("selectAlbum");
	album_selected.value = true;
}
const unSelectAlbum = () => {
	console.log("unSelectAlbum");
	album_selected.value = false;
}

onMounted(() => {
	ElLoading.service({
		lock: true,
		text: 'Loading',
		background: 'rgba(0, 0, 0, 0.7)',
	})
	fullScreenLoadingShort();
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

	const progress = document.getElementById("progress");
	const song = document.getElementById("song");
	const controlIcon = document.getElementById("controlIcon");
	const playPauseButton = document.querySelector(".play-pause-btn");
	const forwardButton = document.querySelector(".controls button.forward");
	const backwardButton = document.querySelector(".controls button.backward");
	const rotatingImage = document.getElementById("rotatingImage");
	const songName = document.querySelector(".music-player h2");
	const artistName = document.querySelector(".music-player p");

	let rotating = false;
	let currentRotation = 0;
	let rotationInterval;

	const songs = [
		{
			title: "ウミユリ海底譚",
			name: "n-buna",
			source: "../assets/audio/2.mp3",
			cover: "../assets/pictures/2.jpg"
		}
	]

	let currentSongIndex = 0;

	function startRotation() {
		if (!rotating) {
			rotating = true;
			rotationInterval = setInterval(rotateImage, 50);
		}
	}

	function pauseRotation() {
		clearInterval(rotationInterval);
		rotating = false;
	}

	function rotateImage() {
		currentRotation += 1;
		rotatingImage.style.transform = `rotate(${currentRotation}deg)`;
	}

	function updateSongInfo() {
		songName.textContent = songs[currentSongIndex].title;
		artistName.textContent = songs[currentSongIndex].name;
		// song.src = songs[currentSongIndex].source;
		// rotatingImage.src = songs[currentSongIndex].cover;
		console.log(song.src)
		console.log(rotatingImage.src)

		song.addEventListener("loadeddata", function () {});
	}

	song.addEventListener("loadedmetadata", function () {
		progress.max = song.duration;
		progress.value = song.currentTime;
	});

	song.addEventListener("ended", function () {
		currentSongIndex = (currentSongIndex + 1) % songs.length;
		updateSongInfo();
		playPause();
	});

	song.addEventListener("timeupdate", function () {
		if (!song.paused) {
			progress.value = song.currentTime;
		}
	});

	function playPause() {
		if (song.paused) {
			song.play();
			controlIcon.classList.add("fa-pause");
			controlIcon.classList.remove("fa-play");
			startRotation();
		} else {
			song.pause();
			controlIcon.classList.remove("fa-pause");
			controlIcon.classList.add("fa-play");
			pauseRotation();
		}
	}

	playPauseButton.addEventListener("click", playPause);

	progress.addEventListener("input", function () {
		song.currentTime = progress.value;
	});

	progress.addEventListener("change", function () {
		song.play();
		controlIcon.classList.add("fa-pause");
		controlIcon.classList.remove("fa-play");
		startRotation();
	});

	forwardButton.addEventListener("click", function () {
		currentSongIndex = (currentSongIndex + 1) % songs.length;
		updateSongInfo();
		playPause();
	});

	backwardButton.addEventListener("click", function () {
		currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
		updateSongInfo();
		playPause();
	});

	updateSongInfo();
})
</script>

<template>
	<body>
		<main @click="unSelectAlbum">
			<nav class="main-menu">
				<div>
					<div class="user-info">
						<router-link to="/profile">
							<img src="../assets/pictures/avatar.png" alt="user"/>
						</router-link>
						<p>CosSky</p>
					</div>
					<ul>

						<li class="nav-item">
							<a href="#" @click="current_view = 'discover'">
								<i class="fa fa-compact-disc nav-icon"></i>
								<span class="nav-text">Discover</span>
							</a>
						</li>
						<li class="nav-item">
							<a href="#" @click="current_view = 'playlist'">
								<i class="fa fa-circle-play nav-icon"></i>
								<span class="nav-text">Playlist</span>
							</a>
						</li>
						<li class="nav-item">
							<a href="#settings">
								<i class="fa fa-gear nav-icon"></i>
								<span class="nav-text">Settings</span>
							</a>
						</li>

					</ul>
				</div>

				<ul>
					<li class="nav-item">
						<a href="#/login">
							<i class="fa fa-right-from-bracket nav-icon"></i>
							<span class="nav-text">Logout</span>
						</a>
					</li>
				</ul>
			</nav>

			<section class="content">
				<div class="left-content">
					<div class="albums" v-if="!album_selected">
						<h1 style="margin: 20px 0 14px 0;" v-if="!album_selected">Playlists</h1>
						<div style="display: flex; flex-direction: row">
							<el-container class="album-container"  style="margin-right: 20px">
								<el-card class="album">
									<div class="album-frame">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"></path></svg>
									</div>
									<div>
										<h2>New Playlist</h2>
									</div>
								</el-card>
							</el-container>
							<el-container class="album-container containers" >
								<el-card @click.stop="selectAlbum" class="album">
									<div class="album-frame">
										<img src="../assets/pictures/playlists/1.jpg" alt="" />
									</div>
									<div>
										<h2>中古 | 凯尔特民谣</h2>
										<p>CosSky</p>
									</div>
								</el-card>
								<el-card class="album">
									<div class="album-frame">
										<img src="../assets/pictures/playlists/4.png" alt="" />
									</div>
									<div>
										<h2>Xeuphoria Collection 1</h2>
										<p>CosSky</p>
									</div>
								</el-card>
								<el-card class="album">
									<div class="album-frame">
										<img src="../assets/pictures/playlists/2.jpg" alt="" />
									</div>
									<div>
										<h2>花と水飴、最終電車</h2>
										<p>CosSky</p>
									</div>
								</el-card>
								<el-card class="album">
									<div class="album-frame">
										<img src="../assets/pictures/playlists/3.jpg" alt="" />
									</div>
									<div>
										<h2>だから僕は音楽を辞めた</h2>
										<p>CosSky</p>
									</div>
								</el-card>
								<el-card class="album">
									<div class="album-frame">
										<img src="../assets/pictures/playlists/5.jpg" alt="" />
									</div>
									<div>
										<h2 style="max-width: 120px; overflow-wrap: break-word">testtesttesttesttesttesttesttesttest</h2>
										<p>CosSky</p>
									</div>
								</el-card>
							</el-container>
						</div>
					</div>
				    <div class="album-details" v-if="album_selected" style="
						display: grid;
						grid-template-columns: 30% 70%;
				        width: 750px;
				        height: 200px;
					">
				        <img src="../assets/pictures/playlists/1.jpg" alt="Album Cover" style="width: 100%; height: 100%"/>
				        <div class="details-text">
				            <h2 style="text-align: left; margin-left: 20px">Hi</h2>
				            <p style="text-align: left; margin-left: 20px">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius ipsa, praesentium. Aliquid blanditiis excepturi, expedita fugiat illum iure labore nulla placeat quasi quidem ratione rem reprehenderit tempore temporibus voluptate voluptatum?</p>
				        </div>
				    </div>

				</div>

				<div class="right-content">
					<div class="music-player">
						<a href="#play" style="margin: 10px 0 0 0;">
							<div class="album-cover">
								<img src="../assets/pictures/songs/2.jpg" id="rotatingImage" alt="" />
								<span class="point"></span>
							</div>
						</a>
						<h2>ウミユリ海底譚</h2>
						<p>n-buna</p>
						<audio id="song">
							<source src="../assets/audio/2.mp3" type="audio/mpeg" />
						</audio>
					</div>

					<div class="current-playlist" style="margin-top: 10px">
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
						<el-container class="playlist-container" style="overflow: auto; height: 256px">
							<div v-for="_ in 10" class="playlist-item" style="display: flex; flex-direction: row">
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
									">Unknown Song</p>
									<p class="playlist-container-desc" style="
										color: white;
										font-size: 12px;
										text-align: left;
										overflow: auto;
										width: 240px;
										height: 18px
									">testtesttesttesttesttesttesttesttesttest</p>
								</div>
							</div>
						</el-container>
					</div>

				</div>
			</section>
		</main>
		<footer>
			<div class="bottom-description bottom-component" style="display: flex; flex-direction: row; justify-content: center;">
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
						</div>
					</a>
				</div>
				<div style="display: flex; flex-direction: column; justify-content: center;">
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">ウミユリ海底譚</p>
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">n-buna</p>
				</div>
			</div>

			<el-card class="bottom-controller bottom-component" style="
				position: absolute;
			    left: 50%;
			    transform: translateX(-50%);
			">
				<div class="controls" style="margin: 10px 0 0 0">
					<button class="play-settings" style="margin: 0">
						<img src="../assets/icons/controller/share.png" alt="" style="width: 60%">
					</button>
					<button class="backward" style="margin: 0 10px 0 10px">
						<i class="fa-solid fa-backward"></i>
						<img src="../assets/icons/controller/last.png" alt="" style="width: 60%">
					</button>
					<button class="play-pause-btn" style="margin: 0 10px 0 10px">
						<i class="fa-solid fa-play" id="controlIcon"></i>
						<img src="../assets/icons/controller/play.png" alt="" style="width: 60%">
					</button>
<!--                    <button class="play-pause-btn" style="margin: 0 10px 0 10px">-->
<!--                        <i class="fa-solid fa-play" id="controlIcon"></i>-->
<!--                        <img src="../assets/icons/controller/pause.png" alt="" style="width: 60%">-->
<!--                    </button>-->
					<button class="forward" style="margin: 0 10px 0 10px">
						<i class="fa-solid fa-forward"></i>
						<img src="../assets/icons/controller/next.png" alt="" style="width: 60%">
					</button>
					<button class="play-settings" style="margin: 0">
						<img src="../assets/icons/controller/normal.png" alt="" style="width: 60%">
					</button>
				</div>
				<input type="range" value="0" id="progress" style="margin: 0 0 10px 0; width: 500px"/>
			</el-card>

			<el-card class="bottom-settings bottom-component">
				<h1>// TODO</h1>
			</el-card>
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
	justify-content: center;
	flex-direction: column;
	min-height: 100vh;
	background-color: rgba(0, 0, 0, 1);
	background-repeat: no-repeat;
	background-size: cover;
}

/* MAIN MENU */

main {
	display: grid;
	grid-template-columns: 11% 89%;
	height: 600px;
	width: 95%;
	margin: 20px 0 0 0;
	background: rgba(16, 21, 61, 0.6);
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
	background: rgba(16, 21, 61, 0.8);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
	0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
	z-index: 10;
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
}

/* LEFT CONTENT */

.left-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 30px 20px;
	color: #e5e5e5;
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
	-webkit-line-clamp: 2;
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
		grid-template-columns: 12% 88%;
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
	.content {
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
	.content {
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

	.content {
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

</style>