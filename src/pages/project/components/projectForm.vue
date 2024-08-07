<template>
    <a-card class="projectForm" :body-style="{ padding: '0' }" :bordered="false">
        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :span="8" v-for="item in dataSouce" :key="item.key">
                    <a-form-item :label="item.label" :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }"  >
                        <a-input :placeholder="item.placeholder" v-if="item.type == 'input'"
                            v-decorator="[item.key, { rules: [{ required: item.required, message: item.placeholder }, { min: 6, message: '长度至少为 6!' }, { max: 32, message: '长度至多为 32!' }, { max: 32, message: '长度至多为 32!' }] }]" />

                        <a-select :placeholder="item.placeholder"
                            v-if="item.type == 'defaultSelect' && item.key !== 'productName'"
                            v-decorator="[item.key, { rules: [{ required: item.required, message: item.placeholder }] }]">
                            <a-select-option :value="_item.value" v-for="_item in item.options" :key="_item.value">{{
                                _item.name
                            }}</a-select-option>
                        </a-select>
                        <a-select :placeholder="item.placeholder"
                            v-if="item.type == 'defaultSelect' && item.key == 'productName'"
                            @change="handleProductNameChange"
                            v-decorator="[item.key, { rules: [{ required: item.required, message: item.placeholder }] }]">
                            <a-select-option :value="_item.value" v-for="_item in item.options" :key="_item.value">{{
                                _item.name
                            }}</a-select-option>
                        </a-select>
                        <a-select allowClear mode="combobox" showArrow showSearch multiple="false"
                            @dropdownVisibleChange="dropdownVisibleChange(item)" :placeholder="item.placeholder"
                            v-if="item.type == 'select'"
                            v-decorator="[item.key, { rules: [{ required: item.required, message: item.placeholder }] }]">
                            <a-select-option :value="_item" v-for="_item in item.options" :key="_item">{{ _item
                                }}</a-select-option>
                        </a-select>
                        <a-date-picker valueFormat="YYYY-MM-DD" style="width: 100%;" v-if="item.type == 'date-picker'"
                            v-decorator="[item.key, { rules: [{ required: item.required, message: item.placeholder }] }]" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-card>
</template>

<script>
import { getDeptList } from '@/services/user'
import { addProjectInfo, getProjectInfo, updateProjectInfo, getProjectTips } from '@/services/project'

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
                "浸渍罐",
                "系统改造",
                "冷却系统",
                "烘箱",
            ],
            projectType: "",
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
            ],
            formList: [
                {
                    label: "项目编号",
                    key: "number",
                    type: "input",
                    placeholder: "请输入项目编号",
                    required: true,
                    hide: []
                },
                {
                    label: "产品编号",
                    key: "productNumber",
                    type: "input",
                    placeholder: "请输入产品编号",
                    hide: [],
                    required: true,
                },
                {
                    label: "客户名称",
                    key: "customerName",
                    type: "select",
                    placeholder: "请选择客户名称",
                    hide: [],
                    options: [

                    ],
                    required: true
                },

                {
                    label: "产品名称",
                    key: "productName",
                    type: "defaultSelect",
                    hide: [],
                    required: true,
                    options: [
                        {
                            name: "热压罐",
                            value: '热压罐'
                        },
                        {
                            name: "储气罐",
                            value: '储气罐'
                        },
                        {
                            name: "液压釜",
                            value: '液压釜'
                        },
                        {
                            name: "固化炉",
                            value: '固化炉'
                        },
                        {
                            name: "浸渍罐",
                            value: '浸渍罐'
                        },
                        {
                            name: "系统改造",
                            value: '系统改造'
                        },
                        {
                            name: "冷却系统",
                            value: '冷却系统'
                        },
                        {
                            name: "烘箱",
                            value: '烘箱'
                        },
                        {
                            name: "缓冲罐",
                            value: '缓冲罐'
                        },
                    ],
                    placeholder: "请选择产品名称"
                },
                {
                    label: "级别",
                    key: "level",
                    type: "defaultSelect",
                    required: true,
                    hide: [],
                    options: [
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
                    ],
                    placeholder: "请选择级别"
                },
                {
                    label: "规格/型号",
                    key: "Model",
                    type: "select",
                    required: true,
                    options: [

                    ],
                    hide: [],
                    placeholder: "请选择规格/型号"
                },
                {
                    label: "下单日期",
                    key: "orderDate",
                    type: "date-picker",
                    placeholder: "请选择下单日期",
                    hide: [],
                    required: true
                },
                {
                    label: "发货日期",
                    key: "deliveryDate",
                    type: "date-picker",
                    placeholder: "请选择发货日期",
                    hide: [],
                    required: true
                },
                {
                    label: "罐体尺寸",
                    key: "tankSize",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择罐体尺寸"
                },
                {
                    label: "容积(m³)",
                    key: "volume",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择容积(m³)"
                },
                {
                    label: "工作压力(MPa)",
                    key: "workingPressure",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择工作压力(MPa)"
                },
                {
                    label: "设计压力(MPa)",
                    key: "designPressure",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择设计压力(MPa)"
                },
                {
                    label: "工作温度(℃)",
                    key: "workingTemperature",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择工作温度(℃)"
                },
                {
                    label: "罐体厚度(mm)",
                    key: "tankthickness",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择罐体厚度(mm)"
                },
                {
                    label: "球冠封头厚度(mm)",
                    key: "sphericalCrownThickness",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择球冠封头厚度(mm)"
                },
                // 份
                {
                    label: "椭圆封头厚度(mm)",
                    key: "ellipticalHeadThickness",
                    type: "select",
                    hide: [],
                    options: [

                    ],
                    placeholder: "请选择椭圆封头厚度(mm)"
                },
                {
                    label: "加热功率(kw)",
                    key: "heatingPower",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择加热功率(kw)"
                },
                {
                    label: "循环风机",
                    key: "circulatingFan",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择循环风机"
                },
                {
                    label: "热电偶",
                    key: "thermocouple",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择热电偶"
                },
                {
                    label: "检测口",
                    key: "inspectionPort",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择检测口"
                },
                {
                    label: "罐门结构",
                    key: "doorStructure",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择罐门结构"
                },
                {
                    label: "开门方向",
                    key: "openingDirection",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择开门方向"
                },
                {
                    label: "真空路数",
                    key: "vacuumNumber",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择真空路数"
                },
                {
                    label: "真空泵",
                    key: "vacuumPump",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择真空泵"
                },
                // 份
                {
                    label: "缓冲罐(m³)",
                    key: "bufferTank",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择缓冲罐(m³)"
                },
                {
                    label: "真空度",
                    key: "vacuumDegree",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择真空度"
                },
                {
                    label: "储气罐规格",
                    key: "assModel",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择储气罐规格"
                },
                {
                    label: "储气罐工作压力(MPa)",
                    key: "assWorkingPressure",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择储气罐工作压力(MPa)"
                },
                {
                    label: "储气罐筒体厚度(mm)",
                    key: "assTankthickness",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择储气罐筒体厚度(mm)"
                },
                {
                    label: "储气罐封头厚度(mm)",
                    key: "assHeadThickness",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择储气罐封头厚度(mm)"
                },
                {
                    label: "空压机",
                    key: "airCompressor",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择空压机"
                },
                {
                    label: "制氮机",
                    key: "nitrogenPlant",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择制氮机"
                },
                {
                    label: "增压机",
                    key: "supercharger",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择增压机"
                },
                // f
                {
                    label: "罐内小车",
                    hide: ['储气罐'],
                    key: "carInTank",
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择罐内小车"
                },
                {
                    label: "罐外小车",
                    key: "carOutTank",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择罐外小车"
                },
                {
                    label: "桥架",
                    key: "bridgeTray",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择桥架"
                },
                {
                    label: "牵引车",
                    key: "tractor",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择牵引车"
                },
                {
                    label: "减压阀",
                    key: "pressureReliefValve",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择减压阀"
                },
                {
                    label: "进气阀组",
                    key: "intakeValveGroup",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择进气阀组"
                },
                {
                    label: "排气阀组",
                    key: "exhaustValveGroup",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择排气阀组"
                },
                {
                    label: "冷却阀组",
                    key: "coolingValveGroup",
                    hide: ['储气罐'],
                    type: "select",
                    options: [

                    ],
                    placeholder: "请选择冷却阀组"
                },
                {
                    label: "排空阀组",
                    key: "emptyValveGroup",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择排空阀组"
                },
                {
                    label: "气冷阀组",
                    key: "airCooledValve",
                    type: "select",
                    hide: ['储气罐'],
                    options: [

                    ],
                    placeholder: "请选择气冷阀组"
                },
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
        dataSouce() {
            return this.formList.filter(item=> {
                return !item.hide.includes(this.projectType)
            })
        }
    },
    created() {
    },
    methods: {
        onChange() {

        },
        handleProductNameChange(v) {
            this.projectType = v
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
                // let keys = [
                //     'number',
                //     'productNumber',
                //     'customerName',
                //     'productName',
                //     'level',
                // ]
                console.log(res.data.data);
                this.projectType = res.data.data.productName
                let keys = this.formList.map(item => item.key)
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
        async dropdownVisibleChange(v) {
            console.log(v.options.length);
            if (!v.options.length) {
                let res = await getProjectTips({ remark: v.label })
                if (res.data.status.retCode == 0) {
                    v.options = res.data.data
                }
            }
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

<style lang="less">
.projectForm {
    .ant-form-item {
        margin-bottom: 8px;
    }
}
</style>