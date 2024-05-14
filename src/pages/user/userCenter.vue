<template>
    <div class="userCenter">
        <a-card style="margin-top: 24px;" class="info">
            <div class="avatar">
                <img :src="avatar" alt="">
            </div>
            <div class="left">
                <div class="name">
                    <span class="title">{{ userInfo.nickName }}</span>
                    <a-upload name="file" :showUploadList="false" action="#" :headers="headers"
                        :before-upload="beforeUpload" @change="handleChange" :customRequest="customRequest">
                        <a-button class="editUpload" type="link" size="small">
                            编辑头像
                        </a-button>
                    </a-upload>

                    <!-- <span class="editUpload"></span> -->
                </div>
                <div class="info">
                    <img src="@/assets/img/man.svg" alt="" v-if="!userInfo.sex">
                    <img src="@/assets/img/woman.svg" alt="" v-else>
                    {{ getUserSex() }}，{{ userInfo.mobile }}
                </div>
            </div>
            <div class="right">
                <!-- ss -->
            </div>
        </a-card>
        <a-card style="margin-top: 24px;" class="userInfo">
            <div class="item">
                <h1>基本资料</h1>
                <div class="form">
                    <a-form :form="form">
                        <a-form-item :label="'手机号码'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input :placeholder="'请输入手机号码'"
                                v-decorator="['mobile', { rules: [{ required: true, message: '请输入手机号码' }] }]"></a-input>
                        </a-form-item>
                        <a-form-item :label="'邮箱'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input :placeholder="'请输入邮箱'"
                                v-decorator="['email', { rules: [{ required: false, message: '请输入邮箱' }] }]"></a-input>
                        </a-form-item>
                        <a-form-item :label="'性别'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-radio-group v-decorator="['sex', { rules: [{ required: true, message: '请选择性别' }] }]">
                                <a-radio :value="0">男</a-radio>
                                <a-radio :value="1">女</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item :label="'地址'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-textarea rows="4" :placeholder="'请输入地址'"
                                v-decorator="['address', { rules: [{ required: false, message: '请输入地址' }] }]" />
                        </a-form-item>
                    </a-form>
                    <a-button class="submit" type="primary" @click="handleSubmit">
                        保存
                    </a-button>
                </div>
            </div>
            <div class="item">
                <h1>密码</h1>
                <div class="form">
                    <a-form :form="pForm">
                        <a-form-item :label="'旧密码'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input type="password" :placeholder="'请输入旧密码'"
                                v-decorator="['password', { rules: [{ required: true, message: '请输入旧密码' },{ min: 6, message: '长度至少为 6!' }, { max: 6, message: '长度至多为 6!' }] }]"></a-input>
                        </a-form-item>
                        <a-form-item :label="'新密码'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input type="password" :placeholder="'请输入新密码'"
                                v-decorator="['userNumber', { rules: [{ required: true, message: '请输入新密码' },{ min: 6, message: '长度至少为 6!' }, { max: 6, message: '长度至多为 6!' }] }]"></a-input>
                        </a-form-item>
                    </a-form>
                    <a-button class="submit" type="primary" @click="handlePasswordSubmit">
                        保存
                    </a-button>
                </div>
            </div>
        </a-card>

    </div>
</template>

<script>
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
import { upLoadFile } from "@/services/project"
import { mapMutations } from 'vuex'
import md5 from "js-md5";
import { getUserInfo, updateUserInfo, uploadUserAvatar, uploadUserPassword } from '@/services/user'
export default {
    data() {
        return {
            userInfo: {},
            deptList: [],
            id: "",
            roleList: [],
            value: 1,
            headers: {
                authorization: 'authorization-text',
            },
            path: "",
            avatar: "",
            pForm: this.$form.createForm(this),
            form: this.$form.createForm(this)
        }
    },
    mounted() {
        let user = localStorage.getItem("admin.user")
        if (user) {
            let userInfo = JSON.parse(user)
            this.getUserInfo(userInfo.id)
        }
    },
    methods: {
        ...mapMutations('account', ['setUser']),

        // 获取员工信息
        async getUserInfo(id) {
            const res = await getUserInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let keys = [
                    'mobile',
                    'sex',
                    'address',
                    'email',
                ]
                this.userInfo = res.data.data
                Object.keys(res.data.data).forEach(item => {
                    if (keys.includes(item)) {
                        this.form.setFieldsValue({ [item]: res.data.data[item] })
                    }
                })

                this.avatar = this.getImg(res.data.data)
                console.log(this.avatar, 'avatar');
            }
        },
        getUserSex() {
            return this.userInfo.sex == 0 ? '男' : '女'
        },
        getImg(data) {
            console.log(data);
            if (data.avatar) {
                return process.env.VUE_APP_API_BASE_URL + data.avatar.replace(/^\./, '')
            }
        },
        handleChange(info) {
            console.log(info, 'ss');
            // if (info.file.status === 'uploading') {
            this.loading = true;
            //     return;
            // }
            if (info.file.status === 'uploading') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                    this.avatar = imageUrl;
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
            const formData = new FormData();
            formData.append('file', data.file);
            formData.append('path', `./pic/avatar`);
            formData.append('name', this.formatDate() + '.' + data.file.name.split(".")[1]);
            this.loading = true
            const res = await upLoadFile(formData)
            if (res.data.status.retCode == 0) {
                this.loading = false
                this.path = `./pic/avatar/` + this.formatDate() + '.' + data.file.name.split(".")[1]
                this.$emit("uploadOk", `./pic/avatar/` + this.formatDate() + '.' + data.file.name.split(".")[1])
                this.uploadUserAvatar()
            } else {
                this.$message.success(res.data.status.msg)
                this.loading = false
            }
        },
        async uploadUserAvatar() {
            let params = {
                id: this.userInfo.id,
                avatar: this.path
            }
            let res = await uploadUserAvatar(params)
            if (res.data.status.retCode == 0) {
                let user = localStorage.getItem("admin.user")
                let userInfo = JSON.parse(user)
                let a = { ...userInfo, avatar: this.path }
                this.setUser(a)
                this.$message.success(`上传成功`)
            }

        },
        getMD5Up(val) {
            let screct = md5(val)
            let bigScrect = screct.toUpperCase()
            return bigScrect
        },
        async handlePasswordSubmit() {
            this.pForm.validateFields((err, values) => {
                console.log(values);
                if (!err) {
                    let params = {
                        id: this.userInfo.id,
                        userNumber: this.getMD5Up(values.userNumber),
                        password: this.getMD5Up(values.password),
                    }
                    this.uploadUserPassword(params)
                }
            })

        },
        async uploadUserPassword(params) {
            let res = await uploadUserPassword(params)
            if (res.data.status.retCode === 0) {
                this.$message.success("操作成功")
            }else {
                this.$message.warning(res.data.status.msg)
            }
        },
        handleSubmit() {
            this.form.validateFields((err, values) => {
                if (!err) {
                    const { deptID, nickName, id, roleID, userName } = this.userInfo
                    let params = {
                        ...values,
                        deptID,
                        id,
                        roleID,
                        nickName,
                        userName,
                        resign: 1 // 是否在职
                    }
                    console.log(params);
                    this.updateUserInfo({ ...params, id: this.userInfo.id })
                }
            })
        },
        updateUserInfo(params) {
            updateUserInfo(params).then(res => {
                if (res.data.status.retCode === 0) {
                    this.$message.success("操作成功")
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.userCenter {
    .info {
        ::v-deep {
            .ant-card-body {
                display: flex;
                align-items: center;

                .left {
                    margin-left: 30px;

                    .name {
                        margin-bottom: 6px;
                    }

                    .title {
                        font-size: 22px;
                        color: #333333;
                        font-weight: bold;
                    }

                    .editUpload {
                        margin-left: 5px;
                        cursor: pointer;
                    }

                    img {
                        margin-right: 8px;
                    }

                    .info {
                        display: flex;
                        font-size: 16px;
                        align-items: center;
                        color: #666666;
                    }
                }

                .avatar {
                    width: 100px;
                    height: 100px;
                    background-color: #ccc;
                    border-radius: 50%;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100;
                        object-fit: cover;
                    }
                }

                .right {
                    margin-left: auto;
                }
            }
        }
    }

    .userInfo {
        ::v-deep .ant-card-body {
            display: flex;

            .item {
                width: 50%;
            }
        }

        h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .submit {
            float: right;
        }

        .form {
            width: 500px;
            // margin: 0 auto;
        }
    }
}
</style>