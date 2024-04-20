<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'工作内容'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-textarea rows="4" :placeholder="'请输入工作内容'"
                    v-decorator="['content', { rules: [{ required: false, message: '请输入工作内容' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
// import { addFlowList, getDeptList, getRoleInfo, updateBlogContentList } from '@/services/user'
import { addFlowList, updateBlogContentList } from '@/services/electrical'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            id: "",
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
    },
    methods: {
        onChange() {

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
           this.id = data.id
           this.form.setFieldsValue({ content: data.content})
        },
        // 清空表单
        resetFields() {
            this.form.resetFields();
        },

        handleSubmit(callback) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let params = {
                        ...values,
                    }
                    if (this.type == 'edit') {
                        this.updateBlogContentList({ ...params, id: this.id }, callback)
                    } else {
                        this.addFlowList(params, callback)
                    }
                }
            })
        },
        addFlowList(params, callback) {
            addFlowList(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        updateBlogContentList(params, callback) {
            updateBlogContentList(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        }
    }
}
</script>

<style scoped></style>