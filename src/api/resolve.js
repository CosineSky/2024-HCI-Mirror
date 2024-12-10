import {axios} from "@/utils/request";
import {RESOLVE_MODULE} from "@/api/_prefix";

/*
    // TODO: newly added
    + user_id: number
 */
export const getUserById = (userId) => {
    console.log(userId)
    return axios.post(`${RESOLVE_MODULE}/user`, userId,
        { headers: { 'Content-Type': 'application/json' } })
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
    return axios.post(`${RESOLVE_MODULE}/song`, songId,
        { headers: { 'Content-Type': 'application/json' } })
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
    return axios.post(`${RESOLVE_MODULE}/playlist`, playlistId,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}