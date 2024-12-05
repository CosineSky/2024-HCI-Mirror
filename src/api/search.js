import { axios } from '../utils/request';
import { SEARCH_MODULE } from './_prefix';

/*
    // TODO - newly added
    + keyword: string
 */
export const searchByKeyword = (searchInfo) => {
    return axios.get(`${SEARCH_MODULE}/fetch`, { params: searchInfo })
        .then(res => {
            return res;
        });
}
