import {computed, ref} from "vue";
import ColorThief from "colorthief";


const backgroundColor = ref("#ffffff");

function getDominantColor(imageSrc, callback, alpha = 0.2) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        if (dominantColor) {
            let [r, g, b] = dominantColor;
            const whiteR = 255, whiteG = 255, whiteB = 255;
            r = Math.floor(r + alpha * (whiteR - r));
            g = Math.floor(g + alpha * (whiteG - g));
            b = Math.floor(b + alpha * (whiteB - b));
            callback(`rgb(${r}, ${g}, ${b})`);
        } else {
            console.error("Failed to extract dominant color.");
            callback("rgb(200, 200, 200)");
        }
    };
}

function updateBackground (event) {
    const imageSrc = event.target.src;
    getDominantColor(imageSrc, (color) => {
        backgroundColor.value = color;
    });
}


export  {updateBackground,backgroundColor}




