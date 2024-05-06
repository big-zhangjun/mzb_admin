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
        <Editor :style="{ height: height, overflowY: 'hidden' }" v-model="html" :defaultConfig="editorConfig" :mode="mode"
          @onCreated="onCreated" />
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
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    // 新增公告信息
    async addNoticeInfo(data) {
      console.log(this.html);
      let user = localStorage.getItem("admin.user")
      let creatorID = JSON.parse(user).id
      let params = {
        creatorID,
        title: data.title,
        content: this.html
      }
      let res = await addNoticeInfo(params)
      console.log(res);
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addNoticeInfo(values)
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
  }
}
</style>