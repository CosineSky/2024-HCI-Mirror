<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import Empty from "./Empty.vue";
import {formatTime} from "@/utils/formatTime";
import {ElMessage, ElPopover} from "element-plus";
import {loadSongDurations} from "@/utils/loadSongDurations";
import {addSongToPlaylist} from "@/api/playlist";
import playButton from "../icon/playButton.vue";
import checkMark from "../icon/checkMark.vue";
import pauseButton from "../icon/pauseButton.vue";

const emit = defineEmits(['pauseSong', 'switchSong', 'back', 'switchToArtist']);
const props = defineProps({
  songResult: {
    type: Array,
    required: true,
  },
  playlistResult: {
    type: Array,
    required: true,
  },
  playList: { //指当前收藏的歌单列表
    type: Array,
    required: true,
  },
  currentSongId: {
    type: Number,
    // required: true
  },
  isPaused: {
    type: Boolean,
  }
});
const currentTab = ref('songs')

const handleTabClick = (tab) => {
  currentTab.value = tab
}

// const songDurations = ref(new Map());
// watch(() => props.musicList, (newSongs) => {
//   loadSongDurations(newSongs, songDurations);
// }, { immediate: true });

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);

const playFromId = (musicId) => {
  if (musicId === null || musicId === undefined) {
    // 从头开始播放
    musicPlayIndex  = props.currentSongId;
  } else {
    musicPlayIndex  = musicId;
  }
  emit('switchSong', musicPlayIndex, true);
  musicPauseIndex = null;
}

const pauseMusic = (musicId) => {
  musicPauseIndex = musicId;
  emit('pauseSong');
}

const enterArtistDescription = (artistName) => {
  emit('switchToArtist', artistName);
}
const addToFavorite = (musicId, albumId,albumTitle) => {
  addSongToPlaylist({
    user_id: currentUserId.value,
    playlist_id: albumId,
    song_id: musicId,
  }).then(() => {
    ElMessage({
      message: "添加至: " + albumTitle,
      grouping: true,
      type: 'info',
      offset: 16,
      customClass: "reco-message",
      duration: 4000,
    })
  })
}

const popovers = ref([])
const getPopoverIndex = (popover) => {
  if (popover) {
    popovers.value.push(popover);
  }
}
const closePopover = (e) => {
  popovers.value.forEach((item) => {
    item.hide();
  })
}

onMounted(() => {
  musicPlayIndex = props.currentSongId;
  musicClickedIndex = props.currentSongId;
  musicPauseIndex = props.isPaused ? props.currentSongId : null;
})

onUnmounted(() => {
  popovers.value = null;
})
</script>

<template>
	<div class="search-view">
    <div class="back-button" data-tooltip="返回" @click="$emit('back')">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
      </svg>
    </div>

		<div class="tabs">
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'songs' }"
				@click="handleTabClick('songs')"
			>歌曲</button>
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'playlists' }"
				@click="handleTabClick('playlists')"
			>歌单</button>
		</div>
		<div class="search-results">
			<div v-if="currentTab === 'songs'">
        <div class="tips">
          <p style="position:absolute; left:25px">#</p>
          <p style="position:absolute; left:140px">标题</p>
          <p style="margin-left: auto; margin-right:30px">收藏</p>
        </div>
        <div class="musicList">
          <div class="music-item"
               v-for="music in songResult"
               :key="music.id"
               :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
               @mouseenter="()=>{musicHoveredIndex = music.id;}"
               @mouseleave="()=>{musicHoveredIndex = -1}"
               @click="musicClickedIndex=music.id"
               @dblclick="playFromId(music.id)"
               :style="{backgroundColor: musicClickedIndex===music.id? '#404040':
				     musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)',
				   }"> <!--@click事件写在script中的函数里 无法及时触发:style中的样式!!!-->
            <div style="width: 20px"
                :style="{visibility: musicHoveredIndex === music.id||musicPlayIndex === music.id ? 'hidden' : 'visible' }">
              {{
                songResult.indexOf(music) + 1
              }}
            </div>
            <play-button @click="playFromId(music.id)" style="position: absolute;left: 14px;cursor: pointer"
                         v-if="(musicHoveredIndex === music.id&&musicPlayIndex!==music.id)||musicPauseIndex===music.id"
                         :style="{color: musicPauseIndex===music.id ? '#1ed660' : 'white'}"/>

            <pause-button @click="pauseMusic(music.id)"
                          style="color:#1ed660 ;position: absolute;left: 17px;cursor: pointer"
                          v-if="musicPlayIndex===music.id&&musicHoveredIndex === music.id&&musicPauseIndex!==music.id"/>
            <img width="17" height="17" alt=""
                 style="position: absolute;left: 24px;"
                 v-if="musicPlayIndex===music.id&&musicHoveredIndex !== music.id&&musicPauseIndex!==music.id"
                 src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif">

            <div class="music-detailed-info">
              <img class="music-image"
                   :src="music.picPath"
                   alt="歌曲图片"/>
              <div class="music-name-author" style="padding-left: 5px;">
                <p class="music-name"
                   :style="{color : musicPlayIndex ===music.id? '#1ED660':''}"
                   :class="[musicPlayIndex === music.id ? 'music-after-click' : '']"
                >{{ music.title }} </p>
                <p class="music-author" @click="enterArtistDescription(music.artist)"
                   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                  {{ music.artist }}</p>
              </div>
            </div>
            <!--          从歌单界面进入专辑-->
            <div class="music-album-info" @click="emit('openEpisodeView',music.album)" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
              {{ music.album }}
            </div>
            <div class="music-right-info">
              <el-popover
                  :ref="getPopoverIndex"
                  class="music-dropdown-options"
                  popper-class="my-popover"
                  :width="400"
                  trigger="click"
                  :hide-after=0

              >
                <template #reference>
                  <check-mark class="check-mark" v-tippy="'加入歌单'"
                              :style="{visibility: musicHoveredIndex === music.id ? 'visible' : 'hidden'}"/>
                </template>
                <ul @click="closePopover" style="overflow: scroll;max-height: 400px;">
                  <div style="padding: 6px 0 6px 10px;font-weight: bold;color:darkgrey;font-size:16px">
                    选择歌单收藏
                  </div>
                  <hr style="    border: 0;padding-top: 1px;background: linear-gradient(to right, transparent, #98989b, transparent);">
                  <li class="album-to-add" @click="addToFavorite(music.id,album.id,album.title)"
                      v-for="album in playList">
                    <div style="
										height:40px;
										display: flex;
										align-items: center;
										justify-content: space-between;
										font-size: 20px;
										font-weight:400">
                      <div style="display: flex; flex-direction: row">
                        <img :src="album.picPath" style="height: 40px; width:40px; border-radius: 4px" alt=""/>
                        <div style="
												margin-left: 10px;
												font-size: 18px;
											">{{ album.title }}</div>
                      </div>
                      <div style="font-size: 14px; color: #a4a4a4">{{ album.songNum }}首</div>
                    </div>
                  </li>
                </ul>
              </el-popover>
<!--              <div style="margin-left: auto;margin-right: 15px; color: #b2b2b2"-->
<!--                   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}"-->
<!--                   v-show="songDurations.get(music.id) !== undefined">-->
<!--                {{ formatTime(songDurations.get(music.id)) }}-->
<!--              </div>-->
<!--              <el-popover-->
<!--                  :ref="getPopoverIndex"-->
<!--                  class="music-dropdown-options"-->
<!--                  popper-class="my-popover"-->
<!--                  :width="400"-->
<!--                  trigger="click"-->
<!--                  :hide-after=0-->
<!--              >-->
<!--              </el-popover>-->
            </div>
          </div>
        </div>
			</div>
			<ul v-if="currentTab === 'playlists'">
				<li v-for="(playlist, index) in playlistResult" :key="playlist.id">
					<div class="playlist-item">
						<span class="song-index">{{ index + 1 }}</span>
						<img :src="playlist.picPath" class="playlist-pic pic" alt=""/>
						<div class="playlist-info info">
							<h3 class="playlist-title">{{ playlist.title }}</h3>
							<p class="playlist-username">歌曲数: {{ playlist.songNum }} • {{ playlist.description }}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div v-if="(songResult.length === 0 && currentTab === 'songs')
			|| (playlistResult.length === 0 && currentTab === 'playlists')">
			<Empty :magic="Math.floor(Math.random() * 8)"/>
		</div>
	</div>
</template>


<style scoped>
ul{
background-color: #282828;
list-style-type: none;
padding: 0;
margin: 0;
border-radius: 10px;
}

li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  padding: 15px 12px;
}

li:hover {
  background-color: #363636;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: underline;
}


p {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.search-view {
	padding: 0;
  width: 100%;
}

.back-button {
  position: relative;
  margin: 24px 0 40px 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: #fff;
  transition: all 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, .8);
}

/* 提示文字样式 */
.back-button[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #282828;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}


.tabs {
  margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
}

.tab-button {
	background-color: transparent;
	color: #eaeaea;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 999;
	transition: background-color 0.3s ease;
	border: 1px solid #fff;
	margin: 0 10px;
	border-radius: 12px;
	font-size: 18px;
	padding: 5px 10px;
}

.tab-button:hover {
	background: rgba(255, 255, 255, 0.2);
}

.search-results {
	list-style-type: none;
	padding: 0;
  width: 100%;
}

.tips {
  z-index: 0;
  display: flex;
  position: relative;
  padding: 5px 8px 5px 8px;
  width: 100%;
  box-sizing: border-box;
  user-select: none;
  color: #fff;
}

.musicList {
  border-top: 1px solid #363636;
  margin-top: 10px;
}

/*每行音乐的样式*/
.music-item {
  position: relative;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 10px 0 10px 25px;
  flex-grow: 1;
  min-width: 0;
  color: #fff;
}

/*左侧信息*/
.music-detailed-info {
  display: flex;
  flex-direction: row;
}

.music-image {
  display: flex;
  align-items: center;
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
  width: 30%;
  text-align: left ;
  position: absolute;
  left: 60%;
  color: #b2b2b2;
  text-overflow: ellipsis;
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
  color:white;
}

.check-mark {
  width: 20px;
  height: auto;
  margin-right: 40px;
  color: white;
  font-weight: bolder;
  border-radius: 50%;
}

.check-mark:hover {
  cursor: pointer;
}

.check-mark:focus {
  outline: none;
}

.album-to-add {
  padding: 8px;
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

.info h3 {
	font-size: 18px;
	color: #e7e7e7;
}

.info p {
	font-size: 14px;
	color: #a9a9a9;
}

.pic:hover {
	filter: brightness(1.05);
	border-color: #ddc323;
	box-shadow: 0 0 10px rgba(221, 195, 35, 0.5);
	transform: scale(1.03);
}

.song-item {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.song-index {
	font-size: 18px;
	color: #fff;
	margin-right: 10px;
}

.song-pic {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 10px;
}

.song-info {
	display: flex;
	text-align: left;
	flex-direction: column;
}

.song-title {
	font-size: 24px;
	color: #fff;
	margin: 0;
}

.song-artist {
	font-size: 14px;
	color: #fff;
	margin: 0;
}

.song-album {
	font-size: 14px;
	color: #fff;
	margin: 0;
}

.playlist-item {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.playlist-pic {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 10px;
}

.playlist-info {
	display: flex;
	text-align: left;
	flex-direction: column;
}

.playlist-title {
	font-size: 18px;
	color: #fff;
	margin: 0;
}

.playlist-username {
	font-size: 14px;
	color: #fff;
	margin: 0;
}

.active {
  background-color: #fff;
  color: #000;
}
</style>
