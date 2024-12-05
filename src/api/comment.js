import { axios } from '../utils/request';
import { COMMENT_MODULE } from './_prefix';


/*
    // TODO - modified
    - commenter_user_name: string
    - song_name: string
    comment: string
    + commenter_user_id: number
    + song_id: number
 */
export const commentSong = (commentSongInfo) => {
    return axios.post(`${COMMENT_MODULE}/song`, commentSongInfo,
        { headers: { 'Content-Type': 'application/json' } })
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
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
