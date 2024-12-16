import {axios} from "@/utils/request";
import {PLAYLIST_MODULE, RESOLVE_MODULE, SONG_MODULE, USER_MODULE} from "@/api/_prefix";

/*
    // TODO: newly added
    + user_id: number
 */
export const getUserById = (userId) => {
    console.log(userId)
    return axios.get(`${USER_MODULE}/id`, { params: userId })
        .then(res => {
            return res;
        });
}

/*
    // TODO: newly added
    + song_id: number
 */
export const getSongById = (songId) => {
    console.log(songId)
    return axios.get(`${SONG_MODULE}/id`, { params: songId })
        .then(res => {
            return res;
        });
}

/*
    // TODO: newly added
    + playlist_id: number
 */
export const getPlaylistById = (playlistId) => {
    console.log(playlistId)
    return axios.get(`${PLAYLIST_MODULE}/id`, { params: playlistId })
        .then(res => {
            return res;
        });
}