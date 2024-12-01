<script setup>

</script>

<template>
  <div class="header">
    <input type="text" placeholder="想播放什么？" />
    <button class="login-btn">登录</button>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 100px;
  background-color: rgba(17, 6, 58, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
  border: 1px solid #fff;
}

input[type="text"] {
  padding: 5px;
  border-radius: 5px;
  margin: auto;
  width: 50%;
  height: 50%;
  background-color: rgba(200, 187, 255, 0.6);
  border: 2px solid rgba(222, 215, 255, 0.9);
  box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
}

input[type="text"]::placeholder {
  color: #fff;
  opacity: 0.7;
  font-size: 16px;
}

input[type="text"]:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #fff;
}

.login-btn {
  background-color: rgb(77, 58, 162);
  border: 4px solid rgb(234, 229, 255);
  box-shadow: 0 6px 10px rgba(200, 187, 255, 0.4);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
