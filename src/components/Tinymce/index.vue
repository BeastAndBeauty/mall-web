<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
  </div>
</template>

<script>
import editorImage from "./components/editorImage";
import "../../../static/tinymce4.7.5/langs/zh_CN";

const plugins = [
  `advlist anchor autolink autosave code codesample colorpicker colorpicker
  contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime
  legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
  spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount`
];
const toolbar = [
  `bold italic underline strikethrough alignleft aligncenter
  alignright outdent indent  blockquote undo redo removeformat`,
  `hr bullist numlist link image charmap	 preview anchor pagebreak
    fullscreen insertdatetime media table forecolor backcolor`
];
export default {
  name: "tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      default: "file edit insert view format table"
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    width: {
      type: Number,
      required: false,
      default: 720
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date()
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val)
        );
      }
    }
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,//操作的对象
        width: this.width,
        height: this.height,
        language: "zh_CN",
        body_class: "panel-body ",
        object_resizing: false,//是否允许编辑图片
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,//工具栏
        menubar: false,//菜单栏
        plugins: plugins,//插件
        end_container_on_empty_block: true,//是否允许回车
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",//默认的无序列表标记
        advlist_number_styles: "default",//默认的有序列表标记
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],//图片跨域请求用的
        default_link_target: "_blank",//连接的默认打开形式
        link_title: false,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        }
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach(v => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    }
  },
  destroyed() {
    this.destroyTinymce();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 10px;
  top: 2px;
  /*z-index: 2005;*/
}

.editor-upload-btn {
  display: inline-block;
}
</style>
