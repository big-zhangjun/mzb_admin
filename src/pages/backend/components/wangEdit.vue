<template>
  <div>
    <div class="item">
      <div class="label">标题</div>
      <a-form :form="form">
        <a-form-item :label="''" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
          <a-input v-decorator="['title', { rules: [{ required: true, message: '请输入标题' }] }]" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </div>

    <div class="item">
      <div class="label">内容描述</div>
      <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor :style="{ height: height, overflowY: 'hidden' }" v-model="html" :defaultConfig="editorConfig"
          :mode="mode" @onCreated="onCreated" />
      </div>
    </div>
    <div class="item">
      <div class="label">封面图<span>（请选择默认封面图或本地上传）</span></div>
      <div>
        <div class="imgList">
          <img v-for="item in imgList" :class="{ active: fileName == item.value }" :src="item.src" alt=""
            @click="handleCover(item)">
        </div>
        <mUpload @uploadOk="uploadOk" ref="mUpload"/>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import "@wangeditor/editor/dist/css/style.css"
import { addNoticeInfo } from "@/services/backend"
export default Vue.extend({
  components: { Editor, Toolbar },
  props: ["height"],
  data() {
    return {
      title: "",
      form: this.$form.createForm(this),
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
      fileName: "",
      imgList: [
        {
          src: require("@/assets/cover/1.jpg"),
          value: "custom/1.jpg"
        },
        {
          src: require("@/assets/cover/2.jpg"),
          value: "custom/2.jpg"
        },
        {
          src: require("@/assets/cover/3.jpg"),
          value: "custom/3.jpg"
        },
        {
          src: require("@/assets/cover/4.png"),
          value: "custom/4.png"
        },
        {
          src: require("@/assets/cover/5.png"),
          value: "custom/5.png"
        }
      ]

    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    uploadOk(fileName) {
      this.fileName = fileName
    },
    handleCover(v) {
      if (v.value == this.fileName) {
        this.fileName = ""
        return
      }
      this.$refs.mUpload.imageUrl = ""
      this.fileName = v.value
    },
    // 新增公告信息
    async addNoticeInfo(data, callback) {
      console.log(this.html);
      let user = localStorage.getItem("admin.user")
      let creatorID = JSON.parse(user).id
      let params = {
        creatorID,
        title: data.title,
        content: this.html,
        cover: this.fileName
      }
      let res = await addNoticeInfo(params)
      if (res.data.status.retCode === 0) {
        this.$message.success("操作成功")
        callback && callback()
      }
      console.log(res);
    },
    beforeUpload() {

    },
    handleChange() {

    },
    handleSubmit(callback) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addNoticeInfo(values, callback)
        }
      })
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>
<style lang="less" scoped>
.item {
  margin-bottom: 30px;

  .label {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    margin-bottom: 15px;

    span {
      font-size: 14px;
      font-weight: normal;
      color: #9e9e9e;
    }
  }
}

.imgList {
  display: flex;
  margin-bottom: 20px;

  img {
    width: 104px;
    height: 104px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 20px;
    box-sizing: border-box;
    border: solid 2px transparent;
  }

  .active {
    border: solid #13c2c2 2px;
  }
}
</style>