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
                        <div>
                            <span>{{ item.moduleName }}</span>
                            <a @click="handleDel(item)" style="margin-left: 10px;">
                                <a-icon type="delete" />
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
            <p v-if="type !== 'add'">{{ ModalText }}</p>
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
import { getModuleList, delModuleInfo, addModuleInfo } from '@/services/backend'
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
            type: ""
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
            this.type = 'edit'
        },
        async handleOk() {
            this.confirmLoading = true;
            if(this.type=='add') {
                this.addModule()
            }else {
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
                        parentID: this.parentID
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
        select(v) {
            this.parentID = v[0]
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
                        console.log(getParentKey(item.key, this.moduleList));
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
</style>
