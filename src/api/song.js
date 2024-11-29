import { axios } from '../utils/request';
import { SONG_MODULE } from './_prefix';


/*
    playlist_name: string
    user_name: string
 */
export const getSongsByPlaylist = (playlistInfo) => {
    return axios.get(`${SONG_MODULE}/fetch`, { params: playlistInfo })
        .then(res => {
            return res;
        });
}
