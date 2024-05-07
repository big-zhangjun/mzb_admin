<template>
    <div>
        <a-card>
            <h1>{{ title }}</h1>
            <div v-html="noticeDetail"></div>
        </a-card>
    </div>
</template>

<script>
import { getNoticeInfo } from "@/services/backend"
    export default {
        data() {
            return {
                noticeDetail: "",
                title:""
            }
        },
        created() {
            this.getNoticeInfo()
        },
        methods: {
            async getNoticeInfo() {
                let res = await getNoticeInfo({id: +this.$route.query.id})
                this.noticeDetail = res.data.data.content
                this.title = res.data.data.title
            }
        }
    }
</script>

<style lang="less" scoped>
h1 {
    font-size: 28px;
    font-weight: bold;
}
</style>