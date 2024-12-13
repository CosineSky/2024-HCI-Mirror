import { axios } from '../utils/request';
import { SEARCH_MODULE } from './_prefix';

/*
    // TODO - newly added
    + keyword: string
 */
export const searchSongByKeyword = (searchInfo) => {
    return axios.get(`${SEARCH_MODULE}/song`, { params: searchInfo })
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    + keyword: string
 */
export const searchPlaylistByKeyword = (searchInfo) => {
    return axios.get(`${SEARCH_MODULE}/playlist`, { params: searchInfo })
        .then(res => {
            return res;
        });
}
