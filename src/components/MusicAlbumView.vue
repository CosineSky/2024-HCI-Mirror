<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import playButton from "../icon/playButton.vue";
import dots from "../icon/dots.vue";
import checkMark from "../icon/checkMark.vue";
import {ElMessage, ElPopover} from "element-plus";
import {backgroundColor, updateBackground} from "../utils/getBackgroundColor";
import pauseButton from "../icon/pauseButton.vue";
import {modifyPlaylist, removePlaylist, removeSongFromPlaylist} from "../api/playlist";
import tippy from 'tippy.js';


const emit = defineEmits();
const props = defineProps({
  albumInfo: { // 类型 ：id, userid, title ,description ,picPath,createTime,updateTime,songNum
    type: Object,
    required: true,
  },
  playList:{
    type: Array,
    required: true,
  },
  musicList: {//  类型 ：id ,title, artist, album,description, picPath,uploadTime
    type: Object,
    required: true,
  },
  playFromLeftBar: null,
  currentSongId: Number,
});

const edit_title = ref("");
const edit_description = ref("");
const edit_cover_path = ref("");

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

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);

const resizeObserver = ref(null)
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value} , #1F1F1F 50%)`)

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

  //🙏 权宜之计
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
// 鼠标悬停提示
tippy('#myButton', {
  content: "I'm a Tippy tooltip!",
});

//TODO:
const enterPersonalSpace = () => {
}

const removeAlbum = (albumId) => {
	removePlaylist({
		playlist_id: albumId,
	}).then(res => {
		console.log("Hi")
	})
}

const playFromId = (musicId) => {
	if (musicId === null) {
		// 从头开始播放
		musicPlayIndex.value = props.musicList[0].id;
	} else {
		musicPlayIndex.value = musicId;
	}
	emit('switchSongs', props.albumInfo, musicPlayIndex.value);
	musicPauseIndex = null;
}

const addToFavorite = (musicId,albumId) => {
  //TODO:调用接口添加歌曲到指定歌单，并设置elmessage提示信息

  ElMessage({
        message: "添加至: " + props.albumInfo.title,
        grouping: true,
        type: 'info',
        offset: 16,
        customClass: "reco-message",
        duration: 4000,
      }
  )
}
const removeMusicFromAlbum = (albumId, songId) => {
	removeSongFromPlaylist({
		playlist_id: albumId,
		song_id: songId,
	})
}
const enterMusicDescription = (musicId) => {
}
const enterAuthorDescription = (authorName) => {
}

const pauseMusic = (musicId) => {
	musicPauseIndex = musicId;
}

const editAlbumDescription = (albumId) => {
	const editDesc = document.querySelector(".edit-desc");
	editDesc.style.visibility = "visible";
}

const confirmEdit = (albumId) => {
	modifyPlaylist({
		id: albumId,
		title: edit_title.value,
		description: edit_description.value,
		picPath: "",
	}).then(() => {

	})
}

const quitEdit = () => {
	const editDesc = document.querySelector(".edit-desc");
	editDesc.style.visibility = "hidden";
}
const addRecommendMusic = (musicId) => {
	console.log(musicId);
	//TODO:添加歌曲到指定的歌单
	ElMessage({
		message: "添加至: " + props.albumInfo.title,
		grouping: true,
		type: 'info',
		offset: 16,
		customClass: "reco-message",
		duration: 4000,
	})
}


</script>

<template>
	<div class="album-content" :style="{backgroundImage: gradientColor}" @mousewheel="handelScroll">
		<div class="header">
			<!--			.<img src="../assets/pictures/songs/2.jpg" alt="" class="album-image" @load="updateBackground"/>-->
			<img :src="albumInfo.picPath" alt="" class="album-image" @load="updateBackground(albumInfo.picPath)"/>
			<div class="header-content">
				<p style="text-align: left;margin:20px 0 0 15px">歌单</p>
				<p class="header-album-name" style="font-weight: bolder;font-size:80px;margin:10px 0 35px 10px;">
					{{ albumInfo.title }}</p>
				<div class="header-content-detail">
					<p class="header-creator" @click="enterPersonalSpace">{{ albumInfo.description }}</p>
					<p style="padding-right:  6px ">•</p>
					<p v-if="albumInfo.updateTime !== undefined">
						{{ albumInfo.updateTime.substring(0, 10) }} </p>
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
				<el-popover
					style="border-radius: 10px"
					:width="400"
					trigger="click"
					popper-class="my-popover"
					:ref="getPopoverIndex"
					:hide-after=0>
					<template #reference>
						<dots v-tippy="'歌单详情'" class="more-info"/>
					</template>
					<ul @click="closePopover">
						<li @click="()=>{editAlbumDescription(albumInfo.id)}">编辑歌单详情</li>
						<li @click="">删除歌单</li>
					</ul>
				</el-popover>
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
					<p style="padding-left: 10px;font-weight: bold;font-size: 26px">{{ albumInfo.title }}</p>
				</div>
			</div>
			<div class="tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p class="album-text" style="position:absolute; left:62%">专辑</p>
				<p style="margin-left: auto; margin-right:20px">详情</p> <!--时间变为详细信息-->
			</div>
			<div class="edit-desc" @blur="quitEdit">
				<div data-testid="playlist-edit-details-modal" class="main-edit-desc">
					<div class="edit-desc-header">
						<h1 class="encore-text encore-text-title-small" data-encore-id="text">编辑详情</h1>
						<button class="edit-desc-header-button" @click="quitEdit">
							<svg data-encore-id="icon" role="img" aria-label="关闭" aria-hidden="false"
							     viewBox="0 0 16 16"
							     class="small-svg">
								<path
									d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
							</svg>
						</button>
					</div>
					<div class="edit-desc-text">
						<!--              <input accept="image/.jpg, image/.jpeg, image/.png" type="file" data-testid="image-file-picker" class="wcftliF4QjZKB1CYgEON">-->
						<div class="edit-desc-img">
							<div class="edit-desc-img-1" draggable="false">
								<div class="edit-desc-img-1-1 edit-desc-img-1">
									<svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist"
									     viewBox="0 0 24 24"
									     class="large-svg">
										<path
											d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
									</svg>
								</div>
							</div>
							<div class="edit-desc-img-2">
								<div class="edit-desc-img-2-1">
									<button data-testid="edit-image-button" class="edit-desc-img-2-button"
									        aria-haspopup="true"
									        type="button">
										<div class="edit-desc-img-2-1-1 icon">
											<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
											     class="large-svg">
												<path
													d="M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.726 4.726 0 0 1 1.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 0 0 1.001-.636L20.611 5.268a1.329 1.329 0 0 0 0-1.879z"></path>
											</svg>
											<span class="encore-text encore-text-body-medium"
											      data-encore-id="text">选择照片</span></div>
									</button>
								</div>
							</div>
							<div class="edit-desc-img-3">
								<button class="edit-desc-img-3-button" type="button">
									<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16"
									     class="small-svg">
										<path
											d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
									</svg>
									<span class="hidden-visually">编辑照片</span></button>
							</div>
						</div>
						<div class="edit-desc-input-name">
							<input v-model="edit_title" data-testid="playlist-edit-details-name-input" id="text-input-c673a65959365e7f" type="text" class="edit-desc-input-name-1" placeholder="添加名称">
						</div>
						<div class="edit-desc-input-desc">
                            <textarea v-model="edit_description" data-testid="playlist-edit-details-description-input" class="edit-desc-input-desc-1" placeholder="添加简介"/>
						</div>
						<div class="edit-desc-button">
							<button @click="confirmEdit(albumInfo.id)" data-testid="playlist-edit-details-save-button"
							        data-encore-id="buttonPrimary"
							        class="edit-desc-button-1 encore-text-body-medium-bold">
								<span class="edit-desc-button-1-1">收藏</span>
							</button>
						</div>
						<p class="encore-text encore-text-marginal-bold final-tip" data-encore-id="text">继续下一步，则表示你已同意
							Spotify 获取你选择上传的图像。请确保你有上传此图像的权利。</p>
					</div>
				</div>
			</div>
			<div class="fixed-tips">
				<p style="position:absolute; left:45px">#</p>
				<p style="position:absolute; left:140px">标题</p>
				<p class="album-text" style="position:absolute; left:62%">专辑</p>
				<p style="margin-left: auto; margin-right:20px">详情</p><!--时间变为详细信息-->
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

              <p @click="enterAuthorDescription(music.artist)" class="music-author"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
                {{ music.artist }}</p>
            </div>
          </div>

          <div class="music-album-info" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
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
                <div style="padding: 6px 0 6px 10px;font-weight: bold;color:darkgrey;font-size:16px">选择歌单收藏</div>
                <hr style="    border: 0;padding-top: 1px;background: linear-gradient(to right, transparent, #98989b, transparent);" >

                <li class="album-to-add" @click="addToFavorite(music.id,album.id)" v-for="album in playList">
                  <div style="height:40px;display: flex;align-items: center;font-size: 20px;font-weight:400">
                    <img :src="album.picPath" style="height: 32px;width:32px;border-radius: 4px" alt=""/>
                    <div style="margin-left: 30px">{{album.title}} </div>
                  </div>

                </li>
              </ul>
            </el-popover>
<!--            这里原本想写歌曲时长，但是没有 只能留空-->
            <div style="margin-left: auto;margin-right: 15px; color: #b2b2b2"
                 :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">{{}}
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
                <dots v-tippy="'歌曲详情'" class="music-more-info"/>
              </template>
              <ul @click="closePopover">
                <li @click="removeMusicFromAlbum(music.id)">删除歌曲</li>
              </ul>
            </el-popover>

          </div>

        </div>

      </div>

      <!--TODO:推荐歌曲的细节处理-->
      <div class="other-info">
        <div style="margin-left:20px;margin-bottom:20px;">
          <div style="display: flex;text-align: left;justify-content: center;flex-direction: column">
            <span style="color:white;font-size: 30px;font-weight: bolder">推荐</span>
            <span style="color:grey;font-size: 20px">根据此歌单包含的内容推荐
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

            <div class="music-album-info" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
              {{ music.album }}
            </div>
            <div class="music-right-info">
              <button class="reco-add-button" @click="addRecommendMusic(music.id)">添加</button>

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
.album-to-add{
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

/* new-elements */
.edit-desc {
	visibility: hidden;
	z-index: 1000;
	background-color: rgba(0, 0, 0, .7);
	bottom: 0;
	display: flex;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	overflow: hidden;
}

.main-edit-desc {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	background-color: #282828;
	border-radius: 8px;
	-webkit-box-shadow: 0 4px 4px rgba(0, 0, 0, .3);
	box-shadow: 0 4px 4px rgba(0, 0, 0, .3);
	color: #fff;
	-ms-flex-direction: column;
	flex-direction: column;
	min-height: 384px;
	width: 524px;
}

.edit-desc-header {
	display: flex;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	justify-content: space-between;
	padding: 24px;
}

.edit-desc-header-button {
	align-self: end;
	background-color: transparent;
	border: 0;
	border-radius: 32px;
	color: hsla(0, 0%, 100%, .7);
	grid-area: close-button;
	height: 32px;
	margin-top: -8px;
	width: 32px;
	-webkit-margin-end: -8px;
	margin-inline-end: -8px;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
}

.edit-desc-text {
	display: grid;
	grid-template: 32px 132px 32px auto / 180px 1fr;
	grid-template-areas:
        "album-image title"
        "album-image description"
        ". save-button"
        "disclaimer disclaimer";
	grid-gap: 16px;
	padding: 0 24px 24px;
}

.edit-desc-img {
	grid-area: album-image;
	height: 180px;
	margin: 0;
	position: relative;
	/* width: 180px; */
}

.edit-desc-img-1 {
	border-radius: 4px;
	height: 100%;
	width: 100%;
}

.edit-desc-img-1-1 {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	background-color: #282828;
	color: #7f7f7f;
	justify-content: center;
	-webkit-box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
	box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
	
	&:hover {
		display: none;
	}
}

.large-svg {
	fill: currentcolor;
	width: 48px;
	height: 48px;
}

.edit-desc-img-2 {
	bottom: 0;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
}

.edit-desc-img-2-1 {
	height: 100%;
	width: 100%;
}

.edit-desc-img-2-button {
	background-color: #282828;
	color: #fff;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	text-align: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	border: none;
	border-radius: 4px;
	justify-content: center;
	opacity: 0;
	padding: 0;
}

.edit-desc-img-2-1-1 {
	margin-top: 16px;
	-webkit-transition: opacity .2s;
	transition: opacity .2s;
}

.edit-desc-img-3 {
	right: 8px;
	height: 32px;
	position: absolute;
	top: 8px;
	width: 32px;
}

@media (hover: hover) {
	.edit-desc-img-3-button:not([data-context-menu-open=true]) {
		opacity: 0;
		pointer-events: none;
		position: unset;
	}
}

.edit-desc-img-3-button {
	background-color: rgba(0, 0, 0, .3);
	border: none;
	border-radius: 500px;
	color: #b3b3b3;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	padding: 8px;
	text-decoration: none;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	
	&:hover {
		opacity: 0;
		pointer-events: none;
		position: unset;
	}
}

.small-svg {
	height: 16px;
	width: 16px;
}

.edit-desc-input-name {
	grid-area: title;
	position: relative;
	margin-right: 8px;
}

.edit-desc-input-name-1 {
	background: hsla(0, 0%, 100%, .1);
	border: 1px solid transparent;
	border-radius: 4px;
	color: #fff;
	font-family: inherit;
	font-size: 14px;
	height: 40px;
	padding: 0 12px;
	width: 100%;
	-webkit-box-shadow: inset 0 -2px #343030;
	box-shadow: inset 0 -2px 0 0 #343030;
}

.edit-desc-input-desc {
	grid-area: description;
	margin-top: 8px;
	position: relative;
}

.edit-desc-input-desc-1 {
	background: hsla(0, 0%, 100%, .1);
	border: 1px solid transparent;
	border-radius: 4px;
	color: #fff;
	font-family: inherit;
	font-size: 14px;
	padding: 8px 8px 28px;
	resize: none;
	width: 100%;
	height: 70%;
}

.edit-desc-button {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	grid-area: save-button;
	justify-self: flex-end;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
}

.edit-desc-button-1 {
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	background-color: transparent;
	border: 0;
	border-radius: 9999px;
	cursor: pointer;
	display: inline-block;
	position: relative;
	text-align: center;
	text-decoration: none;
	text-transform: none;
	touch-action: manipulation;
	transition-duration: 33ms;
	transition-property: background-color, border-color, color, box-shadow, filter, transform;
	user-select: none;
	vertical-align: middle;
	transform: translate3d(0px, 0px, 0px);
	padding: 0px;
	min-inline-size: 0px;
	align-self: center;
}

.edit-desc-button-1-1 {
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	position: relative;
	background-color: #ffffff;
	color: #000000;
	display: flex;
	border-radius: 9999px;
	font-size: inherit;
	min-block-size: 48px;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	padding-block: 8px;
	padding-inline: 32px;
	transition-property: background-color, transform;
	transition-duration: 33ms;
}

.encore-text {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	color: inherit;
	margin-block: 0;
	font-size: 13px;
	white-space: normal;
}

.encore-text-title-small {
	font-size: 1.5rem;
}

.final-tip {
	grid-area: disclaimer;
}

.encore-text-marginal-bold {
	font-weight: 700;
}
</style>
