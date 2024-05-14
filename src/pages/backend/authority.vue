<template>
    <a-card style="height: 80vh;" class="card">
        <div class="left">
            <div class="header">
                <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange"
                    :expanded-keys="expandedKeys" />
                <a-tree show-icon :checkStrictly='false' :tree-data="moduleList" :selectable="false" :replaceFields="replaceFields"
                    :auto-expand-parent="autoExpandParent">
                    <template slot="custom" slot-scope="item">
                        <a-checkbox @click="onChanges(item)" v-model="item.checked">
                            {{ item.moduleName }}
                        </a-checkbox>
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="right">
            <h1>员工职位</h1>
            <div class="tab">
                <a-button @click="changeRole(item)" :type="roleID == item.id ? 'primary' : ''" v-for="item in roleList"
                    :key="item.id">{{
                        item.roleName
                    }}</a-button>
            </div>
        </div>
    </a-card>
</template>

<script>
import {
    getModuleList,
    getOperaList,
    getAuthorityOperate,
    getAuthorityList,
    addAuthorityInfo,
    addAuthorityOperate,
    delAuthorityInfo,
    delAuthorityOperate
} from '@/services/backend'


import { getRoleList } from '@/services/user'

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            console.log('sd', node.children, key);
            if (node.children.some(item => item.key == key)) {
                parentKey = node.key;
                console.log('sdfafs', parentKey);
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
            replaceFields: {
                title: "moduleName",
                key: "id"
            },
            ss: true,
            operaList: [],
            autoExpandParent: false,
            moduleList: [],
            searchValue: "",
            flatModuleList: [],
            expandedKeys: [],
            operaIds: [],
            authorityList: [],
            authorityOperateList: [],
            roleList: [],
            roleID: ""
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
       
    },
    activated() {
        this.getRoleList()
        this.getOperaList().then(() => {
            this.init()
        })
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
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
        },
        onChanges(item) {
            if (item.moduleId) {
                console.log('操作');
                if (item.checked) {
                    this.delAuthorityOperate(item)
                } else {
                    this.addAuthorityOperate(item)
                }
                // 点击的是操作授权
            } else {
                // 点击的是模块授权
                console.log('模块', item);
                if (item.checked) {
                    this.delAuthorityInfo(item)
                } else {
                    this.addAuthorityInfo(item)
                }
            }
        },
        // 新增模块授权
        async addAuthorityInfo(data) {
            let params = {
                roleID: this.roleID,
                moduleID: data.id,
            }
            const res = await addAuthorityInfo(params)
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
            if(res.data.status.retCode === 0) {
                this.$message.success("操作成功")
            }
        },
        // 新增操作授权
        async addAuthorityOperate(data) {
            let params = {
                roleID: this.roleID,
                moduleID: data.moduleId,
                operateID: data.id
            }
            const res = await addAuthorityOperate(params)
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
            if(res.data.status.retCode === 0) {
                this.$message.success("操作成功")
            }

        },
        // 删除模块授权
        async delAuthorityInfo(data) {
            let params = {
                roleID: this.roleID,
                moduleID: data.id,
            }
            const res = await delAuthorityInfo(params)
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
            if(res.data.status.retCode === 0) {
                this.$message.success("操作成功")
            }

        },
        // 删除操作授权
        async delAuthorityOperate(data) {
            let params = {
                roleID: this.roleID,
                moduleID: data.moduleId,
                operateID: data.id
            }
            const res = await delAuthorityOperate(params)
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
            if(res.data.status.retCode === 0) {
                this.$message.success("操作成功")
            }

        },
        // 切换员工职位
        changeRole(item) {
            this.roleID = item.id
            Promise.all([this.getAuthorityOperate(), this.getAuthorityList()])
        },
        // 查询职位信息
        async getRoleList() {
            const res = await getRoleList({})
            this.roleList = res.data.data
            let user = localStorage.getItem("admin.user")
            this.roleID = JSON.parse(user).roleID
        },
        // 查询操作授权列表
        async getAuthorityOperate() {
            const res = await getAuthorityOperate({ roleID: this.roleID })
            this.authorityOperateList = res.data.data
            this.setAuthorityChecked(this.moduleList)
        },
        // 查询授权模块列表
        async getAuthorityList() {
            const res = await getAuthorityList({ roleID: this.roleID })
            this.authorityList = res.data.data
            this.setModuleChecked(this.moduleList)
        },
        // 设置模块选中
        setModuleChecked(arr) {
            let roleIds = this.authorityList.map(item => item.roleID)
            let moduleIDs = this.authorityList.map(item => item.moduleID)
            arr.forEach(item => {
                if (item.children && item.children.length && item.key) {
                    this.setModuleChecked(item.children)
                    if (roleIds.includes(this.roleID) && moduleIDs.includes(item.id)) {
                        this.$set(item, 'checked', true)
                    } else {
                        this.$set(item, 'checked', false)
                    }
                }
            })
        },
        // 设置操作选中
        setAuthorityChecked(arr) {
            // let roleIds = this.authorityOperateList.map(item => item.roleID)
            arr.forEach(item => {
                if (item.children && item.children.length) {
                    this.setAuthorityChecked(item.children)
                } else {
                    let modulelist = this.authorityOperateList.filter(_item=> _item.moduleID == item.moduleId)
                    let operaIds = modulelist.map(_item=> _item.operateID)
                    if(operaIds.includes(item.id) ) {
                        this.$set(item, 'checked', true)
                    } else {
                        this.$set(item, 'checked', false)
                    }
                }
            })
        }, 
        // 获取操作列表
        async getOperaList() {
            const res = await getOperaList({})
            this.operaList = res.data.data.map(item => {
                return {
                    id: item.id,
                    moduleName: item.cn,
                    slots: { title: 'custom' },
                    scopedSlots: { title: "custom" }
                }
            })
            let ids = [1, 2, 3, 4, 5]
            this.operaIds = this.operaList.filter(item => ids.includes(item.id)).map(item => item.id)
        },
        buildTreeData(data) {
            const treeData = [];
            const map = {};

            // 构建映射关系，以id作为key
            // let childrens = this.operaList.map(item=> {
            //     return {
            //         id: item.id,
            //         moduleName: item.cn
            //     }
            // })
            data.forEach(item => map[item.id] = { ...item, key: item.id, children: [] });
            // return
            // 遍历数据，构建树形结构
            data.forEach(item => {
                // console.log(item, 'sss', map);
                const parent = map[item.parentID];
                if (parent) {
                    parent.children.push(map[item.id]);
                } else {
                    treeData.push(map[item.id]);
                }
            });

            return this.setOpera(treeData);
        },
        setOpera(treeData) {
            treeData.forEach(item => {
                item.slots = { title: 'custom' }
                item.scopedSlots = { title: "custom" }
                if (item.children.length) {
                    this.setOpera(item.children)
                } else {
                    if (item.parentID == 19) {
                        item.children = this.operaList.map(ele => {
                            return {
                                ...ele,
                                moduleId: item.id
                            }
                        })
                    } else {
                        item.children = this.operaList.filter(_item => this.operaIds.includes(_item.id)).map(ele => {
                            return {
                                ...ele,
                                moduleId: item.id
                            }
                        })
                    }
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

    .right {
        padding-left: 20px;

        .tab {
            margin-top: 20px;
            display: flex;
            gap: 20px
        }
    }
}

@media screen and (max-width: 900px) {
    .fold {
        width: 100%;
    }
}
</style>
