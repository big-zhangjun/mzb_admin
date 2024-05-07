<template>
    <div class="mupload">
        <a-upload :headers="headers" name="avatar" list-type="picture-card" class="avatar-uploader"
            :show-upload-list="false" action="#" :before-upload="beforeUpload" @change="handleChange"
            :customRequest="customRequest">
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                    Upload
                </div>
            </div>
        </a-upload>
    </div>
</template>
<script>
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
import { upLoadFile } from "@/services/project"
export default {
    data() {
        return {
            loading: false,
            imageUrl: '',
            headers: {
                'Content-type': 'multipart/form-data',
            },
        };
    },
    props: {
        path: {
            type: String,
            default: "notice"
        }
    },
    methods: {
        handleChange(info) {
            console.log(info, 'ss');
            // if (info.file.status === 'uploading') {
            this.loading = true;
            //     return;
            // }
            if (info.file.status === 'uploading') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                    this.imageUrl = imageUrl;
                });
            }
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 5MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        formatDate() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            return `${year}${String(month).padStart(2, 0)}${String(day).padStart(2, 0)}${String(hours).padStart(2, 0)}${String(minutes).padStart(2, 0)}${String(seconds).padStart(2, 0)}`;
        },

        async customRequest(data) {
            console.log(data);
            const formData = new FormData();
            formData.append('file', data.file);
            formData.append('path', `./pic/${this.path}`);
            formData.append('name', this.formatDate()+'.'+data.file.name.split(".")[1]);
            this.loading = true
            const res = await upLoadFile(formData)
            if (res.data.status.retCode == 0) {
                this.loading = false
                this.$emit("uploadOk",  `./pic/${this.path}/` + this.formatDate()+'.'+data.file.name.split(".")[1])
                this.$message.success(`上传成功`)
            } else {
                this.$message.success(res.data.status.msg)
                this.loading = false
            }
        },
    },
};
</script>
<style lang="less" scoped>
.avatar-uploader>.ant-upload {
    width: 104px;
    height: 104px;
}



.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.mupload {
    ::v-deep .ant-upload {

        width: 104px;
        height: 104px;

        img {

            width: 104px;
            height: 104px;
            object-fit: scale-down;
        }
    }
}
</style>