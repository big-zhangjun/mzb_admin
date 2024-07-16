<template>
    <a-card :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'数量'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input :placeholder="'请输入数量'"
                    v-decorator="['deptName', { rules: [{ required: true, message: '请输入数量' }] }]" />
            </a-form-item>

            <a-form-item :label="'是否发货'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择是否发货'"
                    v-decorator="['delivered', { rules: [{ required: true, message: '请选择是否发货' }] }]">
                    <a-select-option :value="item.code" v-for="item in deliveredList" :key="item.code">{{ item.name
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'未发原因'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择未发原因'"
                    v-decorator="['reason', { rules: [{ required: true, message: '请选择未发原因' }] }]">
                    <a-select-option :value="item" v-for="item in reasonList" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'预计发货时间'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-range-picker v-decorator="['expectDate', { rules: [{ required: true, message: '请选择未发原因' }] }]" />
            </a-form-item>
            <a-form-item :label="'备注'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-textarea rows="4" :placeholder="'请输入备注'"
                    v-decorator="['remark', { rules: [{ required: false, message: '请输入部门描述' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import { addDeptInfo, getDeptList, getRoleListS, getDeptInfo, updateDeptInfo, getUserListS } from '@/services/user'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            reasonList: [
                "缺料",
                "网购",
                "待生产",
            ],
            deliveredList: [
                {
                    code: 1,
                    name: "是"
                },
                {
                    code: 2,
                    name: "否"
                }
            ],
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
            const res = await getUserListS({ roleId: targetOption.value })
            let children = res.data.data.length ? res.data.data.map(item => {
                return {
                    label: item.userName,
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
            this.getRoleListS()
        },
        // 查询部门列表
        async getDeptList() {
            const res = await getDeptList({})
            if (res.data.status.retCode === 0) {
                this.deptList = res.data.data
            }
        },
        // 查询职位列表
        async getRoleListS() {
            const res = await getRoleListS({})
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
                        getUserListS({ roleId: managerRoleID }).then(respone => {
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