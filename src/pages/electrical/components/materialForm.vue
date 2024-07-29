<template>
    <div>
        <div class="material-form">
            <div class="item">
                <div class="label">客户名称：</div>
                <div class="value">{{ material.customerName }}</div>
            </div>
            <div class="item">
                <div class="label">产品编号：</div>
                <div class="value">{{ material.productNumber }}</div>
            </div>
            <div class="item">
                <div class="label">型号：</div>
                <div class="value">{{ material.model }}</div>
            </div>
            <div class="item">
                <div class="label">发货单位：</div>
                <div class="value">{{ material.fromCompany }}</div>
            </div>
            <div class="item">
                <div class="label">申请人：</div>
                <div class="value">{{ material.applyRealName }}</div>
            </div>
            <div class="item">
                <div class="label">来源：</div>
                <div class="value">
                    {{ material.source }}
                </div>
            </div>
            <div class="item">
                <div class="label">申请日期：</div>
                <div class="value">{{ material.applyDate }}</div>
            </div>
            <div class="item">
                <div class="label">完整率：</div>
                <div class="value">{{ getProgress(material.progress) }}</div>
            </div>
            <div class="lock" @click="handleLock(material)" v-if="permission.includes(5)">
                <a-icon type="unlock" v-if="material.locked == 2"/>
                <a-icon type="lock" v-if="material.locked == 1"/>
            </div>
        </div>
        <a-button type="primary" style="margin-top: 20px;" :disabled="disabled" @click="handleAdd" v-if="permission.includes(1)">新增</a-button>
        <a-button style="margin-top: 20px;margin-left: 20px;" @click="print">打印</a-button>

        <standard-table :pagination="false" :columns="columns" :dataSource="dataSource" :rowKey="'id'">
            <template slot="materialName" slot-scope="{text, record}">
                <span :title="record.code" @click="copyToClipboard(record.code)">{{ text }}</span>
            </template>
            <template slot="action" slot-scope="{text, record}">
                <a style="margin-right: 8px" @click="edit(record)" v-if="permission.includes(3)">
                    <a-icon type="edit" />编辑
                </a>
                <a-popconfirm title="确定删除该数据?" ok-text="确定" cancel-text="取消" v-if="permission.includes(2)" @confirm="delMaterialShotInfo(record)">
                    <a>
                        <a-icon type="delete" />删除
                    </a>
                </a-popconfirm>
            </template>
        </standard-table>
        <a-modal v-model="showModel" title="缺料报备" @ok="handleSubmit" :width="1200" class="treeModal">
            <treeData ref="treeData" />
        </a-modal>
        <a-modal v-model="editModel" title="编辑缺料" @ok="handleEditSubmit" :width="600">
            <materialEditModel :type="materialShotType" ref="materialEditModel" :disabled="disabled"/>
        </a-modal>
        <a-modal v-model="printShowModel" title="打印" :footer="null" :width="1200">
            <printModel ref="printModel" :columns="columns" :material="material" :dataSource="dataSource" />
        </a-modal>
    </div>
</template>


<script>
import treeData from "@/pages/electrical/components/treeData"
import materialEditModel from "@/pages/electrical/components/materialEditModel"
import printModel from "@/pages/electrical/components/printModel"
import StandardTable from '@/components/table/StandardTable'
import { getShotageInfo, getMaterialShotList, delMaterialShotInfo, updateShotInfo, lockShotageInfo } from '@/services/electrical'
export default {
    components: {
        StandardTable,
        treeData,
        materialEditModel,
        printModel
    },
    props: {
        permission: {
            type: Array,
            default:()=> []
        }
    },
    data() {
        return {
            material: {},
            printShowModel: false,
            dataSource: [],
            materialShotType: "add",
            showModel: false,
            editModel: false,
            sourceList: [
                "项目现场安装",
                "网购",
                "售后"
            ],
            id: "",
            columns: [
                {
                    title: '名称',
                    dataIndex: 'materialName',
                    scopedSlots: { customRender: 'materialName' }
                },
                {
                    title: '规格',
                    dataIndex: 'materialModel',
                },
                {
                    title: '数量',
                    dataIndex: 'amount',
                    width: 60
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    width: 60
                },
                {
                    title: '是否发货',
                    dataIndex: 'delivered',
                    customRender: (text) => {
                        return text == 1 ? '是' : '否'
                    }
                },
                {
                    title: '未发原因',
                    dataIndex: 'reason',

                },
                {
                    title: '预计发货时间',
                    dataIndex: 'expectDate',
                    customRender: (text) => {
                        return text == '1000-01-01' ? '--' : text
                    }

                },
                {
                    title: '最终发货时间',
                    dataIndex: 'deliveryDate',
                    customRender: (text) => {
                        return text == '1000-01-01' ? '--' : text
                    }

                },
                {
                    title: '物流方式',
                    dataIndex: 'logistics',

                },
                {
                    title: '快递单号',
                    dataIndex: 'courierNumber',

                },
                {
                    title: '是否签收',
                    dataIndex: 'ready',
                    customRender: (text) => {
                        return text == 0 ? '否' : '是'
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                },
                {
                    title: '操作',
                    scopedSlots: { customRender: 'action' }
                },
            ],
        }
    },
    computed:{
        disabled() {
            return this.material.locked == 1
        }
    },
    methods: {
        getProgress(v) {
            if (v) {
                return v + '%'
            } else {
                return '0%'
            }
        },
        copyToClipboard(text) {
            var textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.$message.success("复制成功")
        },
        async getShotageInfo(id) {
            this.id = id
            let res = await getShotageInfo({ id })
            this.material = res.data.data
            this.getMaterialShotList(id)
        },
        print() {
            this.printShowModel = true
        },
        async getMaterialShotList() {
            let res = await getMaterialShotList({ shotageID: this.id })
            this.dataSource = res.data.data
        },
        handleAdd() {
            this.showModel = true
            this.$nextTick(() => {
                this.$refs.treeData.init(this.dataSource)
            })
        },
        async delMaterialShotInfo(data) {
            if(this.disabled) return
            let params = {
                id: data.id,
                "deleted": 1
            }
            let res = await delMaterialShotInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
                await this.getMaterialShotList()
                this.getProgressNum()
            }
        },
        edit(data) {
            this.materialShotType = 'edit'
            this.editModel = true
            this.$nextTick(() => {
                this.$refs.materialEditModel.initData(data.id)
            })
        },
        handleSubmit() {
            let treeData = this.$refs.treeData
            treeData.handleSubmit(this.id, async () => {
                this.showModel = false
                await this.getMaterialShotList()
                this.getProgressNum()
            })
            console.log('ss');
        },
        handleEditSubmit() {
            this.$refs.materialEditModel.handleSubmit(async () => {
                this.editModel = false
                await this.getMaterialShotList()
                this.getProgressNum()
            })
        },
        async getProgressNum() {
            let fm = this.dataSource.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
            let fz = this.dataSource.map(item => item.ready).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
            let params = {
                fromCompany: this.material.fromCompany,
                id: this.material.id,
                progress: +(fz / fm * 100).toFixed(0),
                source: this.material.source
            }
            this.updateShotInfo(params)
        },
        async updateShotInfo(params) {
            let res = await updateShotInfo(params)
            if (res.data.status.retCode === 0) {
                this.getShotageInfo(this.id)
                this.$message.success("操作成功")
                this.$emit("handleUpdate")
            } else {
                this.$message.warning(res.data.status.msg)
            }
        },
        async handleLock(data) {
            let locked = data.locked == 2 ? 1 : 2
            let res = await lockShotageInfo({id: data.id, locked})
            if (res.data.status.retCode === 0) {
                this.getShotageInfo(this.id)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.material-form {
    display: flex;
    flex-wrap: wrap;

    .item {
        width: 300px;
        display: flex;
        margin-bottom: 20px;
        margin-right: 20px;
        align-items: center;

        // font-size: 16px;
        .label {
            color: #aaaaaa;
        }

        .value {
            flex: 1;
            color: #12151b;
        }
    }
}
</style>
<style lang="less">
.treeModal {
    .ant-modal {
        top: 10px
    }

}
.lock {
    position: absolute;
    right: 30px;
    top: 70px;
    cursor: pointer;
    font-size: 30px;
    color: #36cfc9;
}
</style>