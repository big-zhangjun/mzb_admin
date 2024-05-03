<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'请选择日期：'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-date-picker style="width: 100%;"
                    v-decorator="['blogDay', { rules: [{ required: true, message: '请选择日期' }] }]" />
            </a-form-item>
            <a-form-item :label="'地址'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-input placeholder="请输入"
                    v-decorator="['address', { rules: [{ required: true, message: '请输入地址' }] }]"></a-input>
            </a-form-item>
            <a-form-item :label="'项目信息：'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-select show-search v-decorator="['projectID', { rules: [{ required: true, message: '请选择项目信息' }] }]"
                    placeholder="请选择">
                    <a-select-option :value="item.id" v-for="item in projectList" :key="item.id">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'工作内容：'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-select mode="multiple" show-search
                    v-decorator="['contentId', { rules: [{ required: true, message: '请选择日期' }] }]" placeholder="请选择">
                    <a-select-option :value="item.id" v-for="item in blogContentList" :key="item.id">
                        {{ item.content }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'备注'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <a-textarea placeholder="请输入"
                    v-decorator="['remark', { rules: [{ required: true, message: '请输入地址' }] }]"></a-textarea>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import moment from 'moment';

// import { addBlogList, getDeptList, getRoleInfo, updateBlogContentList } from '@/services/user'
import { addBlogList, getBlogContentList, addEcRep, addSiRep, addAsRep } from '@/services/electrical'
import { getProjectList } from '@/services/project'

export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            id: "",
            blogContentList: [],
            projectList: [],
            value: 1,
            form: this.$form.createForm(this)
        }
    },
    props: {
        type: {
            type: String,
            default: "add"
        }
    },
    computed: {
        // desc() {
        //     return this.'pageDesc'
        // }
    },
    created() {
        this.getBlogContentList()
        this.getProjectList()
    },
    methods: {
        onChange() {

        },
        async getProjectList() {
            const res = await getProjectList({
                pageIndex: 1,
                pageSize: 100
            })
            this.projectList = res.data.data.records.map(item => {
                return {
                    id: item.id,
                    label: item.productNumber + '---' + item.customerName + '---' + item.model
                }
            })
        },
        // // 获取员工信息
        // async getRoleInfo(id) {
        //     const res = await getRoleInfo({ id })
        //     this.id = id
        //     if (res.data.status.retCode === 0) {
        //         let keys = [
        //             'content',
        //         ]
        //         Object.keys(res.data.data).forEach(item => {
        //             if (keys.includes(item)) {
        //                 this.form.setFieldsValue({ [item]: res.data.data[item] })
        //             }
        //         })

        //     }
        // },
        getWorkTent(data) {
            let keys = [
                'blogDay',
                'address',
                'remark',
                'projectID'
            ]
            keys.forEach((key) => {
                this.form.setFieldsValue({ [key]: data[key] })
            })
            let ids = data.content.split(",")
            let contentIds = this.blogContentList.filter(item => ids.includes(item.content)).map(item => item.id)
            this.form.setFieldsValue({ contentId: contentIds })
        },
        // 清空表单
        resetFields() {
            this.form.resetFields();
        },

        handleSubmit(callback) {
            console.log(this.$store.state);
            this.form.validateFields((err, values) => {
                if (!err) {
                    const { contentId, blogDay, ...p } = values
                    let params = {
                        ...p,
                        blogDay: moment(blogDay).format('YYYY-MM-DD'),
                        userID: this.$store.state.account.user.id,
                        content: this.blogContentList.filter(item => contentId.includes(item.id)).map(item => item.content).join(",")
                    }
                    this.addBlogList(params, callback)


                    let addFun = this.blogContentList.filter(item => contentId.includes(item.id)).map(item => item.contentType)
                    addFun = [...new Set(addFun)]
                    addFun.forEach(async item => {
                        await this.addUser(item, params.projectID)
                    })
                }
            })
        },
        async addUser(type, id) {
            let fun = ""
            switch (type) {
                case 1:
                    fun = this.addEcRep
                    break
                case 2:
                    fun = this.addSiRep
                    break
                case 3:
                    fun = this.addAsRep
                    break
            }
            const user = JSON.parse(localStorage.getItem("admin.user"))
            let params = {
                id,
                "rep": user.id,
                "repName": user.userName
            }
            console.log(params,'ss');
            fun(params)
        },
        async addEcRep(params) {
            const res = await addEcRep(params)
            console.log(res);
        },
        async addSiRep(params) {
            const res = await addSiRep(params)
            console.log(res);
        },
        async addAsRep(params) {
            const res = await addAsRep(params)
            console.log(res);
        },
        addBlogList(params, callback) {
            addBlogList(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        async getBlogContentList() {
            const res = await getBlogContentList({})
            this.blogContentList = res.data.data
        }
    }
}
</script>

<style scoped></style>