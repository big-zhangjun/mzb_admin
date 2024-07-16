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
                <div class="value" style="width: 70%;">
                    <a-select show-search v-model="material.source" style="width: 100%;" placeholder="请选择">
                        <a-select-option :value="item" v-for="item in sourceList" :key="item">
                            {{ item }}
                        </a-select-option>
                    </a-select>
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
        </div>
        <a-button type="primary" style="margin-top: 20px;" @click="handleAdd">新增</a-button>
        <a-button style="margin-top: 20px;margin-left: 20px;" @click="showModel = true">打印</a-button>

        <standard-table :pagination="false" :columns="columns" :dataSource="dataSource" :rowKey="'id'">
            <template slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" />编辑
                    </a>
                    <a-popconfirm title="确定删除该数据?" ok-text="确定" cancel-text="取消" @confirm="delMaterialShotInfo(record)"
                       >
                        <a>
                            <a-icon type="delete" />删除
                        </a>
                    </a-popconfirm>
                </template>
        </standard-table>
        <a-modal v-model="showModel" title="缺料报备" @ok="handleSubmit" :width="1200">
            <treeData ref="treeData" />
        </a-modal>
        <a-modal v-model="editModel" title="编辑缺料" @ok="handleEditSubmit" :width="600">
            <materialEditModel ref="materialEditModel" />
        </a-modal>
    </div>
</template>


<script>
import treeData from "@/pages/electrical/components/treeData"
import materialEditModel from "@/pages/electrical/components/materialEditModel"
import StandardTable from '@/components/table/StandardTable'
import { getShotageInfo, getMaterialShotList, delMaterialShotInfo } from '@/services/electrical'
export default {
    components: {
        StandardTable,
        treeData,
        materialEditModel
    },
    data() {
        return {
            material: {},
            dataSource: [],
            showModel: false,
            editModel: false,
            sourceList: [
                "项目现场安装"
            ],
            id: "",
            columns: [
                // {
                //     title: '序号',
                //     dataIndex: 'id',
                //     width: 20,
                // },
                {
                    title: '名称',
                    dataIndex: 'materialName',
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

                },
                {
                    title: '最终发货时间',
                    dataIndex: 'deliveryDate',

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
    methods: {
        getProgress(v) {
            if (v) {
                return v + '%'
            }
        },
        async getShotageInfo(id) {
            this.id = id
            let res = await getShotageInfo({ id })
            this.material = res.data.data
            this.getMaterialShotList(id)
        },
        async getMaterialShotList() {
            let res = await getMaterialShotList({ shotageID:this.id })
            this.dataSource = res.data.data
        },
        handleAdd() {
            this.showModel = true
            this.$nextTick(()=>{
                this.$refs.treeData.init(this.dataSource)
            })
        },
        async delMaterialShotInfo(data) {
            let params = {
                id:data.id,
                "deleted": 1
            }
            let res = await delMaterialShotInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
                this.getMaterialShotList()
            }
        },
        edit() {
            this.editModel = true
        },
        handleSubmit() {
            let treeData = this.$refs.treeData
            treeData.handleSubmit(this.id, () => {
                this.showModel = false
                this.getMaterialShotList()
            })
            console.log('ss');
        },
        handleEditSubmit() {

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