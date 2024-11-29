<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {parseLrc} from "../utils/parseLyrics"
import ColorThief from "colorthief";
import {PLAY, PAUSE, NORMAL_MODE, LOOP_MODE, RANDOM_MODE} from "../assets/base64";



/*
    BACKGROUND
 */
const textColor = ref("#000");
const backgroundColor = ref("#ffffff");
const gradientColor = computed(() => `linear-gradient(to top right, ${backgroundColor.value}, #000000)`)
const isFullScreen = ref(false);
function toggleFullScreen() {
    isFullScreen.value = !isFullScreen.value;
    if (isFullScreen.value) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
function isDarkColor(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}
function getDominantColor(imageSrc, callback, alpha = 0.2) {
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
function updateBackground (event) {
    const imageSrc = event.target.src;
    getDominantColor(imageSrc, (color) => {
        backgroundColor.value = color;
        textColor.value = isDarkColor(color) ? "#fff" : "#000";
    });
}



/*
    LYRICS
 */
const lyrics = ref([]); // 歌词数组
const currentTime = ref(0); // 当前播放时间
const currentLineIndex = ref(0); // 当前歌词行的索引
const isLyricsDisplaying = ref(true);

function toggleLyrics() {
    isLyricsDisplaying.value = !isLyricsDisplaying.value;
}
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function updateCurrentTime(event) {
    currentTime.value = event.target.currentTime;
    updateCurrentLine();
}
function updateCurrentLine() {
    // 根据当前时间更新当前歌词行
    for (let i = 0; i < lyrics.value.length; i++) {
        if (
            currentTime.value >= lyrics.value[i].time &&
            (!lyrics.value[i + 1] || currentTime.value < lyrics.value[i + 1].time)
        ) {
            currentLineIndex.value = i;
            break;
        }
    }
}



/*
    SONGS
 */
const songs = [
    {
        title: "ウミユリ海底譚",
        name: "n-buna",
        source: "../assets/audio/2.mp3",
        cover: "../assets/pictures/2.jpg"
    }
];
const isPaused = ref(false);
const playingMode = ref(0); /* 0 - Normal, 1 - Loop, 2 - Random */
const currentSongIndex = ref(0);



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







function readLrc(filePath) {
    return "[ti:ウミユリ海底譚]\n" +
        "[ar:初音未来]\n" +
        "[al:EXIT TUNES PRESENTS Vocalofantasy feat.初音ミク]\n" +
        "[offset:0]\n" +
        "\n" +
        "[00:00.000]ウミユリ海底譚\n" +
        "[00:00.800]詞：ナブナ\n" +
        "[00:01.600]曲：ナブナ\n" +
        "[00:02.412]待って わかってよ\n" +
        "[00:03.525]何でもないから\n" +
        "[00:04.543]僕の歌を笑わないで\n" +
        "[00:06.504]空中散歩の SOS\n" +
        "[00:08.214]僕は 僕は 僕は\n" +
        "[00:26.181]今 灰に塗れてく\n" +
        "[00:29.248]海の底\n" +
        "[00:30.656]息を飲み干す夢を見た\n" +
        "[00:34.066]ただ 揺らぎの中 空を眺める\n" +
        "[00:39.281]僕の手を遮った\n" +
        "[00:42.264]夢の跡が 君の嗚咽が\n" +
        "[00:45.818]吐き出せない泡沫の庭の隅を\n" +
        "[00:49.995]光の泳ぐ空にさざめく\n" +
        "[00:53.926]文字の奥 波の狭間で\n" +
        "[00:57.161]君が遠のいただけ\n" +
        "[00:59.719]「なんて」\n" +
        "[01:00.444]もっと縋ってよ\n" +
        "[01:01.458]知ってしまうから\n" +
        "[01:02.584]僕の歌を笑わないで\n" +
        "[01:04.541]海中列車に遠のいた\n" +
        "[01:06.294]涙なんて なんて\n" +
        "[01:08.094]取り去ってしまってよ\n" +
        "[01:09.434]行ってしまうなら\n" +
        "[01:10.506]君はここに戻らないで\n" +
        "[01:12.414]空中散歩と四拍子\n" +
        "[01:14.232]僕は 僕は 僕は\n" +
        "[01:32.040]ただ藍に呑まれてく\n" +
        "[01:35.411]空の底\n" +
        "[01:36.787]灰の中で夢を描いた\n" +
        "[01:39.997]今心の奥\n" +
        "[01:42.770]消える光が\n" +
        "[01:45.179]君の背を掻き消した\n" +
        "[01:48.245]触れる跡が 夢の続きが\n" +
        "[01:52.015]始まらない\n" +
        "[01:52.981]僕はまだ忘れないのに\n" +
        "[01:55.968]光に届く 波に揺らめく\n" +
        "[01:59.988]夜の奥\n" +
        "[02:00.951]僕の心に\n" +
        "[02:03.235]君が手を振っただけ\n" +
        "[02:05.764]「なんて」\n" +
        "[02:06.436]そっと塞いでよ もういらないから\n" +
        "[02:08.422]そんな嘘を歌わないで\n" +
        "[02:10.335]信じてたって笑うような\n" +
        "[02:12.126]ハッピーエンドなんて\n" +
        "[02:14.050]逆らってしまってよこんな世界なら\n" +
        "[02:16.382]君はここで止まらないで\n" +
        "[02:18.382]泣いて笑ってよ 一等星\n" +
        "[02:20.282]愛は 愛は 愛は\n" +
        "[02:22.184]消えない君を描いた\n" +
        "[02:24.258]僕にもっと\n" +
        "[02:26.137]知らない人の吸った 愛を\n" +
        "[02:30.220]僕を殺しちゃった\n" +
        "[02:32.270]期待の言葉とか\n" +
        "[02:35.181]聞こえないように笑ってんの\n" +
        "[02:54.403]もっと縋ってよ\n" +
        "[02:55.393]もういらないからさ\n" +
        "[02:58.262]ねぇ\n" +
        "[03:02.304]そっと塞いでよ\n" +
        "[03:03.381]僕らの曖昧な愛で\n" +
        "[03:09.824]「なんて」\n" +
        "[03:10.504]待って わかってよ\n" +
        "[03:11.492]何でもないから\n" +
        "[03:12.384]僕の夢を笑わないで\n" +
        "[03:14.501]海中列車に遠のいた\n" +
        "[03:16.255]涙なんて なんて\n" +
        "[03:18.116]消え去ってしまってよ\n" +
        "[03:19.462]行ってしまうなら\n" +
        "[03:20.546]僕はここで止まらないで\n" +
        "[03:22.484]泣いて笑ってよ SOS\n" +
        "[03:24.166]僕は 君は 僕は\n" +
        "[03:26.414]最終列車と泣き止んだ\n" +
        "[03:28.305]あの空に溺れていく\n"
}

onMounted(() => {
    lyrics.value = parseLrc(readLrc("../assets/lyrics/test.lrc"));
    
    song = document.getElementById("song");
    progress = document.getElementById("progress");
    controlIcon = document.getElementById("controlIcon");
    playModeIcon = document.getElementById("playModeIcon");
	playPauseButton = document.querySelector(".play-pause-btn");
	forwardButton = document.querySelector(".controls button.forward");
	backwardButton = document.querySelector(".controls button.backward");
    playModeButton = document.querySelector(".play-mode-btn");
    shareButton = document.querySelector(".share-btn");
	songName = document.querySelector(".music-info p");
    artistName = document.querySelector(".music-info span");

	function updateSongInfo() {
		songName.textContent = songs[currentSongIndex.value].title;
		artistName.textContent = songs[currentSongIndex.value].name;
		// song.src = songs[currentSongIndex.value].source;
		// console.log(song.src)

		song.addEventListener("loadeddata", function () {});
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
})
</script>

<template>
    <body>
        <div v-if="isLyricsDisplaying" class="lyrics-container">
            <div
                class="lyrics-lines"
                :style="{ transform: `translateY(${-currentLineIndex * 40}px)` }"
            >
                <div
                    v-for="(line, index) in lyrics"
                    :key="index"
                    :class="{ active: index === currentLineIndex }"
                    class="lyrics-line"
                >
                    {{ line.text }}
                </div>
            </div>
        </div>
        <div class="player" :style="{ backgroundImage: gradientColor }">
            <!-- 背景 -->
            <div class="background"></div>
            
            <!-- 播放器内容 -->
            <div class="player-content">
                <!-- 专辑封面容器 -->
                <div class="album-cover-container">
                    <img src="../assets/pictures/songs/2.jpg" alt="Album Cover" class="album-cover" @load="updateBackground" />
                </div>
                
                <!-- 歌曲信息和控制条 -->
                <div class="track-info-container">
                    
                    <!-- 歌曲信息 -->
                    <div class="music-info" style="display: flex; flex-direction: column; justify-content: center;">
                        <audio id="song" @timeupdate="updateCurrentTime">
                            <source src="../assets/audio/2.mp3" type="audio/mpeg" />
                        </audio>
                        <p style="
                            font-family: Consolas, serif;
                            color: white;
                            font-size: 32px;
                            text-align: left;
                            margin: 0">ウミユリ海底譚</p>
                        <span style="
                            font-family: Consolas, serif;
                            color: white;
                            font-size: 16px;
                            text-align: left;
                            margin: 0">n-buna</span>
                    </div>
                    
                    <!-- 按钮及控制条 -->
                    <div class="bottom-controller bottom-component" style="
                        position: absolute;
                        left: 50%;
                        bottom: 2%;
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
                        <div style="display: flex; flex-direction: row;">
                            <p style="margin-right: 10px">{{formatTime(currentTime)}}</p>
                            <input type="range" value="0" id="progress" style="margin: 20px 0 10px 0; width: 700px"/>
                            <p style="margin-left: 10px">0:00</p>
                        </div>
                    </div>
                
                </div>
            
            
            </div>
            
            <!-- 全屏按钮 -->
            <div class="corner-buttons">
                <button @click="toggleLyrics" class="corner-button">
                    <span v-if="isLyricsDisplaying" style="text-decoration: underline">A</span>
                    <span v-else>A</span>
                </button>
                <button @click="toggleFullScreen" class="corner-button">
                    <span v-if="isFullScreen">↖</span>
                    <span v-else>⛶</span>
                </button>
            </div>
        </div>
    </body>
</template>



<style scoped>
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.player {
    position: relative;
    width: 100%;
    height: 100vh;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    z-index: -1;
}

.player-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 20px;
}

.album-cover-container {
    position: relative;
    width: 240px;
    height: 240px;
    margin: 0 0 10px 10px;
    z-index: 1;
}

.album-cover {
    width: 240px;
    height: 240px;
    border-radius: 10px;
    object-fit: cover;
}

.track-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 20px; /* 专辑封面与歌曲信息之间的间距 */
    max-width: 60%; /* 限制内容的最大宽度 */
    width: 100%;
}

.controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}

.play-pause-btn {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
}

.seek-bar input {
    width: 100%; /* 让进度条宽度填满可用空间 */
    margin-top: 10px;
}

.time-info {
    margin-top: 10px;
    font-size: 1rem;
}

.corner-buttons {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.corner-button {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
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

.lyrics-container {
    z-index: 10;
    overflow: hidden;
    height: 400px;
    position: absolute;
    top: 40%;  /* 距离顶部50% */
    left: 50%; /* 距离左边50% */
    transform: translate(-50%, -50%); /* 偏移自身宽高的50%来实现完全居中 */
}

.lyrics-lines {
    transition: transform 0.3s;
}

.lyrics-line {
    text-align: center;
    padding: 10px 0;
    color: #aaa;
    transition: color 0.3s;
}

.lyrics-line.active {
    color: #30e1f1;
    font-weight: bold;
}

</style>
