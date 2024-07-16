<template>
    <a-card style="height: 80vh;" class="card">
        <div class="left">
            <div class="header">
                <!-- <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange"
                    :expanded-keys="expandedKeys" /> -->
                <div class="all" :class="{ active: !code }" @click="handleAll">全部</div>
                <a-tree :tree-data="moduleList" :replaceFields="replaceFields" :selectable="true" @select="onSelect"
                    :auto-expand-parent="autoExpandParent" :load-data="onLoadData">
                </a-tree>
            </div>
        </div>
        <div class="right">
            <a-row :gutter="16">
                <a-form :form="form">
                    <a-col :md="8" :sm="24">
                        <a-form-item :label="'名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input @pressEnter="handleSearch" v-model="materialName" placeholder="请输入名称"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item :label="'规格'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                            <a-input @pressEnter="handleSearch" v-model="MaterialModel" placeholder="请输入规格"></a-input>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-row>

            <standard-table :selectedRows.sync="selectedRows" :columns="columns" :dataSource="dataSource"
                @clear="onClear" @change="onChange" @selectedRowChange="onSelectChange" :scroll="{ y: 500 }"
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">

            </standard-table>
        </div>
    </a-card>
</template>

<script>
import { getMaterialGroupList, getMaterialList, addMaterialShotInfo } from '@/services/electrical'
import StandardTable from '@/components/table/StandardTable'

export default {
    name: 'QueryList',
    components: {
        StandardTable
    },
    data() {
        return {
            form: this.$form.createForm(this),
            replaceFields: {
                title: "groupName",
                key: "id"
            },
            moduleName: "",
            selectedRows: [],
            ModalText: '确认删除该模块？',
            MaterialModel: "",
            materialName: "",
            columns: [
                {
                    title: 'code',
                    dataIndex: 'code',
                },
                {
                    title: '名称',
                    dataIndex: 'materialName',
                },
                {
                    title: '规格',
                    dataIndex: 'MaterialModel',
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                },

                // {
                //     title: '姓名',
                //     dataIndex: 'code',
                //     width: 50,
                // },
                // {
                //     title: '单位',
                //     dataIndex: 'unit',
                //     width: 50,
                // },
            ],
            dataSource: [

            ],
            visible: false,
            confirmLoading: false,
            autoExpandParent: false,
            moduleList: [],
            searchValue: "",
            flatModuleList: [],
            expandedKeys: [],
            detail: null,
            parentID: 0,
            type: "",
            nodeChildren: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            filterList: [],
            code: ""
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    methods: {
        async init(list) {
            this.filterList = list
            const res = await getMaterialGroupList({ parentId: 0 })
            this.flatModuleList = res.data.data.map(item => {
                return {
                    ...item,
                    isLeaf: false,
                    key: item.id
                }
            })
            this.moduleList = res.data.data
            this.getMaterialList()
        },
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getMaterialList()
        },
        handleSearch() {
            this.pagination.current = 1
            this.getMaterialList()
        },
        async getMaterialList() {
            let params = {
                code: this.code,
                pageSize: 10,
                pageIndex: this.pagination.current,
                materialName: this.materialName,
                MaterialModel: this.MaterialModel
            }
            let res = await getMaterialList(params)
            console.log(this.filterList, 'ss');
            let ids = this.filterList.map(item => item.materialID)
            this.dataSource = res.data.data.records.filter(item => !ids.includes(item.id))
            this.pagination.total = res.data.data.totalCount
        },
        onClear() {
            this.$message.info('您清空了勾选的所有行')
        },

        onChange() {
            this.$message.info('表格状态改变了')
        },
        onSelectChange() {
            console.log(this.selectedRows);
            this.$message.info('选中行改变了')
        },
        handleAll() {
            this.code = ""
            this.pagination.current = 1
            this.getMaterialList()
        },
        onLoadData(treeNode) {
            return new Promise(async resolve => {
                if (treeNode.dataRef.children) {
                    resolve();
                    return;
                }
                console.log(treeNode);
                let { id } = treeNode.$vnode.data.props
                let res = await getMaterialGroupList({ parentId: id })
                treeNode.dataRef.children = res.data.data.map(item => {
                    return {
                        ...item,
                        isLeaf: item.haveChild !== 't'
                    }

                });
                this.moduleList = [...this.moduleList];
                resolve();
                // }, 1000);
            });
        },
        onSelect(selectedKeys, info) {
            let { code } = info.node.$vnode.data.props
            this.pagination.current = 1
            this.code = code
            this.getMaterialList()

        },
        onCheck(checkedKeys, info) {
            console.log('onCheck', checkedKeys, info);
        },
        onChange(e) {

        },
        async handleSubmit(shotageID, callback) {
            let list = this.selectedRows.map(item => {
                return {
                    materialID: item.id,
                    unit: item.unit
                }
            })
            let promises = list.map(item => {
                return this.addMaterialShotInfo({ shotageID, ...item })
            })
            await Promise.all(promises)
            callback()
        },
        async addMaterialShotInfo(params) {
            let res = await addMaterialShotInfo(params)
        }
    }
}
</script>

<style lang="less" scoped>
.card {
    ::v-deep .ant-card-body {
        display: flex;
        height: 100%;
    }

    .left {
        width: 250px;
        border-right: solid 1px rgb(243, 244, 247);
        height: 100%;
        overflow-y: auto;
        padding-right: 10px;

        .header {
            h1 {
                font-size: 14px;
                margin-bottom: 0;
            }
        }

        .all {
            cursor: pointer;
            margin-left: 10px;
        }

        .active {
            color: red;
        }
    }

    .right {
        padding: 0 20px;
        flex: 1;
        padding-right: 0;
    }
}

@media screen and (max-width: 900px) {
    .fold {
        width: 100%;
    }
}

.module {
    a {
        display: none;
    }

    &:hover {
        a {
            display: inline-block;
        }
    }
}
</style>
