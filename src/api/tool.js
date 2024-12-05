import {axios} from '../utils/request'
import {API_MODULE} from './_prefix'

/*
    // TODO - newly added
    + user_id: number
 */
export const uploadImage = (payload) => {
    return axios.post(`${API_MODULE}/images`, payload, {
        headers:{'Content-Type': "multipart/form-data;"}
    }).then(res => {
        return res
    })
}
