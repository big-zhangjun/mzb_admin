<template>
    <a-card>
        <div class="content">
            <a-space class="operator">
            </a-space>
            <!-- <wangEdit :height="'480px'" ref="wangEdit"></wangEdit> -->
            <noticeList ref="noticeList" :showDelete="showDelete" @handleEdit="handleEdit" :showEdit="showEdit" >
                <template slot="add">
                    <a-button style="margin-left: 10px;" @click="newAdd" type="danger" v-if="permission.includes(1)">新建</a-button>
                </template>
            </noticeList>
            <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="700">
                <wangEdit :wangEditType="wangEditType" :height="'280px'" ref="wangEdit"></wangEdit>
            </a-modal>
        </div>
    </a-card>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.common.js'
import wangEdit from "@/pages/backend/components/wangEdit"
import noticeList from "@/pages/notice"
export default {
    name: 'QueryList',
    components: { wangEdit, noticeList },
    data() {
        return {
            permission: [],
            form: {},
            visible: false,
            modalTitle: "新建公告",
            advanced: false,
            wangEditType: ""
        }
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    computed: {
        ...mapGetters('setting', ['menuData']),
        showDelete() {
            return this.permission.includes(2)
        },
        showEdit() {
            return this.permission.includes(3)
        }
    },
    async mounted() {
        this.permission = this.$route.meta.permission
    },
    methods: {
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        newAdd() {
            this.visible = true
            this.modalTitle = "新增公告"
            this.wangEditType = 'add'
            this.$nextTick(()=>{
                this.$refs.wangEdit.initData()
            })
        },
        handleEdit(data) {
            this.visible = true
            this.modalTitle = "编辑公告"
            this.wangEditType = 'edit'
            this.$nextTick(()=>{
                this.$refs.wangEdit.getDada(data)
            })
        },
        handleReset() { },
        handleSearch() { },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.wangEdit.handleSubmit(() => {
                //    this.$message.success("操作成功")
                   this.$refs.noticeList.handleReset()
                   this.visible = false
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
.fold {
    width: calc(100% - 216px);
    display: inline-block
}

.content {
    // width: 800px;
    // margin: 0 auto;
    // padding-bottom: 40px;
}

.operator {
    margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
    .fold {
        width: 100%;
    }
}
</style>