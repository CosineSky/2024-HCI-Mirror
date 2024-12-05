<script setup>
import {onMounted, ref} from "vue";
import musicAlbumOpened from "../icon/musicAlbumOpened.vue";
import musicAlbumClosed from "../icon/musicAlbumClosed.vue";
import searchIcon from "../icon/searchIcon.vue";
import plusIcon from "../icon/plusIcon.vue";
import playButton from "../icon/playButton.vue";
import {getPlaylistsByUser} from "../api/playlist";

const musicAlbums = ref([
    { id: 1, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1' },
    { id: 2, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2' },
    { id: 3, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3' },
    { id: 4, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1' },
    { id: 5, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2' },
    { id: 6, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3' },
    { id: 7, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1' },
    { id: 8, image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2' },
    { id: 9, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3' },
    { id: 10, image: require('../assets/pictures/playlists/1.jpg'), title: '歌单 1' },
    { id: 11 ,image: require('../assets/pictures/playlists/2.jpg'), title: '歌单 2' },
    { id: 12, image: require('../assets/pictures/playlists/3.jpg'), title: '歌单 3' },
    // 更多歌单
]);

let albumHoveredIndex = ref(null);
let hoverOnAlbum= ref(false);
let isSideBarOpen = ref(true);
let sideBarWidth = ref(180);
let user = ref("HanG");
const criticalWidth = 180;
const minWidth = 75;

function toggleSideBar() {
    isSideBarOpen = !isSideBarOpen;
    sideBarWidth.value = isSideBarOpen? criticalWidth : minWidth;
}
function  startResizing(event) {
    event.preventDefault();
    const initialWidth = sideBarWidth.value;
    const initialMouseX = event.clientX;
    
    const onMouseMove = (moveEvent) => {
        sideBarWidth.value = initialWidth + (moveEvent.clientX - initialMouseX);
        // 确保宽度不小于最小值
        if(sideBarWidth.value <= criticalWidth) {
            isSideBarOpen = false;
            sideBarWidth.value = minWidth;
        }
        else
            isSideBarOpen = true;
    };
    
    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}
function addAlbum() {
    //TODO:
    
}
function searchAlbum() {
    //TODO:
}

onMounted(()=>{
     getPlaylistsByUser({
        user_id: 1,
    }).then(res => {
        musicAlbums.value = res.data.result || []
    }).catch(e => {

    })
})
</script>

<template>
    <nav class="main-menu resizable-box" :style="{ width: sideBarWidth + 'px'}">
        <div class="top-control">
            <div class="toggle-button" @click="toggleSideBar">
                <music-album-opened v-if="isSideBarOpen" />
                <music-album-closed v-if="!isSideBarOpen" />
                <p style="margin-left: 15px;font:normal small-caps bold 20px Arial, sans-serif ;" v-if="isSideBarOpen">音乐库</p>
            </div>
            <div class="add-album" v-if="isSideBarOpen" @click="addAlbum">
                <plus-icon />
            </div>
        
        </div>
        <div class="search-album" v-if="isSideBarOpen" @click="searchAlbum">
            <search-icon/>
        </div>
        
        <div class="musicAlbums"
             @mouseenter="()=>{hoverOnAlbum=true}"
             @mouseleave="()=>{hoverOnAlbum=false}"
             :style="{ scrollbarWidth : hoverOnAlbum? 'auto':'none'}">

            <div v-if="musicAlbums !== undefined" v-for="album in musicAlbums"
                 :key="album.id"
                 @mouseenter="()=>{albumHoveredIndex = album.id}"
                 @mouseleave="()=>{albumHoveredIndex = null}"
                 :style="{backgroundColor: albumHoveredIndex === album.id ? '#1F1F1F' : '#121212' }"
                 class="musicAlbum-item" >
                <img
                    src='../assets/pictures/playlists/1.jpg'
                    :src="album.image"
                    alt="playlist"
                    class="musicAlbum-image"
                    :style="{opacity:albumHoveredIndex === album.id ? 0.4 :1}"
                />
                <play-button v-if="albumHoveredIndex === album.id" class="play-button"/>
                
                <div  class="musicAlbum-description">
                    <p style="padding-bottom: 5px;font-size: 18px">{{ album.title }}</p>
                    <p style="color: #b2b2b2;font-size: 13px">歌单 • {{user}}</p>
                </div>
            </div>
        </div>
        <div class="resizer" @mousedown="startResizing"  ></div>
    
    </nav>
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


.main-menu.resizable-box{
    position: relative; /*使得子元素的absotute是相对于该元素*/
    /*display: flex;
    flex-direction: column;
    */
    
    border-radius: 15px 0 0 15px;
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    padding: 12px 0 20px;
    overflow: hidden;
    font-family: inherit;
    background-color:#121212;
    
}
.top-control{
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.toggle-button:hover{
    color : #d2d0d0;
}
.toggle-button{
    display: flex;
    align-items: center;
    width: 120px;
    margin: 0 0 0 16px;
    background-color:transparent;
    cursor: pointer;
    transition: color  0.5s ease ;
    color: #b2b2b2;
}
.add-album{
    color:#b2b2b2;
    margin-top: 5px;
    margin-right:15px;
    width: 30px;
    cursor: pointer;
}
.search-album{
    color:#b2b2b2;
    margin: 16px 0 0 13px;
    width: 40px;
    cursor: pointer;
}
.resizer {
    position: absolute;
    width: 5px;
    height: 100%;
    right: 0;
    top: 0;
    cursor: ew-resize; /* 水平调整光标 */
    background-color: transparent; /* 透明背景 */
}

.musicAlbums {
    height: 100%;
    padding: 0 10px 0 10px;
    overflow: auto;
    /*默认情况 滚动条消失*/
    
}
/*滑动条*/
.musicAlbums::-webkit-scrollbar {
    width: 12px; /* 滚动条宽度 */
}

.musicAlbums::-webkit-scrollbar:window-inactive {

}

.musicAlbums::-webkit-scrollbar-track {
    background: transparent; /* 滚动条背景 */
}

.musicAlbums::-webkit-scrollbar-thumb {
    background: #888; /* 滚动条颜色 */
    border-radius: 10px; /* 圆角 */
    
}

.musicAlbums::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 悬停时的颜色 */
}

.musicAlbum-item {
    display: flex;
    position: relative;
    align-items: center;
    border-radius: 10px;
    padding: 10px 0;
    color: #f6f6f6;
}

.musicAlbum-description{
    text-align: left;
    display: flex;
    flex-direction: column;
    
}
.musicAlbum-image {
    width: 55px;  /* 调整图片大小 */
    height: 55px; /* 调整图片大小 */
    margin-right: 10px;
    border-radius: 10px;
}
.play-button {
    position: absolute;
    top: 20px;
    left: 10px;
    color: #f1f1f1; /* 播放键的颜色 */
    cursor: pointer; /* 鼠标移动到播放键上时显示为点击手型 */
    transition: transform  0.3s ease ;
}
.play-button:hover{
    transform: scale(1.1);
}

.musicAlbum-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* 单行显示文本 */
}



</style>