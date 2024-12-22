<script setup>
import {ref} from "vue"
import {getSongsByPlaylist} from "@/api/song";
import {getPlaylistById} from "../api/resolve";

import formerIcon from "../icon/formerIcon.vue";
import nextIcon from "../icon/nextIcon.vue";
// const props = defineProps({
//   defautAlbum:{
//     type: Object,
//     required: true
//   } ,
//   mostPlayedAlbum:{
//       type: Object,
//       required: true,
//     },
//
// })
const defautAlbum = ref({
  title:"default",
    picPath:null
})
const mostPlayedAlbum= ref({
  title:"mostPlayedAlbum",
  picPath:null
})
const weeklyRecommend = ref({
  picPath:"https://i.scdn.co/image/ab67616d00004851970e7892dab13cdb11387690",

})
const newSongsRecommend = ref({
  picPath:"https://i.scdn.co/image/ab67616d000048511b822a1e27037ac21e4eaa6d"
})
/*先固定就这两位*/
const artistRecommend = ref([{picPath:"",name:"Marcus Warner"},{picPath:"",name: "朴树"}])
const episodeRecommend = ref([{picPath:"",title:"热门专辑1"},{picPath:"",title:"热门专辑2"}])

/*图片区 ：推荐歌曲、推荐艺人、推荐专辑(歌单)*/
const songs = ref([]);
const singers = ref([]);
const albums = ref([]);

const currentTab = ref('all')


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

const handleTabClick = (tab) => {
	currentTab.value = tab
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

getSongsByPlaylist({
	playlist_id: 3,
}).then((res) => {
	songs.value = res.data.result.slice(0, 4);
});

</script>

<template>
	<div class="main-view">
		<div class="tabs">
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'all' }"
				@click="handleTabClick('all')"
			>全部
			</button>
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'songs' }"
				@click="handleTabClick('songs')"
			>音乐
			</button>
		</div>
		<div class="recommend-tabs">
        <div class="tab-main">
          <div class="wrapper">
            <div class="img">
              <img class="tab-img" :src="defautAlbum.picPath" alt="">
            </div>
            <div class="text">
              <span>点赞的歌曲</span>
            </div>
          </div>
        </div>
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="mostPlayedAlbum.picPath" alt="">
          </div>
          <div class="text">
            <span>{{mostPlayedAlbum.title}}</span>
          </div>
        </div>
      </div>
<!--      每周推荐-->
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="weeklyRecommend.picPath" alt="">
          </div>
          <div class="text">
            <span>每周推荐</span>
          </div>
        </div>
      </div>
      <!--      新歌推荐-->
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="newSongsRecommend.picPath" alt="">
          </div>
          <div class="text">
            <span>新歌推荐</span>
          </div>
        </div>
      </div>
      <!--艺人推荐 （下面两个tab）-->
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="artistRecommend[0].picPath" alt="">
          </div>
          <div class="text">
            <span>{{ artistRecommend[0].name }}</span>
          </div>
        </div>
      </div>
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img  class="tab-img" :src="artistRecommend[1].picPath" alt="">
          </div>
          <div class="text">
            <span>{{ artistRecommend[1].name }}</span>
          </div>
        </div>
      </div>
      <!--专辑推荐 （下面两个tab）-->
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img  class="tab-img" :src="episodeRecommend[0].picPath" alt="">
          </div>
          <div class="text">
            <span>{{ episodeRecommend[0].title }}</span>
          </div>
        </div>
      </div>
      <div class="tab-main">
        <div class="wrapper">
          <div class="img">
            <img  class="tab-img" :src="episodeRecommend[1].picPath" alt="">
          </div>
          <div class="text">
            <span>{{ episodeRecommend[1].title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="daily-recommendation" @mouseenter="buttonTurnUp(0)" @mouseleave="buttonTurnDown(0)">
      <h1>根据您的喜好推荐的音乐</h1>
      <div id="click-scroll-X" >
        <div class="left_btn"  @click="leftSlide"> <p style="margin-bottom: 2px"><</p> </div>
        <div class="scroll_wrapper"  >
          <div class="scroll_list">
            <div v-for="song in songs"
                 :key="song.id"
                 class="song">
              <img class="song-img" :src="song.picPath" alt="">
              <div class="song-text">{{ song.title }}</div>
              <div class="song-text">{{ song.artist }}</div>
            </div>

          </div>
        </div>
        <div class="right_btn" @click="rightSlide">  <p style="margin-bottom: 2px">></p>  </div>
      </div>
    </div>
    <div class="singer-recommendation" @mouseenter="buttonTurnUp(1)" @mouseleave="buttonTurnDown(1)">
      <h1>推荐艺人</h1>
      <div id="click-scroll-X" >
        <div class="left_btn" @click="leftSlide"> <p style="margin-bottom: 2px"><</p> </div>
        <div class="scroll_wrapper" >
          <div class="scroll_list">
            <div v-for="song in songs"
                 :key="song.id"
                 class="song">
              <img class="song-img" :src="song.picPath" alt="">
              <div class="song-text">{{ song.title }}</div>
              <div class="song-text">{{ song.artist }}</div>
            </div>

          </div>
        </div>
        <div class="right_btn" @click="rightSlide">  <p style="margin-bottom: 2px">></p>  </div>
      </div>
    </div>



	</div>
</template>

<style scoped>
p{
  margin: 0;
}
span{
  color: white;
  font-weight: bold;
  font-size: 16px;
  white-space: normal;
}
.main-view {
	padding: 20px;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tabs {
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
}

.tab-button {
	background-color: transparent;
	color: whitesmoke;
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
  color: whitesmoke;
}
.recommend-tabs{
  display: grid;
  grid-template-areas:
    "a b"
    "c d"
    "e f"
    "g h";

  grid-template-rows:0.25fr 0.25fr 0.25fr 0.25fr;
  grid-gap: 7px;
}
.tab-main{

}
.wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  padding:   1px;
  background-color:rgba(31,31,31,0.8) ;
  &:hover{
    background-color: rgba(80, 80, 80, 0.5);
    cursor: pointer;
  }
}
.tab-img ,.img{
  height: 54px;
  width: 54px;
  border-radius: 6px;
  border: none;
}
.text{
  margin-left: 8px;
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
    transition: opacity 0.2s ease-in-out;
    bottom: 140px;
  }
  .right_btn{
    right: -10px;
  }
  .left_btn{
    left: -10px;
  }
  .scroll_wrapper {

    width: 600px;
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

h1 {
	font-size: 24px;
	margin-bottom: 15px;
	margin-left: 10px;
	color: #fff;
	text-align: left;
}
.daily-recommendation{

}
.song {
  padding:9px;
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
}

.song-img {
  border-radius: 6px;
	width: 160px;
	height: 160px;
}
.song-text{
  width: 160px;
  margin-left: 4px;
  text-align: left;
  color: #a6a6a6;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}



.active {
	background-color: #fff;
	color: #000;
}

</style>