<script setup>
import {ref} from "vue"
import {getSongsByPlaylist} from "@/api/song";

const songs = ref([]);

const currentTab = ref('all')

const handleTabClick = (tab) => {
	currentTab.value = tab
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
		
		<div class="recommendations">
			<h1>根据您的喜好推荐的音乐</h1>
			<div class="recommend-songs">
				<div v-for="song in songs"
				     :key="song.id"
				     class="song">
					<img class="recommend-song-img" :src="song.picPath" alt="">
					<h2>{{ song.title }}</h2>
					<p>{{ song.artist }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.main-view {
	padding: 20px;
}

.tabs {
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

.recommendations h1 {
	font-size: 24px;
	margin-bottom: 15px;
	margin-left: 10px;
	color: #fff;
	text-align: left;
}

.recommend-songs {
	display: flex;
	flex-direction: row;
}

.recommend-songs img {
	width: 200px;
	height: 200px;
	margin-top: 10px
}

.recommend-songs h2 {
	font-size: 20px;
	margin-bottom: 5px;
	color: #fff;
	text-align: left;
	margin-left: 15px;
}

.recommend-songs p {
	font-size: 14px;
	color: #f0f0f0;
	text-align: left;
	margin-left: 15px;
}

.song {
	border: 1px solid #fff;
	width: 240px;
	border-radius: 20px;
	margin-right: 20px;
}

.active {
	background-color: #fff;
	color: #000;
}

.recommend-song-img:hover {
	transform: rotate(3deg) scale(1.02);
}
</style>