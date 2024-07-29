<template>
    <a-card :bordered="false">
        <a-form :form="form">
            <a-form-item :label="'数量'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input :placeholder="'请输入数量'" :disabled="disabled"
                    v-decorator="['amount', { rules: [{ required: false, message: '请输入数量' }] }]" />
            </a-form-item>
            <a-form-item :label="'是否发货'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择是否发货'" @change="handleDeliveryChange"
                    v-decorator="['delivered', { rules: [{ required: false, message: '请选择是否发货' }] }]">
                    <a-select-option :value="item.code" v-for="item in deliveredList" :key="item.code">{{ item.name
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="isDelivered" :label="'未发原因'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择未发原因'"
                    v-decorator="['reason', { rules: [{ required: false, message: '请选择未发原因' }] }]">
                    <a-select-option :value="item" v-for="item in reasonList" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'预计发货时间'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-date-picker v-decorator="['expectDate', { rules: [{ required: false, message: '请选择未发原因' }] }]"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item :label="'最终发货时间'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-date-picker v-decorator="['deliveryDate', { rules: [{ required: false, message: '请选择未发原因' }] }]"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item :label="'物流方式'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-select :placeholder="'请选择物流方式'"
                    v-decorator="['logistics', { rules: [{ required: false, message: '请选择物流方式' }] }]">
                    <a-select-option :value="item" v-for="item in logisticsList" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'快递单号'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input :placeholder="'请输入快递单号'"
                    v-decorator="['courierNumber', { rules: [{ required: false, message: '请输入快递单号' }] }]" />
            </a-form-item>
            <a-form-item :label="'签收数量'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-input :placeholder="'请输入签收数量'"
                    v-decorator="['ready', { rules: [{ required: false, message: '请输入签收数量' }] }]" />
            </a-form-item>
            <a-form-item :label="'备注'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                <a-textarea rows="4" :placeholder="'请输入备注'"
                    v-decorator="['remark', { rules: [{ required: false, message: '请输入部门描述' }] }]" />
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
import moment from 'moment';
import { updateMaterialShotInfo, getMaterialShotInfo } from '@/services/electrical'
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
            logisticsList: [
                "物流",
                "快递",
                "自带",
            ],
            deliveredList: [
                {
                    code: 1,
                    name: "是"
                },
                {
                    code: 0,
                    name: "否"
                }
            ],
            deptList: [],
            options: [],
            userList: [],
            id: "",
            roleList: [],
            value: 1,
            isDelivered: true,
            form: this.$form.createForm(this),
            detail: {}
        }
    },
    props: {
        type: {
            type: String,
            default: "add"
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {

        // desc() {
        //     return this.'pageDesc'
        // }
    },
    methods: {
        initData(id) {
            this.id = id
            this.getMaterialShotInfo(id)
        },
        handleDeliveryChange(value) {
            this.isDelivered = value === 0; // assuming 'yes' is the code for delivered
        },
        async getMaterialShotInfo(id) {
            let res = await getMaterialShotInfo({ id })
            let keys = [
                "amount",
                "delivered",
                "reason",
                "logistics",
                "courierNumber",
                "remark",
                'ready'
            ]
            this.detail = res.data.data
            Object.keys(res.data.data).forEach((item) => {
                if (keys.includes(item)) {
                    this.form.setFieldsValue({
                        [item]: res.data.data[item]
                    })
                }
            })
            let dateKeys = [
                "expectDate",
                "deliveryDate"
            ]
            dateKeys.forEach(item => {
                if (res.data.data[item] == '1000-01-01') {
                    this.form.setFieldsValue({
                        [item]: moment(), // set delivery date to today
                    });
                } else {
                    this.form.setFieldsValue({
                        [item]: res.data.data[item] // set delivery date to today
                    });
                }
            })
        },

        handleSubmit(callback) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let deliveryDate = this.form.getFieldsValue().deliveryDate
                    let expectDate = this.form.getFieldsValue().expectDate
                    let params = {
                        ...this.detail,
                        ...values,
                        amount: +values.amount,
                        ready: +values.ready,
                        deliveryDate: deliveryDate ? moment(deliveryDate).format('YYYY-MM-DD') : "1000-01-01",
                        expectDate: expectDate ? moment(expectDate).format('YYYY-MM-DD') : "1000-01-01",
                    }
                    if (this.type == 'edit') {
                        this.updateMaterialShotInfo({ ...params }, callback)
                    }
                }
            })
        },
        async updateMaterialShotInfo(params, callback) {
            let res = await updateMaterialShotInfo(params)
            if (res.data.status.retCode === 0) {
                callback()
            } else {
                this.$message.warning(res.data.status.msg)
            }
        }
    }
}
</script>

<style scoped></style>