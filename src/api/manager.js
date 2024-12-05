import { axios } from '../utils/request';
import { MANAGER_MODULE } from './_prefix';


/*
    song_name: string
    audio_path: string
    lyrics_path?: string
    album?: string
    artist: string
    upload_time: datetime
 */
export const addSong = (songInfo) => {
    return axios.post(`${MANAGER_MODULE}/login`, songInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
