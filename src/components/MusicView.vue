<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import playButton from "../icon/playButton.vue";
import {ElMessage} from "element-plus";
import {backgroundColor, updateBackground} from "../utils/getBackgroundColor";
import pauseButton from "../icon/pauseButton.vue";

import {addSongToPlaylist} from "../api/playlist";
import { loadSongDurations } from '../utils/loadSongDurations';
import {getSongsByArtist} from "@/api/artist";

/*
    USER
 */
const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));
const currentUserId = ref(userToken.value.id);

/*
歌词
 */
const lyrics = ref([]); // 歌词数组

const emit = defineEmits(['pauseSong', 'switchSongs', 'switchToArtist', 'back']);
const props = defineProps({
  songInfo: {// 类型 ：id, title, artist, album, description, picPath,uploadTime
    type: Object,
    required: true,
  },
  playFromLeftBar: null,
  currentSongId: {
    type: Number,
    required: true
  },
  isPaused: {
    type: Boolean,
  }
});



const recMusicList = ref([
  {
    id: 4,
    number: 1,
    name: "NightTheater",
    author: "Wakadori",
    img: require("../assets/pictures/songs/1.jpg"),
    time: "3:30",
    album: "NightTheater"
  },
])

const artistMusicList = ref([])

const artists = ref([{
  id:1,
  avatarUrl:"http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/6ac2a408-1632-4713-bcc3-a54151e29c18.jpg",
  name:"朴树"
},
]);
const albums = ref([]);

onMounted(() => {
  getSongsByArtist(songInfo.artist).then(res => {
    artistMusicList.value = res.data;
  })
})

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);

const resizeObserver = ref(null)
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value} , #1F1F1F 50%)`)

//获取歌曲时长
const songDurations = ref(new Map());
watch(() => props.musicList, (newSongs) => {
  loadSongDurations(newSongs, songDurations);
}, { immediate: true });

const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}


onMounted(() => {
  resizeObserver.value = new ResizeObserver(debounce(handleResize, 50));
  console.log(resizeObserver.value)
  nextTick(() => {
    const albumContent = document.querySelector(".album-content");
    if (albumContent) {
      resizeObserver.value.observe(albumContent);
    }
  })

  musicPlayIndex = props.currentSongId;
  musicClickedIndex = props.currentSongId;
  musicPauseIndex = props.isPaused ? props.currentSongId : null;
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
})

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


watch(props.playFromLeftBar, () => {
  playFromId(props.playFromLeftBar)
})

const playFromId = (musicId) => {
  musicPlayIndex = musicId;
  emit('switchSongs', musicPlayIndex);
  musicPauseIndex = null;
}

const addToFavorite = (musicId, albumId) => {
  addSongToPlaylist({
    user_id: currentUserId.value,
    playlist_id: albumId,
    song_id: musicId,
  }).then(() => {
    ElMessage({
      message: "添加至: " + props.albumInfo.title,
      grouping: true,
      type: 'info',
      offset: 16,
      customClass: "reco-message",
      duration: 4000,
    })
  })
}
watch(() => props.isPaused, (newValue) => {
  if (newValue) {
    musicPauseIndex = musicPlayIndex;
  } else {
    musicPauseIndex = null;
  }
});

const enterAuthorDescription = (artistName) => {
  emit('switchToArtist', artistName);
}

const pauseMusic = (musicId) => {
  musicPauseIndex = musicId;
  emit('pauseSong');
}

const addRecommendMusic = (musicId) => {
  console.log(musicId);
  //TODO:添加歌曲到指定的歌单
  ElMessage({
    message: "添加至默认收藏夹",
    grouping: true,
    type: 'info',
    offset: 16,
    customClass: "reco-message",
    duration: 4000,
  })
}

watch(() => props.currentSongId, (newId) => {
  if (newId) {
    musicPlayIndex = newId;
    musicClickedIndex = newId;
    musicPauseIndex = props.isPaused ? newId : null;
  }
}, { immediate: true });
// 判断当前播放的歌曲是否是这首歌
const isCurrentSong = computed(() => {
  return (musicPlayIndex === props.musicId);
});
const enterMusicDescription = (musicId) => {
}

let timer = ref(null)
const limit = 230;
function leftSlide(event){
  // 保存滚动盒子左侧已滚动的距离
  const target = event.currentTarget.nextElementSibling;
  let left=target.scrollLeft
  console.log(target);
  let num=1
  clearInterval(timer)

  timer=setInterval(()=>{
    let distanceNextTime =(limit/2 - Math.abs( limit/2 - num))/3;
    //   !left:已经滚动到最左侧
    //   一次性滚动距离（可调节）
    if(left<=0||num>=limit){
      // 停止滚动
      clearInterval(timer)
      return
    }
    left-=distanceNextTime
    // 给滚动盒子元素赋值向左滚动距离
    target.scrollLeft=left < 0 ? 0 : left
    // 保存向左滚动距离（方便判断一次性滚动多少距离）
    num+=distanceNextTime

  },18)
  // 20：速度（可调节）
}
function rightSlide(event){
  const target = event.currentTarget.previousElementSibling;
  // 保存滚动盒子左侧已滚动的距离
  let left=target.scrollLeft
  // 保存元素的整体宽度
  let scrollWidth=target.scrollWidth
  // 保存元素的可见宽度
  let clientWidth=target.clientWidth

  let num=1
  clearInterval(timer)
  timer = setInterval(()=>{
    let distanceNextTime =(limit/2 - Math.abs( limit/2 - num))/3;
    // 已经滚动距离+可见宽度
    // left+clientWidth>=scrollWidth：滚动到最右侧
    // num>=300一次性滚动距离
    if(left+clientWidth>=scrollWidth||num>=limit){
      clearInterval(timer.value)
      return
    }
    // 给滚动盒子元素赋值向左滚动距离
    left+=distanceNextTime
    target.scrollLeft= left +clientWidth > scrollWidth? scrollWidth - clientWidth : left;
    // 保存向左滚动距离（方便判断一次性滚动多少距离）
    num+=distanceNextTime
  },18)
  // 20：速度（可调节）
}
const buttonTurnUp= (buttonId)=>{
  const rightButton = document.querySelectorAll('.right_btn');
  const leftButton = document.querySelectorAll('.left_btn');
  rightButton[buttonId].style.opacity="1";
  leftButton[buttonId].style.opacity="1";

}
const buttonTurnDown= (buttonId)=>{
  const rightButton = document.querySelectorAll('.right_btn');
  const leftButton = document.querySelectorAll('.left_btn');
  rightButton[buttonId].style.opacity="0";
  leftButton[buttonId].style.opacity="0";

}
const openArtistView = (name)=>{
  emit('openArtistView', name);
}
const openEpisodeView= (id)=>{
  emit('openEpisodeView', id);
}
</script>

<template>
  <div v-if="songInfo !== null">
    <div class="album-content" :style="{backgroundImage: gradientColor}" @mousewheel="handelScroll">
      <div class="back-button" data-tooltip="返回" @click="$emit('back')">
        <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
        </svg>
      </div>
      <div class="header">
        <img :src="songInfo.picPath" alt="" class="album-image" @load="updateBackground(songInfo.picPath)"/>
        <div class="header-content">
          <p style="text-align: left;margin:20px 0 0 15px">歌曲</p>
          <p class="header-album-name" style="font-weight: bolder;font-size:80px;margin:10px 0 35px 10px;">
            {{ songInfo.title }}</p>
          <div class="header-content-detail">
            <p class="header-creator" @click="">{{ songInfo.artist }}</p>
            <p style="padding: 0 2px 0 2px ">•</p>
            <p class="header-creator" @click="">{{ songInfo?.album }}</p>
            <p style="padding: 0 2px 0 2px ">•</p>
            <p v-if="songInfo.uploadTime !== undefined">
              {{ songInfo.uploadTime.substring(0, 10) }} </p>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="play-area">
          <div class="play-button">
            <play-button v-if="!isCurrentSong||musicPauseIndex!==null"
                         @click="playFromId(musicPauseIndex)"
                         style="position: absolute; top:20%;left:24%;color: #000000"/>
            <pause-button v-if="isCurrentSong&&musicPauseIndex===null"
                          @click="pauseMusic(musicPlayIndex)"
                          style="position: absolute; top:24%;left:25%;color: #000000"/>
          </div>
        </div>

        <div class="fixed-play-area" :style="{background :`${backgroundColor}`}">
          <div class="opacity-wrapper">
            <div class="play-button">
              <play-button v-if="!isCurrentSong||musicPauseIndex!==null"
                           @click="playFromId(musicPauseIndex)"
                           style="position: absolute; top:20%;left:24%;color: #000000"/>
              <pause-button v-if="isCurrentSong&&musicPauseIndex===null"
                            @click="pauseMusic(musicPlayIndex)"
                            style="position: absolute; top:24%;left:25%;color: #000000"/>
            </div>
            <p style="padding-left: 10px;font-weight: bold;font-size: 26px">{{ songInfo.title }}</p>
          </div>
        </div>

<!--        <div class="other-info">
          <div class="lyrics-lines" :style="{ transform: `translateY(${-currentLineIndex * 40}px)` }">
            <div
                v-for="(line, index) in lyrics"
                :key="index"
                :class="{ active: index === currentLineIndex }"
                class="lyrics-line"
            >{{ line.text }}
            </div>
            <h1 v-if="lyrics.length === 0" style="
					font-size: 24px;
					color: #9d9d9d;
					margin-top: 240px;
				    font-family: Consolas, 幼圆, serif;
				">Ouch！该歌曲暂无歌词！</h1>
          </div>
        </div>-->

        <!--TODO:推荐歌曲的细节处理-->
        <div class="other-info">
          <div style="margin-left:20px;margin-bottom:20px;">
            <div style="display: flex;text-align: left;justify-content: center;flex-direction: column">
              <span style="color:white;font-size: 30px;font-weight: bolder">推荐</span>
              <span style="color:grey;font-size: 20px">基于此歌曲
            </span>
            </div>
          </div>

          <div class="recMusicList">
            <div class="music-item"
                 v-for="music in recMusicList"
                 :key="music.id"
                 :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
                 @mouseenter="()=>{musicHoveredIndex = music.id;}"
                 @mouseleave="()=>{musicHoveredIndex = null}"
                 @click="musicClickedIndex=music.id"
                 @dblclick="playFromId(music.id)"
                 :style="{backgroundColor: musicClickedIndex===music.id? '#404040':
				     musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)',
				   }">


              <div
                  :style="{visibility: musicHoveredIndex === music.id||musicPlayIndex === music.id ? 'hidden' : 'visible' }">
                {{
                  recMusicList.indexOf(music) + 1
                }}
              </div>
              <play-button @click="playFromId(music.id)" style="position: absolute;left: 33px;cursor: pointer"
                           v-if="(musicHoveredIndex === music.id&&musicPlayIndex!==music.id)||musicPauseIndex===music.id"
                           :style="{color: musicPauseIndex===music.id ? '#1ed660' : 'white'}"/>
              <pause-button @click="pauseMusic(music.id)"
                            style="color:#1ed660 ;position: absolute;left: 37px;cursor: pointer"
                            v-if="musicPlayIndex===music.id&&musicHoveredIndex === music.id&&musicPauseIndex!==music.id"/>
              <img width="17" height="17" alt=""
                   style="position: absolute;left: 42px;"
                   v-if="musicPlayIndex===music.id&&musicHoveredIndex !== music.id&&musicPauseIndex!==music.id"
                   src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif">

              <div class="music-detailed-info">
                <img class="music-image"
                     :src="music.picPath"
                     alt="歌曲图片"/>
                <div class="music-name-author" style="padding-left: 5px;">
                  <p @click="enterMusicDescription(music.id)" class="music-name"
                     :style="{color : musicPlayIndex ===music.id? '#1ED660':''}"
                     :class="[musicPlayIndex === music.id ? 'music-after-click' : '']"
                  >{{ music.title }}</p>

                  <p @click="enterAuthorDescription(music.artist)" class="music-author"
                     :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                    {{ music.artist }}</p>
                </div>
              </div>

              <div class="music-album-info"
                   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                {{ music.album }}
              </div>
              <div class="music-right-info">
                <button class="reco-add-button" @click="addRecommendMusic(music.id)">添加</button>

              </div>

            </div>

          </div>
        </div>

        <div class="other-info">
          <div style="margin-left:20px;margin-bottom:20px;">
            <div style="display: flex;text-align: left;justify-content: center;flex-direction: column">
              <span style="color:white;font-size: 30px;font-weight: bolder">{{songInfo.artist}}</span>
              <span style="color:grey;font-size: 20px">本艺人的其他歌曲列表
            </span>
            </div>
          </div>

          <div class="recMusicList">
            <div class="music-item"
                 v-for="music in artistMusicList"
                 :key="music.id"
                 :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
                 @mouseenter="()=>{musicHoveredIndex = music.id;}"
                 @mouseleave="()=>{musicHoveredIndex = null}"
                 @click="musicClickedIndex=music.id"
                 @dblclick="playFromId(music.id)"
                 :style="{backgroundColor: musicClickedIndex===music.id? '#404040':
				     musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)',
				   }">


              <div
                  :style="{visibility: musicHoveredIndex === music.id||musicPlayIndex === music.id ? 'hidden' : 'visible' }">
                {{
                  artistMusicList.indexOf(music) + 1
                }}
              </div>
              <play-button @click="playFromId(music.id)" style="position: absolute;left: 33px;cursor: pointer"
                           v-if="(musicHoveredIndex === music.id&&musicPlayIndex!==music.id)||musicPauseIndex===music.id"
                           :style="{color: musicPauseIndex===music.id ? '#1ed660' : 'white'}"/>
              <pause-button @click="pauseMusic(music.id)"
                            style="color:#1ed660 ;position: absolute;left: 37px;cursor: pointer"
                            v-if="musicPlayIndex===music.id&&musicHoveredIndex === music.id&&musicPauseIndex!==music.id"/>
              <img width="17" height="17" alt=""
                   style="position: absolute;left: 42px;"
                   v-if="musicPlayIndex===music.id&&musicHoveredIndex !== music.id&&musicPauseIndex!==music.id"
                   src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif">

              <div class="music-detailed-info">
                <img class="music-image"
                     :src="music.picPath"
                     alt="歌曲图片"/>
                <div class="music-name-author" style="padding-left: 5px;">
                  <p @click="enterMusicDescription(music.id)" class="music-name"
                     :style="{color : musicPlayIndex ===music.id? '#1ED660':''}"
                     :class="[musicPlayIndex === music.id ? 'music-after-click' : '']"
                  >{{ music.title }}</p>

                  <p @click="enterAuthorDescription(music.artist)" class="music-author"
                     :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                    {{ music.artist }}</p>
                </div>
              </div>

              <div class="music-album-info"
                   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                {{ music.album }}
              </div>
              <div class="music-right-info">
                <button class="reco-add-button" @click="addRecommendMusic(music.id)">添加</button>

              </div>

            </div>

          </div>
        </div>
        <div class="singer-recommendation" @mouseenter="buttonTurnUp(1)" @mouseleave="buttonTurnDown(1)">
          <h1>相似艺人</h1>
          <div id="click-scroll-X" >
            <div class="left_btn" @click="leftSlide"> <p style="margin-bottom: 2px"><</p> </div>
            <div class="scroll_wrapper" >
              <div class="scroll_list">
                <div v-for="artist in artists"
                     :key="artist.id"
                     class="scroll-entry large-scroll-entry"
                     @click="openArtistView(artist.name)">
                  <img class="very-big-img" style="border-radius: 50%" :src="artist.avatarUrl" alt="">
                  <div class="entry-text bolder-white-theme">{{ artist.name}}</div>
                  <div class="entry-text">艺人</div>
                </div>

              </div>
            </div>
            <div class="right_btn" @click="rightSlide">  <p style="margin-bottom: 2px">></p>  </div>
          </div>
        </div>
        <div class="albums-recommendation" @mouseenter="buttonTurnUp(2)" @mouseleave="buttonTurnDown(2)">
          <h1>热门专辑</h1>
          <div id="click-scroll-X" >
            <div class="left_btn" @click="leftSlide"> <p style="margin-bottom: 2px"><</p> </div>
            <div class="scroll_wrapper" >
              <div class="scroll_list">
                <div v-for="album in albums"
                     :key="album.id"
                     class="scroll-entry"
                     @click="openEpisodeView(album.id)">
                  <img class="big-img" :src="album.picPath" alt="">
                  <div class="entry-text bolder-white-theme">{{ album.title }}</div>
                  <div class="entry-text">{{ album.description }}</div>
                </div>

              </div>
            </div>
            <div class="right_btn" @click="rightSlide">  <p style="margin-bottom: 2px">></p>  </div>
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

.header, .play-area, .other-info {
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
  background-color: #121212;
  transition: background-color ease 0.6s;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto; /*千万不能删，不然背景黑一半*/
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
  width: 160px;
  height: 160px;
  margin-top: 30px;
  margin-left: 15px;
  margin-right: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  flex-grow: 1;
  min-width: 0;
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

.fixed-play-area {
  top: 0;
  z-index: 11;
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


.other-info {
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

/*右侧信息*/
.music-right-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
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

.back-button {
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

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, .8);
  }
}

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
</style>
