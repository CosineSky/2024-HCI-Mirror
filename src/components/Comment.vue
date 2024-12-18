<script setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {parseTime, toggleImg} from '../utils'
import {commentSong, getSongComments, getSongCommentsCount, likeComment} from "../api/comment"
import {getSongById, getUserById} from "../api/resolve"
import {ElMessage} from "element-plus"
import defaultBg from '../assets/pictures/jj.png'
import likeIcon from '../assets/icons/comment/like.png'
import {useTheme} from "../store/theme";
import Pagination from "../components/Pagination.vue";
import {getDominantColor} from "../utils/getBackgroundColor";

const theme = useTheme()
const state = reactive({
  comments: [],
  commenters: [],
  song: null,
  total: 0,
  pageSize: 20,
  currentPage: 1
})

const router = useRouter()
const route = useRoute()
const {songId, userId} = defineProps({
      songId: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      }
    }
)
const page = ref(1)
const imgEl = ref()
const bg = ref('')
const comment = ref('')
const showComment = ref(true)
const showDetail = ref(false)

const sortBy = ref('Time') // 默认按时间排序
/*
覆盖仓库的Comment.vue
 */
const backgroundColor = ref("#ffffff");
const gradientColor = computed(() => `linear-gradient(to bottom, ${backgroundColor.value} , #1F1F1F 50%)`)

onMounted(() => {
  watch(bg, (val) => {
    toggleImg(val).then((img) => {
      if (imgEl.value) {
        imgEl.value.style.backgroundImage = `url(${img.src})`
      }
    })
    getDominantColor(bg.value, (color) => {
      backgroundColor.value = color;
    });
  })

  // 初始化所有state数据
  state.comments = [
    // {
    // 	userId: 1,
    // 	comment: "这首歌真的太棒了！林俊杰的声音太有感染力了",
    // 	createTime: "2024-03-15 14:30",
    // 	likedCount: 156,
    // 	isLiked: false
    // },
    // {
    // 	userId: 2,
    // 	comment: "歌词写得太深刻了，每次听都有新的感悟",
    // 	createTime: "2024-03-14 18:45",
    // 	likedCount: 89,
    // 	isLiked: false
    // },
    // {
    // 	userId: 3,
    // 	comment: "编曲非常精妙，层次感很强",
    // 	createTime: "2024-03-13 20:15",
    // 	likedCount: 67,
    // 	isLiked: false
    // }
  ]

  state.commenters = [
    // {
    // 	userId: 1,
    // 	username: "音乐爱好者",
    // 	avatarUrl: "https://example.com/avatar1.jpg"
    // },
    // {
    // 	userId: 2,
    // 	username: "JJ粉丝",
    // 	avatarUrl: "https://example.com/avatar2.jpg"
    // },
    // {
    // 	userId: 3,
    // 	username: "乐评人",
    // 	avatarUrl: "https://example.com/avatar3.jpg"
    // }
  ]

  state.song = {
    // title: '达尔文',
    // artist: '林俊杰',
    // singer: [
    // 	{
    // 		name: '林俊杰'
    // 	}
    // ],
    // songDetail: {
    // 	lyricist: '林可邦',
    // 	composer: '蔡健雅',
    // 	arranger: '林俊杰 JJ Lin',
    // 	language: '国语',
    // 	genre: 'Pop',
    // 	originalArtist: '达尔文 - 蔡健雅',
    // 	recordCompany: '就是俊杰音乐股份有限公司',
    // 	description: '《达尔文》是林俊杰的一首经典之作，以进化论之父Charles Darwin为名，寓意生命的进化与演变。这首歌不仅旋律悠扬，更在歌词中蕴含了深刻的哲理，引人深思。当林俊杰的歌声响起，仿佛带领我们穿越时空，见证生命从简单到复杂的蜕变过程。每一个音符都如同自然的密码，诠释着生命的奥秘。用心聆听，你会发现，这首歌不仅仅是一首歌，更是一部关于生命进化的壮丽史诗。'
    // }
  }

  state.total = 0
  state.pageSize = 20
  state.currentPage = 1
  getCommentCount(parseInt(songId))
  getCommentMusicFn(parseInt(songId), page.value)
})

const getCommentCount = (id) => {
  getSongCommentsCount({
    song_id: id
  }).then(res => {
    state.total = res.data.result
  })
}

const getCommentMusicFn = async (id, page) => {
  getSongComments({
    song_id: id,
    page: page,
    pageSize: state.pageSize,
    sort: sortBy.value
  }).then(res => {
    state.comments = res.data.result.map(comment => ({
      ...comment,
      isLiked: comment.likedUserIds ? comment.likedUserIds.includes(parseInt(userId)) : false
    }));

    console.log("Processed comments:", state.comments);

    for (let i = 0; i < state.comments.length; i++) {
      getUserById({
        user_id: state.comments[i].userId
      }).then(res => {
        console.log("COMMENTER FOUND")
        state.commenters.push(res.data.result)
      })
    }
    getSongById({
      song_id: songId,
    }).then(res => {
      state.song = res.data.result
      bg.value = res.data.result.picPath
      theme.change(bg.value)
    })
  })
}
const currentChange = (page) => {
  state.currentPage = page
  getCommentMusicFn(parseInt(songId), page)
}

const gotoUserDetail = (userId) => {
  router.push({
    path: '/userDetail',
    query: {
      userId
    }
  })
}

const resetComments = () => {
  comment.value = "";
  ElMessage.info("已清空您的评论！");
}

const handleSubmit = () => {
  if (!comment.value.replace(/(^\s*$) | (\s*$)/g, '')) {
    ElMessage.warning("评论内容不能为空！");
    return;
  }

  commentSong({
    userId: parseInt(userId),
    songId: parseInt(songId),
    comment: comment.value,
  }).then(() => {
    ElMessage.success("评论成功！");

    comment.value = "";
    getCommentCount(parseInt(songId));
    state.currentPage = 1;
    sortBy.value = 'Time'
    getCommentMusicFn(parseInt(songId), 1);
  }).catch(error => {
    ElMessage.error("发布评论失败，请稍后重试");
    console.error("Submit comment failed:", error);
  });
}

const showComments = () => {
  showComment.value = true
  showDetail.value = false
  const navLeft = document.querySelector('.nav-left')
  const navRight = document.querySelector('.nav-right')
  navLeft.classList.add('active')
  navRight.classList.remove('active')
}
const showDetails = () => {
  showComment.value = false
  showDetail.value = true
  const navLeft = document.querySelector('.nav-left')
  const navRight = document.querySelector('.nav-right')
  navLeft.classList.remove('active')
  navRight.classList.add('active')
}

function adjustHeight(event) {
  nextTick(() => {
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 26 + 'px'
  })
}

const handleLike = (index) => {
  const comment = state.comments[index];
  const newIsLiked = !comment.isLiked;

  likeComment({
    userId: parseInt(userId),
    commentId: comment.id,
    isLike: newIsLiked
  }).then(() => {
    state.comments[index].isLiked = newIsLiked;
    state.comments[index].likeCount = newIsLiked
        ? comment.likeCount + 1
        : comment.likeCount - 1;
  }).catch(error => {
    ElMessage.error("点赞失败，请稍后重试");
    console.error("Like failed:", error);
  });
}

const changeSortBy = (type) => {
  sortBy.value = type
  getCommentMusicFn(parseInt(songId), page.value)
}
</script>

<template>
  <div class="comment-wrapper" :style="{backgroundImage: gradientColor}">
    <div class="comment">
      <div v-if="state.song !== null" class="comment-box">
        <div class="info">
          <div ref="imgEl" class="bg-img"></div>
          <div class="song-info">
            <div class="song-name">{{ state.song.title }}</div>
            <div class="singers">
              <div class="singer-info">
                <span>歌手:{{ state.song.artist }}</span>
                <!--<span v-for="(item, index) in state.song.singer">-->
                <!--歌手:{{item.name + (index < state.song.singer.length - 1 ? '/' : '') }}-->
                <!--</span>-->
              </div>
            </div>
          </div>
        </div>
        <div class="navigation">
          <div class="nav-left active" @click="showComments">评论{{ state.total }}</div>
          <div class="nav-right" @click="showDetails">详情</div>
        </div>
        <div v-if="showComment" class="user-comment">
          <textarea placeholder="请输入您的评论..." v-model="comment" @input="adjustHeight"></textarea>
          <span
              class="custom-button"
              style="color: white; font-size: 20px; position: absolute; bottom: 14px; right: 2%"
              @click.stop="handleSubmit"
          >发布</span>
        </div>
        <div v-if="showComment" class="comment-content">
          <div class="comment-content-box">
            <div class="title-container">
              <div class="title">精彩评论</div>
              <div class="sort-options">
							<span
                  :class="{ active: sortBy === 'Time' }"
                  @click="changeSortBy('Time')"
              >最新</span>
                <div class="divider"></div>
                <span
                    :class="{ active: sortBy === 'Hot' }"
                    @click="changeSortBy('Hot')"
                >最热</span>
              </div>
            </div>
            <div class="content" @wheel.stop>
              <div v-for="i in state.comments.length" class="content-line">
                <!--							:style="{ backgroundImage: `url(${state.commenters[i - 1].avatarUrl})` }"-->
                <div
                    @click="gotoUserDetail(state.commenters[i - 1].userId)"
                    :style="{ backgroundImage: '../assets/pictures/avatar.png' }"
                    class="photo"
                ></div>
                <div v-if="state.commenters[i - 1] !== undefined" class="right-box">
                  <div class="comment-text">
                    <div @click="gotoUserDetail(state.comments[i - 1].id)" class="name">
                      {{ state.commenters[i - 1].username }}:
                    </div>
                    <div class="text">{{ state.comments[i - 1].comment }}</div>
                  </div>
                  <div class="handle-box">
                    <div class="time">{{ parseTime(state.comments[i - 1].createdAt) }}</div>
                    <div class="operation">
                      <img
                          :src="likeIcon"
                          class="like-icon"
                          :class="{ 'liked': state.comments[i-1].isLiked }"
                          alt="like"
                          @click="handleLike(i-1)"
                      />
                      <span
                          :class="{ 'liked-count': state.comments[i-1].isLiked }"
                          style="font-size: 12px;color: white"
                      >{{ state.comments[i - 1].likeCount }}
										</span>
                      <div class="operator-line"></div>
                    </div>
                  </div>
                </div>
                <div class="line"></div>
              </div>
            </div>
            <pagination
                class="pagination"
                @current-change="currentChange"
                :total="state.total"
                :pageSize="state.pageSize"
                :currentPage="state.currentPage"
                :background="true"
                layout="prev, pager, next"
            />
          </div>
        </div>
        <div v-if="showDetail" class="song-info-container">
          <div class="song-info-row" v-if="state.song.title">
            <div class="song-info-label">歌曲:</div>
            <div class="song-info-value">{{ state.song.title }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.artist">
            <div class="song-info-label">艺人:</div>
            <div class="song-info-value">{{ state.song.artist }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.album">
            <div class="song-info-label">专辑:</div>
            <div class="song-info-value">{{ state.song.album }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.lyricist">
            <div class="song-info-label">作词:</div>
            <div class="song-info-value">{{ state.song.lyricist }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.composer">
            <div class="song-info-label">作曲:</div>
            <div class="song-info-value">{{ state.song.composer }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.language">
            <div class="song-info-label">歌曲语种:</div>
            <div class="song-info-value">{{ state.song.language }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.genre">
            <div class="song-info-label">歌曲流派:</div>
            <div class="song-info-value">{{ state.song.genre }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.recordCompany">
            <div class="song-info-label">唱片公司:</div>
            <div class="song-info-value">{{ state.song.recordCompany }}</div>
          </div>
          <div class="song-info-row" v-if="state.song.description">
            <div class="song-info-label">详细介绍:</div>
            <div class="song-info-value">{{ state.song.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.el-tab-pane),
:deep(.el-tabs__content),
:deep(.el-tabs) {
  height: 100%;
}
.comment-wrapper {
  min-height: 100%;
  width: 100%;
  background-attachment: fixed;
  position: relative;
  z-index: 1;
  transition: background-color ease 0.6s;
}
.comment {
  height: 100%;
  width: 100%;
  margin: 0;
  //position: fixed;
  //transform: translateY(100%);
  //background-color: @bgColor;
  .comment-box {
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex-flow: column;
    height: 50%;

    .info {
      display: flex;
      margin-bottom: 30px;

      .song-info {
        display: flex;
        flex-direction: column;
        font-size: 13px;

        .song-name {
          font-size: 30px;
          margin-bottom: 20px;
          color: white;
          //margin-top: 10px;
        }

        .singers {
          display: flex;
          align-items: center;

          .singer-info {
            display: flex;
            align-items: center;
            margin-right: 20px;
            color: white;
          }
        }
      }

      .bg-img {
        transition: 1s background;
        width: 130px;
        height: 130px;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        margin-right: 20px;
      }
    }

    .navigation {
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
      //background-color: rgba(0, 0, 0, 0.1);
      .nav-left {
        cursor: pointer;
        padding: 10px 10px;
        font-size: 16px;
        color: #fff;
        margin-right: 30px;
      }

      .nav-left:hover {
        color: #ddc323;
        cursor: pointer;
      }

      .nav-left.active {
        color: #ddc323;
        font-weight: bold;
        transition: color 0.2s ease;
      }

      .nav-right {
        cursor: pointer;
        padding: 10px 10px;
        font-size: 16px;
        color: #fff;
        margin-left: 30px;
      }

      .nav-right:hover {
        color: #ddc323;
        cursor: pointer;
      }

      .nav-right.active {
        color: #ddc323;
        font-weight: bold;
        transition: color 0.2s ease;
      }
    }

    .user-comment {
      margin-bottom: 20px;
      position: relative;

      textarea {
        width: 100%;
        height: 80px;
        padding: 10px;
        font-size: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background-color: rgba(0, 0, 0, 0.2);
        color: #fff;
        resize: none;
        outline: none;
        backdrop-filter: blur(10px);

        &:focus {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: none;
          background-color: rgba(0, 0, 0, 0.15);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .custom-button:focus,
      .custom-button.active,
      .custom-button:hover {
        cursor: pointer; /* 默认显示手型光标 */
        background-color: inherit !important; /* 保持背景色 */
        border-color: inherit !important; /* 保持边框色 */
        color: #ddc323 !important;
        box-shadow: none !important;
        transition: color 0.2s ease;
      }
    }

    .comment-content {
      :deep(.el-tabs__item) {
        margin-right: 30px;
      }

      .comment-content-box {
        height: 100%;
        margin-bottom: 150px;

        .title {
          color: white;
          display: flex;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .content {
          padding-right: 35px;

          .content-line {
            display: flex;
            align-items: center;
            position: relative;
            padding-bottom: 25px;
            width: 100%;
            padding-top: 25px;

            .line {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 1px;
              width: 100%;
              background-color: rgba(255, 255, 255, 0.08);
            }

            .photo {
              cursor: pointer;
              width: 40px;
              height: 40px;
              min-width: 40px;
              min-height: 40px;
              border-radius: 50%;
              background-color: #42b983;
              margin-right: 20px;
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }

            .right-box {
              display: flex;
              flex-direction: column;
              align-content: space-around;
              width: 100%;

              .comment-text {
                display: flex;
                font-size: 13px;
                margin-bottom: 6px;

                .name {
                  color: #0086b3;
                  cursor: pointer;
                  margin-right: 5px;
                }

                .text {
                  color: white;
                  text-align: left;
                  padding-right: 20px; /* 右侧留出一些空间，防止文字贴边 */
                }
              }

              .handle-box {
                display: flex;
                justify-content: space-between;

                .time {
                  color: white;
                  font-size: 13px;
                }

                .operation {
                  position: relative;
                  top: 4px;
                  display: flex;
                  align-items: center;
                  gap: 4px;

                  .like-icon {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;

                    &.liked {
                      filter: drop-shadow(0 0 2px #ddc323) drop-shadow(0 0 2px #ddc323);
                    }
                  }

                  .liked-count {
                    color: #ddc323 !important;
                    text-shadow: 0 0 2px #ddc323;
                    margin-left: 4px;
                  }

                  .operator-line {
                    width: 1.5px;
                    height: 15px;
                    background-color: rgba(255, 255, 255, 0.05);
                    margin: 0 10px;
                  }

                  .el-icon {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        :deep(.el-pagination) {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
        }

        :deep(.el-pagination .el-pager) {
          display: flex;
          flex-direction: row;
        }

        :deep(.el-pagination .el-pager li) {
          margin: 0 4px;
        }
      }
    }

    .song-info-container {
      :deep(.el-tabs__item) {
        margin-right: 30px;
      }

      margin-bottom: 150px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);


      .song-info-row {
        color: white;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;


        .song-info-label {
          font-weight: bold;
          width: 80px; /* 固定标签宽度 */
          flex-shrink: 0; /* 防止标签被压缩 */
          text-align: left;
          margin-right: 100px;
        }

        .song-info-value {
          flex: 1; /* 让内容区域占据剩余空间 */
          text-align: left;
          word-wrap: break-word; /* 允许长文本换行 */
          word-break: break-all; /* 在任意字符间换行 */
          padding-right: 20px; /* 右侧留出一些空间，防止文字贴边 */
          max-width: calc(100% - 120px); /* 确保不会超出容器宽度 */
        }
      }
    }
  }
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  .sort-options {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 35px;

    span {
      color: #999;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #ddc323;
      }

      &.active {
        color: #ddc323;
        font-weight: bold;
      }
    }

    .divider {
      width: 1px;
      height: 12px;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>