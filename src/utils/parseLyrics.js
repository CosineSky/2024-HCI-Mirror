export function parseLrc(lrcContent) {
    // 定义正则表达式来匹配时间戳和歌词
    const regex = /\[(\d{2}):(\d{2}\.\d{3})\](.*)/;
    const lyrics = [];

    // 按行分割 LRC 内容
    const lines = lrcContent.split('\n');

    lines.forEach(line => {
        // 匹配每行的时间戳和歌词
        const match = line.match(regex);
        if (match) {
            // 提取分钟、秒和歌词文本
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const text = match[3].trim();

            // 计算总时间（秒）
            const timeInSeconds = minutes * 60 + seconds;

            // 将解析结果推送到 lyrics 数组
            lyrics.push({ time: timeInSeconds, text });
        }
    });

    return lyrics;
}
