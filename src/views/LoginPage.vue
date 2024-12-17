<script setup>
import {onMounted, ref} from "vue";
import {userInfo, userLogin, userRegister} from "../api/user.js";
import {useTheme} from "../store/theme";
import {router} from "../router";

const theme = useTheme()

const login_email = ref("cossky@outlook.com")
const login_password = ref("1145141919810")
const login_prompt = ref("")

const register_name = ref("CosSky")
const register_email = ref("cossky@outlook.com")
const register_password = ref("1145141919810")
const register_prompt = ref("")

function handleLogin() {
	userLogin({
		email: login_email.value,
		password: login_password.value,
	}).then(res => {
		if (res.data.code === '000' || res.data.code === '200') {
			sessionStorage.setItem('token', res.data.result)
            userInfo().then(res => {
                sessionStorage.setItem('user-token', JSON.stringify(res.data.result))
	            console.log("Storing session: ", res.data.result);
	            router.push({path: "/home"})
            })
		} else if (res.data.code === '400') {
  
		}
	}).catch(() => {
        login_prompt.value = "Wrong email or password! :(";
    })
}
function handleRegister() {
	userRegister({
		username: register_name.value,
		email: register_email.value,
		password: register_password.value,
	}).then(res => {
		if (res.data.code === '000' || res.data.code === '200') {

            let userForms = document.getElementById('user_options-forms')
            userForms.classList.remove('bounceLeft')
            userForms.classList.add('bounceRight')
		} else if (res.data.code === '400') {

		}
	}).catch(() => {
        register_prompt.value = "Email already taken! :(";
    })
}

onMounted(() => {
	theme.reset();
	
	/**
	 * Variables
	 */
	const signupButton = document.getElementById('signup-button'),
		loginButton = document.getElementById('login-button'),
		userForms = document.getElementById('user_options-forms')

	/**
	 * Add event listener to the "Sign Up" button
	 */
	signupButton.addEventListener('click', () => {
		userForms.classList.remove('bounceRight')
		userForms.classList.add('bounceLeft')
        register_prompt.value = "";
	}, false)

	/**
	 * Add event listener to the "Login" button
	 */
	loginButton.addEventListener('click', () => {
		userForms.classList.remove('bounceLeft')
		userForms.classList.add('bounceRight')
        login_prompt.value = "";
	}, false)
})

</script>

<template>
	<body>
		<video autoplay muted loop id="video-background">
			<source src="../assets/videos/1.mp4" type="video/mp4">
			Your browser does not support the video tag.
		</video>
		<section class="user">
			<div class="user_options-container">
				<div class="user_options-text">
					<div class="user_options-unregistered">
						<h2 class="user_unregistered-title">Don't have an account?</h2>
						<p class="user_unregistered-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet, aspernatur blanditiis incidunt officiis reprehenderit ullam vitae. Blanditiis deleniti earum et exercitationem iste, neque quae, quo quos ullam vel voluptas?</p>
						<button class="user_unregistered-signup" id="signup-button">Sign up</button>
					</div>

					<div class="user_options-registered">
						<h2 class="user_registered-title">Have an account?</h2>
						<p class="user_registered-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto assumenda atque cupiditate dolorum eius est fuga minus, molestiae, nam non obcaecati odio officia optio pariatur recusandae repudiandae sit vel, vitae?</p>
						<button class="user_registered-login" id="login-button">Login</button>
					</div>
				</div>

				<div class="user_options-forms" id="user_options-forms">
					<div class="user_forms-login">
						<h2 class="forms_title">Login</h2>
						<form class="forms_form">
							<fieldset class="forms_fieldset">
								<div class="forms_field">
									<input type="email" v-model="login_email" placeholder="Email" class="forms_field-input" required autofocus />
								</div>
								<div class="forms_field">
									<input type="password" v-model="login_password" placeholder="Password" class="forms_field-input" required />
								</div>
							</fieldset>
                            <p style="font-family: 'Comic Sans MS', serif; color: red">{{ login_prompt }}</p>
							<div class="forms_buttons">
								<button type="button" class="forms_buttons-forgot">Forgot password?</button>
								<input @click="handleLogin" type="submit" value="Log In" class="forms_buttons-action">
							</div>
						</form>
					</div>
					<div class="user_forms-signup">
						<h2 class="forms_title">Sign Up</h2>
						<form class="forms_form">
							<fieldset class="forms_fieldset">
								<div class="forms_field">
									<input type="text" v-model="register_name" placeholder="Username" class="forms_field-input" required />
								</div>
								<div class="forms_field">
									<input type="email" v-model="register_email" placeholder="Email" class="forms_field-input" required />
								</div>
								<div class="forms_field">
									<input type="password" v-model="register_password" placeholder="Password" class="forms_field-input" required />
								</div>
							</fieldset>
                            <p style="font-family: 'Comic Sans MS', serif; color: red">{{ register_prompt }}</p>
							<div class="forms_buttons">
								<input @click="handleRegister" type="submit" value="Sign up" class="forms_buttons-action">
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	</body>
</template>

<style scoped>
/**
 * * General variables
 * */
/**
 * * General configs
 * */
*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

body {
    margin: 0;
    padding: 0;
    height: 100%;
	font-family: "Nunito", sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url("../assets/videos/1.mp4");
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

button {
	background-color: transparent;
	padding: 0;
	border: 0;
	outline: 0;
	cursor: pointer;
}

input {
	background-color: transparent;
	padding: 0;
	border: 0;
	outline: 0;
}
input[type=submit] {
	cursor: pointer;
}
input::-moz-placeholder {
	font-size: 0.85rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 300;
	letter-spacing: 0.1rem;
	color: #ccc;
}
input:-ms-input-placeholder {
	font-size: 0.85rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 300;
	letter-spacing: 0.1rem;
	color: #ccc;
}
input::placeholder {
	font-size: 0.85rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 300;
	letter-spacing: 0.1rem;
	color: #ccc;
}

/**
 * * Bounce to the left side
 * */
@-webkit-keyframes bounceLeft {
	0% {
		transform: translate3d(100%, -50%, 0);
	}
	50% {
		transform: translate3d(-30px, -50%, 0);
	}
	100% {
		transform: translate3d(0, -50%, 0);
	}
}
@keyframes bounceLeft {
	0% {
		transform: translate3d(100%, -50%, 0);
	}
	50% {
		transform: translate3d(-30px, -50%, 0);
	}
	100% {
		transform: translate3d(0, -50%, 0);
	}
}
/**
 * * Bounce to the left side
 * */
@-webkit-keyframes bounceRight {
	0% {
		transform: translate3d(0, -50%, 0);
	}
	50% {
		transform: translate3d(calc(100% + 30px), -50%, 0);
	}
	100% {
		transform: translate3d(100%, -50%, 0);
	}
}
@keyframes bounceRight {
	0% {
		transform: translate3d(0, -50%, 0);
	}
	50% {
		transform: translate3d(calc(100% + 30px), -50%, 0);
	}
	100% {
		transform: translate3d(100%, -50%, 0);
	}
}
/**
 * * Show Sign Up form
 * */
@-webkit-keyframes showSignUp {
	100% {
		opacity: 1;
		visibility: visible;
		transform: translate3d(0, 0, 0);
	}
}
@keyframes showSignUp {
	100% {
		opacity: 1;
		visibility: visible;
		transform: translate3d(0, 0, 0);
	}
}
/**
 * * Page background
 * */
.user {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	background-size: cover;
}
.user_options-container {
	position: relative;
	width: 80%;
}
.user_options-text {
	display: flex;
	justify-content: space-between;
	width: 100%;
	background-color: rgba(34, 34, 34, 0.85);
	border-radius: 3px;
}

/**
 * * Registered and Unregistered user box and text
 * */
.user_options-registered,
.user_options-unregistered {
	width: 50%;
	padding: 75px 45px;
	color: #fff;
	font-weight: 300;
}

.user_registered-title,
.user_unregistered-title {
	margin-bottom: 15px;
	font-size: 1.66rem;
	line-height: 1em;
}

.user_unregistered-text,
.user_registered-text {
	font-size: 0.83rem;
	line-height: 1.4em;
}

.user_registered-login,
.user_unregistered-signup {
	margin-top: 30px;
	border: 1px solid #ccc;
	border-radius: 3px;
	padding: 10px 30px;
	color: #fff;
	text-transform: uppercase;
	line-height: 1em;
	letter-spacing: 0.2rem;
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.user_registered-login:hover,
.user_unregistered-signup:hover {
	color: rgba(34, 34, 34, 0.85);
	background-color: #ccc;
}

/**
 * * Login and signup forms
 * */
.user_options-forms {
	position: absolute;
	top: 50%;
	left: 30px;
	width: calc(50% - 30px);
	min-height: 420px;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 2px 0 15px rgba(0, 0, 0, 0.25);
	overflow: hidden;
	transform: translate3d(100%, -50%, 0);
	transition: transform 0.4s ease-in-out;
}
.user_options-forms .user_forms-login {
	transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
}
.user_options-forms .forms_title {
	margin-bottom: 45px;
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1em;
	text-transform: uppercase;
	color: #e8716d;
	letter-spacing: 0.1rem;
}
.user_options-forms .forms_field:not(:last-of-type) {
	margin-bottom: 20px;
}
.user_options-forms .forms_field-input {
	width: 100%;
	border-bottom: 1px solid #ccc;
	padding: 6px 20px 6px 6px;
	font-family: "Montserrat", sans-serif;
	font-size: 1rem;
	font-weight: 300;
	color: gray;
	letter-spacing: 0.1rem;
	transition: border-color 0.2s ease-in-out;
}
.user_options-forms .forms_field-input:focus {
	border-color: gray;
}
.user_options-forms .forms_buttons {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 35px;
}
.user_options-forms .forms_buttons-forgot {
	font-family: "Montserrat", sans-serif;
	letter-spacing: 0.1rem;
	color: #ccc;
	text-decoration: underline;
	transition: color 0.2s ease-in-out;
}
.user_options-forms .forms_buttons-forgot:hover {
	color: #b3b3b3;
}
.user_options-forms .forms_buttons-action {
	background-color: #e8716d;
	border-radius: 3px;
	padding: 10px 35px;
	font-size: 1rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 300;
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 0.1rem;
	transition: background-color 0.2s ease-in-out;
}
.user_options-forms .forms_buttons-action:hover {
	background-color: #e14641;
}
.user_options-forms .user_forms-signup,
.user_options-forms .user_forms-login {
	position: absolute;
	top: 70px;
	left: 40px;
	width: calc(100% - 80px);
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out, transform 0.5s ease-in-out;
}
.user_options-forms .user_forms-signup {
	transform: translate3d(120px, 0, 0);
}
.user_options-forms .user_forms-signup .forms_buttons {
	justify-content: flex-end;
}
.user_options-forms .user_forms-login {
	transform: translate3d(0, 0, 0);
	opacity: 1;
	visibility: visible;
}

/**
 * * Triggers
 * */
.user_options-forms.bounceLeft {
	-webkit-animation: bounceLeft 1s forwards;
	animation: bounceLeft 1s forwards;
}
.user_options-forms.bounceLeft .user_forms-signup {
	-webkit-animation: showSignUp 1s forwards;
	animation: showSignUp 1s forwards;
}
.user_options-forms.bounceLeft .user_forms-login {
	opacity: 0;
	visibility: hidden;
	transform: translate3d(-120px, 0, 0);
}
.user_options-forms.bounceRight {
	-webkit-animation: bounceRight 1s forwards;
	animation: bounceRight 1s forwards;
}

/**
 * * Responsive 990px
 * */
@media screen and (max-width: 990px) {
	.user_options-forms {
		min-height: 350px;
	}
	.user_options-forms .forms_buttons {
		flex-direction: column;
	}
	.user_options-forms .user_forms-login .forms_buttons-action {
		margin-top: 30px;
	}
	.user_options-forms .user_forms-signup,
	.user_options-forms .user_forms-login {
		top: 40px;
	}

	.user_options-registered,
	.user_options-unregistered {
		padding: 50px 45px;
	}
}


</style>