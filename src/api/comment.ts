import {axios} from "../utils/request";
const COMMENT_MODULE = `/api/comment`
type CommentInfo = {
    songId: number,
    page: number,
};

type CommentPostInfo = {
    userId: number,
    songId: number,
    comment: string,
};

export const commentInfo = (commentInfo: CommentInfo) => {
    console.log(commentInfo)
    return axios.get(`${COMMENT_MODULE}/${commentInfo.songId}`)
        .then((res: any) => {
            return res
        })
}

export const commentPost = (commentPostInfo: CommentPostInfo) => {
    console.log(commentPostInfo)
    return axios.post(`${COMMENT_MODULE}/${commentPostInfo.songId}/comment`, commentPostInfo, {})
        .then((res: any) => {
            return res
        })
}