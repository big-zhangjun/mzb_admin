<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'部门名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入部门名称'"
                    v-decorator="['deptName', { rules: [{ required: true, message: '请输入部门名称' }] }]" />
            </a-form-item>

            <a-form-item :label="'部门负责人'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-cascader :options="options" placeholder="请选择部门负责人" @change="onChange" :load-data="loadData"
                    v-decorator="['managerID', { rules: [{ required: true, message: '请选择部门负责人' }] }]" />
            </a-form-item>

            <a-form-item :label="'部门描述'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-textarea rows="4" :placeholder="'请输入部门描述'"
                    v-decorator="['description', { rules: [{ required: false, message: '请输入部门描述' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import { addDeptInfo, getDeptList, getRoleList, getDeptInfo, updateDeptInfo, getUserList } from '@/services/user'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            deptList: [],
            options: [],
            userList: [],
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
        this.initData()
    },
    methods: {
        onChange(v) {
            if (v.length < 2) {
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        managerID: null
                    })
                })
            }
        },
        async loadData(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            const res = await getUserList({ roleId: targetOption.value })
            let children = res.data.data.length ? res.data.data.map(item => {
                return {
                    label: item.nickName,
                    value: item.id
                }
            }) : []
            targetOption.loading = false;
            if (children.length) {
                targetOption.children = children
            } else {
                targetOption.isLeaf = true
            }
            this.options = [...this.options]
        },
        // 初始化数据
        initData() {
            this.getRoleList()
        },
        // 查询部门列表
        async getDeptList() {
            const res = await getDeptList({})
            if (res.data.status.retCode === 0) {
                this.deptList = res.data.data
            }
        },
        // 查询职位列表
        async getRoleList() {
            const res = await getRoleList({})
            if (res.data.status.retCode === 0) {
                this.roleList = res.data.data
                this.options = this.roleList.map(item => {
                    return {
                        label: item.roleName,
                        value: item.id,
                        isLeaf: false,
                    }
                })
            }
        },
        // 获取员工信息
        async getDeptInfo(id) {
            const res = await getDeptInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let keys = [
                    'deptName',
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
                        this.updateDeptInfo({ ...params, id: this.id }, callback)
                    } else {
                        this.addDeptInfo(params, callback)
                    }
                }
            })
        },
        addDeptInfo(params, callback) {
            addDeptInfo(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        updateDeptInfo(params, callback) {
            updateDeptInfo(params).then(res => {
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