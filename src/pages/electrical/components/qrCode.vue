<template>
    <div class="index-box">
        <div id="printCodeView">
            <img :src="codeUrl" alt="">
        </div>
        <div class="footer">
            <a-button style="margin-right: 20px;" @click="handleReset">刷新</a-button>
            <a-button v-print="printViewInfo" type="primary">打印</a-button>
        </div>
    </div>
</template>

<script>
// 
import { getUnlimitedQRCode, getFileInfo } from '@/services/electrical'

export default {
    props: {
        material: {
            type: Object,
            default: () => { }
        },
        dataSource: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            msg: "打印",
            printViewInfo: {
                id: "printCodeView", //打印区域的唯一的id属性
                popTitle: ' ', // 页眉文字 （不设置时显示undifined）（页眉页脚可以在打印页面的更多设置的选项中取消勾选）
                extraHead: ' ', // 最左上方的头部文字，附加在head标签上的额外标签，使用逗号分割
                preview: false, // 是否启动预览模式，默认是false （开启预览模式ture会占满整个屏幕，不建议开启，除非业务需要）
                previewTitle: '', // 打印预览的标题(预览模式preview为true时才显示)
                previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印(预览模式preview为true时才显示)
                zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
                previewBeforeOpenCallback(that) { console.log('正在加载预览窗口！'); console.log(that.msg, this) }, // 预览窗口打开之前的callback (预览模式preview为true时才执行) （that可以取到data里的变量值）
                previewOpenCallback() { console.log('已经加载完预览窗口，预览打开了！') }, // 预览窗口打开时的callback (预览模式preview为true时才执行)
                beforeOpenCallback() { console.log('开始打印之前！') }, // 开始打印之前的callback
                openCallback() { console.log('执行打印了！') }, // 调用打印时的callback
                closeCallback() { console.log('关闭了打印工具！') }, // 关闭打印的callback(无法区分确认or取消)
                clickMounted() { console.log('点击v-print绑定的按钮了！') },
                standard: '',
                extarCss: ''
            },
            codeUrl: "",
            id: "",
            key: 0
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        async getUnlimitedQRCode(id) {
            this.id = id
            let res = await getUnlimitedQRCode({ id })
            if (res.data.status.retCode == 0) {
                this.getFileInfo(id)
            }
        },
        async getFileInfo(id) {
            this.id = id
            let res = await getFileInfo({ name: `./pic/qrcode/${id}.png` })
            if (res.data.status.retCode == 0) {
                this.codeUrl = process.env.VUE_APP_API_BASE_URL + res.data.data.path.replace(/^\./, '') + `?key=${this.key}`
                console.log(this.codeUrl);
                // return process.env.VUE_APP_API_BASE_URL + data.avatar.replace(/^\./, '')
            } else {
                this.getUnlimitedQRCode(id)
            }
            // if(res.data.stat)
        },
        async handleReset() {
            this.key++
            await this.getUnlimitedQRCode(this.id)
            this.getFileInfo(this.id)
        },
        initData(id) {
            this.getFileInfo(id)
        },
        handleClose() {
            this.$emit('handleClose')
        },
        print() {
            this.dialogVisible = true
        },
    }
}
</script>

<style lang="less" scoped>
@media print {
    .hidden {
        display: none;
    }
}
</style>
<style lang="less">
.print-container {
    padding-top: 40px;
    // border: 1px solid #000;
}

.line {
    border-bottom: solid 1px #b6b6b6;
    padding-bottom: 2px;
    display: inline-block;
    margin: 0 6px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
}

.info {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #ccc;
    padding-bottom: 8px;
}

.info,
.hospital,
.patient-info,
.medical-info,
.signatures,
.notes {
    margin-bottom: 20px;
}

.signatures {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
}

.hospital {
    p {
        border-bottom: solid 1px #ccc;
        padding-bottom: 8px;
        display: inline-block;

    }
}

p {
    margin: 5px 0;
}

.notes {
    border-top: 1px solid #000;
    padding-top: 10px;
}

.dialog-footer {
    text-align: center;
    margin-top: 20px;
}

@media print {
    .hidden {
        display: none;
    }

    .index-box {
        display: none;
    }
}

.material-form {
    width: 100%;
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

.footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px 0 0 0;
}
</style>