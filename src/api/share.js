import { axios } from '../utils/request';
import {SHARE_MODULE} from './_prefix';


/*
    // TODO - modified
    - owner_name: string
    - playlist_name: string
    + playlist_id: number
 */
export const sharePlaylist = (playlistInfo) => {
    return axios.post(`${SHARE_MODULE}/playlist`, playlistInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    + song_id: number
 */
export const shareSong = (songInfo) => {
    return axios.post(`${SHARE_MODULE}/song`, songInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}