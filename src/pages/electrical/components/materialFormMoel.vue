<template>
    <a-card :bordered="false">
        <a-form :form="form">
            <a-form-item v-if="type == 'add'" :label="'选择项目'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-button type="primtry" @click="showModel = true">选择项目</a-button>
                {{ projectInfo.customerName }}
            </a-form-item>
            <a-form-item v-else :label="'选择项目'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                {{ detail.customerName }}
            </a-form-item>
            <a-form-item :label="'发货单位'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择发货单位'" @change="handleDeliveryChange"
                    v-decorator="['fromCompany', { rules: [{ required: false, message: '请选择发货单位' }] }]">
                    <a-select-option :value="item" v-for="item in fromCompanyList" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'来源'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择来源'"
                    v-decorator="['source', { rules: [{ required: false, message: '请选择来源' }] }]">
                    <a-select-option :value="item" v-for="item in sourceList" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'金蝶单号'" v-if="permission.includes(5)" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input :placeholder="'请输入金蝶单号'"
                    v-decorator="['kingdeeBill', { rules: [{ required: false, message: '请输入金蝶单号' }] }]" />
            </a-form-item>
            <a-form-item :label="'完整率'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input disabled :placeholder="'请输入完整率'"
                    v-decorator="['progress', { rules: [{ required: false, message: '请输入完整率' }] }]" />
            </a-form-item>
            <a-form-item :label="'备注'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-textarea rows="4" :placeholder="'请输入备注'"
                    v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]" />
            </a-form-item>

         
        </a-form>
        <a-modal v-model="showModel" title="项目列表" @ok="handleSelect" :width="900">
            <cusModel ref="cusModel" />
        </a-modal>
    </a-card>
</template>

<script>
import moment from 'moment';
import { getShotageInfo, updateShotInfo, addShotInfo } from '@/services/electrical'
import cusModel from '@/pages/electrical/components/cusModel'
export default {
    components: { cusModel },
    name: 'materialFormMoel',
    // i18n: require('./i18n'),
    data() {
        return {
            projectInfo: {},
            showModel: false,
            sourceList: [
                "项目现场安装",
                "网购",
                "售后"
            ],
            fromCompanyList: [
                "凯之路（上海）复合材料科技有限公司",
                "美洲豹空天软件开发（台州）有限公司",
                "美洲豹（浙江）航空装备有限公司",
                "浙江美洲豹特种设备有限公司",
            ],
            id: "",
            value: 1,
            form: this.$form.createForm(this),
            detail: {}
        }
    },
    props: {
        type: {
            type: String,
            default: "add"
        },
        permission: {
            type: Array,
            default: ()=> []
        }
    },
    methods: {
        initData(id) {
            this.id = id
            this.getShotageInfo(id)
        },
        async getShotageInfo(id) {
            this.id = id
            let res = await getShotageInfo({ id })
            let keys = [
                "fromCompany",
                "source",
                "kingdeeBill",
                "remark"
            ]
            this.detail = res.data.data
            Object.keys(res.data.data).forEach((item) => {
                if (keys.includes(item)) {
                    this.form.setFieldsValue({
                        [item]: res.data.data[item]
                    })
                }
            })
            this.form.setFieldsValue({
                'progress': res.data.data.progress ? res.data.data.progress + "%" : "0%"
            })

        },
        resetFields() {
            this.form.resetFields()
            this.form.setFieldsValue({ fromCompany: "浙江美洲豹特种设备有限公司" })
            this.form.setFieldsValue({ 'progress': "0%" })
        },
        handleDeliveryChange(value) {
            this.isDelivered = value === 0; // assuming 'yes' is the code for delivered
        },
        handleSubmit(callback) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let params = {
                        ...values,
                        progress: this.detail.progress,
                        id: this.id
                    }
                    if (this.type == 'edit') {
                        this.updateShotInfo(params, callback)
                    } else {
                        this.addShotInfo(callback)
                    }
                }
            })
        },
        async handleSelect() {
            let projectID = this.$refs.cusModel.selectedRow
            if (!projectID) {
                this.$message.warning("请选择项目")
                return
            }
            this.projectInfo = this.$refs.cusModel.projectInfo
            this.showModel = false

        },
        addShotInfo(callback) {
            let projectID = this.$refs.cusModel && this.$refs.cusModel.selectedRow
            if (!projectID) {
                this.$message.warning("请选择项目")
                return
            }
            this.form.validateFields(async (err, values) => {
                let user = JSON.parse(localStorage.getItem("admin.user"))
                let params = {
                    ...values,
                    projectID,
                    applyDate: moment().format('YYYY-MM-DD'),
                    "progress": 0,
                    applyUserID: user.id,

                }
                let res = await addShotInfo(params)
                if (res.data.status.retCode === 0) {
                    this.$message.success("操作成功")
                    callback()
                } else {
                    this.$message.warning(res.data.status.msg)
                }
            })
        },
        async updateShotInfo(params, callback) {
            let res = await updateShotInfo(params)
            if (res.data.status.retCode === 0) {
                this.$message.success("操作成功")
                callback()
            } else {
                this.$message.warning(res.data.status.msg)
            }
        }
    }
}
</script>

<style scoped></style>