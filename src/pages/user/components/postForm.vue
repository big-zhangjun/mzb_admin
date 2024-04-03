<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'职位名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入职位名称'"
                    v-decorator="['roleName', { rules: [{ required: true, message: '请输入职位名称' }] }]" />
            </a-form-item>
            <a-form-item :label="'职位描述'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-textarea rows="4" :placeholder="'请输入职位描述'"
                    v-decorator="['description', { rules: [{ required: true, message: '请输入职位描述' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import { addRoleInfo, getDeptList, getRoleInfo, updateRoleInfo, getUserList } from '@/services/user'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            id: "",
            roleList: [],
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
        // 查询职位列表
        async getDeptList() {
            const res = await getDeptList({})
            if (res.data.status.retCode === 0) {
                this.deptList = res.data.data
            }
        },
        // 获取员工信息
        async getRoleInfo(id) {
            const res = await getRoleInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let keys = [
                    'roleName',
                    'description',
                ]
                const { managerRoleID, managerID } = res.data.data
                let managerIDs = [managerRoleID, managerID]
                Object.keys(res.data.data).forEach(item => {
                    if (keys.includes(item)) {
                        this.form.setFieldsValue({ [item]: res.data.data[item] })
                    }
                })
                this.options.forEach((item) => {
                    if (item.value == managerRoleID) {
                        getUserList({ roleId: managerRoleID }).then(respone => {
                            let children = respone.data.data.map(_item => {
                                return {
                                    label: _item.nickName,
                                    value: _item.id
                                }
                            })
                            this.$set(item, 'isLeaf', true)
                            this.$set(item, 'children', children)
                        })
                    }
                })
                this.form.setFieldsValue({ managerID: managerIDs })

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
                        managerID: values.managerID[values.managerID.length - 1]
                    }
                    if (this.type == 'edit') {
                        this.updateRoleInfo({ ...params, id: this.id }, callback)
                    } else {
                        this.addRoleInfo(params, callback)
                    }
                }
            })
        },
        addRoleInfo(params, callback) {
            addRoleInfo(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        updateRoleInfo(params, callback) {
            updateRoleInfo(params).then(res => {
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