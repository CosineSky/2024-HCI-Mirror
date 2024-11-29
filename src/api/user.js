import { axios } from '../utils/request';
import { USER_MODULE } from './_prefix';


/*
    email: string
    password: string
 */
export const userLogin = (loginInfo) => {
    return axios.post(`${USER_MODULE}/login`, loginInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    user_name: string
    email: string
    password: string
 */
export const userRegister = (registerInfo) => {
    return axios.post(`${USER_MODULE}/register`, registerInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    None
 */
export const userInfo = () => {
    return axios.get(`${USER_MODULE}`)
        .then(res => {
            return res;
        });
}
