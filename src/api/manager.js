import { axios } from '../utils/request';
import { MANAGER_MODULE } from './_prefix';


/*
    // TODO - modified
    song_name: string
    album?: string
    artist: string
    + description: string
    audio_path: string
    + cover_path: string
    lyrics_path?: string
    upload_time: datetime
 */
export const addSong = (songInfo) => {
    return axios.post(`${MANAGER_MODULE}/addSong`, songInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}
