<template>
    <div>
        <a-card :body-style="{ padding: '0 0 ' }" :bordered="false">
            <a-form :form="ecForm">
                <a-form-item v-if="showType == 'productName'" :label="'产品名称'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select placeholder="请选择"
                        v-decorator="['productName', { rules: [{ required: true, message: '请选择产品名称' }] }]">
                        <a-select-option :value="item" v-for="item in productNameList" :key="item">
                            {{ item }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'productNumber'" :label="'产品编号'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-input placeholder="请输入产品编号"
                        v-decorator="['productNumber', { rules: [{ required: true, message: '请输入产品编号' }, { min: 6, message: '长度至少为 6!' }, { max: 32, message: '长度至多为 32!' }, { max: 32, message: '长度至多为 32!' }] }]" />
                </a-form-item>
                <a-form-item v-if="showType == 'model'" :label="'规格/型号'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select show-search placeholder="请选择规格/型号"
                        v-decorator="['model', { rules: [{ required: true, message: '请选择规格/型号' }] }]">
                        <a-select-option :value="item" v-for="item in modeList" :key="item">
                            {{ item }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'level'" :label="'级别'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select placeholder="请选择规格/型号"
                        v-decorator="['level', { rules: [{ required: true, message: '请选择规格/型号' }] }]">
                        <a-select-option :value="item.value" v-for="item in levels" :key="item.value">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'ecRep'" :label="'电气柜负责人'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select mode="multiple" placeholder="请选择" @deselect="handleMenageDeselect($event, 'ec')"
                        @select="handleMenageSelect($event, 'ec')"
                        v-decorator="['ecRep', { rules: [{ required: true, message: '请选择负责人' }] }]">
                        <a-select-option :value="item.id" v-for="item in userList" :key="item.id">
                            {{ item.userName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'ecStartDate'" :label="'电气柜开始日期'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-date-picker style="width: 100%;"
                        v-decorator="['ecStartDate', { rules: [{ required: true, message: '请选择日期' }] }]" />
                </a-form-item>
                <a-form-item v-if="showType == 'ecEndDate'" :label="'电气柜结束日期'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-date-picker style="width: 100%;"
                        v-decorator="['ecEndDate', { rules: [{ required: true, message: '请选择日期' }] }]" />
                </a-form-item>
                <a-form-item v-if="showType == 'ecStatus'" :label="'电气柜安装状态'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select v-decorator="['ecStatus', { rules: [{ required: true, message: '请选择电气柜安装状态' }] }]"
                        placeholder="请选择">
                        <a-select-option :value="item.id" v-for="item in statusList" :key="item.id">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'siRep'" :label="'现场安装负责人'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select mode="multiple" placeholder="请选择" @select="handleMenageSelect($event, 'si')"
                        @deselect="handleMenageDeselect($event, 'si')"
                        v-decorator="['siRep', { rules: [{ required: true, message: '请选择负责人' }] }]">
                        <a-select-option :value="item.id" v-for="item in userList" :key="item.id">
                            {{ item.userName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'siStartTime'" :label="'现场安装开始日期'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-date-picker style="width: 100%;"
                        v-decorator="['siStartTime', { rules: [{ required: true, message: '请选择日期' }] }]" />
                </a-form-item>
                <a-form-item v-if="showType == 'siEndTime'" :label="'现场安装结束日期'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-date-picker style="width: 100%;"
                        v-decorator="['siEndTime', { rules: [{ required: true, message: '请选择日期' }] }]" />
                </a-form-item>
                <a-form-item v-if="showType == 'siStatus'" :label="'现场安装状态'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select v-decorator="['siStatus', { rules: [{ required: true, message: '请选择日期' }] }]"
                        placeholder="请选择">
                        <a-select-option :value="item.id" v-for="item in statusList" :key="item.id">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'electricalList'" :label="'电气清单'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select placeholder="请选择"
                        v-decorator="['electricalList', { rules: [{ required: true, message: '请选择电气清单' }] }]">
                        <a-select-option :value="item.id" v-for="item in list" :key="item.id">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="showType == 'invoiceList'" :label="'发货清单'" :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }">
                    <a-select placeholder="请选择"
                        v-decorator="['invoiceList', { rules: [{ required: true, message: '请选择发货清单' }] }]">
                        <a-select-option :value="item.id" v-for="item in list" :key="item.id">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
import { addEcRep, delEcRep, updateEcInfo, addSiRep, delSiRep, updateSiInfo, addAsRep, delAsRep, updateAsInfo } from '@/services/electrical'
import { getProjectTips, updateEcListInfo } from '@/services/project'
import { getUserList } from '@/services/user'
import moment from 'moment';
export default {
    props: ['showType', 'detail'],
    data() {
        return {
            ecForm: this.$form.createForm(this),
            modeList: [],
            userList: [],
            list: [
                {
                    label: "有",
                    id: 1
                },
                {
                    label: "无",
                    id: 0
                },
            ],
            statusList: [
                {
                    label: "未开始",
                    id: 1
                },
                {
                    label: "进行中",
                    id: 2
                },
                {
                    label: "缺料中",
                    id: 3
                },
                {
                    label: "已完成",
                    id: 4
                }
            ],
            productNameList: [
                "热压罐",
                "储气罐",
                "液压釜",
                "固化炉",
                "浸渍罐",
                "系统改造"
            ],
            levels: [
                {
                    name: "P1",
                    value: 1
                },
                {
                    name: "P2",
                    value: 2
                },
                {
                    name: "P3",
                    value: 3
                },
                {
                    name: "P4",
                    value: 4
                },
                {
                    name: "P5",
                    value: 5
                }
            ]
        }
    },
    created() {
        this.getUserList()
        this.getModelList()
    },
    methods: {
        async getUserList() {
            let params = {}
            let res = await getUserList(params)
            if (res.data.status.retCode == 0) {
                this.userList = res.data.data
            }
        },
        async addEcRep(params) {
            const res = await addEcRep(params)
            console.log(res);
        },
        async delEcRep(params) {
            const res = await delEcRep(params)
            console.log(res);
        },
        async addSiRep(params) {
            const res = await addSiRep(params)
            console.log(res);
        },
        async delSiRep(params) {
            const res = await delSiRep(params)
            console.log(res);
        },
        async addAsRep(params) {
            const res = await addAsRep(params)
            console.log(res);
        },
        async delAsRep(params) {
            const res = await delAsRep(params)
            console.log(res);
        },
        // 选择人
        handleMenageSelect(v, k) {
            let rep = this.userList.find(item => item.id == v)
            let params = {
                id: this.detail.id,
                rep: +v,
                repName: rep.userName
            }
            switch (k) {
                case "ec":
                    this.addEcRep(params)
                    break
                case "si":
                    this.addSiRep(params)
                    break
                case "as":
                    this.addAsRep(params)
                    break
            }
        },
        handleMenageDeselect(v, k) {
            let rep = this.userList.find(item => item.id == v)
            let params = {
                id: this.detail.id,
                rep: +v,
                repName: rep.userName
            }
            switch (k) {
                case "ec":
                    this.delEcRep(params)
                    break
                case "si":
                    this.delSiRep(params)
                    break
                case "as":
                    this.delAsRep(params)
                    break
            }
        },
        async getModelList() {
            let res = await getProjectTips({ remark: '规格/型号' })
            if (res.data.status.retCode == 0) {
                this.modeList = res.data.data
            }
        },
        handleEcStatus(type, callback) {
            switch (type) {
                case "ecStatus":
                    {
                        let status = this.ecForm.getFieldsValue().ecStatus
                        let statusCN = ""
                        let res = this.statusList.find(item => item.id == status)
                        if (res) {
                            statusCN = res.label
                        }
                        let params = {
                            startDate: this.detail.startDate,
                            endDate: this.detail.endDate,
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateEcInfo(callback, params)
                    }
                    break
                case "ecStartDate":
                    {
                        let status = this.detail.ecStatus
                        let statusCN = this.detail.ecStatusCN
                        let params = {
                            startDate: moment(this.ecForm.getFieldsValue().ecStartDate).format('YYYY-MM-DD'),
                            endDate: this.detail.ecEndDate,
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateEcInfo(callback, params)
                    }
                    break
                case "ecEndDate":
                    {
                        let status = this.detail.ecStatus
                        let statusCN = this.detail.ecStatusCN
                        let params = {
                            startDate: this.detail.ecStartDate,
                            endDate: moment(this.ecForm.getFieldsValue().ecEndDate).format('YYYY-MM-DD'),
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateEcInfo(callback, params)
                    }
                    break
                case "siStatus":
                    {
                        let status = this.ecForm.getFieldsValue().siStatus
                        let statusCN = ""
                        let res = this.statusList.find(item => item.id == status)
                        if (res) {
                            statusCN = res.label
                        }
                        let params = {
                            startDate: this.detail.siStartTime,
                            endDate: this.detail.siEndTime,
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateSiInfo(callback, params)
                    }
                    break
                case "siEndTime":
                    {
                        let status = this.detail.siStatus
                        let statusCN = this.detail.siStatusCN
                        let params = {
                            startDate: this.detail.siStartTime,
                            endDate: moment(this.ecForm.getFieldsValue().siEndTime).format('YYYY-MM-DD'),
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateSiInfo(callback, params)
                    }
                    break
                case "siStartTime":
                    {
                        let status = this.detail.siStatus
                        let statusCN = this.detail.siStatusCN
                        let params = {
                            startDate: moment(this.ecForm.getFieldsValue().siStartTime).format('YYYY-MM-DD'),
                            endDate: this.detail.siEndTime,
                            status: status,
                            statusCN: statusCN
                        }
                        this.updateSiInfo(callback, params)
                    }
                    break
                case "asStatus":
                    this.updateAsInfo(callback)
                    break
            }
        },
        async updateEcInfo(callback, p) {
            let params = {
                "id": this.detail.id,
                ...p
            }
            const result = await updateEcInfo(params)
            console.log(result);
            callback('update')
        },
        async updateSiInfo(callback, p) {
            let params = {
                "id": this.detail.id,
                ...p
            }
            const result = await updateSiInfo(params)
            callback('update')
            console.log(result);
        },
        async updateAsInfo(callback) {
            let startDate = moment(this.ecForm.getFieldsValue().asStartTime).format('YYYY-MM-DD')
            let endDate = moment(this.ecForm.getFieldsValue().asEndTime).format('YYYY-MM-DD')
            let status = this.ecForm.getFieldsValue().asStatus
            let statusCN = ""
            let res = this.statusList.find(item => item.id == status)
            if (res) {
                statusCN = res.label
            }
            let params = {
                "id": this.detail.id,
                "startDate": startDate,
                "endDate": endDate,
                "status": status,
                "statusCN": statusCN
            }
            const result = await updateAsInfo(params)
            callback('update')
            console.log(result);
        },
        // 更改状态
        async handleListSelect(key, callback) {
            let params = {
                id: this.detail.id,
                // electricalList: this.ecForm.getFieldsValue().electricalList,
                // invoiceList: this.ecForm.getFieldsValue().invoiceList
            }
            if (key == 'invoiceList') {
                params.electricalList = this.detail.electricalList
                params.invoiceList = this.ecForm.getFieldsValue().invoiceList
            } else {
                params.invoiceList = this.detail.invoiceList
                params.electricalList = this.ecForm.getFieldsValue().electricalList
            }
            await updateEcListInfo(params)
            callback('update')
        },
        handleSubmit(callback) {
            this.ecForm.validateFields((err) => {
                if (!err) {
                    if (['siRep', 'asRep', 'ecRep'].includes(this.showType)) {
                        callback('update')
                    } else if (['ecStatus', 'asStatus', 'siStatus', 'ecStartDate', 'ecEndDate', 'siStartTime', 'siEndTime'].includes(this.showType)) {
                        this.handleEcStatus(this.showType, callback)
                    } else if (['electricalList', 'invoiceList'].includes(this.showType)) {
                        this.handleListSelect(this.showType, callback)
                    }
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped></style>