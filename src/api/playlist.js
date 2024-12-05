import { axios } from '../utils/request';
import { PLAYLIST_MODULE } from './_prefix';


/*
    // TODO - modified
    - user_name: string
    + user_id: number
 */
export const getPlaylistsByUser = (userInfo) => {
    return axios.get(`${PLAYLIST_MODULE}/fetch`, { params: userInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    - user_name: string
    playlist_name: string
    + user_id: number
    + playlist_description: string
 */
export const createPlaylist = (playlistCreateInfo) => {
    return axios.post(`${PLAYLIST_MODULE}/create`, playlistCreateInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    - user_name: string
    - playlist_name: string
    - song_name: string
    + user_id: number
    + playlist_id: number
    + song_id: number
 */
export const addSongToPlaylist = (songInfo) => {
    return axios.post(`${PLAYLIST_MODULE}/addSong`, songInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
