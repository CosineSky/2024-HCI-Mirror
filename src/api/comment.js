import { axios } from '../utils/request';
import { COMMENT_MODULE } from './_prefix';
/*
    songId: number
    comment: string
    userId: number
 */
export const commentSong = (commentSongInfo) => {
    return axios.post(`${COMMENT_MODULE}/song`, commentSongInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    playlistId: number
    comment: string
    userId: number
 */
export const commentPlaylist = (commentPlaylistInfo) => {
    return axios.post(`${COMMENT_MODULE}/playlist`, commentPlaylistInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    songId: number
    page: number
 */
export const commentInfo = (commentInfo) => {
    console.log(commentInfo)
    return axios.get(`${COMMENT_MODULE}/${commentInfo.songId}`)
        .then((res) => {
            return res
        })
}

