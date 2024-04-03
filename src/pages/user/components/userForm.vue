<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'用户名'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入用户名'"
                    v-decorator="['userName', { rules: [{ required: true, message: '请输入手机号码' }] }]" />
            </a-form-item>
            <a-form-item :label="'真实姓名'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入真实姓名'"
                    v-decorator="['nickName', { rules: [{ required: true, message: '请输入手机号码' }] }]" />
            </a-form-item>
            <a-form-item :label="'部门'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择部门'"
                    v-decorator="['deptID', { rules: [{ required: true, message: '请选择部门' }] }]">
                    <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{ item.deptName
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'角色'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择角色'"
                    v-decorator="['roleID', { rules: [{ required: true, message: '请选择角色' }] }]">
                    <a-select-option :value="item.id" v-for="item in roleList" :key="item.id">{{ item.roleName
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'手机号码'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入手机号码'"
                    v-decorator="['mobile', { rules: [{ required: true, message: '请输入手机号码' }] }]"></a-input>
            </a-form-item>
            <a-form-item :label="'邮箱'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入邮箱'"
                    v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱' }] }]"></a-input>
            </a-form-item>
            <a-form-item :label="'性别'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-radio-group v-decorator="['sex', { rules: [{ required: true, message: '请选择性别' }] }]">
                    <a-radio :value="0">男</a-radio>
                    <a-radio :value="1">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <!-- <a-form-item :label="'密码'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入密码'" v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"/>
            </a-form-item> -->
            <a-form-item :label="'地址'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-textarea rows="4" :placeholder="'请输入地址'"
                    v-decorator="['address', { rules: [{ required: true, message: '请输入地址' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import { addUserInfo, getDeptList, getRoleList, getUserInfo, updateUserInfo } from '@/services/user'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            deptList: [],
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
        // 初始化数据
        initData() {
            this.getDeptList()
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
            }
        },
        // 获取员工信息
        async getUserInfo(id) {
            const res = await getUserInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let keys = [
                    'userName',
                    'nickName',
                    'deptID',
                    'roleID',
                    'mobile',
                    'sex',
                    'address',
                    'email',
                ]
                Object.keys(res.data.data).forEach(item => {
                    if (keys.includes(item)) {
                        this.form.setFieldsValue({ [item]: res.data.data[item] })
                    }
                })
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
                        password: '000000'
                    }
                    if (this.type == 'edit') {
                        this.updateUserInfo({...params, id: this.id}, callback)
                    } else {
                        this.addUserInfo(params, callback)
                    }
                }
            })
        },
        addUserInfo(params, callback) {
            addUserInfo(params).then(res => {
                if (res.data.status.retCode === 0) {
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        updateUserInfo(params, callback) {
            updateUserInfo(params).then(res => {
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