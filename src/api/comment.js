import { axios } from '../utils/request';
import { COMMENT_MODULE } from './_prefix';


/*
    commenter_user_name: string
    comment: string
    song_name: string
 */
export const commentSong = (commentSongInfo) => {
    return axios.post(`${COMMENT_MODULE}/song`, null, { params: commentSongInfo })
        .then(res => {
            return res;
        });
}

/*
    commenter_user_name: string
    comment: string
    playlist_owner_name: string
    playlist_name: string
 */
export const commentPlaylist = (commentPlaylistInfo) => {
    return axios.post(`${COMMENT_MODULE}/playlist`, commentPlaylistInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
