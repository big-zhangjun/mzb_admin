<template>
    <a-card style="height: 80vh;" class="card">
        <div class="left">
            <div class="header">
                <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange"
                    :expanded-keys="expandedKeys" />
                <a-tree :tree-data="moduleList" :replaceFields="replaceFields" :auto-expand-parent="autoExpandParent">
                    <template slot="title" slot-scope="{ title }">
                        <span v-if="title.indexOf(searchValue) > -1">
                            {{ title.substr(0, title.indexOf(searchValue)) }}
                            <span style="color: #f50">{{ searchValue }}</span>
                            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                        </span>
                        <span v-else>{{ title }}</span>
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="right">

        </div>
    </a-card>
</template>

<script>
import { getModuleList } from '@/services/backend'
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
            autoExpandParent: false,
            moduleList: [],
            searchValue: "",
            flatModuleList: [],
            expandedKeys: []
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

            return treeData;
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
