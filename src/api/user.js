import { axios } from '../utils/request';
import { USER_MODULE } from './_prefix';

/*
    phone: string,
    password: string
 */
export const userLogin = (loginInfo) => {
    return axios.post(`${USER_MODULE}/login`, null, {params: loginInfo})
        .then((res) => {
            return res
        })
}

/*
    name: string,
    phone: string,
    password: string,
    captcha: string
 */
export const userRegister = (registerInfo) => {
    return axios.post(`${USER_MODULE}/register?`, null, {params: registerInfo})
        .then((res) => {
            return res
        })
}

/*
    phone: string
 */
export const userSendCaptcha = (captchaInfo) => {
    console.log(captchaInfo.phone)
    return axios.post(`${USER_MODULE}/send`, null, {
        params: {
            phone: captchaInfo.phone
        }
    })
        .then((res) => {
            return res
        })
}

/*
    phone?: string,
    password?: string,
    captcha?: string,
 */
export const userReset = (resetInfo) => {
    console.log(resetInfo)
    return axios.post(`${USER_MODULE}/reset`, resetInfo, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
            return res
        })
}

/*
    phone:string
 */
export const getUserByPhone = (phone) => {
    return axios.get(`${USER_MODULE}/getUserByPhone`, {params: phone})
        .then((res) => {
            return res
        })
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

export const userFollowArtist = (followArtistInfo) => {
    console.log(followArtistInfo)
    return axios.post(`${USER_MODULE}/followArtist`,null,{
        params:{
            userId: followArtistInfo.user_id,
            artistId: followArtistInfo.artist_id,
            isFollowed: followArtistInfo.isFollowed
        }
    })
        .then(res => {
            return res;
        });
}
