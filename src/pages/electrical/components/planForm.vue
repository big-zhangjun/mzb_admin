<template>
    <a-card :body-style="{ padding: '0 0 ' }" :bordered="false">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="电气柜">
                <div style="width: 80%;margin: 0 auto;">
                    <a-form :form="ecForm">
                        <a-form-item :label="'电气柜负责人'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                            <a-select mode="multiple" placeholder="请选择" @deselect="handleMenageDeselect($event, 'ec')"
                                @select="handleMenageSelect($event, 'ec')"
                                v-decorator="['ecRep', { rules: [{ required: false, message: '请选择负责人' }] }]">
                                <a-select-option :value="item.id" v-for="item in userList" :key="item.id">
                                    {{ item.userName }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :label="'电气柜开始日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                            <a-date-picker @change="onChangeStart('ec')" style="width: 100%;"
                                v-decorator="['ecStartDate', { rules: [{ required: false, message: '请选择日期' }] }]" />
                        </a-form-item>
                        <a-form-item :label="'电气柜结束日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                            <a-date-picker @change="onChangeEnd('ec')" style="width: 100%;"
                                v-decorator="['ecEndDate', { rules: [{ required: false, message: '请选择日期' }] }]" />
                        </a-form-item>
                        <a-form-item :label="'电气柜安装状态'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                            <a-select
                                v-decorator="['ecStatus', { rules: [{ required: false, message: '请选择电气柜安装状态' }] }]"
                                 placeholder="请选择" @select="handleEcStatus('ec')">
                                <a-select-option :value="item.id" v-for="item in statusList" :key="item.id">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="现场安装" force-render>
                <a-form :form="ecForm">
                    <a-form-item :label="'现场安装负责人'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select mode="multiple" placeholder="请选择" @deselect="handleMenageDeselect($event, 'si')"
                            @select="handleMenageSelect($event, 'si')"
                            v-decorator="['siRep', { rules: [{ required: false, message: '请选择负责人' }] }]">
                            <a-select-option :value="item.id" v-for="item in userList" :key="item.id">
                                {{ item.userName }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'现场安装开始日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-date-picker @change="onChangeStart('si')" style="width: 100%;"
                            v-decorator="['siStartTime', { rules: [{ required: false, message: '请选择日期' }] }]" />
                    </a-form-item>
                    <a-form-item :label="'现场安装结束日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-date-picker @change="onChangeEnd('si')" style="width: 100%;"
                            v-decorator="['siEndTime', { rules: [{ required: false, message: '请选择日期' }] }]" />
                    </a-form-item>
                    <a-form-item :label="'现场安装状态'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select v-decorator="['siStatus', { rules: [{ required: false, message: '请选择日期' }] }]"
                             placeholder="请选择" @select="handleEcStatus('si')">
                            <a-select-option :value="item.id" v-for="item in statusList" :key="item.id">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="3" tab="清单" force-render>
                <a-form :form="ecForm">
                    <a-form-item :label="'电气柜清单'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select @select="handleListSelect($event, 'ec')" placeholder="请选择"
                            v-decorator="['electricalList', { rules: [{ required: false, message: '请选择电气柜清单' }] }]">
                            <a-select-option :value="item.id" v-for="item in list" :key="item.id">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'现场安装清单'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select @select="handleListSelect($event, 'si')" placeholder="请选择"
                            v-decorator="['invoiceList', { rules: [{ required: false, message: '请选择现场安装清单' }] }]">
                            <a-select-option :value="item.id" v-for="item in list" :key="item.id">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <!-- <a-tab-pane key="3" tab="售后" force-render>
                <a-form :form="ecForm">
                    <a-form-item :label="'售后负责人'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select mode="multiple" placeholder="请选择" @deselect="handleMenageDeselect($event, 'as')"
                            @select="handleMenageSelect($event, 'as')"
                            v-decorator="['asRep', { rules: [{ required: false, message: '请选择负责人' }] }]">
                            <a-select-option :value="item.id" v-for="item in userList" :key="item.id">
                                {{ item.userName }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="'售后开始日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-date-picker @change="onChangeStart('as')" style="width: 100%;"
                            v-decorator="['asStartTime', { rules: [{ required: false, message: '请选择日期' }] }]" />
                    </a-form-item>
                    <a-form-item :label="'售后结束日期'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-date-picker @change="onChangeEnd('as')" style="width: 100%;"
                            v-decorator="['asEndTime', { rules: [{ required: false, message: '请选择日期' }] }]" />
                    </a-form-item>
                    <a-form-item :label="'售后状态'" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-select v-decorator="['asStatus', { rules: [{ required: false, message: '请选择日期' }] }]"
                             placeholder="请选择" @select="handleEcStatus('as')">
                            <a-select-option :value="item.id" v-for="item in statusList" :key="item.id">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-tab-pane> -->
        </a-tabs>
    </a-card>
</template>

<script>
import { getUserList } from '@/services/user'
import { addEcRep, delEcRep, updateEcInfo, addSiRep, delSiRep, updateSiInfo, addAsRep, delAsRep, updateAsInfo } from '@/services/electrical'
import moment from 'moment';
import { getProjectEpInfo, updateEcListInfo } from '@/services/project'
export default {
    name: 'BasicForm',
    // i18n: require('./i18n'),
    data() {
        return {
            id: "",
            value: 1,
            userList: [],
            ecForm: this.$form.createForm(this),
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
        this.getUserList()
    },
    methods: {
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
            console.log(v, '选中', k);
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
            console.log(v, '取消', k);
        },
        handleEcStatus(type) {
            switch (type) {
                case "ec":
                    this.updateEcInfo()
                    break
                case "si":
                    this.updateSiInfo()
                    break
                case "as":
                    this.updateAsInfo()
                    break
            }
        },
        async updateEcInfo() {
            let startDate = moment(this.ecForm.getFieldsValue().ecStartDate).format('YYYY-MM-DD')
            let endDate = moment(this.ecForm.getFieldsValue().ecEndDate).format('YYYY-MM-DD')
            let status = this.ecForm.getFieldsValue().ecStatus
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
            const result = await updateEcInfo(params)
            console.log(result);
        },
        async updateSiInfo() {
            let startDate = moment(this.ecForm.getFieldsValue().siStartTime).format('YYYY-MM-DD')
            let endDate = moment(this.ecForm.getFieldsValue().siEndTime).format('YYYY-MM-DD')
            let status = this.ecForm.getFieldsValue().siStatus
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
            const result = await updateSiInfo(params)
            console.log(result);
        },
        async updateAsInfo() {
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
            console.log(result);
        },
        onChangeStart(type) {
            this.$nextTick(() => {
                switch (type) {
                    case "ec":
                        this.updateEcInfo()
                        break
                    case "si":
                        this.updateSiInfo()
                        break
                    case "as":
                        this.updateAsInfo()
                        break
                }
            })
        },
        onChangeEnd(type) {
            this.$nextTick(() => {
                switch (type) {
                    case "ec":
                        this.updateEcInfo()
                        break
                    case "si":
                        this.updateSiInfo()
                        break
                    case "as":
                        this.updateAsInfo()
                        break
                }
            })
        },
        // 获取员工信息
        async getProjectInfo(id) {
            const res = await getProjectEpInfo({ id })
            this.id = id
            if (res.data.status.retCode === 0) {
                let ecRep = res.data.data.ecRep ? res.data.data.ecRep.split(",").map(item => +item) : [];
                let siRep = res.data.data.siRep ? res.data.data.siRep.split(",").map(item => +item) : [];
                // let asRep = res.data.data.siRep ? res.data.data.asRep.split(",").map(item => +item) : [];
                console.log(res.data.electricalList);
                this.ecForm.setFieldsValue({
                    ecRep,
                    ecStartDate: res.data.data.ecStartDate == '1000-01-01' ? '' : res.data.data.ecStartDate,
                    ecEndDate: res.data.data.ecEndDate == '1000-01-01' ? '' : res.data.data.ecEndDate,
                    ecStatus: res.data.data.ecStatus,
                    electricalList: res.data.data.electricalList,
                    siRep,
                    siStartTime: res.data.data.siStartTime == '1000-01-01' ? '' : res.data.data.siStartTime,
                    siEndTime: res.data.data.siEndTime == '1000-01-01' ? '' : res.data.data.siEndTime,
                    siStatus: res.data.data.siStatus,
                    invoiceList: res.data.data.invoiceList
                    // asRep,
                    // asStartTime: res.data.data.asStartTime,
                    // asEndTime: res.data.data.asEndTime,
                    // asStatus: res.data.data.asStatus,
                });
                this.detail = res.data.data
            }
        },
        // 更改状态
        async handleListSelect() {
            let params = {
                id:  this.id,
                electricalList: this.ecForm.getFieldsValue().electricalList,
                invoiceList: this.ecForm.getFieldsValue().invoiceList
            }
            await updateEcListInfo(params)
            this.$emit('unpadeList')
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
        callback() { },
        async getUserList() {
            let params = {}
            let res = await getUserList(params)
            if (res.data.status.retCode == 0) {
                this.userList = res.data.data
            }
        }
    }
}
</script>

<style scoped></style>