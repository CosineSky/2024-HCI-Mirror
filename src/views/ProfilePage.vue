<script setup>
import {useTheme} from "../store/theme";
import {onMounted, ref} from "vue";
const theme = useTheme()

onMounted(() => {
	theme.reset();
})


// 假设 albums 是从后端获取的用户最近播放的专辑封面 URL 列表
const albums = ref([
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
	{ coverUrl: "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg" },
]);

// 获取随机位置的样式
const getRandomPositionStyle = (index) => {
	let xl = [100, 100, 100, 1300, 1300, 1300];
	let yl = [50, 300, 550, 100, 350, 575]
	let x = xl[index] + (Math.random() * 100 - 50);
	let y = yl[index] + (Math.random() * 50 - 25);
	
	const rotation = Math.random() * 360; // 随机旋转角度
	
	return {
		left: `${x}px`,
		top: `${y}px`,
		transform: `rotate(${rotation}deg)`,
	};
};

// 可以在这里添加动态效果，定期更新封面位置
onMounted(() => {
	// 可使用定时器不断更新专辑封面的位置
	setInterval(() => {
		albums.value = albums.value.map((album) => ({
			...album,
			coverUrl: album.coverUrl, // 更新封面 URL 或其他内容
		}));
	}, 2000); // 每 2 秒更新位置
});

</script>

<template>
	<body>
		<video autoplay muted loop id="video-background">
			<source src="../assets/videos/2.mp4" type="video/mp4">
			Your browser does not support the video tag.
		</video>
		<div class="content-profile-page">
			<div class="profile-user-page card">
				<div class="img-user-profile">
					<img class="profile-bgHome" src="../assets/pictures/bg2.jpg" alt=""/>
					<img class="avatar" src="../assets/pictures/avatar.png" alt=""/>
				</div>
				<div class="user-profile-data">
					<h1>CosSky</h1>
					<p>www.github.com/cosinesky</p>
				</div>
				<div class="description-profile">Country | Rock | Jazz</div>
				<ul class="data-user">
					<li><a><strong>11</strong><span>Posts</span></a></li>
					<li><a><strong>45</strong><span>Followers</span></a></li>
					<li><a><strong>14</strong><span>Following</span></a></li>
				</ul>
			</div>
		</div>
<!--		<div class="album-container">-->
<!--			<img-->
<!--				v-for="(album, index) in albums"-->
<!--				:key="index"-->
<!--				:src="album.coverUrl"-->
<!--				class="album-cover"-->
<!--				:style="getRandomPositionStyle(index)"-->
<!--			    alt=""-->
<!--			/>-->
<!--		</div>-->
	</body>
</template>

<style scoped>
body {
	font-family: "Open sans", sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-image: url("../assets/videos/2.mp4");
	background-repeat: no-repeat;
	background-size: cover;
}

#video-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover; /* 确保视频填充整个视口 */
	z-index: -1; /* 将视频置于内容后面 */
}

a {
	text-decoration: none;
	color: #3498db;
}
.content-profile-page {
	margin: 1em auto;
	width: 44.23em;
}

.card {
	background: #fff;
	border-radius: 0.3rem;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	border: .1em solid rgba(0, 0, 0, 0.2);
	margin-bottom: 1em;
}

.profile-user-page .img-user-profile {
	margin: 0 auto;
	text-align: center;
}
.profile-user-page .img-user-profile .profile-bgHome {
	border-bottom: .2em solid #f5f5f5;
	width: 44.23em;
	height: 16em;
}
.profile-user-page .img-user-profile .avatar {
	margin: 0 auto;
	background: #fff;
	width: 7em;
	height: 7em;
	padding: 0.25em;
	border-radius: .4em;
	margin-top: -10em;
	box-shadow: 0 0 .1em rgba(0, 0, 0, 0.35);
}
.profile-user-page button {
	position: absolute;
	font-size: 13px;
	font-weight: bold;
	cursor: pointer;
	width: 7em;
	background: #3498db;
	border: 1px solid #2487c9;
	color: #fff;
	outline: none;
	border-radius: 0 .6em .6em 0;
	padding: .80em;
}

.profile-user-page button:hover {
	background: #51a7e0;
	transition: background .2s ease-in-out;
	border: 1px solid #2487c9;
}
.profile-user-page .user-profile-data, .profile-user-page .description-profile {
	text-align: center;
	padding: 0 1.5em;
}
.profile-user-page .user-profile-data h1 {
	font-family: "Lato", sans-serif;
	margin-top: 0.35em;
	color: #292f33;
	margin-bottom: 0;
}
.profile-user-page .user-profile-data p {
	font-family: "Lato", sans-serif;
	color: #8899a6;
	font-size: 1.1em;
	margin-top: 0;
	margin-bottom: 0.5em;
}
.profile-user-page .description-profile {
	color: #75787b;
	font-size: 0.98em;
}
.profile-user-page .data-user {
	font-family: "Quicksand", sans-serif;
	margin-bottom: 0;
	cursor: pointer;
	padding: 0;
	list-style: none;
	display: table;
	width: 100.15%;
}
.profile-user-page .data-user li {
	margin: 0;
	padding: 0;
	width: 33.33334%;
	display: table-cell;
	text-align: center;
	border-left: 0.1em solid transparent;
}
.profile-user-page .data-user li:first-child {
	border-left: 0;
}
.profile-user-page .data-user li:first-child a {
	border-bottom-left-radius: 0.3rem;
}
.profile-user-page .data-user li:last-child a {
	border-bottom-right-radius: 0.3rem;
}
.profile-user-page .data-user li a, .profile-user-page .data-user li strong {
	display: block;
}
.profile-user-page .data-user li a {
	background-color: #f7f7f7;
	border-top: 1px solid rgba(242,242,242,0.5);
	border-bottom: .2em solid #f7f7f7;
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.4),0 1px 1px rgba(255,255,255,0.4);
	padding: .93em 0;
	color: #46494c;
}
.profile-user-page .data-user li a strong, .profile-user-page .data-user li a span {
	font-weight: 600;
	line-height: 1;
}
.profile-user-page .data-user li a strong {
	font-size: 2em;
}
.profile-user-page .data-user li a span {
	color: #717a7e;
}
.profile-user-page .data-user li a:hover {
	background: rgba(0, 0, 0, 0.05);
	border-bottom: .2em solid #3498db;
	color: #3498db;
}
.profile-user-page .data-user li a:hover span {
	color: #3498db;
}

footer h4 {
	display: block;
	text-align: center;
	clear: both;
	font-family: "Coda", sans-serif;
	color: #566965;
	line-height: 6;
	font-size: 1em;
}
footer h4 a {
	text-decoration: none;
	color: #3498db;
}

.album-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.album-cover {
	z-index: -1;
	position: absolute;
	width: 180px;
	height: 180px;
	border-radius: 50%;
	object-fit: cover;
	transition: transform 0.5s ease-in-out; /* 动画效果 */
	pointer-events: auto; /* 确保封面图可以响应用户交互 */
	border: 2px solid white; /* 添加白色边框 */
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 可选，增加阴影效果，让封面更加突出 */
}
</style>