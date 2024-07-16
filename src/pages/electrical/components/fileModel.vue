<template>
    <a-card :body-style="{ padding: '0 0 ' }" :bordered="false">
        <a-tabs default-active-key="1" @change="callback" v-model="active">
            <a-tab-pane key="1" tab="发货清单">

            </a-tab-pane>
            <a-tab-pane key="2" tab="电气清单" force-render>

            </a-tab-pane>
            <a-tab-pane key="3" tab="电气布线图" force-render>

            </a-tab-pane>
        </a-tabs>
        <a-list class="tab-pane" style="max-height: 300px;overflow-y: auto;padding-right: 30px;min-height: 180px">
            <a-list-item style="cursor: pointer" v-for="item in fileList" :key="item.id" stt>
                <a-list-item-meta :title="item.fileName" :description="item.createTime">
                    <div class="avatar" slot="avatar">
                        <img :src="getImgUrl(item.filePath)" alt="">
                    </div>
                </a-list-item-meta>
                <div>{{ item.userName }}</div>
                <a-popconfirm slot="actions" title="确定删除该文件?" ok-text="确定" cancel-text="取消"
                    @confirm="delProjectFile(item)" v-if="permission.includes(2)">
                    <a style="color: rgb(240, 112, 78);">删除</a>
                </a-popconfirm>
                <a slot="actions" @click="download(item)"  v-if="permission.includes(7)">下载</a>
            </a-list-item>
        </a-list>
        <div class="footer"  v-if="permission.includes(8)">
            <a-upload name="file" :multiple="true" action="#" :headers="headers" @change="handleChange"
                :showUploadList="false" :customRequest="customRequest">
                <a-button> <a-icon type="upload"/> 上传 </a-button>
            </a-upload>
        </div>
    </a-card>
</template>

<script>
// import moment from 'moment';
import { getProjectFile, upLoadFile, uploadProjectFile, delProjectFile } from '@/services/project'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            fileList: [

            ],
            headers: {
                authorization: 'authorization-text',
            },
            active: 1
        }
    },
    props: {
        type: {
            type: String,
            default: "add"
        },
        projectID: {
            type: Number,
            default: ""
        },
        permission: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        // desc() {
        //     return this.'pageDesc'
        // }
    },
    created() {
        // this.getProjectFile()
    },
    methods: {
        getImgUrl(path) {
            console.log(this.getFileType(path));
            switch (this.getFileType(path)) {
                case '1':
                    return require("@/assets/img/2.png")
                case '2':
                    return require("@/assets/img/3.png")
                case '3':
                    return require("@/assets/img/1.png")
                case '3':
                    return require("@/assets/img/4.png")
            }
            // let fileType = path.split
            return ''
        },
        getFileType(filePath) {
            const extension = this.getFileExtension(filePath);
            switch (extension) {
                case '.jpg':
                case '.jpeg':
                    return '1';
                case '.png':
                    return '1';
                case '.gif':
                    return '1';
                case '.bmp':
                    return 'BMP Image';
                case '.pdf':
                    return '2';
                case '.doc':
                case '.docx':
                    return '4';
                case '.xls':
                case '.xlsx':
                    return '3';
                // 添加更多文件类型判断
                default:
                    return '5';
            }
        },
        async delProjectFile(data) {
            let res = await delProjectFile({ id: data.id })
            if (res.data.status.retCode === 0) {
                this.$message.success("操作成功")
                this.getProjectFile()
            }
        },
        getFileExtension(filePath) {
            // 使用正则表达式提取文件扩展名
            const match = filePath.match(/\.\w+$/);
            return match ? match[0].toLowerCase() : '';
        },
        async download(v) {
            const BASE_URL = process.env.VUE_APP_API_BASE_URL
            let url = BASE_URL + v.filePath.replace(/^\./, '')
            const response = await fetch(url);
            try {
                const opts = {
                    suggestedName: v.fileName,
                    types: [
                        {
                            description: '文件',
                            accept: {
                                // 'text/plain': ['.xlsx'],
                            }
                        }
                    ],
                    excludeAcceptAllOption: true
                };

                const handle = await window.showSaveFilePicker(opts); // 打开保存文件对话框
                const writable = await handle.createWritable(); // 创建可写入的文件对象
                const blob = await response.blob();
                await writable.write(blob);
                await writable.close();

                this.$message.success('文件保存成功')
            } catch (err) {
                this.$message.warning('文件保存失败')
            }
        },
        async customRequest(data) {
            const formData = new FormData();
            let folder = ["", "delivery_list", 'ep_list', 'electrical_diagram'][this.active]
            formData.append('file', data.file);
            formData.append('path', `./doc/${folder}`);
            let time = this.formatDate()
            this.fileName = data.file.name
            formData.append('name', `${this.projectID}_${time}` + '_' + data.file.name);
            this.loading = true
            const res = await upLoadFile(formData)
            if (res.data.status.retCode == 0) {
                this.loading = false
                this.path = `./doc/${folder}/${this.projectID}_` + time + '_' + data.file.name
                this.uploadProjectFile()
            } else {
                this.$message.success(res.data.status.msg)
                this.loading = false
            }
        },
        async getProjectFile() {
            let params = {
                fileType: +this.active,
                projectID: this.projectID
            }
            let res = await getProjectFile(params)
            this.fileList = res.data.data
        },
        handleChange() { },
        callback(v) {
            this.active = v
            this.getProjectFile()
        },
        async uploadProjectFile() {
            let user = localStorage.getItem("admin.user")
            let userID = JSON.parse(user).id
            let params = {
                projectID: this.projectID,
                fileType: +this.active,
                fileName: this.fileName,
                FilePath: `${this.path}`,
                userID
            }
            let res = await uploadProjectFile(params)
            if (res.data.status.retCode == 0) {
                this.$message.success(`上传成功`)
                this.getProjectFile()
            }
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

    }
}
</script>

<style scoped lang="less">
.avatar {

    img {
        width: 26px;
    }
}

.footer {
    margin-top: 12px;
    padding-top: 24px;
    position: absolute;
}
</style>