import { axios } from '../utils/request';
import {SHARE_MODULE} from './_prefix';


/*
    owner_name: string
    playlist_name: string
 */
export const sharePlaylist = (playlistInfo) => {
    return axios.post(`${SHARE_MODULE}/playlist`, playlistInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
