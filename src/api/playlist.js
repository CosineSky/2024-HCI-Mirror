import { axios } from '../utils/request';
import { PLAYLIST_MODULE } from './_prefix';


/*
    // TODO - modified
    - user_name: string
    + user_id: number
 */
export const getPlaylistsByUser = (userInfo) => {
    console.log(userInfo)
    return axios.get(`${PLAYLIST_MODULE}/fetch`, { params: userInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    - user_name: string
    - playlist_name: string
    + user_id: number
    - playlist_description: string
 */
export const createPlaylist = (playlistCreateInfo) => {
    console.log(playlistCreateInfo)
    return axios.post(`${PLAYLIST_MODULE}/create`, null,
        { params: playlistCreateInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    + id: number
    + title: string
    + description: string
    + picPath: string
 */
export const modifyPlaylist = (playlistModifyInfo) => {
    console.log(playlistModifyInfo)
    return axios.post(`${PLAYLIST_MODULE}/modify`, playlistModifyInfo,
        {headers: {'Content-Type': 'application/json'}})
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

/*
    // TODO - newly added
    - playlist_id: number
 */
export const removePlaylist = (removePlaylistInfo) => {
    console.log(removePlaylistInfo)
    return axios.post(`${PLAYLIST_MODULE}/delete`, null,
        { params: removePlaylistInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    - playlist_id: number
    - song_id: number
 */
export const removeSongFromPlaylist = (removeSongFromPlaylistInfo) => {
    console.log(removeSongFromPlaylistInfo)
    return axios.post(`${PLAYLIST_MODULE}/removeSong`, null,
        { params: removeSongFromPlaylistInfo })
        .then(res => {
            return res;
        });
}