<template>
    <a-card>
        <div class="content">
            <a-space class="operator">
            </a-space>
            <wangEdit :height="'480px'" ref="wangEdit"></wangEdit>
            <a-button @click="handleOk" type="primary" v-if="permission.includes(1)">新建</a-button>
        </div>
    </a-card>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.common.js'
import wangEdit from "@/pages/backend/components/wangEdit"
export default {
    name: 'QueryList',
    components: { wangEdit },
    data() {
        return {
            permission: [],
            form: {},
            visible: false,
            modalTitle: "新建新闻",
            advanced: false
        }
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    computed: {
        ...mapGetters('setting', ['menuData']),
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
        },

        handleReset() { },
        handleSearch() { },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.wangEdit.handleSubmit(() => {
                    this.$router.push({
                        path: "/notices"
                    })
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
    width: 800px;
    margin: 0 auto;
    padding-bottom: 40px;
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