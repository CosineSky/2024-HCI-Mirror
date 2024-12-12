import { axios } from '../utils/request';
import { SEARCH_MODULE } from './_prefix';

/*
    // TODO - newly added 这个函数要求从后端获得两个list，一个是歌曲，一个是歌单
    + keyword: string
 */
export const searchByKeyword = (searchInfo) => {
    return axios.get(`${SEARCH_MODULE}/fetch`, { params: searchInfo })
        .then(res => {
            return res;
        });
}

/*
以下是search函数获得数据的详情
searchResult.value = {
    "songs": [
      {
        "id": 1,
        "title": "Song 1",
        "artist": "Artist 1",
        "album": "Album 1",
        "picPath": "/songs/1"
      },
      {
        "id": 2,
        "title": "Song 2",
        "artist": "Artist 2",
        "album": "Album 2",
        "picPath": "/songs/2"
      }
    ],
    "playlists": [
      {
        "id": 1,
        "title": "Playlist 1",
        "username": "user 1",
        "picPath": "/songs/1"
      },
      {
        "id": 2,
        "title": "Playlist 2",
        "username": "user 2",
        "picPath": "/songs/2"
      }
    ]
  };
 */