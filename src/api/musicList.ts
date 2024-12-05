export interface GetMusicDetailData {
    song: {
        id: number
        name: number
        picUrl: string
    }
    singer: {
        id: number
        name: string
    }[]
}