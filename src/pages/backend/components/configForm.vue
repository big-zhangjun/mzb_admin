<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item label="日志提醒1" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-radio-group name="radioGroup"
                    v-decorator="['wxBlog1', { rules: [{ required: true, message: '请选择' }] }]">
                    <a-radio :value="0"> 否</a-radio>
                    <a-radio :value="1"> 是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="日志提醒时间1" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-time-picker format="HH:mm" style="width: 100%;"
                    v-decorator="['wxBlogTime1', { rules: [{ required: true, message: '请选择' }] }]" />
            </a-form-item>
            <a-form-item label="日志提醒2" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-radio-group name="radioGroup"
                    v-decorator="['wxBlog2', { rules: [{ required: true, message: '请选择' }] }]">
                    <a-radio :value="0"> 否</a-radio>
                    <a-radio :value="1"> 是</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="日志提醒时间2" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-time-picker format="HH:mm" style="width: 100%;"
                    v-decorator="['wxBlogTime2', { rules: [{ required: true, message: '请选择' }] }]" />
            </a-form-item>
            <a-form-item label="日志提醒提示" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-input v-decorator="['wxBlogPrompt', { rules: [{ required: true, message: '请选择' }] }]"
                    style="width: 100%" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="日志提醒摘要" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }">
                <a-input v-decorator="['wxBlogAbstract', { rules: [{ required: true, message: '请选择' }] }]"
                    style="width: 100%" placeholder="请输入" />

            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import moment from 'moment';

// import { addBlogList, getDeptList, getRoleInfo, updateBlogContentList } from '@/services/user'
import { getConfigInfo, updateConfigInfo } from '@/services/user'

export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
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
        this.getConfigApi()
    },
    methods: {
        onChange() {

        },
        async getConfigApi() {
            const res = await getConfigInfo({})
            let keys = Object.keys(res.data.data)
            console.log(res);
            keys.forEach((ele) => {
                // console.log(ele,'ss');
                let keys = ['wxBlogTime1', 'wxBlogTime2']
                if (keys.includes(ele)) {
                    // 使用Moment.js将时间字符串转换为Moment对象
                    // const time = moment(res.data.data[ele], 'HH:mm:ss');
                    // // 将Moment对象转换为日期对象
                    // const date = time.toDate();
                    // // 获取Unix时间戳（毫秒）
                    // const timestampMillis = date.getTime();

                    // // 获取Unix时间戳（秒）
                    // const timestampSeconds = Math.floor(timestampMillis / 1000);
                    // console.log(timestampSeconds);
                    this.form.setFieldsValue({ [ele]: moment(res.data.data[ele], 'HH:mm') })
                } else {
                    this.form.setFieldsValue({ [ele]: res.data.data[ele] })
                }
            })
        },
        // 清空表单
        resetFields() {
            this.form.resetFields();
        },

        handleSubmit(callback) {
            this.form.validateFields(async (err, values) => {
                console.log(values.wxBlogTime1);
                if (!err) {
                    const wxBlogTime1 = moment(values.wxBlogTime1).format('HH:mm');
                    const wxBlogTime2 = moment(values.wxBlogTime2).format('HH:mm');
                    let params = {
                        ...values,
                        wxBlogTime1,
                        wxBlogTime2
                        // 转换为 HHmm 格式
                    }
                    let res = await updateConfigInfo({ ...params })
                    if (res.data.status.retCode === 0) {
                        callback()
                    }
                }
            })
        }
    }
}
</script>

<style scoped></style>