<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import playButton from "../icon/playButton.vue";
import pauseButton from "../icon/pauseButton.vue";
import {backgroundColor, updateBackground} from "../utils/getBackgroundColor";
import {getArtistInfo} from "../api/artist";
import {getSongById, getUserById} from "../api/resolve";
import checkMark from "../icon/checkMark.vue";
import {addSongToPlaylist, removeSongFromPlaylist} from "../api/playlist";
import {getSongsByPlaylist} from "../api/song";
import {formatTime} from '../utils/formatTime';
import {loadSongDurations} from '../utils/loadSongDurations';
import {userFollowArtist} from "../api/user";

const emit = defineEmits(['playSong', 'pauseSong', 'back', 'updateSongs', 'toggleFollow']);
const props = defineProps({
  artistName: {
    type: String,
    required: true
  },
  isPaused: {
    type: Boolean,
  },
  currentSongId: {
    type: Number,
    required: true
  },
  isFollowed: {
    type: Boolean
  }
});

const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));
const currentUserId = ref(userToken.value.id);

const artist = ref(null);
const hotSongs = ref([]);
const resizeObserver = ref(null);
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value}, #1F1F1F 50%)`);

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);

// 用户第一次播放该艺人歌曲的标志
const isFirstPlay = ref(true);

// 关注/取消关注逻辑
const toggleFollow = () => {
  emit('toggleFollow',artist.value.id,props.isFollowed);
};

// 添加喜欢歌曲的状态管理
const likedSongs = ref(new Set());

const toggleLikeSong = async (songId) => {
  try {
    if (!likedSongs.value.has(songId)) {
      await addSongToPlaylist({
        user_id: currentUserId.value,
        playlist_id: 2,//我的喜欢歌单ID
        song_id: songId
      });
      
      likedSongs.value.add(songId);
    }else{
      await removeSongFromPlaylist({
        playlist_id: 2,//我的喜欢歌单ID
        song_id: songId
      });

      likedSongs.value.delete(songId);
    }
  } catch (error) {
    console.error("Failed to add song to favorites:", error);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  const albums = document.querySelectorAll(".music-album-info");
  const albumText = document.querySelectorAll(".album-text");
  const albumContent = document.querySelector(".album-content");
  // if (window.innerWidth > 0)
  // 专辑隐藏
  console.log(albumContent.clientWidth);
  if (albumContent.clientWidth < 605) {
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

  // 调整头部图片和文字大小
  const artistImage = document.querySelector(".artist-image");
  const artistName = document.querySelector(".artist-name");
  if (albumContent.clientWidth < 420) {
    artistImage.style.width = "140px";
    artistImage.style.height = "140px";
    artistName.style.fontSize = "60px";
  } else {
    artistImage.style.width = "220px";
    artistImage.style.height = "220px";
    artistName.style.fontSize = "80px";
  }

  const fixedTipArea = document.querySelector(".fixed-tips");
  const fixedPlayArea = document.querySelector(".fixed-play-area");
  fixedPlayArea.style.width = (albumContent.clientWidth - 20) + "px";
  fixedTipArea.style.width = (albumContent.clientWidth - 16) + "px";
};

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const initializeLikedSongs = async () => {
  try {
    const res = await getSongsByPlaylist({
      playlist_id: 2  // "我的喜欢"歌单ID
    });
    
    const likedSongIds = res.data.result.map(song => song.id);
    likedSongs.value = new Set(likedSongIds);
  } catch (error) {
    console.error("Failed to initialize liked songs:", error);
  }
};

const getRandomListeners = () => {
  return Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
};

const monthlyListeners = ref(getRandomListeners());


onMounted(() => {
  // 初始化喜欢的歌曲集合
  initializeLikedSongs();

  // 设置resize观察器
  resizeObserver.value = new ResizeObserver(debounce(handleResize, 50));
  nextTick(() => {
    const albumContent = document.querySelector(".album-content");
    if (albumContent) {
      resizeObserver.value.observe(albumContent);
    }
  });

  musicPlayIndex = props.currentSongId;
  musicClickedIndex = props.currentSongId;
  musicPauseIndex = props.isPaused ? props.currentSongId : null;
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
  popovers.value = null;
});

watch(() => props.artistName, async (newValue) => {
  try {
    const artistResponse = await getArtistInfo(newValue);
    artist.value = artistResponse.data.result;
    
    updateBackground(artist.value.avatarUrl);

    const songPromises = artist.value.songIds.map(songId =>
      getSongById({
        song_id: songId
      }).then(res => res.data.result)
    );

    const songs = await Promise.all(songPromises);
    hotSongs.value = songs;
  } catch (error) {
    console.error("Failed to fetch artist data:", error);
  }
}, { immediate: true });

const handelScroll = (event) => {

  const playArea = document.querySelector(".play-area");
  const fixedPlayArea = document.querySelector(".fixed-play-area");
  const tipArea = document.querySelector(".tips");
  const fixedTipArea = document.querySelector(".fixed-tips");
  const albumContent = document.querySelector(".album-content");

  const offsetHeight = albumContent.offsetTop;
  const stickyPlayY = playArea.offsetTop - offsetHeight;
  const stickyTipY = tipArea.offsetTop - offsetHeight;
  const curOffset = offsetHeight - albumContent.getBoundingClientRect().top;

  console.log(stickyPlayY, stickyTipY);
  if (curOffset >= stickyPlayY) {
    fixedPlayArea.style.opacity = "1";
    fixedPlayArea.style.top = offsetHeight + "px";


    fixedPlayArea.style.width = (albumContent.clientWidth - 20) + "px";
  } else {
    fixedPlayArea.style.opacity = "0";
  }
  if (curOffset + fixedPlayArea.scrollHeight >= stickyTipY) {
    fixedTipArea.style.display = "flex";
    fixedTipArea.style.top = offsetHeight + fixedPlayArea.scrollHeight + 'px';

  } else {
    fixedTipArea.style.display = "none";
  }
}

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


const playFromId = (musicId) => {
  if (musicId === null || musicId === undefined) {
    if (hotSongs.value && hotSongs.value.length > 0) {
      musicPlayIndex = hotSongs.value[0].id;
      if(isFirstPlay){
        isFirstPlay.value = false;
        emit('updateSongs', hotSongs.value);
      }
      emit('playSong', hotSongs.value[0]);
    }
  } else {
    musicPlayIndex = musicId;
    const songToPlay = hotSongs.value.find(song => song.id === musicId);
    if (songToPlay) {
      if(isFirstPlay){
        isFirstPlay.value = false;
        emit('updateSongs', hotSongs.value);
      }
      emit('playSong', songToPlay);
    }
  }
  musicPauseIndex = null;
};

const pauseMusic = (musicId) => {
  musicPauseIndex = musicId;
  // 发送暂停事件给父组件
  emit('pauseSong');
};

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

const star = (artistId) => {
  alert("暂未开放");
}

const addToFavorite = (musicId) => {
}

watch(() => props.isPaused, (newValue) => {
  if (newValue) {
    musicPauseIndex = musicPlayIndex;
  } else {
    musicPauseIndex = null;
  }
});

const songDurations = ref(new Map());

watch(() => hotSongs.value, (newSongs) => {
  loadSongDurations(newSongs, songDurations);
}, { immediate: true });

watch(() => props.currentSongId, (newId) => {
  if (newId) {
    musicPlayIndex = newId;
    musicClickedIndex = newId;
    musicPauseIndex = props.isPaused ? newId : null;
  }
}, { immediate: true });

const isCurrentSongInList = computed(() => {
  if (!props.currentSongId || !hotSongs.value || hotSongs.value.length === 0) return false;
  return hotSongs.value.some(song => song.id === musicPlayIndex);
});

</script>

<template>
  <div class="album-content" :style="{backgroundImage: gradientColor}" @mousewheel="handelScroll">
    <div class="back-button" data-tooltip="返回" @click="$emit('back')">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
      </svg>
    </div>

    <div class="header">
      <img :src="artist?.avatarUrl" alt="" class="artist-image" @load="updateBackground"/>
      <div class="header-content">
        <h1 class="artist-name">{{ artist?.name }}</h1>
        <div class="artist-stats">
          <p>月听众 {{ monthlyListeners.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="play-area">
        <div class="play-button">
          <play-button v-if="!isCurrentSongInList||musicPauseIndex!==null"
                       @click="playFromId(musicPauseIndex)"
                       style="position: absolute; top:20%;left:24%;color: #000000"/>
          <pause-button v-if="isCurrentSongInList&&musicPauseIndex===null"
                        @click="pauseMusic(musicPlayIndex)"
                        style="position: absolute; top:24%;left:25%;color: #000000"/>
        </div>
        <!-- 替换原来的el-popover为关注按钮 -->
        <button class="follow-button" 
                :class="{ 'following': props.isFollowed }"
                @click="toggleFollow">
          {{ props.isFollowed ? '已关注' : '关注' }}
        </button>
      </div>

      <div class="fixed-play-area" :style="{background :`${backgroundColor}`}">
        <div class="opacity-wrapper">
          <div class="play-button">
            <play-button v-if="musicPlayIndex===null||musicPauseIndex!==null"
                         @click="playFromId(musicPauseIndex)"
                         style="position: absolute; top:20%;left:24%;color: #000000"/>
            <pause-button v-if="musicPlayIndex!==null&&musicPauseIndex===null"
                          @click="pauseMusic(musicPlayIndex)"
                          style="position: absolute; top:24%;left:25%;color: #000000"/>
          </div>
          <p style="padding-left: 10px;font-weight: bold;font-size: 26px">{{ artist?.name }}</p>
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
             v-for="music in hotSongs"
             :key="music.id"
             :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
             @mouseenter="()=>{musicHoveredIndex = music.id;}"
             @mouseleave="()=>{musicHoveredIndex = -1}"
             @click="musicClickedIndex=music.id"
             @dblclick="playFromId(music.id)"
             :style="{backgroundColor: musicClickedIndex===music.id? '#404040':
				     musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)',
				   }"> <!--@click事件写在script中的函数里 无法及时触发:style中的样式!!!-->

          <div
              :style="{visibility: musicHoveredIndex === music.id||musicPlayIndex === music.id ? 'hidden' : 'visible' }">
            {{ hotSongs.indexOf(music) + 1 }}
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
              >{{ music.title }}</p>

              <p class="music-author"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                {{ music.artist }}</p>
            </div>
          </div>

          <div class="music-album-info" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
            {{ music.album }}
          </div>
          <div class="music-right-info">
            <div class="like-button" 
                 :class="{ 'liked': likedSongs.has(music.id) }"
                 @click="toggleLikeSong(music.id)"
                 :style="{ visibility: musicHoveredIndex === music.id || likedSongs.has(music.id) ? 'visible' : 'hidden' }">
              <div v-if="likedSongs.has(music.id)" 
                   class="check-mark-wrapper" 
                   data-tooltip="从我喜欢的歌曲移除">
                <check-mark class="check-mark"/>
              </div>
              <span v-else class="add-icon" data-tooltip="添加至我喜欢的歌曲">+</span>
            </div>

            <div style="margin-left: auto;margin-right: 45px; color: #b2b2b2"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}"
            v-show="songDurations.get(music.id) !== undefined">
              {{ formatTime(songDurations.get(music.id)) }}
            </div>
          </div>

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

li:hover {
  background-color: #363636;
  border-radius: 12px;
}


p {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.header, .play-area, .tips, .musicList, .other-info {
  z-index: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  user-select: none;
}

.album-content {
  margin: 0;
  padding: 0;
  color: white;
  background-color: rgb(31, 31, 31);
  transition: background-color ease 0.6s;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto; /*千万不能删，不然背景黑一半*/
}


.header {
  display: flex;
  padding: 40px;
  align-items: center;
  gap: 24px;

  .artist-image {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 60px rgba(0,0,0,.5);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;

    .artist-name {
      font-size: 80px;
      font-weight: 700;
      margin: 0;
      line-height: 1;
    }

    .artist-stats {
      font-size: 14px;
      color: #b3b3b3;
      margin-top: 15px;
    }
  }
}

.content {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.20);
}

.album-image {
  border-radius: 6%;
  width: 160px;
  height: 160px;
  margin-top: 30px;
  margin-left: 15px;
  margin-right: 20px;
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
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  border-radius: 12px 12px 0 0;
  position: fixed; /**/
  display: flex;
  padding: 10px 0 10px 20px;
  width: inherit;

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
  background-color: #1ed660;
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
  background-color: #1ed683;
}


.tips {
  z-index: 0;
  display: flex;
  position: relative;
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
}

/*音乐被点击后的样式*/
.music-after-click {
  color: #1ed660;
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
  text-overflow: ellipsis;
}

.music-album-info:hover {
  cursor: pointer;
  text-decoration: underline;
}

.music-time-info {
  position: absolute;
  left: 85%;
  color: #b2b2b2;
}

/*右侧信息*/
.music-right-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.like-button {
  width: 20px;
  height: 20px;
  margin-right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #b3b3b3;
}

.like-button:hover {
  transform: scale(1.1);
  color: white;
}

.like-button.liked {
  color: #1ed760;
}

.add-icon {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
}

.add-icon[data-tooltip]:hover::after {
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

.check-mark {
  width: 16px;
  height: 16px;
}

.check-mark[data-tooltip]:hover::after {
  display: none;
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

.reco-add-button {
  color: white;
  margin-right: 16px;
  box-sizing: border-box;
  background-color: transparent;
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
  text-align: center;
  transition-duration: 33ms;
  transition-property: background-color, border-color, color, box-shadow, filter, transform;
  user-select: none;
  vertical-align: middle;
  transform: translate3d(0px, 0px, 0px);
  padding-block: 3px;
  padding-inline: 15px;
  border: 1px solid #818181;
  min-inline-size: 0;
  min-block-size: 32px;
  display: inline-flex;
  align-items: center;

  &:hover {
    border: 1px solid #f5f5f5;
    scale: 1.1;
  }
}

.follow-button {
  margin-left: 32px;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 500px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.04);
    border-color: white;
  }
  
  &.following {
    background-color: rgba(255, 255, 255, 0.1);
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

/* 修改play-area样式以适应新的布局 */
.play-area {
  display: flex;
  align-items: center;
  padding: 24px 32px;
}

.check-mark-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-mark-wrapper[data-tooltip]:hover::after {
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

/* 修改返回按钮样式 */
.back-button {
  z-index: 3;
  position: relative;
  margin: 24px 0 0 24px;
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
</style>