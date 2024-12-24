<script setup>
import {onMounted, ref} from "vue"
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
const emit = defineEmits([])
/*条目区 都写死*/
const defautAlbum = ref({
	id: 2,
	title: "default",
	picPath: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/53a10825-f3a3-48e9-81ec-86d662606c67.png"
})
const mostPlayedAlbum = ref({
	id: 3,
	title: "最受欢迎的专辑",
	picPath: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/60fa504f-23ee-4446-8ef8-0f5049963865.png"
})
const weeklyRecommend = ref({
	id: 5,
	picPath: "https://i.scdn.co/image/ab67616d00004851970e7892dab13cdb11387690",

})
const newSongsRecommend = ref({
	id: 6,
	picPath: "https://i.scdn.co/image/ab67616d000048511b822a1e27037ac21e4eaa6d"
})
/*先固定就这两位*/
const artistRecommend = ref([
    { id:1,picPath:"https://y.qq.com/music/photo_new/T001R150x150M000000mLAT42CFWNa.jpg?max_age=2592000",name:"朴树"},
    {id:2,picPath:"http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg",name: "n-buna"}])
const episodeRecommend = ref([
    {id:200,picPath:"http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/b313c9cf-85d7-4b5d-9ba4-a80acce452ba.png",title:"Ignite (2016 League Of Legends World Championship)"},
    {id:201,picPath:"http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/e17e49ca-62f9-404d-866b-a13e9886372e.jpg",title:"Stay"}])

/*图片区 ：推荐歌曲、推荐艺人、推荐专辑(歌单)*/
const songs = ref([]);
/*写死*/
const artists = ref([
	{id: 1, avatarUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/6ac2a408-1632-4713-bcc3-a54151e29c18.jpg", name: "朴树"},
	{id: 2, avatarUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/59b6831d-a4c8-4e11-8edc-bfbd0221fd0e.jpg", name: "许巍"},
	{id: 3, avatarUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/e6af63fd-21cd-4c9a-98ed-0362fd5c69f5.jpg", name: "Beyond"},
	{id: 4, avatarUrl: "https://i.scdn.co/image/ab67616100005174f1496a59885e3470c2644879", name: "张学友"},
	{id: 5, avatarUrl: "https://i.scdn.co/image/ab67616100005174e62cff9c6018ae5616b01eab", name: "ヨルシカ"},
	// {id: 5, avatarUrl: "", name: "朴树"},
]);
const episodes = ref([]);


const currentTab = ref('all')
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
const openArtistView = (name)=>{
  emit('openArtistView', name);
}
const openEpisodeView= (id)=>{
  emit('openEpisodeView', id);
}
const openMusicView = (id)=>{
  emit('openMusicView', id);
}
const openAlbumView = (id)=>{
  emit('openAlbumView', id);
}


onMounted(()=>{
  getSongsByPlaylist({
    playlist_id: 3,
  }).then((res) => {
    songs.value = res.data.result.slice(0, 6);
  }).catch(e => {
    console.log("MainView Failed to get songs!");
  });
  let randomEpisodeIds =[];
  for (let i = 0; i < 6; i++) {
    randomEpisodeIds.push( Math.floor(Math.random()*20+200));
  }
  randomEpisodeIds.forEach((id)=>{
    getPlaylistById({playlist_id:id}).then(res => {
      episodes.value.push(res.data.result);
    })
  });
})


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
        <div class="tab-main" @click="openAlbumView(defautAlbum.id)">
          <div class="wrapper">
            <div class="img">
              <img class="tab-img" :src="defautAlbum.picPath" alt="">
            </div>
            <div class="text">
              <span class="tab-text">点赞的歌曲</span>
            </div>
          </div>
        </div>
      <div class="tab-main" @click="openAlbumView(mostPlayedAlbum.id)">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="mostPlayedAlbum.picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">{{mostPlayedAlbum.title}}</span>
          </div>
        </div>
      </div>
<!--      每周推荐-->
      <div class="tab-main" @click="openAlbumView(weeklyRecommend.id)">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="weeklyRecommend.picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">每周推荐</span>
          </div>
        </div>
      </div>
      <!--      新歌推荐-->
      <div class="tab-main" @click="openAlbumView(newSongsRecommend.id)">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="newSongsRecommend.picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">新歌推荐</span>
          </div>
        </div>
      </div>
      <!--艺人推荐 （下面两个tab）-->
      <div class="tab-main" @click="openArtistView(artistRecommend[0].name)">
        <div class="wrapper">
          <div class="img">
            <img class="tab-img" :src="artistRecommend[0].picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">{{ artistRecommend[0].name }}</span>
          </div>
        </div>
      </div>
      <div class="tab-main" @click="openArtistView(artistRecommend[1].name)">
        <div class="wrapper">
          <div class="img">
            <img  class="tab-img" :src="artistRecommend[1].picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">{{ artistRecommend[1].name }}</span>
          </div>
        </div>
      </div>
      <!--专辑推荐 （下面两个tab）-->
      <div class="tab-main" @click="openEpisodeView(episodeRecommend[0].id)">
        <div class="wrapper" >
          <div class="img">
            <img  class="tab-img" :src="episodeRecommend[0].picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">{{ episodeRecommend[0].title }}</span>
          </div>
        </div>
      </div>
      <div class="tab-main" @click="openEpisodeView(episodeRecommend[1].id)">
        <div class="wrapper">
          <div class="img">
            <img  class="tab-img" :src="episodeRecommend[1].picPath" alt="">
          </div>
          <div class="text">
            <span class="tab-text">{{ episodeRecommend[1].title }}</span>
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
                 class="scroll-entry"
              @click="openMusicView(song.id)">
              <img class="big-img" :src="song.picPath" alt="">
              <div class="entry-text bolder-white-theme">{{ song.title }}</div>
              <div class="entry-text">{{ song.artist }}</div>
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
      <h1>推荐专辑</h1><!--这里暂时写歌单 最好改为专辑-->
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
</template>

<style scoped>
p{
  margin: 0;
}
.tab-text{
  color: white;
  font-weight: bold;
  font-size: 16px;
  white-space: normal;
}
.main-view {
  border-radius: 12px;
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

	.left_btn, .right_btn {
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

	.right_btn {
		right: -10px;
	}

	.left_btn {
		left: -10px;
	}

	.scroll_wrapper {

		width: 100%;
		overflow-x: scroll;
		padding: 20px 0;

		.scroll_list {
			display: flex;
			align-items: center;
			gap: 5px;
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
.scroll-entry {
	padding: 9px;
	align-items: center;
	box-shadow: 0 4px 15px rgb(17, 17, 17); /* 悬浮效果的阴影 */
	width: 180px;
	height: 210px;
	display: flex;
	flex-direction: column;
	gap: 5px;

	&:hover {
		cursor: pointer;
		border-radius: 6px;
		background-color: rgba(255, 255, 255, 0.1);
	}

	&.large-scroll-entry {
		height: 230px;
	}
}

.big-img {
  border-radius: 6px;
	width: 160px;
	height: 160px;
}
.very-big-img {
  border-radius: 6px;
  width: 180px;
  height: 180px;
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

.active {
	background-color: #fff;
	color: #000;
}

</style>