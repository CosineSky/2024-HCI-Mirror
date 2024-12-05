<script setup lang="ts">
import {ElMessage} from "element-plus";
import {uploadImage} from "../api/tool";
import {ref} from "vue";

const imageFileList = ref([])
const logoUrl = ref('')
const uploadingImages = ref(false);

const handleExceed = () => {
    ElMessage.warning(`当前限制选择 1 个文件`);
}

const handleChange = (file: any, fileList: any) => {
    uploadingImages.value = true;
    imageFileList.value = fileList
    let formData = new FormData()
    formData.append('file', file.raw)
    uploadImage(formData).then(res => {
        logoUrl.value = res.data.result
        uploadingImages.value = false;
    })
}
const uploadHttpRequest = () => {
    return new XMLHttpRequest()
}
</script>

<template>
    <el-upload
        v-model:file-list="imageFileList"
        style="width: 300px"
        :limit="1"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :on-remove="handleChange"
        class="upload-demo"
        list-type="picture"
        :http-request="uploadHttpRequest"
        drag
    >
        <div class="el-upload-text">
            将文件拖到此处或单击此处上传。
        </div>
    </el-upload>
</template>

<style scoped>

</style>