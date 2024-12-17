<script setup>
import {ref} from "vue";
import Empty from "./Empty.vue";

const {songResult, playlistResult} = defineProps({
	songResult: Array,
	playlistResult: Array
})

const currentTab = ref('songs')

const handleTabClick = (tab) => {
	currentTab.value = tab
}
</script>

<template>
	<div class="search-view">
		<div class="tabs">
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'songs' }"
				@click="handleTabClick('songs')"
			>💿歌曲</button>
			<button
				class="tab-button"
				:class="{ 'active': currentTab === 'playlists' }"
				@click="handleTabClick('playlists')"
			>📕歌单</button>
			<button
				class="tab-button"
			>🙂用户</button>
		</div>
		<div class="search-results">
			<ul v-if="currentTab === 'songs'">
				<li v-for="(song, index) in songResult" :key="song.id">
					<div class="song-item">
						<span class="song-index">{{ index + 1 }}</span>
						<img :src="song.picPath" class="song-pic" alt=""/>
						<div class="song-info">
							<h3 class="song-title">{{ song.title }}</h3>
							<p class="song-artist">{{ song.artist }}</p>
							<p class="song-album">{{ song.album }}</p>
						</div>
					</div>
				</li>
			
			</ul>
			<ul v-if="currentTab === 'playlists'">
				<li v-for="(playlist, index) in playlistResult" :key="playlist.id">
					<div class="playlist-item">
						<span class="song-index">{{ index + 1 }}</span>
						<img :src="playlist.picPath" class="playlist-pic" alt=""/>
						<div class="playlist-info">
							<h3 class="playlist-title">{{ playlist.title }}</h3>
							<p class="playlist-username">{{ playlist.username }}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div v-if="songResult.length === 0 && playlistResult.length === 0">
			<Empty :magic="Math.floor(Math.random() * 8)"/>
		</div>
	</div>
</template>

<style scoped>
.search-view {
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

.search-results {
	list-style-type: none;
	padding: 0;
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

</style>
