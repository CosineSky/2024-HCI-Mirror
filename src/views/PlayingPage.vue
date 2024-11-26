<script setup>
import {onMounted, ref} from "vue";
import ColorThief from "colorthief";

const textColor = ref("#000");
const backgroundColor = ref("#ffffff");

function isDarkColor(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
const getDominantColor = (imageSrc, callback, alpha = 0.2) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
	    const colorThief = new ColorThief();
	    const dominantColor = colorThief.getColor(img);
	    if (dominantColor) {
	        let [r, g, b] = dominantColor;
	        const whiteR = 255, whiteG = 255, whiteB = 255;
	        r = Math.floor(r + alpha * (whiteR - r));
	        g = Math.floor(g + alpha * (whiteG - g));
	        b = Math.floor(b + alpha * (whiteB - b));
	        callback(`rgb(${r}, ${g}, ${b})`);
	    } else {
	      console.error("Failed to extract dominant color.");
	      callback("rgb(200, 200, 200)");
	    }
    };
}
const updateBackground = (event) => {
    const imageSrc = event.target.src;
    getDominantColor(imageSrc, (color) => {
        backgroundColor.value = color;
		textColor.value = isDarkColor(color) ? "#fff" : "#000";
    });
}

onMounted(() => {
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
	];

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
		<div class="music-player" :style="{backgroundColor: backgroundColor}">
			<div class="album-cover">
				<img src="../assets/pictures/songs/2.jpg" id="rotatingImage" alt="" @load="updateBackground"/>
				<span class="point"></span>
			</div>
			<h2 :style="{color: textColor}">ウミユリ海底譚</h2>
			<p :style="{color: textColor}">n-buna</p>
			<audio id="song">
				<source src="../assets/audio/2.mp3" type="audio/mpeg" />
			</audio>

			<input type="range" value="0" id="progress" />

			<div class="controls">
				<button class="backward">
					<i class="fa-solid fa-backward"></i>
				</button>
				<button class="play-pause-btn">
					<i class="fa-solid fa-play" id="controlIcon"></i>
				</button>
				<button class="forward">
					<i class="fa-solid fa-forward"></i>
				</button>
			</div>
		</div>

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

body {
	font-family: "Nunito", sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-image: url("../assets/pictures/bg3.jpg");
	background-repeat: no-repeat;
	background-size: cover;
}

/* MUSIC PLAYER */
.music-player {
	width: 500px;
	height: 750px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #fff;
	background: rgba(188, 184, 198, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow: inset 2px -2px 6px rgba(214, 214, 214, 0.2),
	inset -3px 3px 3px rgba(255, 255, 255, 0.3);
	border-radius: 16px;
	padding: 30px 20px;
	margin-top: 20px;
}

.album-cover {
	position: relative;
}

.album-cover img {
	border-radius: 50%;
	border: 2px solid rgba(222, 215, 255, 0.9);
	max-width: 300px;
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
	margin: 16px 0 2px;
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
	background: rgba(200, 187, 255, 0.6);
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

.controls button:nth-child(2) {
	transform: scale(1.3);
}

.controls button:nth-child(2):is(:hover, :focus-visible) {
	transform: scale(1.25);
}

/* MEDIA QUERIES */
@media (max-width: 1500px) {
	main {
		grid-template-columns: 6% 94%;
	}

	.user-info img {
		border-radius: 50%;
		padding: 12px 12px 6px;
	}
}

@media (max-width: 1310px) {
	main {
		grid-template-columns: 8% 92%;
		margin: 30px;
	}
}

@media (max-width: 1250px) {
	.swiper-slide img {
		border-radius: 16px;
		height: 280px;
	}
	.artist img {
		width: 120px;
	}
	.controls button {
		margin: 15px;
	}
}

@media (max-width: 1100px) {
	.swiper-slide img {
		height: 220px;
	}
	.artist img {
		width: 90px;
	}
}

@media (max-width: 910px) {
	main {
		grid-template-columns: 10% 90%;
		margin: 20px;
	}
	.swiper-slide img {
		height: 180px;
	}
	.artist img {
		width: 80px;
	}
}

@media (max-width: 825px) {
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
	.artist img {
		width: 110px;
	}
	#progress {
		width: 60%;
	}
	.controls button {
		margin: 20px;
	}
}

@media (max-width: 580px) {
	.swiper-slide img {
		height: 180px;
	}

	.artist img {
		width: 80px;
	}
}

@media (max-width: 450px) {
	.user-info img {
		border-radius: 50%;
		padding: 6px 6px 2px;
	}

}
</style>