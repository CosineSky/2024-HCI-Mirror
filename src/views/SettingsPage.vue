<script setup>

</script>

<template>
	<body>
		<section>
			<div class="mobile-viewport">
				<div class="text-area">

					<h1>SETTINGS</h1>

					<div class="setting">
						<h3>Setting 1</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum error, eum exercitationem explicabo facere iste maiores minus nihil possimus sunt. Eum ex harum hic non placeat possimus quod velit? Temporibus!</p>
						<label class="switch">
							<input type="checkbox">
							<div class="slider"></div>
						</label>
					</div>

					<div class="setting">
						<h3>Setting 2</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi deserunt earum eligendi ex incidunt, ipsam nostrum perspiciatis provident quae quia quod sed vel. Aliquid illum quisquam quo reiciendis rerum vel?</p>
						<label class="switch">
							<input type="checkbox">
							<div class="slider"></div>
						</label>
					</div>

					<div class="setting">
						<h3>Setting 3</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto blanditiis consectetur eligendi et exercitationem id ipsa iste laborum molestiae odit placeat porro, possimus, quod ratione, rerum unde ut! Rem?</p>
						<label class="switch">
							<input type="checkbox">
							<div class="slider"></div>
						</label>
					</div>

					<div class="setting">
						<h3>Volume</h3>
						<input type="range" name="quantity" min="1" max="100">
					</div>
				</div>

			</div>
		</section>
	</body>
</template>

<style scoped>
body {
	font-family: "Open sans", sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-image: url("../assets/pictures/bg4.jpg");
	background-repeat: no-repeat;
	background-size: cover;
}

*{
	box-sizing: border-box;
	font-family: $font-stack;
}

section{
	 width: 1000px;
	 height: 600px;
	 background-color: transparent;
	 position: relative;
}

.mobile-viewport{
	position:absolute;
	top:0;
	bottom:0;
	left:0;
	right:0;
	margin:auto;
	background-color:#41414C;
	width:1000px;
	height:600px;
	max-width:100%;
	max-height:100%;
	-webkit-box-shadow: 0 16px 109px -1px rgba(0,0,0,0.63);
	-moz-box-shadow: 0 16px 109px -1px rgba(0,0,0,0.63);
	box-shadow: 0 16px 109px -1px rgba(0,0,0,0.63);
}

.text-area{
	padding:20px;
	color:white;
	h3{
		text-transform:uppercase;
		font-size:.9em;
		letter-spacing:.2em;
		font-weight:300;
	}
	p{
		font-size:.7em;
		width:75%;
		line-height:2em;
	}
}


.setting{
	position:relative;
	padding-bottom:20px;
}

.switch {
	position: absolute;
	right:10px;
	top:35px;
	display: inline-block;
	width: 60px;
	height: 20px;
}

.switch input {display:none;}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: .4s;
	transition: .4s;
}

.slider:before {
	position: absolute;
	content: "";
	height: 12px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: .4s;
	transition: .4s;
}

input:checked + .slider {
	background-color: #D89000;
}

input:focus + .slider {
	box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(26px);
}

input[type="range"]{
	width:100%;
}

input[type=range] {
	/*removes default webkit styles*/
	-webkit-appearance: none;

	/*fix for FF unable to apply focus style bug */
	border: 1px solid white;

	/*required for proper track sizing in FF*/
	width:100%;
}
input[type=range]::-webkit-slider-runnable-track {
	height: 5px;
	background: #ddd;
	border: none;
	border-radius: 3px;
}
input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: none;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #D89000;
	margin-top: -4px;
}
input[type=range]:focus {
	outline: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
	background: #ccc;
}

input[type=range]::-moz-range-track {
	height: 5px;
	background: #ddd;
	border: none;
	border-radius: 3px;
}
input[type=range]::-moz-range-thumb {
	border: none;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #D89000;;
}

/*hide the outline behind the border*/
input[type=range]:-moz-focusring{
	outline: 1px solid white;
	outline-offset: -1px;
}

input[type=range]::-ms-track {
	width: 300px;
	height: 5px;

	/*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
	background: transparent;

	/*leave room for the larger thumb to overflow with a transparent border */
	border-color: transparent;
	border-width: 6px 0;

	/*remove default tick marks*/
	color: transparent;
}
input[type=range]::-ms-fill-lower {
	background: #777;
	border-radius: 10px;
}
input[type=range]::-ms-fill-upper {
	background: #ddd;
	border-radius: 10px;
}
input[type=range]::-ms-thumb {
	border: none;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: goldenrod;
}
input[type=range]:focus::-ms-fill-lower {
	background: #888;
}
input[type=range]:focus::-ms-fill-upper {
	background: #ccc;
}
</style>