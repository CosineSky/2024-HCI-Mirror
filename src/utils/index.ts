// 切换图片过渡 (防止图片闪烁
export function toggleImg(src: string, size?: string): Promise<HTMLImageElement> {
    if (!src) {
        return Promise.reject(`toggleImg：传递的src为空: ${src}`)
    }
    const img = new Image()
    img.src = size ? src + `?param=${size}` : src
    img.crossOrigin = 'Anonymous'
    img.width = document.body.clientWidth
    img.height = document.body.clientHeight

    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`)
        }
    })
}