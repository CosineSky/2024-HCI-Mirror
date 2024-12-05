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
