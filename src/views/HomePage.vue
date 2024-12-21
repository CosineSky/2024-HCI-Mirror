/* eslint-disable */
<script setup>
// Vue Basics
import {onMounted, ref, watch, computed, nextTick} from "vue"
import {router} from "../router";

// Assets
import defaultBg from '../assets/pictures/Eason.png'
import {LOOP_MODE, NORMAL_MODE, PAUSE, PLAY, RANDOM_MODE} from "../assets/base64";

// Components
import Header from "../components/Header";
import Comment from "../components/Comment";
import LeftSideBar from "../components/LeftSideBar";
import SearchView from "@/components/SearchView.vue";
import MusicAlbumView from "../components/MusicAlbumView.vue";
import MainView from "../components/MainView.vue";

// APIs
import {getSongsByPlaylist} from "../api/song";
import {getPlaylistsByUser} from "../api/playlist";

// Others
import {useTheme} from "../store/theme";
import {parseLrc} from "../utils/parseLyrics"
import {updateBackground} from "../utils/getBackgroundColor";


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

setInterval(() => {
  // console.log(progresses.length, controlIcons.length, playModeIcons.length);
}, 1000);


const theme = useTheme()
const album_selected = ref(false);
const showRightContent = ref(true)

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

// buttons
let playPauseButtons;
let forwardButtons;
let backwardButtons;
let playModeButtons;
let shareButtons;

// icons
let controlIcon;
let playModeIcon;

// test items
let progresses;
let controlIcons;
let playModeIcons;


const registerDOMs = () => {
	/*
        Navs & Containers
	 */
	const navItems = document.querySelectorAll(".nav-item");
	const containers = document.querySelectorAll(".containers");

	navItems.forEach((navItem) => {
		navItem.addEventListener("click", () => {
			navItems.forEach((item) => {
				item.className = "nav-item";
			});
			navItem.className = "nav-item active";
		});
	});
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

	/*
        Songs Related
	 */
	song = document.getElementById("song");
	playPauseButtons = document.querySelectorAll(".play-pause-btn");
	forwardButtons = document.querySelectorAll(".controls button.forward");
	backwardButtons = document.querySelectorAll(".controls button.backward");
	playModeButtons = document.querySelectorAll(".play-mode-btn");
	shareButtons = document.querySelectorAll(".share-btn");

	progresses = document.querySelectorAll('.idProgress');
	controlIcons = document.querySelectorAll('.idControlIcon');
	playModeIcons = document.querySelectorAll('.idPlayModeIcon');

	function updateSongInfo() {
		try {
			if (songs.value[currentSongIndex.value]) {
				controlIcons.forEach(controlIcon => {
					controlIcon.src = PLAY;
				});
				song.src = songs.value[currentSongIndex.value].filePath;
				parseLrc(songs.value[currentSongIndex.value].lyricsPath).then(res => {
					lyrics.value = res;
				});
				song.load();
				song.play();
				theme.change(songs.value[currentSongIndex.value].picPath);
			}
		} catch (e) {
			console.log("Uncaught Error in updateSongInfo!", e);
		}
	}

	function shareSong() {
		console.log("Hello!");
	}

	function playPause() {
		isPaused.value = !isPaused.value;
		try {
			if (song.paused) {
				song.play();
				controlIcons.forEach(controlIcon => {
					controlIcon.src = PLAY;
				});
			} else {
				song.pause();
				controlIcons.forEach(controlIcon => {
					controlIcon.src = PAUSE;
				});
			}
		} catch (e) {
			console.log("Uncaught Error in playPause!", e);
		}
	}

	function switchPlayMode() {
		playingMode.value = (playingMode.value + 1) % 3
		switch (playingMode.value) {
			case 0:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = NORMAL_MODE;
				});
				break;
			case 1:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = LOOP_MODE;
				});
				break;
			case 2:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = RANDOM_MODE;
				});
				break;
			default:
				break;
		}
	}

	song.addEventListener("loadedmetadata", function () {
		progresses.forEach(progress => {
			duration.value = song.duration;
			progress.max = song.duration;
			progress.value = song.currentTime;
		});
	});
	song.addEventListener("ended", function () {
		switchSongs(1);
		updateSongInfo();
	});
	song.addEventListener("timeupdate", function () {
		if (!song.paused) {
			progresses.forEach(progress => {
				progress.value = song.currentTime;
			});
		}
	});

	playPauseButtons.forEach(playPauseButton => {
		if (!playPauseButton._hasClickListener) {
			playPauseButton.addEventListener("click", playPause);
			playPauseButton._hasClickListener = true;
		}
	});
	playModeButtons.forEach(playModeButton => {
		if (!playModeButton._hasClickListener) {
			playModeButton.addEventListener("click", switchPlayMode);
			playModeButton._hasClickListener = true;
		}
	});
	shareButtons.forEach(shareButton => {
		if (!shareButton._hasClickListener) {
			shareButton.addEventListener("click", shareSong);
			shareButton._hasClickListener = true;
		}
	});
	forwardButtons.forEach(forwardButton => {
		if (!forwardButton._hasClickListener) {
			forwardButton.addEventListener("click", function () {
				switchSongs(1);
				updateSongInfo();
			});
			forwardButton._hasClickListener = true;
		}
	});
	backwardButtons.forEach(backwardButton => {
		if (!backwardButton._hasClickListener) {
			backwardButton.addEventListener("click", function () {
				switchSongs(-1);
				updateSongInfo();
			});
			backwardButton._hasClickListener = true;
		}
	});

	progresses.forEach(progress => {
		progress.addEventListener("input", function () {
			if (!song.paused) {
				song.currentTime = progress.value;
			}
		});
		progress.addEventListener("change", function () {
			try {
				if (song.paused) {
					song.play();
				}
			} catch (e) {
				console.log("Uncaught Error in change!", e);
			}
		});
	});

	// updateSongInfo();
}


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
const displayingSongs = ref([]);
const isPaused = ref(false);
const duration = ref(0);
const playingMode = ref(0); /* 0 - Normal, 1 - Loop, 2 - Random */

// Current Playing
const currentSongId = ref(1);
const currentSongIndex = ref(0);
const isPlayingPage = ref(false);
const togglePlayingPage = () => {
	isPlayingPage.value = !isPlayingPage.value;
	registerDOMs();
}
const switchSongs = (del) => {
	console.log(playingMode.value, currentSongIndex.value, songs.value.length)
	switch (playingMode.value) {
		case 0:
			console.log("normal mode")
			currentSongIndex.value = (currentSongIndex.value + del + songs.value.length) % songs.value.length;
			break;
		case 1:
			console.log("loop mode")
			currentSongIndex.value = currentSongIndex.value;
			break;
		case 2:
			console.log("random mode")
			currentSongIndex.value = Math.floor(Math.random() * songs.value.length);
			break;
		default:
			break;
	}
	currentSongId.value = songs.value[currentSongIndex.value].id;
}

const switchToSong = (index, isDiffPlaylist) => {
	if (index === currentSongIndex.value && !isDiffPlaylist) {
		return;
	}

	currentSongIndex.value = index;
	currentSongId.value = songs.value[index].id;

	if (song) {
		controlIcons.forEach(controlIcon => {
			controlIcon.src = PLAY;
		});
		song.src = songs.value[index].filePath;
		parseLrc(songs.value[index].lyricsPath).then(res => {
			lyrics.value = res;
		});
		song.load();
		song.play();
		theme.change(songs.value[index].picPath);
	}
}

const switchToPlaylist = (playlist, songId) => {
	console.log(playlist, songId)

	currentPlaylist.value = playlist;
	displayingPlaylist.value = playlist;
	currentPlaylistId.value = playlist.id;
	theme.change(currentPlaylist.value.picPath);

	getSongsByPlaylist({
		playlist_id: currentPlaylistId.value,
	}).then((res) => {
		songs.value = res.data.result;
		displayingSongs.value = res.data.result;
		currentSongId.value = songId;
		for (let i = 0; i < songs.value.length; i++) {
			if (songs.value[i].id === songId) {
				switchToSong(i, true);
				parseLrc(songs.value[i].lyricsPath).then(res => {
					lyrics.value = res;
				});
				break;
			}
		}

	}).catch(e => {
		console.log("Error while switching playlists!");
	});
}


/*
    PLAYLISTS
 */
const playlists = ref([]);
const currentPlaylist = ref(2);
const currentPlaylistId = ref(2);
const displayingPlaylist = ref(2);
const receivePlaylistId = (value) => {
  console.log(value)
  currentPlaylist.value = value;
  currentPlaylistId.value = value.id;
  console.log("Current Playlist Id:", currentPlaylistId.value)
  getSongsByPlaylist({
    playlist_id: currentPlaylistId.value,
  }).then((res) => {
    songs.value = res.data.result;
  }).catch(e => {
    console.log("Failed to get songs!");
  });
};
const receiveDisplayingPlaylist = (value) => {
	setMidComponents(1);
	displayingPlaylist.value = value;
	getSongsByPlaylist({
		playlist_id: value.id,
	}).then((res) => {
		displayingSongs.value = res.data.result;
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

/*
    share_icon
 */
const isSharing = ref(false);

onMounted(() => {
	/*
        DOMS & EVENTS
	 */
	theme.change(defaultBg);
	registerDOMs();

	/*
		API
	 */
	console.log("L: ", currentUserId.value)
	getPlaylistsByUser({
		user_id: currentUserId.value,
	}).then((res) => {
		playlists.value = res.data.result;
		console.log("playlists: ", playlists.value);
		currentPlaylist.value = playlists.value[0];
		displayingPlaylist.value = playlists.value[0];
		currentPlaylistId.value = currentPlaylist.value.id;
		theme.change(currentPlaylist.value.picPath);
		getSongsByPlaylist({
			playlist_id: currentPlaylistId.value,
		}).then((res) => {
			songs.value = res.data.result;
			displayingSongs.value = res.data.result;
			currentSongId.value = songs.value[0].id;

			// TODO: currentSongIndex != currentSongId ?
			parseLrc(songs.value[currentSongIndex.value].lyricsPath).then(res => {
				lyrics.value = res;
			});
		}).catch(e => {
			console.log("Failed to get songs!");
		});
	}).catch(e => {
		console.log("Failed to get playlists!");
	});

})
let playFromLeftBarAlbum = ref(null);
</script>

<template>
	<div class="body" v-show="!isPlayingPage" @click="unSelectAlbum">

    <!-- MAIN & RIGHT CONTENT -->
    <Header class="header" @headData="receiveDataFromHeader" allow-search></Header>
    <img class="logo" src="../assets/pictures/logos/logo3.png" alt="">
    <left-side-bar class="left-side-bar" @playFromLeftBar="(id)=>{playFromLeftBarAlbum = id }" @setCurrentPlaylist="receiveDisplayingPlaylist"/>
    <div class="content" :class="{ 'full-width': !showRightContent }">
      <div class="main-view" :class="{ 'expanded': !showRightContent }">
        <el-container v-if="midComponents == 0" class="playlist-container"
                      style="overflow: auto; height: 730px ;border-radius: 12px">
          <MainView/>
        </el-container>
        <!--height: 730px -->
        <div v-if="midComponents == 1" class="playlist-container"
                      style="overflow: scroll; border-radius: 12px">
          <MusicAlbumView :album-info="displayingPlaylist" :music-list="displayingSongs"
                          @switchSongs="switchToPlaylist" :play-list="playlists" :playFromLeftBar="playFromLeftBarAlbum"/>
        </div>
        <el-container v-if="midComponents == 2" class="playlist-container"
                      style="overflow: auto; height: 730px ;border-radius: 12px" >
          <el-button class="exit-search"
                     data-tooltip="退出"
                     :class="{ 'adjusted-position': showRightContent }"
                     @click="setMidComponents(0)"></el-button>
          <Comment :song-id=currentSongId :user-id=currentUserId></Comment>
        </el-container>
        <el-container v-if="midComponents == 3" class="playlist-container"
                      style="overflow: auto; height: 730px ;border-radius: 12px">
          <el-button class="exit-search"
                     data-tooltip="退出"
                     :class="{ 'adjusted-position': showRightContent }"
                     @click="setMidComponents(0)"></el-button>
          <SearchView :songResult="songResult" :playlistResult="playlistResult"/>
        </el-container>
      </div>
      <div v-if="showRightContent" class="right-content">
        <div v-if="songs[currentSongIndex] !== undefined" class="music-player music-info">
          <div class="album-cover" @click="togglePlayingPage">
            <img :src="songs[currentSongIndex].picPath" style="margin-top: 10px" id="rotatingImage" alt=""/>
            <span class="point"></span>
          </div>
          <h2>{{ songs[currentSongIndex].title }}</h2>
          <p>{{ songs[currentSongIndex].artist }}</p>
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
					<el-container class="playlist-container" style="overflow: auto; height: 384px; display: flex; flex-direction: column">
						<div v-for="(song, index) in songs" class="playlist-item"
						     style="display: flex; flex-direction: row">
							<div @click="switchToSong(index, false)" style="cursor: pointer">
								<img :src="song.picPath" alt=""
								     :class="{ 'playing': index === currentSongIndex }"
								/>
							</div>
							<div style="display: flex; flex-direction: column; margin-left: 10px">
								<p class="playlist-container-desc" style="
									color: white;
									font-size: 18px;
									font-family: Candara, serif;
									text-align: left;
									overflow: auto;
									width: 240px;
									height: 24px;
								">{{ songs[index].title }}</p>
								<p class="playlist-container-desc" style="
									color: #949494;
									font-size: 12px;
									text-align: left;
									overflow: auto;
									width: 240px;
									height: 18px
								">{{ songs[index].artist }}</p>
							</div>
						</div>
					</el-container>
				</div>
			</div>
		</div>


		<!-- FOOTER -->
		<footer>
			<div class="bottom-description bottom-component"
			     style="display: flex; flex-direction: row; justify-content: center;">
				<div @click="togglePlayingPage">
					<img v-if="songs[currentSongIndex] !== undefined"
					     :src="songs[currentSongIndex].picPath" alt=""
					     style="
						     width: 60px;
						     margin: 0 0 0 10px;
						     border-radius: 5%;
							 border: 2px solid rgba(222, 215, 255, 0.9);
							 max-width: 120px;
							 box-shadow: 0 10px 60px rgba(200, 187, 255);
						"/>
					<audio id="song" @timeupdate="updateCurrentTime">
						<source
							v-if="songs[currentSongIndex] !== undefined"
							:src="songs[currentSongIndex].filePath"
							type="audio/mpeg"/>
					</audio>
				</div>
				<div v-if="songs[currentSongIndex] !== undefined"
				     style="display: flex; flex-direction: column; justify-content: center;">
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
						{{ songs[currentSongIndex].title }}</p>
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
						{{ songs[currentSongIndex].artist }}</p>
				</div>
			</div>

			<el-card class="bottom-controller bottom-component" style="
						position: absolute;
					    left: 50%;
					    transform: translateX(-50%);
					">
				<div class="controls" style="display: flex; flex-direction: row; margin: 10px 0 0 0">
					<button class="share-btn" style="margin: 0">
						<img src="../assets/icons/controller/mute.png" alt="" style="width: 60%">
					</button>
					<button class="backward" style="margin: 0 10px 0 10px">
						<img src="../assets/icons/controller/last.png" alt="" style="width: 60%">
					</button>
					<button class="play-pause-btn" style="margin: 0 10px 0 10px">
						<img id="controlIcon" class="idControlIcon" src="../assets/icons/controller/play.png" alt=""
						     style="width: 60%">
					</button>
					<button class="forward" style="margin: 0 10px 0 10px">
						<img src="../assets/icons/controller/next.png" alt="" style="width: 60%">
					</button>
					<button class="play-mode-btn" style="margin: 0">
						<img id="playModeIcon" class="idPlayModeIcon" src="../assets/icons/controller/normal.png" alt=""
						     style="width: 60%">
					</button>
				</div>
				<div style="display: flex; flex-direction: row; margin-top: 10px">
					<p style="margin-right: 10px; padding-bottom: 40px; color: white">{{ formatTime(currentTime) }}</p>
					<input type="range" value="0" id="progress" class="idProgress"
					       style="margin: 0 0 10px 0; width: 500px"/>
					<p style="margin-left: 10px; padding-bottom: 40px; color: white">{{ formatTime(duration) }}</p>
				</div>
			</el-card>

			<div class="right-controls">
				<div class="feature-icon"
				     data-tooltip="分享"
				     :class="{ active: isSharing }">
					<img src="../assets/icons/comment/share.png" alt="分享">
				</div>

				<div class="feature-icon"
				     data-tooltip="评论"
				     :class="{ active: midComponents === 2 }"
				     @click="setMidComponents(2)">
					<img src="../assets/icons/comment/comment.png" alt="评论">
				</div>

				<div class="feature-icon"
				     data-tooltip="播放队列"
				     :class="{ active: showRightContent }"
				     @click="showRightContent = !showRightContent">
					<img src="../assets/icons/queue.png" alt="播放队列">
				</div>
			</div>
		</footer>
	</div>


	<!-- PLAYING PAGE -->
	<div v-show="isPlayingPage" class="playing-page">
		<div v-if="isLyricsDisplaying" class="lyrics-container">
			<div class="lyrics-lines" :style="{ transform: `translateY(${-currentLineIndex * 40}px)` }">
				<div
					v-for="(line, index) in lyrics"
					:key="index"
					:class="{ active: index === currentLineIndex }"
					class="lyrics-line"
				>{{ line.text }}</div>
				<h1 v-if="lyrics.length === 0" style="
					font-size: 24px;
					color: #9d9d9d;
					margin-top: 240px;
				    font-family: Consolas, 幼圆, serif;
				">Ouch！该歌曲暂无歌词！</h1>
			</div>
		</div>

<!--		<div class="player" :style="{ backgroundImage: gradientColor }">-->
		<div class="player">
			<div class="background"></div>
			<div class="player-content">
				<div v-if="songs[currentSongIndex] !== undefined" class="album-cover-container">
					<img :src="songs[currentSongIndex].picPath" alt="Album Cover" class="album-cover"
					     @load="updateBackground"/>
				</div>
				<div class="track-info-container">
					<div v-if="songs[currentSongIndex] !== undefined" class="music-info"
					     style="display: flex; flex-direction: column; justify-content: center;">
						<p style="
                            font-family: Consolas, serif;
                            color: white;
                            font-size: 32px;
                            text-align: left;
                            margin: 0">{{ songs[currentSongIndex].title }}</p>
						<span style="
                            font-family: Consolas, serif;
                            color: white;
                            font-size: 16px;
                            text-align: left;
                            margin: 0">{{ songs[currentSongIndex].artist }}</span>
					</div>
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
								<img id="controlIcon" class="idControlIcon" src="../assets/icons/controller/play.png"
								     alt="" style="width: 60%">
							</button>
							<button class="forward" style="margin: 0 10px 0 10px">
								<img src="../assets/icons/controller/next.png" alt="" style="width: 60%">
							</button>
							<button class="play-mode-btn" style="margin: 0">
								<img id="playModeIcon" class="idPlayModeIcon"
								     src="../assets/icons/controller/normal.png" alt="" style="width: 60%">
							</button>
						</div>
						<div v-if="songs[currentSongIndex] !== undefined" style="display: flex; flex-direction: row;">
							<p style="margin-right: 10px">{{ formatTime(currentTime) }}</p>
							<input type="range" value="0" id="progress" class="idProgress"
							       style="margin: 20px 0 10px 0; width: 700px"/>
							<p style="margin-left: 10px">{{ formatTime(duration) }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="corner-buttons">
				<button @click="toggleLyrics" class="corner-button">
					<span v-if="isLyricsDisplaying" style="text-decoration: underline">A</span>
					<span v-else>A</span>
				</button>
				<button @click="toggleFullScreen" class="corner-button">
					<span v-if="isFullScreen">↖</span>
					<span v-else>⛶</span>
				</button>
				<button @click="togglePlayingPage" class="corner-button">
					<span>◀</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>

*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

.logo {
	position: absolute;
	top: 0px;
	left: -10px;
	width: 8%;
	height: 8%;
	z-index: 114514;
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

.body {
	font-family: "Nunito", sans-serif;
	height: 100%;
	/*没用的样式*/
	/*
	  align-items: center;
	  justify-content: space-between;
	  flex-direction: column;
	*/
	min-height: 100vh;
	background-color: rgb(19, 19, 19); /* rgba(0, 0, 0, 1); */
	background-repeat: no-repeat;
	background-size: cover;

	/* 原先main中的内容
	height: 700px;
	width: 95%;
	margin: 20px 0 0 0;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
	box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
	0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
	z-index: 10;
	*/
	display: grid;
	grid-template-areas:
        "global-nav global-nav global-nav"
        "left-sidebar main-view main-view"
        "now-playing-bar now-playing-bar now-playing-bar";
	grid-template-columns: auto 1fr;
	grid-template-rows: 10% 80% 10%;
	grid-auto-rows: min-content;

	column-gap: 8px;
	padding: 8px;
	overflow: hidden;
}

/* HEADER */
.header {
	grid-area: global-nav;
	z-index: 1000;
}

/* TEMP */

left-side-bar {
	grid-area: left-sideBar;

}

.content {
	grid-area: main-view;

}

footer {
	grid-area: now-playing-bar;

}

/* MAIN MENU */
/*
main {
	height: 700px;
	width: 95%;
	margin: 20px 0 0 0;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
	box-shadow: 0 0.5px 0 1px rgba(255, 255, 255, 0.23) inset,
	0 1px 0 0 rgba(255, 255, 255, 0.6) inset, 0 4px 16px rgba(0, 0, 0, 0.12);
	z-index: 10;
}
*/

footer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 75px;
	width: 100%;
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


/* CONTENT 包含中间和右边栏 是grid布局*/
.content {
  height: 100%;
	display: grid;
	grid-template-columns: 1fr auto;
  grid-template-rows: 100%;
	transition: all 0.3s ease;
	column-gap: 8px;

}

.content.full-width {
	grid-template-columns: 100% !important;

}

/* LEFT CONTENT */
.main-view{
  overflow: scroll;
}
.main-view > {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #e5e5e5;
	transition: all 0.3s ease;
	margin: 0;
	padding: 0;
}

.main-view.expanded {

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
/*
.playlist-container::-webkit-scrollbar {
	height: 10px;
	display: none;
}

.playlist-container-desc::-webkit-scrollbar {
	height: 10px;
	display: none;
}
*/


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
	background-color: #171717;
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	padding: 10px 20px 20px;
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
	align-items: center;
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

	.main-view {

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

	.main-view {
		/*padding: 30px 20px 20px;*/
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

	.main-view {
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
/**
.share-icon,
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

.share-icon:hover,
.queue-icon:hover,
.comment-icon:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateX(-50%) scale(1.1);
}
 */

.right-controls {
	display: flex;
	align-items: center;
	gap: 16px;
	position: absolute;
	right: 80px;
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	transition: all 0.2s ease;
	position: relative;
	cursor: pointer;
}

.feature-icon:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateY(-2px);
}

.feature-icon img {
	width: 16px;
	height: 16px;
	transition: all 0.2s ease;
}

.feature-icon:hover img {
	filter: brightness(1.2);
}

.feature-icon[data-tooltip]:hover::after {
	content: attr(data-tooltip);
	position: absolute;
	top: -25px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #282828;
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	z-index: 1000;
}

.feature-icon.active {
	background: #1db954;
}

.feature-icon.active img {
	filter: brightness(0) invert(1);
}

.feature-icon.active:hover {
	background: #1ed760;
}

/* 退出搜索图标 */
.exit-search {
	position: absolute;
	top: 90px;
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

/* 修改提示文字样式，与feature-icon保持一致 */
.exit-search[data-tooltip]:hover::after {
	content: attr(data-tooltip);
	position: absolute;
	top: 35px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #282828;
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	z-index: 1000;
}

.exit-search.adjusted-position {
	right: calc(23%);
}







/* 没必要 在app中写过了
html, body {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}*/

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
	font-size: 2.4rem;
	cursor: pointer;
	margin-right: 15px;
}

.lyrics-container {
	z-index: 10;
	overflow: hidden;
	height: 440px;
	position: absolute;
	top: 40%; /* 距离顶部50% */
	left: 50%; /* 距离左边50% */
	transform: translate(-50%, -50%); /* 偏移自身宽高的50%来实现完全居中 */
}

.lyrics-lines {
	transition: transform 0.3s;
}

.lyrics-line {
	text-align: center;
	font-size: 1.2rem;
	padding: 10px 0;
	color: #aaa;
	transition: color 0.3s;
}

.lyrics-line.active {
	color: #30e1f1;
	font-weight: bold;
}

.playlist-item img {
	transition: all 0.3s ease;
}

.playlist-item img.playing {
	border-color: #ddc323;
	box-shadow: 0 0 10px rgba(221, 195, 35, 0.5);
	transform: scale(1.05);
}

.playlist-item:hover img:not(.playing) {
	transform: scale(1.05);
	border-color: rgba(255, 255, 255, 0.8);
}

.comment-container {
	position: relative;
	background: transparent;
}

</style>
