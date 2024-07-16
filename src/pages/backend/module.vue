<template>
    <a-card style="height: 80vh;" class="card">
        <div class="left">
            <div class="header">
                <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange"
                    :expanded-keys="expandedKeys" />
                <a-tree :tree-data="moduleList" :replaceFields="replaceFields" :selectable="true" @select="select"
                    :auto-expand-parent="autoExpandParent">
                    <template slot="custom" slot-scope="item">
                        <!-- <a-checkbox @click="onChanges(item)" v-model="item.checked">
                            {{ item.moduleName }}
                        </a-checkbox> -->
                        <div class="module">
                            <span>{{ item.moduleName }}</span>
                            <a @click="handleDel(item)" style="margin-left: 10px;">
                                <a-icon type="delete" />
                            </a>
                            <a @click="handleEdit(item)" style="margin-left: 10px;">
                                <a-icon type="edit" />
                            </a>
                            <a @click="handleMoveUpp(item)" style="margin-left: 10px;">
                                <a-icon type="arrow-up" />
                            </a>
                            <a @click="handleMoveDown(item)" style="margin-left: 10px;">
                                <a-icon type="arrow-down" />
                            </a>
                        </div>
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="right">
            <a-button type="primary" style="margin-left: 20px;" @click="handleAdd">
                新建
            </a-button>
        </div>
        <a-modal title="提示" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
            <p v-if="type == 'del'">{{ ModalText }}</p>
            <a-form :form="form" v-else>
                <a-form-item :label="'模块名称'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                    <a-input :placeholder="'请输入模块名称'"
                        v-decorator="['moduleName', { rules: [{ required: true, message: '请输入模块名称' }] }]" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>

<script>
import { getRoutesConfig } from '@/services/user'
import { loadRoutes } from '@/utils/routerUtil'
import { getModuleList, delModuleInfo, addModuleInfo, updateModuleInfo } from '@/services/backend'
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.key == key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
export default {
    name: 'QueryList',
    components: {},
    data() {
        return {
            form: this.$form.createForm(this),
            replaceFields: {
                title: "moduleName",
                key: "id"
            },
            moduleName: "",
            ModalText: '确认删除该模块？',
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
            nodeChildren: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            const res = await getModuleList({ parentId: -1 })
            this.flatModuleList = res.data.data.map(item => {
                return {
                    ...item,
                    key: item.id
                }
            })
            this.moduleList = this.buildTreeData(res.data.data)
        },
        handleDel(data) {
            this.detail = data
            this.visible = true;
            this.type = 'del'
        },
        async updateModuleInfo(params) {

            let res = await updateModuleInfo(params)
            if (res.data.status.retCode == 0) {
                getRoutesConfig().then(result => {
                    const routesConfig = result.data
                    loadRoutes(routesConfig)
                })
            }

        },
        handleEdit(data) {
            this.detail = data
            this.visible = true;
            this.type = 'edit'
            console.log(data);

        },
        handleMoveDown(data) {
            let { parentID, moduleNo, id, moduleName } = data
            // 找出当前层级的数据
            let list = this.flatModuleList.filter(item => item.parentID == parentID)
            // 找出当前所在的索引
            let index = list.findIndex(item => item.id == id)
            if (index !== -1 && index == list.length - 1) {
                this.$message.warning("已经在最底部了")
                return
            }
            let oldData = list[index + 1]
            let oldParams = {
                moduleName: oldData.moduleName,
                parentID: oldData.parentID,
                id: oldData.id,
                moduleNo: oldData.moduleNo - 1
            }
            let newParams = {
                parentID,
                moduleNo: moduleNo + 1,
                id,
                moduleName
            }
            Promise.all([this.updateModuleInfo(oldParams), this.updateModuleInfo(newParams)]).then(() => {
                this.$message.success('操作成功')
                this.init()
                this.visible = false
                this.confirmLoading = false;
            })
        },
        handleMoveUpp(data) {
            let { parentID, moduleNo, id, moduleName } = data
            if (moduleNo == 1) {
                this.$message.warning("已经在最顶部了")
                return
            }
            let oldData = this.flatModuleList.find(item => {
                return item.parentID == parentID && (moduleNo - 1) == item.moduleNo
            })
            let oldParams = {
                moduleName: oldData.moduleName,
                parentID: oldData.parentID,
                id: oldData.id,
                moduleNo: oldData.moduleNo + 1
            }
            let newParams = {
                parentID,
                moduleNo: moduleNo - 1,
                id,
                moduleName
            }
            Promise.all([this.updateModuleInfo(oldParams), this.updateModuleInfo(newParams)]).then(() => {
                this.$message.success('操作成功')
                this.init()
                this.visible = false
                this.confirmLoading = false;
            })

        },
        async handleOk() {
            this.confirmLoading = true;
            if (this.type == 'add') {
                this.addModule()
            } else if (this.type == 'edit') {
                this.form.validateFields(async (err, values) => {
                    if (!err) {
                        let params = {
                            ...values,
                            parentID: this.detail.parentID,
                            id: this.detail.id,
                            moduleNo: this.detail.moduleNo
                        }
                        this.updateModuleInfo(params).then(() => {
                            this.$message.success('操作成功')
                            this.init()
                            this.visible = false
                            this.confirmLoading = false;
                        })
                    }
                })
            } else {
                this.delModule()
            }

        },
        async delModule() {
            let params = {
                id: this.detail.id
            }
            const res = await delModuleInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success('操作成功')
                this.init()
                this.confirmLoading = false;
                this.visible = false
            }
        },
        async addModule() {
            this.form.validateFields((err, values) => {
                if (!err) {
                    let params = {
                        ...values,
                        parentID: this.parentID,
                        moduleNo: this.nodeChildren.length + 1
                    }
                    addModuleInfo(params).then(res => {
                        if (res.data.status.retCode == 0) {
                            this.$message.success('操作成功')
                            this.init()
                            this.visible = false
                            this.confirmLoading = false;
                        }
                    })
                }
            })
        },
        handleCancel() {
            console.log('Clicked cancel button');
            this.visible = false;
        },
        handleAdd() {
            this.visible = true
            this.type = 'add'
        },
        buildTreeData(data) {
            const treeData = [];
            const map = {};

            // 构建映射关系，以id作为key
            data.forEach(item => map[item.id] = { ...item, key: item.id, children: [] });

            // 遍历数据，构建树形结构
            data.forEach(item => {
                const parent = map[item.parentID];
                if (parent) {
                    parent.children.push(map[item.id]);
                } else {
                    treeData.push(map[item.id]);
                }
            });

            return this.setOpera(treeData);
        },
        select(v, node) {
            this.parentID = v[0]
            let { selectedNodes } = node
            if (selectedNodes.length) {
                let VNode = selectedNodes[0].data.props.dataRef
                this.nodeChildren = VNode.children
            } else {
                this.nodeChildren = []
            }
        },
        setOpera(treeData) {
            treeData.forEach(item => {
                item.slots = { title: 'custom' }
                item.scopedSlots = { title: "custom" }
                if (item.children.length) {
                    this.setOpera(item.children)
                }
            })
            return treeData
        },
        onSelect(selectedKeys, info) {
            console.log('selected', selectedKeys, info);
        },
        onCheck(checkedKeys, info) {
            console.log('onCheck', checkedKeys, info);
        },
        onChange(e) {
            const value = e.target.value;
            const expandedKeys = this.flatModuleList
                .map(item => {
                    if (item.moduleName.indexOf(value) > -1) {
                        return getParentKey(item.key, this.moduleList);
                    }
                    return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            console.log(expandedKeys);
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        },
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
        width: 300px;
        border: solid 1px rgb(243, 244, 247);
        height: 100%;
        overflow-y: auto;

        .header {
            height: 48px;
            background-color: rgb(243, 244, 247);
            line-height: 48px;
            padding: 0 10px;

            h1 {
                font-size: 14px;
                margin-bottom: 0;
            }
        }
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
