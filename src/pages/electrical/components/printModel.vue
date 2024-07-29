<template>
    <div class="index-box">
        <div id="printView">
            <div class="print-container">
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
                        <div class="value">
                            {{ material.source }}
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
            </div>
            <standard-table :pagination="false" :columns="columns" :dataSource="dataSource" :rowKey="'id'">
                <template slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" />编辑
                    </a>
                    <a-popconfirm title="确定删除该数据?" ok-text="确定" cancel-text="取消" @confirm="delMaterialShotInfo(record)">
                        <a>
                            <a-icon type="delete" />删除
                        </a>
                    </a-popconfirm>
                </template>
            </standard-table>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </span> -->
      <div class="footer">
          <a-button v-print="printViewInfo" type="primary">打印</a-button>
      </div>
    </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'

export default {
    components: {StandardTable},
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
                id: "printView", //打印区域的唯一的id属性
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
                // url: 'http://localhost:8080/', // 打印指定的URL，确保同源策略相同
                // asyncUrl (reslove) {
                //   setTimeout(() => {
                //     reslove('http://localhost:8080/')
                //   }, 2000)
                // },
                standard: '',
                extarCss: ''
            },
            columns: [
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
                    customRender: (text) => {
                        return text == '1000-01-01' ? '--' : text
                    }

                },
                {
                    title: '最终发货时间',
                    dataIndex: 'deliveryDate',
                    customRender: (text) => {
                        return text == '1000-01-01' ? '--' : text
                    }

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
                    title: '是否签收',
                    dataIndex: 'ready',
                    customRender: (text) => {
                        return text == 0 ? '否' : '是'
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                },
            ],
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        getProgress(v) {
            if (v) {
                return v + '%'
            }
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