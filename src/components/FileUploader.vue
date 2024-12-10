<script setup>
import {ref} from "vue";
import {uploadFile} from "../api/tool";
import {defineEmits} from 'vue';

const fileList = ref([])
const fileUrl = ref('')
const isUploadingFiles = ref(false);

const handleExceed = () => {
    alert("File count exceeded!")
}

const handleChange = (file, fileList) => {
    isUploadingFiles.value = true;
    fileList.value = fileList
    let formData = new FormData()
    formData.append('file', file.raw)
    uploadFile(formData)
        .then(res => {
            fileUrl.value = res.data.result
            isUploadingFiles.value = false;
            passFileUrl(fileUrl.value)
        })
}
const uploadHttpRequest = () => {
    return new XMLHttpRequest()
}

const emit = defineEmits();

const passFileUrl = (url) => {
    emit('updateFileUrl', url);
};
</script>

<template>
    <el-upload
        v-model:file-list="fileList"
        :limit="1"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :on-remove="handleChange"
        list-type="picture"
        :http-request="uploadHttpRequest"
        drag
    >
    </el-upload>
</template>

<style scoped>
el-upload {
    width: 100px;
}
</style>