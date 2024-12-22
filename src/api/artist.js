import {axios} from '../utils/request';
import {ARTIST_MODULE} from './_prefix';

export const getArtistInfo = (artistName) => {
    const encodedName = encodeURIComponent(artistName);
    return axios.get(`${ARTIST_MODULE}/search/${encodedName}`)
        .then(res => res);
};

export const getSongsByArtist = (artistName) => {
    const encodedName = encodeURIComponent(artistName);
    return axios.get(`${ARTIST_MODULE}/songs/${encodedName}`)
        .then(res => res);
}; 