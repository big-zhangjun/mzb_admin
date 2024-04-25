<template>
    <a-card class="projectForm" :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form :form="form">

            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item :label="'项目编号'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入项目编号'"
                            v-decorator="['number', { rules: [{ required: true, message: '请输入项目编号' }, { min: 6, message: '长度至少为 6!' }, { max: 32, message: '长度至多为 32!' } , { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'产品编号'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入产品编号'"
                            v-decorator="['productNumber', { rules: [{ required: true, message: '请输入产品编号' }, { min: 6, message: '长度至少为 6!' }, { max: 32, message: '长度至多为 32!' } , { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'客户名称'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入客户名称'"
                            v-decorator="['customerName', { rules: [{ required: true, message: '请输入客户名称' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'产品名称'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-select :placeholder="'请选择产品名称'"
                            v-decorator="['productName', { rules: [{ required: true, message: '请选择产品名称' }] }]">
                            <a-select-option :value="item" v-for="item in projectName" :key="item">{{ item
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请选择级别'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-select :placeholder="'请选择级别'"
                            v-decorator="['level', { rules: [{ required: true, message: '请选择级别' }] }]">
                            <a-select-option :value="item.value" v-for="item in levels" :key="item.name">{{ item.name
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请输入规格型号'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入规格型号'"
                            v-decorator="['Model', { rules: [{ required: true, message: '请输入规格型号' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <!-- 分割线 -->
                <a-col :span="8">
                    <a-form-item :label="'罐体尺寸'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入罐体尺寸'"
                            v-decorator="['tankSize', { rules: [{ required: false, message: '请输入罐体尺寸' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'容积(m³)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入容积(m³)'"
                            v-decorator="['volume', { rules: [{ required: false, message: '请输入容积(m³)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'工作压力(MPa)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入工作压力(MPa)'"
                            v-decorator="['workingPressure', { rules: [{ required: false, message: '请输入工作压力(MPa)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'设计压力(MPa)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入设计压力(MPa)'"
                            v-decorator="['designPressure', { rules: [{ required: false, message: '请输入设计压力(MPa)' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input >
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'工作温度(℃)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'工作温度(℃)'"
                            v-decorator="['workingTemperature', { rules: [{ required: false, message: '工作温度(℃)' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请输入罐体厚度(mm)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入罐体厚度(mm)'"
                            v-decorator="['tankthickness', { rules: [{ required: false, message: '请输入罐体厚度(mm)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'球冠封头厚度(mm)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入球冠封头厚度(mm)'"
                            v-decorator="['sphericalCrownThickness', { rules: [{ required: false, message: '请输入球冠封头厚度(mm)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'椭圆封头厚度(mm)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入椭圆封头厚度(mm)'"
                            v-decorator="['ellipticalHeadThickness', { rules: [{ required: false, message: '请输入椭圆封头厚度(mm)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'加热功率(kw)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入加热功率(kw)'"
                            v-decorator="['heatingPower', { rules: [{ required: false, message: '请输入加热功率(kw)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'循环风机'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择循环风机'"
                            v-decorator="['circulatingFan', { rules: [{ required: false, message: '请选择循环风机' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'热电偶'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'热电偶'"
                            v-decorator="['thermocouple', { rules: [{ required: false, message: '热电偶' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请输入检测口'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入检测口'"
                            v-decorator="['inspectionPort', { rules: [{ required: false, message: '请输入检测口' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'罐门结构'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入罐门结构'"
                            v-decorator="['doorStructure', { rules: [{ required: false, message: '请输入罐门结构' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'开门方向'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入开门方向'"
                            v-decorator="['openingDirection', { rules: [{ required: false, message: '请输入开门方向' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'真空路数'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入真空路数'"
                            v-decorator="['vacuumNumber', { rules: [{ required: false, message: '请输入真空路数' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'真空泵'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择真空泵'"
                            v-decorator="['vacuumPump', { rules: [{ required: false, message: '请选择真空泵' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'缓冲罐(m³)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'缓冲罐(m³)'"
                            v-decorator="['bufferTank', { rules: [{ required: false, message: '缓冲罐(m³)' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请输入真空度'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入真空度'"
                            v-decorator="['vacuumDegree', { rules: [{ required: false, message: '请输入真空度' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'储气罐规格'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入储气罐规格'"
                            v-decorator="['assModel', { rules: [{ required: false, message: '请输入储气罐规格' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'储气罐工作压力(MPa)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入储气罐工作压力(MPa)'"
                            v-decorator="['assWorkingPressure', { rules: [{ required: false, message: '请输入储气罐工作压力(MPa)' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'储气榷筒体厚度(mm)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择储气榷筒体厚度(mm)'"
                            v-decorator="['assTankthickness', { rules: [{ required: false, message: '请选择储气榷筒体厚度(mm)' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'储气罐封头厚度(mm)'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'储气罐封头厚度(mm)'"
                            v-decorator="['assHeadThickness', { rules: [{ required: false, message: '储气罐封头厚度(mm)' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'请输入空压机'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请输入空压机'"
                            v-decorator="['airCompressor', { rules: [{ required: false, message: '请输入空压机' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>

                <a-col :span="8">
                    <a-form-item :label="'制氮机'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择制氮机'"
                            v-decorator="['nitrogenPlant', { rules: [{ required: false, message: '请选择制氮机' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'增压机'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'增压机'"
                            v-decorator="['supercharger', { rules: [{ required: false, message: '增压机' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'罐内小车'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'罐内小车'"
                            v-decorator="['carInTank', { rules: [{ required: false, message: '罐内小车' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'罐外小车'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择罐外小车'"
                            v-decorator="['carOutTank', { rules: [{ required: false, message: '请选择罐外小车' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'桥架'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'桥架'"
                            v-decorator="['bridgeTray', { rules: [{ required: false, message: '桥架' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'牵引车'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'牵引车'"
                            v-decorator="['tractor', { rules: [{ required: false, message: '牵引车' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>

                <a-col :span="8">
                    <a-form-item :label="'泄压阀'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择泄压阀'"
                            v-decorator="['pressureReliefValve', { rules: [{ required: false, message: '请选择泄压阀' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'进气阀组'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'进气阀组'"
                            v-decorator="['intakeValveGroup', { rules: [{ required: false, message: '进气阀组' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'排气阀组'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'排气阀组'"
                            v-decorator="['exhaustValveGroup', { rules: [{ required: false, message: '排气阀组' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'冷却阀组'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'请选择冷却阀组'"
                            v-decorator="['coolingValveGroup', { rules: [{ required: false, message: '请选择冷却阀组' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'排空阀组'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'排空阀组'"
                            v-decorator="['emptyValveGroup', { rules: [{ required: false, message: '排空阀组' }, { max: 32, message: '长度至多为 32!' }] }]">
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item :label="'气冷阀组'"  :labelCol="{ span: 10 }" :wrapperCol="{ span: 14 }">
                        <a-input :placeholder="'气冷阀组'"
                            v-decorator="['airCooledValve', { rules: [{ required: false, message: '气冷阀组' }, { max: 32, message: '长度至多为 32!' }] }]" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <!-- <a-form :form="form">
            <a-form-item :label="'项目编号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入项目编号'"
                    v-decorator="['number', { rules: [{ required: false, message: '请输入项目编号' }, { max: 32, message: '长度至多为 32!' }] }]" />
            </a-form-item>
            <a-form-item :label="'产品编号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入产品编号'"
                    v-decorator="['productNumber', { rules: [{ required: false, message: '请输入产品编号' }, { max: 32, message: '长度至多为 32!' }] }]" />
            </a-form-item>
            <a-form-item :label="'客户名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入客户名称'"
                    v-decorator="['customerName', { rules: [{ required: false, message: '请输入客户名称' }, { max: 32, message: '长度至多为 32!' }] }]" />
            </a-form-item>
            <a-form-item :label="'产品名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择产品名称'"
                    v-decorator="['productName', { rules: [{ required: false, message: '请选择产品名称' }, { max: 32, message: '长度至多为 32!' }] }]">
                    <a-select-option :value="item" v-for="item in projectName" :key="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'请选择级别'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-select :placeholder="'请选择级别'"
                    v-decorator="['level', { rules: [{ required: false, message: '请选择级别' }, { max: 32, message: '长度至多为 32!' }] }]">
                    <a-select-option :value="item.value" v-for="item in levels" :key="item.name">{{ item.name
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="'请输入规格型号'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-input :placeholder="'请输入规格型号'"
                    v-decorator="['Model', { rules: [{ required: false, message: '请输入规格型号' }, { max: 32, message: '长度至多为 32!' }] }]" />
            </a-form-item>
        </a-form> -->
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
                    name: "P0",
                    value: 0
                },
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
                // let keys = [
                //     'number',
                //     'productNumber',
                //     'customerName',
                //     'productName',
                //     'level',
                // ]
                Object.keys(res.data.data).forEach(item => {
                    // if (keys.includes(item)) {
                        this.form.setFieldsValue({ [item]: res.data.data[item] })
                    // }
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

<style lang="less">
.projectForm {
    .ant-form-item {
        margin-bottom: 8px;
    }
}
</style>