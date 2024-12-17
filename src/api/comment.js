import {axios} from '../utils/request';
import {COMMENT_MODULE} from './_prefix';

/*
    // TODO - newly added
    + song_id: number
 */
export const getSongComments = (commentInfo) => {
    console.log(commentInfo)
    return axios.get(`${COMMENT_MODULE}/querySong/${commentInfo.song_id}`, {
        params: {
            page: commentInfo.page,
            pageSize: commentInfo.pageSize,
            sort: commentInfo.sort
        }
    })
        .then((res) => {
            return res
        })
}

/*
    // TODO - newly added
    + playlist_id: number
 */
export const getPlaylistComments = (commentInfo) => {
    console.log(commentInfo)
    return axios.get(`${COMMENT_MODULE}/queryPlaylist/${commentInfo.playlist_id}`)
        .then((res) => {
            return res
        })
}

/*
    song_id: number
 */
export const getSongCommentsCount = (commentInfo) => {
    console.log(commentInfo)
    return axios.get(`${COMMENT_MODULE}/countSong/${commentInfo.song_id}`)
        .then((res) => {
            return res
        })
}
/*
    // TODO - modified
    - commenter_user_name: string
    - song_name: string
    comment: string
    + commenter_user_id: number
    + song_id: number
 */
export const commentSong = (commentSongInfo) => {
    console.log(commentSongInfo)
    return axios.post(`${COMMENT_MODULE}/song`, commentSongInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    - commenter_user_name: string
    - playlist_owner_name: string
    - playlist_name: string
    comment: string
    + commenter_user_id: number
    + playlist_id: number
 */
export const commentPlaylist = (commentPlaylistInfo) => {
    return axios.post(`${COMMENT_MODULE}/playlist`, commentPlaylistInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        });
}

// 添加点赞评论的方法
export const likeComment = (likeInfo) => {
    return axios.post(`${COMMENT_MODULE}/like`, {
        userId: likeInfo.userId,
        commentId: likeInfo.commentId,
        isLike: likeInfo.isLike
    }, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        });
}
