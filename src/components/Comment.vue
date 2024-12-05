<script setup lang="ts">
import {reactive, ref, onMounted, watch, nextTick} from 'vue'
import {GetMusicDetailData} from '../api/musicList.ts'
import {useRoute, useRouter} from 'vue-router'
import {toggleImg} from '../utils/index.ts'
import {commentInfo, commentPost} from "../api/comment.ts"
import {getUserById} from "../api/user"
import {ElMessage} from "element-plus";

interface State {
  comments: any[]
  commenters: any[]
  song: GetMusicDetailData | null
  total: number
  pageSize: number
  currentPage: number
}

const state = reactive<State>({
  comments: [],
  commenters: [],
  song: null,
  total: 0,
  pageSize: 20,
  currentPage: 1
})
const router = useRouter()
const route = useRoute();
const songId = route.params.songId.toString()
const userId = route.params.userId.toString()
const page = ref(1)
const imgEl = ref<HTMLDivElement>()
const bg = ref<string>('')
const comment = ref<string>('')
let showComment = ref<boolean>(true)
let showDetail = ref<boolean>(false)

onMounted(() => {
  watch(bg, (val) => {
    toggleImg(val).then((img) => {
      imgEl.value!.style.backgroundImage = `url(${img.src})`
    })
  })
})

const getCommentMusicFn = async (id: number, page: number) => {
  commentInfo({
    songId: id,
    page: page
  }).then(res => {
    state.comments = res.data.result;
    for (let i = 0; i < state.comments.length; i++) {
      getUserById({
        userId: state.comments[i].userId
      }).then(res => {
        state.commenters.push(res.data.result)
      })
    }
  })
}
const currentChange = (page: number) => {
  state.currentPage = page
  getCommentMusicFn(parseInt(songId), page)
}

const gotoUserDetail = (userId: number) => {
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
  commentPost({
    userId: parseInt(userId),
    songId: parseInt(songId),
    comment: comment.value,
  }).then(() => {
    ElMessage.success("评价成功！")
    location.reload()
  })
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
</script>

<template>
  <div class="comment">
    <div v-if="state.song !== null" class="comment-box">
      <div class="info">
        <div ref="imgEl" class="bg-img"></div>
        <div class="song-info">
          <div class="song-name">{{ (state.song as GetMusicDetailData).song.name }}</div>
          <div class="singers">
            <div class="singer-info">
              <span v-for="(item, index) in state.song.singer"
              >歌手:
                {{
                  item.name + (index < (state.song as GetMusicDetailData).singer.length - 1 ? '/' : '')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="navigation">
        <div class="nav-left active" @click="showComments">评论{{ state.total }}</div>
        <div class="nav-right" @click="showDetails">详情</div>
      </div>
      <div v-if="showComment" class="user-comment">
        <textarea placeholder="请输入您的评论..." @input="adjustHeight"></textarea>
        <el-button
            class="custom-button"
            text
            style="color: white; font-size: 20px; position: absolute; bottom: 5px; right: 2%"
        >
          发布
        </el-button>
      </div>
      <div v-if="showComment" class="comment-content">
        <div class="comment-content-box">
          <div class="title">精彩评论</div>
          <div class="content" @wheel.stop>
            <div v-for="i in state.comments.length" class="content-line">
              <div
                  @click="gotoUserDetail(state.commenters[i - 1].userId)"
                  :style="{ backgroundImage: `url(${state.commenters[i - 1].avatarUrl})` }"
                  class="photo"
              ></div>
              <div class="right-box">
                <div class="comment-text">
                  <div @click="gotoUserDetail(state.comments[i - 1].userId)" class="name">
                    {{ state.commenters[i - 1].username }}:
                  </div>
                  <div class="text">{{ state.comments[i - 1].comment }}</div>
                </div>
                <div class="handle-box">
                  <div class="time">{{ state.comments[i - 1].createTime }}</div>
                  <div class="operation">
                    <el-icon>
                      <Star/>
                    </el-icon>
                    <span v-if="state.comments[i-1].likedCount > 0"
                          style="font-size: 12px">{{ state.comments[i - 1].likedCount }}</span>
                    <div class="operator-line"></div>
                  </div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <pagination
              @current-change="currentChange"
              :total="state.total"
              :pageSize="state.pageSize"
              :currentPage="state.currentPage"
          />
        </div>
      </div>
      <div v-if="showDetail" class="song-info-container">
        <div class="song-info-row">
          <div class="song-info-label">演唱者:</div>
          <div class="song-info-value">林俊杰</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">作词:</div>
          <div class="song-info-value">林可邦</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">作曲:</div>
          <div class="song-info-value">蔡健雅</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">编曲:</div>
          <div class="song-info-value">林俊杰 JJ Lin</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">歌曲语种:</div>
          <div class="song-info-value">国语</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">歌曲流派:</div>
          <div class="song-info-value">Pop</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">原唱:</div>
          <div class="song-info-value">达尔文 - 蔡健雅</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">唱片公司:</div>
          <div class="song-info-value">就是俊杰音乐股份有限公司</div>
        </div>
        <div class="song-info-row">
          <div class="song-info-label">简介:</div>
          <div class="song-info-value">
            《达尔文》是林俊杰的一首经典之作，以进化论之父Charles
            Darwin为名，寓意生命的进化与演变。这首歌不仅旋律悠扬，更在歌词中蕴含了深刻的哲理，引人深思。当林俊杰的歌声响起，仿佛带领我们穿越时空，见证生命从简单到复杂的蜕变过程。每一个音符都如同自然的密码，诠释着生命的奥秘。用心聆听，你会发现，这首歌不仅仅是一首歌，更是一部关于生命进化的壮丽史诗。
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

.comment {
  height: 100%;
  width: 100%;
  //position: fixed;
  //transform: translateY(100%);
  //background-color: @bgColor;
  .comment-box {
    padding: 0 0 0 35px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex-flow: column;
    height: 100%;

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
          //margin-top: 10px;
        }

        .singers {
          display: flex;
          align-items: center;

          .singer-info {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }
        }
      }

      .bg-img {
        transition: 1s background;
        width: 130px;
        height: 130px;
        border-radius: 10px;
        .bgSetting();
        margin-right: 20px;
      }
    }

    .navigation {
      display: flex;
      justify-content: flex-start;
      padding: 10px 0;
      margin-bottom: 30px;
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
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        resize: none;
      }

      .custom-button:focus,
      .custom-button.active,
      .custom-button:hover {
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
              .bgSetting();
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
                }
              }

              .handle-box {
                display: flex;
                justify-content: space-between;

                .time {
                  font-size: 13px;
                }

                .operation {
                  position: relative;
                  top: 4px;
                  display: flex;
                  align-items: center;

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
    }

    .song-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .song-info-label {
      font-weight: bold;
      width: 20%;
    }

    .song-info-value {
      width: 80%;
    }
  }
}
</style>