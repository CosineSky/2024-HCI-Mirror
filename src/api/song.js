import { axios } from '../utils/request';
import { SONG_MODULE } from './_prefix';


/*
    // TODO - modified
    - playlist_name: string
    - user_name: string
    + playlist_id: number
 */
export const getSongsByPlaylist = (playlistInfo) => {
    return axios.get(`${SONG_MODULE}/fetch`, { params: playlistInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    - song_id: number
    - playlist_id: number
 */
export const removeSongFromPlaylist = (removeSongInfo) => {
    return axios.post(`${SONG_MODULE}/remove`, removeSongInfo,
        { headers: { 'Content-Type': 'application/json' } })
      .then(res => {
            return res;
        });
}