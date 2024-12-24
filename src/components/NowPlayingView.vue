<script setup>
import {defineProps, defineEmits, ref, computed, watch} from 'vue';
import {getArtistInfo} from "@/api/artist";

const props = defineProps({
  isVisible: Boolean,
  currentSong: Object,
  nextSong: Object,
});

const isFollowing = ref(false);

const artists = computed(() => {
  if (!props.currentSong?.artist) return [];
  return props.currentSong.artist.split('/').map(name => name.trim());
});

const artistImage = ref([]);

const setArtistInfo = async () => {
  artistImage.value = [];
  
  console.log('Artists:', artists.value)
  for (const artist of artists.value) {
    try {
      const artistInfo = await getArtistInfo(artist);
      artistImage.value.push(artistInfo.data.result.avatarUrl);
    } catch (error) {
      console.error('Failed to fetch artist info:', error);
    }
  }
  
  console.log('Artist Images:', artistImage.value)
};

watch(artists, () => {
  if (artists.value.length > 0) {
    setArtistInfo();
  }
}, { immediate: true });

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  // TODO: 调用后端API实现关注/取消关注
  // followArtist({
  //   artistId: artist.value.id,
  //   isFollow: isFollowing.value
  // });
};

const emit = defineEmits(['playNext', 'toggleQueue', 'enterAuthorDescription']);

const playNext = () => {
  emit('playNext');
};

const toggleQueue = () => {
  emit('toggleQueue');
};

const enterAuthorDescription = (artistName) => {
  emit('enterAuthorDescription', artistName);
}
</script>

<template>
  <div class="now-playing-view">
    <div class="music-player music-info">
      <div class="album-cover">
        <img :src="currentSong.picPath" alt="当前播放"/>
      </div>
      <h2>{{ currentSong.title }}</h2>
      <p>{{ currentSong.artist }}</p>
    </div>

    <div class="current-playlist">
      <div class="section-container">
        <div class="section-header">
          <h3>艺术家</h3>
        </div>
        <div v-for="(artist, index) in artists"
             :key="artist" 
             class="artist-info">
          <img :src="artistImage[index]"
               class="artist-image" 
               alt="艺术家"
               @click="enterAuthorDescription(artist)"/>
          <div class="artist-details">
            <h4>{{ artist }}</h4>
            <button class="follow-button"
                    :class="{ 'following': isFollowing }"
                    @click="toggleFollow">
              {{ isFollowing ? '已关注' : '关注' }}
            </button>
          </div>
        </div>
      </div>

      <div class="section-container">
        <div class="section-header">
          <h3>播放队列中的下一首</h3>
        </div>
        <div class="next-track" v-if="nextSong" @click="playNext">
          <img :src="nextSong.picPath" alt="下一首"/>
          <div class="track-details">
            <p class="playlist-container-desc title">{{ nextSong.title }}</p>
            <p class="playlist-container-desc artist">{{ nextSong.artist }}</p>
          </div>
        </div>
        <button class="view-queue" @click="toggleQueue">
          查看完整队列
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.now-playing-view {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: auto;
}

.music-player {
  text-align: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
}

.album-cover {
  width: 270px;
  height: 270px;
  margin: 0 auto 24px;
  position: relative;
}
.album-cover img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid rgba(222, 215, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 10px 60px rgba(200, 187, 255, 0.5);
  transition: transform 0.3s ease;
}

.album-cover:hover img {
  transform: scale(1.02);
}

.section-container {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.artist-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 8px;
}

.artist-info:last-child {
  margin-bottom: 0;
}

.artist-info:hover {
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.artist-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.artist-details {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.artist-details h4 {
  margin: 0;
  font-size: 14px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.follow-button {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 500px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 72px;
  text-align: center;
}

.follow-button:hover {
  transform: scale(1.04);
  border-color: white;
}

.follow-button.following {
  background-color: rgba(255, 255, 255, 0.1);
}

.follow-button.following:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.artist-details p {
  margin: 0;
  font-size: 12px;
  color: #b3b3b3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.next-track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.track-details {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.next-track:hover {
  background: rgba(255, 255, 255, 0.1);
}

.next-track img {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 12px;
}

.playlist-container-desc {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.playlist-container-desc.title {
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
}

.playlist-container-desc.artist {
  color: #949494;
  font-size: 12px;
}

.view-queue {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-queue:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}

h2 {
  color: white;
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: bold;
}

p {
  color: #b3b3b3;
  margin: 0;
  font-size: 16px;
}

.now-playing-view::-webkit-scrollbar {
  width: 8px;
}

.now-playing-view::-webkit-scrollbar-track {
  background: transparent;
}

.now-playing-view::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.now-playing-view::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.current-playlist {
  padding: 0 20px;
}
</style>

