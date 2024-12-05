/**
 * 切换图片过渡 (防止图片闪烁)
 * @param {string} src - 图片源地址
 * @param {string} [size] - 可选的图片尺寸参数
 * @returns {Promise<HTMLImageElement>}
 */
export function toggleImg(src, size) {
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