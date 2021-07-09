<template>
  <div class="form-designer">
    <el-container>
      <el-aside :width="leftWidth">
        <div class="fields-list">
          <div v-for="(field, index) in fields" :key="index">
            <template v-if="field.list.find(f => includeFields.includes(f.type))">
              <div class="field-title">{{ field.title }}</div>
              <draggable tag="ul"
                         :list="field.list"
                         :group="{ name: 'form', pull: 'clone', put: false }"
                         ghost-class="ghost"
                         :sort="false"
              >
                <template v-for="(item, index) in field.list">
                  <li v-if="includeFields.includes(item.type)" :key="index" class="field-label">
                    <a @click="handleFieldClick(item)">
                      <i class="icon iconfont" :class="item.icon"/>
                      <span>{{ item.title || item.label }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
          </div>
          <template v-if="customFields && customFields.length > 0">
            <el-link class="field-title"
                     :underline="false"
                     href="https://element.eleme.io/#/zh-CN/component/installation"
                     target="_blank"
            >自定义字段
            </el-link>
            <draggable tag="ul"
                       :list="customFields"
                       :group="{ name: 'form', pull: 'clone', put: false }"
                       ghost-class="ghost"
                       :sort="false"
            >
              <template v-for="(item, index) in customFields">
                <el-tooltip v-if="item.tips"
                            :key="index"
                            effect="dark"
                            :content="item.tips"
                >
                  <li :key="index" class="field-label">
                    <a style="padding: 0 5px;" @click="handleFieldClick(item)">
                      <i :class="item.icon"/>
                      <span style="margin-left: 5px;">{{ item.title || item.label }}</span>
                    </a>
                  </li>
                </el-tooltip>
                <li v-else :key="index" class="field-label">
                  <a style="padding: 0 5px;" @click="handleFieldClick(item)">
                    <i :class="item.icon"/>
                    <span style="margin-left: 5px;">{{ item.title || item.label }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </template>
        </div>
      </el-aside>
      <el-container class="widget-container" direction="vertical">
        <el-header class="widget-container-header">
          <div style="display: flex; align-items: center">
            <template v-if="undoRedo">
              <el-tooltip effect="dark" content="撤销" placement="bottom">
                <div style="margin-left: 10px">
                  <el-button type="text"
                             size="medium"
                             :disabled="historySteps.index == 0"
                             @click="widgetForm = handleUndo()"
                  ><i class="icon iconfont icon-undo"/>
                  </el-button>
                </div>
              </el-tooltip>
              <el-tooltip effect="dark" content="重做" placement="bottom">
                <div style="margin-left: 10px">
                  <el-button type="text"
                             size="medium"
                             :disabled="historySteps.index == historySteps.steps.length - 1"
                             @click="widgetForm = handleRedo()"
                  ><i class="icon iconfont icon-redo"/>
                  </el-button>
                </div>
              </el-tooltip>
            </template>
          </div>
          <div style="display: flex; align-items: center;">
            <slot name="toolbar-left"/>
            <el-button v-if="toolbar.includes('import')"
                       type="text"
                       size="medium"
                       icon="el-icon-upload2"
                       @click="importJsonVisible = true"
            >导入JSON</el-button>
            <el-button v-if="toolbar.includes('clear')"
                       class="danger"
                       type="text"
                       size="medium"
                       icon="el-icon-delete"
                       @click="handleClear"
            >清空</el-button>
            <el-button v-if="toolbar.includes('preview')"
                       type="text"
                       size="medium"
                       icon="el-icon-view"
                       @click="handlePreview"
            >预览</el-button>
            <el-button v-if="toolbar.includes('generate')"
                       type="text"
                       size="medium"
                       icon="el-icon-download"
                       @click="generateJsonVisible = true"
            >生成JSON</el-button>
            <slot name="toolbar"/>
          </div>
        </el-header>
        <el-main :style="{background: widgetForm.column.length == 0 ? `url(${widgetEmpty}) no-repeat 50%`: ''}">
          <widget-form ref="widgetForm"
                       :data="widgetForm"
                       :select.sync="widgetFormSelect"
                       @change="handleHistoryChange(widgetForm)"
          />
        </el-main>
      </el-container>
      <el-aside class="widget-config-container" :width="rightWidth">
        <el-tabs v-model="configTab" stretch>
          <el-tab-pane label="字段属性" name="widget" style="padding: 0 10px;">
            <widget-config :data="widgetFormSelect"/>
          </el-tab-pane>
          <el-tab-pane label="表单属性" name="form" lazy style="padding: 0 10px;">
            <form-config :data="widgetForm"/>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-dialog title="预览"
                 class="loquat-dialog"
                 :visible.sync="previewVisible"
                 :close-on-click-modal="false"
                 append-to-body
                 center
                 fullscreen
      >
        <el-card style="height:100%">
          <loquat-form v-if="previewVisible"
                       ref="previewForm"
                       v-model="widgetModels"
                       :option="widgetFormPreview"
                       @submit="handlePreviewSubmit"
          />
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePreviewSubmit" >获取数据</el-button>
          <el-button @click="handleBeforeClose">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="导入JSON"
                 class="loquat-dialog"
                 :visible.sync="importJsonVisible"
                 :close-on-click-modal="false"
                 width="800px"
                 append-to-body
                 top="3vh"
                 center
      >
        <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"/>
        <ace-editor v-model="importJson"
                    lang="json"
                    theme="clouds"
                    style="height: 400px"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePreviewSubmit" >确定</el-button>
          <el-button @click="handleBeforeClose">取消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="生成JSON"
                 class="loquat-dialog"
                 :visible.sync="generateJsonVisible"
                 :close-on-click-modal="false"
                 width="800px"
                 append-to-body
                 top="3vh"
                 center
      >
        <ace-editor v-model="generateJson"
                    lang="json"
                    theme="clouds"
                    style="height: 400px"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePreviewSubmit" >确定</el-button>
          <el-button @click="handleBeforeClose">取消</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import fields from './components/fields.js'
import widgetEmpty from './assets/images/widget-empty.png'
import history from './mixins/history'
import Draggable from 'vuedraggable'
import WidgetForm from './components/WidgetForm'
import FormConfig from './components/FormConfig'
import WidgetConfig from './components/WidgetConfig'
import AceEditor from 'v-ace-editor'
// import beautifier from '@utils/json-beautifier'
export default {
  name: 'FormDesign',
  components: { Draggable, WidgetForm, FormConfig, WidgetConfig, AceEditor },
  mixins: [history],
  props: {
    options: {
      type: [Object, String],
      default: () => {
        return {
          column: []
        }
      }
    },
    storage: {
      type: Boolean,
      default: false
    },
    asideLeftWidth: {
      type: [String, Number],
      default: '250px'
    },
    asideRightWidth: {
      type: [String, Number],
      default: '300px'
    },
    toolbar: {
      type: Array,
      default: () => {
        return ['import', 'clear', 'preview', 'generate']
      }
    },
    undoRedo: {
      type: Boolean,
      default: true
    },
    includeFields: {
      type: Array,
      default: () => {
        const arr = []
        fields.forEach(f => {
          f.list.forEach(c => {
            arr.push(c.type)
          })
        })
        return arr
      }
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      widgetEmpty,
      fields,
      widgetForm: {
        column: [],
        labelPosition: 'left',
        labelWidth: 120,
        componentSize: 'small'
      },
      configTab: 'widget',
      widgetFormSelect: {},
      widgetFormPreview: {},
      previewVisible: false,
      importJsonVisible: false,
      generateJsonVisible: false,
      widgetModels: {},
      importJson: '',
      generateJson: '',
      history: {
        index: 0,
        maxStep: 20,
        steps: []
      }
    }
  },
  computed: {
    leftWidth () {
      if (typeof this.asideLeftWidth === 'string') {
        return this.asideLeftWidth
      } else {
        return `${this.asideLeftWidth}px`
      }
    },
    rightWidth () {
      if (typeof this.asideRightWidth === 'string') {
        return this.asideRightWidth
      } else {
        return `${this.asideRightWidth}px`
      }
    }
  },
  watch: {
    options: {
      handler (val) {
        let options = val
        if (typeof options === 'string') {
          try {
            options = eval('(' + options + ')')
          } catch (e) {
            console.error('非法配置')
            options = { column: [] }
          }
        }
        this.widgetForm = { ...this.widgetForm, ...options }
      },
      deep: true
    }
  },
  mounted () {
    this.handleLoadStorage()
  },
  methods: {
    async handleLoadStorage () {
      let options = this.options
      if (typeof options === 'string') {
        try {
          options = eval('(' + options + ')')
        } catch (e) {
          console.error('非法配置')
          options = { column: [] }
        }
      }
      if (!options.column) options.column = []
      this.widgetForm = this.initHistory({
        index: 0,
        maxStep: 20,
        steps: [{ ...this.widgetForm, ...options }],
        storage: this.storage
      })
      if (this.undoRedo) {
        window.addEventListener('keydown', (evt) => {
          // 监听 cmd + z / ctrl + z 撤销
          if ((evt.metaKey && !evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && !evt.shiftKey && evt.keyCode == 90)) {
            this.widgetForm = this.handleUndo()
          }
          // 监听 cmd + shift + z / ctrl + shift + z / ctrl + y 重做
          if ((evt.metaKey && evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && evt.keyCode == 89)) {
            this.widgetForm = this.handleRedo()
          }
        }, false)
      }
    },
    // 左侧字段点击
    handleFieldClick (item) {
      const activeIndex = this.widgetForm.column.findIndex(c => c.prop == this.widgetFormSelect.prop) + 1
      let newIndex = 0
      if (activeIndex == -1) {
        this.widgetForm.column.push(item)
        newIndex = this.widgetForm.column.length - 1
      } else {
        this.widgetForm.column.splice(activeIndex, 0, item)
        newIndex = activeIndex
      }

      this.$refs.widgetForm.handleWidgetAdd({ newIndex })
    },
    // 预览 - 弹窗
    handlePreview () {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0) this.$message.error('没有需要展示的内容')
      else {
        this.widgetFormPreview = this.widgetForm
        this.previewVisible = true
      }
    },
    // 预览 - 弹窗 - 确定
    handlePreviewSubmit () {
      this.$refs.previewForm.validate((valid, msg) => {
        if (valid) {
          this.$alert(this.widgetModels)
        }
      })
    },
    // 预览 - 弹窗 - 关闭前
    handleBeforeClose () {
      this.$refs.form.resetForm()
      this.widgetModels = {}
      this.previewVisible = false
    },
    // 清空
    handleClear () {
      if (this.widgetForm && this.widgetForm.column && this.widgetForm.column.length > 0) {
        this.$confirm('确定要清空吗？', '警告', {
          type: 'warning'
        }).then(() => {
          this.$set(this.widgetForm, 'column', [])
          this.$set(this, 'widgetModels', {})
          this.$set(this, 'widgetFormSelect', {})
          this.handleHistoryChange(this.widgetForm)
        }).catch(() => {
        })
      } else this.$message.error('没有需要清空的内容')
    }
  }
}
</script>

<style lang="scss">
@import 'packages/assets/styles/designer/index';
</style>
