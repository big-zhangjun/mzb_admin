<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'项目编号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入项目编号'"
                    v-decorator="['number', { rules: [{ required: true, message: '请输入项目编号' }] }]" />
            </a-form-item>
            <a-form-item :label="'产品编号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入产品编号'"
                    v-decorator="['productNumber', { rules: [{ required: true, message: '请输入产品编号' }] }]" />
            </a-form-item>
            <a-form-item :label="'客户名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入客户名称'"
                    v-decorator="['customerName', { rules: [{ required: true, message: '请输入客户名称' }] }]" />
            </a-form-item>
            <a-form-item :label="'产品名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择产品名称'"
                    v-decorator="['productName', { rules: [{ required: true, message: '请选择产品名称' }] }]">
                    <a-select-option :value="item" v-for="item in projectName" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'请选择级别'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择级别'"
                    v-decorator="['level', { rules: [{ required: true, message: '请选择级别' }] }]">
                    <a-select-option :value="item.value" v-for="item in levels" :key="item.name">{{ item.name
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'请输入规格型号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入规格型号'"
                    v-decorator="['Model', { rules: [{ required: true, message: '请输入规格型号' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import { getDeptList } from '@/services/user'
import { addProjectInfo, getProjectInfo, updateProjectInfo } from '@/services/project'

export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            id: "",
            roleList: [],
            value: 1,
            form: this.$form.createForm(this),
            projectName: [
                "热压罐",
                "储气罐",
                "液压釜",
                "固化炉",
                "系统改造"
            ],
            levels: [
                {
                    name:"P0",
                    value: 0
                },
                {
                    name:"P1",
                    value: 1
                },
                {
                    name:"P2",
                    value: 2
                },
                {
                    name:"P3",
                    value: 3
                },
                {
                    name:"P4",
                    value: 4
                },
                {
                    name:"P5",
                    value: 5
                }
            ]
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
        // 查询职位列表
        async getDeptList() {
            const res = await getDeptList({})
            if (res.data.status.retCode === 0) {
                this.deptList = res.data.data
            }
        },
        // 获取员工信息
        async getProjectInfo(id) {
            const res = await getProjectInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let keys = [
                    'number',
                    'productNumber',
                    'customerName',
                    'productName',
                    'level',
                ]
                Object.keys(res.data.data).forEach(item => {
                    if (keys.includes(item)) {
                        this.form.setFieldsValue({ [item]: res.data.data[item] })
                    }
                })
                this.form.setFieldsValue({ Model: res.data.data.model })

            }
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
                        this.updateProjectInfo({ ...params, id: this.id }, callback)
                    } else {
                        this.addProjectInfo(params, callback)
                    }
                }
            })
        },
        addProjectInfo(params, callback) {
            addProjectInfo(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        updateProjectInfo(params, callback) {
            updateProjectInfo(params).then(res => {
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