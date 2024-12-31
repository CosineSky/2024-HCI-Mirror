<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import playButton from "../icon/playButton.vue";
import dots from "../icon/dots.vue";
import checkMark from "../icon/checkMark.vue";
import {ElMessage, ElPopover} from "element-plus";
import {backgroundColor, updateBackground} from "../utils/getBackgroundColor";
import pauseButton from "../icon/pauseButton.vue";
import {removePlaylist, removeSongFromPlaylist} from "../api/playlist";
import {formatTime} from "@/utils/formatTime";
import {getPlaylistById} from "../api/resolve";
import {getSongsByPlaylist} from "../api/song";
import {loadSongDurations} from "../utils/loadSongDurations";


const emit = defineEmits();
const props = defineProps({
	episodeInfo: { // 类型 ：id,title,picPath,createTime,songNum
		type: Object,
		required: true,
	},
	musicList: { //表示当前歌单列表  类型 ：id,title,artist,picPath,upload_time
		type: Object,
		required: true,
	},
  playList: { //指当前收藏的歌单列表
    type: Array,
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
// 需要当前专辑信息
// const episodeInfo = ref({
//   id:211,title:"Apologize",picPath:"http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/529a2416-7055-4210-bb5d-2bf5e8380536.jpg",
//   createTime:"2024",songNum:""
// })
// const musicList = ref([])
// 推荐专辑随即从200-220取8个
const relatedEpisode = ref([]);

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);

const resizeObserver = ref(null)
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value} , #1F1F1F 50%)`)

// watch(props.episodeInfo,()=>{
//
// })

//获取歌曲时长
const songDurations = ref(new Map());
watch(() => props.musicList, (newSongs) => {
  loadSongDurations(newSongs, songDurations);
}, { immediate: true });


// 放缩时的组件处理
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
	const albumImage = document.querySelector(".album-image");
	const headerAlbumName = document.querySelector(".header-album-name");
	// 歌单图片和文字缩放
	if (albumContent.clientWidth < 420) {
		albumImage.style.width = "120px";
		albumImage.style.height = "120px";
		headerAlbumName.style.fontSize = "40px";
		headerAlbumName.style.marginBottom = "20px";
	} else {
		albumImage.style.width = "160px";
		albumImage.style.height = "160px";
		headerAlbumName.style.fontSize = "80px";
		headerAlbumName.style.marginBottom = "35px";
	}
	//🙏
	const fixedTipArea = document.querySelector(".fixed-tips");
	const fixedPlayArea = document.querySelector(".fixed-play-area");
	fixedPlayArea.style.width = (albumContent.clientWidth - 20) + "px";
	fixedTipArea.style.width = (albumContent.clientWidth - 16) + "px";
}

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
  getSongsByPlaylist({playlist_id:props.episodeInfo.id}).then(res => {
    props.musicList.value = res.data.result;
      console.log("episode得到歌曲！！")
  })
  let randomEpisodeIds =[];
  for (let i = 0; i < 10; i++) {
    let num = Math.floor(Math.random()*20+200);
      if(randomEpisodeIds.indexOf(num) === -1)
        randomEpisodeIds.push(num);
      else i--;
  }
  randomEpisodeIds.forEach((id)=>{
      getPlaylistById({playlist_id:id}).then(res => {
        relatedEpisode.value.push(res.data.result);
      })
  });

	console.log(resizeObserver.value)
	nextTick(() => {
		const albumContent = document.querySelector(".album-content");
		if (albumContent) {
			resizeObserver.value.observe(albumContent);
		}
	})
})

onUnmounted(() => {
	if (resizeObserver.value) {
		resizeObserver.value.disconnect();
	}
	popovers.value = null;
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

let timer = ref(null)
const limit = 250;
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
function  openEpisodeView(id){

}
//TODO:
const enterArtistDescription = (artistName) => {
  emit('switchToArtist', artistName);
}

const playFromId = (musicId) => {
	if (musicId === null) {
		// 从头开始播放
		musicPlayIndex.value = props.musicList[0].id;
	} else {
		musicPlayIndex.value = musicId;
	}
	emit('switchSongs', props.episodeInfo, musicPlayIndex.value);
	musicPauseIndex = null;
}
const addToFavorite = (musicId) => {
}
const enterMusicDescription = (musicId) => {
}


const pauseMusic = (musicId) => {
	musicPauseIndex = musicId;
}

</script>

<template>
	<div class="album-content" :style="{backgroundImage: gradientColor}" @mousewheel="handelScroll">
    <div class="back-button" data-tooltip="返回" @click="$emit('back')">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
      </svg>
    </div>
    <div class="header">
			<img :src="episodeInfo.picPath" alt="" class="album-image" @load="updateBackground(episodeInfo.picPath)"/>
			<div class="header-content">
				<p style="text-align: left;margin:20px 0 0 15px">专辑EP</p>
				<p class="header-album-name" style="font-weight: bolder;font-size:80px;margin:10px 0 35px 10px;">
					{{ episodeInfo.title }}</p>
				<div class="header-content-detail">
					<p class="header-creator" @click="enterArtistDescription">{{ episodeInfo.artist }}</p>
					<p style="padding-right:  6px ">•</p>
					<p v-if="episodeInfo.createTime !== undefined">
						{{ episodeInfo.createTime.substring(0, 4) }} </p>
					<p style="padding: 0 2px 0 6px">•</p>
					<p style="margin-left:6px">{{ musicList.length }} 首歌曲</p>
				</div>
			</div>
		</div>

		<div class="content">
			<div class="play-area">
				<div class="play-button">
					<play-button v-if="musicPlayIndex===null||musicPauseIndex!==null"
					             @click="playFromId(musicPauseIndex)"
					             style="position: absolute; top:20%;left:24%;color: #000000"/>
					<pause-button v-if="musicPlayIndex!==null&&musicPauseIndex===null"
					              @click="pauseMusic(musicPlayIndex)"
					              style="position: absolute; top:24%;left:25%;color: #000000"/>
				</div>
				<!--        ：ref中函数执行时，组件已经渲染好，并将本组件作为参数传入函数-->

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
					<p style="padding-left: 10px;font-weight: bold;font-size: 26px">{{ episodeInfo.title }}</p>
				</div>
			</div>
			<div class="tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p style="margin-left: auto; margin-right:55px">时间</p>
			</div>
			
			<div class="fixed-tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p style="margin-left: auto; margin-right:75px">时间</p>
			</div>
			
			<div class="musicList">
				<div class="music-item"
				     v-for="music in musicList"
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
						{{
							musicList.indexOf(music) + 1
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
							<p @click="enterMusicDescription(music.id)" class="music-name"
							   :style="{color : musicPlayIndex ===music.id? '#1ED660':''}"
							   :class="[musicPlayIndex === music.id ? 'music-after-click' : '']"
							>{{ music.title }}</p>

							<p @click="enterArtistDescription(music.artist)" class="music-author"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
								{{ music.artist }}</p>
						</div>
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
								<check-mark class="check-mark"
								            :style="{visibility: musicHoveredIndex === music.id ? 'visible' : 'hidden'}"/>
							</template>
							<ul @click="closePopover">
								<!--          TODO: 这里需要所有的歌单-->
								<li @click="addToFavorite(music.id)"></li>
							</ul>
						</el-popover>
            <div style="margin-left: auto;margin-right: 15px; color: #b2b2b2"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}"
                 v-show="songDurations.get(music.id) !== undefined">
              {{ formatTime(songDurations.get(music.id)) }}
            </div>
						<el-popover
							:ref="getPopoverIndex"
							class="music-dropdown-options"
							popper-class="my-popover"
							:width="400"
							trigger="click"
							:hide-after=0
						>
							<template #reference>
								<dots class="music-more-info"/>
							</template>
							<ul @click="closePopover">

							</ul>
						</el-popover>
					</div>
				</div>
			</div>
      <div class="related-episodes">
        <h1>相关专辑</h1>
        <div id="click-scroll-X" >
          <div class="left_btn" @click="leftSlide"> <p style="margin-bottom: 2px"><</p> </div>
          <div class="scroll_wrapper" >
            <div class="scroll_list">
              <div v-for="ep in relatedEpisode"
                   :key="ep.id"
                   class="scroll-entry"
                   @click="emit('openEpisodeView',ep)">
                <img class="big-img" :src="ep.picPath" alt="">
                <div class="entry-text bolder-white-theme">{{ ep.title }}</div>
                <div class="entry-text">{{ ep.createTime.substring(0,4) }}</div>
              </div>

            </div>
          </div>
          <div class="right_btn" @click="rightSlide">  <p style="margin-bottom: 2px">></p>  </div>
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

.header, .play-area, .tips, .musicList {
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

.check-mark:focus {
	outline: none;
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

#click-scroll-X {
  position: relative;
  display: flex;
  align-items: center;

  .left_btn,.right_btn {
    font-size: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    color: #fff;
    background-color: #1f1f1f;
    position: absolute;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
    bottom: 140px;
  }
  .right_btn{
    right: -10px;
  }
  .left_btn{
    left: -10px;
  }
  .scroll_wrapper {

    width: 100%;
    overflow-x: scroll;
    padding: 20px 0;

    .scroll_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap:2px;
    }
  }
}
.scroll-entry {
  padding:9px;
  align-items: center;
  box-shadow: 0 4px 15px rgb(17, 17, 17); /* 悬浮效果的阴影 */
  width: 180px;
  height: 210px;
  display: flex;
  flex-direction: column;
  gap:5px;
  &:hover{
    cursor: pointer;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.1);
  }
  &.large-scroll-entry{
    height: 230px;
  }
}

.big-img {
  border-radius: 6px;
  width: 160px;
  height: 160px;
}
.entry-text{
   width: 160px;
   margin-left: 4px;
   text-align: left;
   color: #a6a6a6;
   font-size: 14px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
 }
.bolder-white-theme{
  font-size: 18px;
  font-weight: bolder;
  color: rgb(241, 241, 241);
}
h1 {
  font-size: 24px;
  margin-bottom: 15px;
  margin-left: 10px;
  color: #fff;
  text-align: left;
}
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

</style>
