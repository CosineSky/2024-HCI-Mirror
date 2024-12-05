import { axios } from '../utils/request';
import { USER_MODULE } from './_prefix';

export const userLogin = (loginInfo) => {
    return axios.post(`${USER_MODULE}/login`, null, { params: loginInfo })
        .then(res => {
            return res;
        });
}

export const userRegister = (registerInfo) => {
    return axios.post(`${USER_MODULE}/register`, registerInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

export const userInfo = () => {
    return axios.get(`${USER_MODULE}`)
        .then(res => {
            return res;
        });
}

export const userUpdate = (updateInfo) => {
    return axios.post(`${USER_MODULE}/update`, updateInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

export const getUserById = (userId) => {
    return axios.get(`${USER_MODULE}/getUser`, {params: userId})
        .then(res => {
            return res
        });
}
