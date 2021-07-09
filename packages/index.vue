<template>
  <div class="form-designer">
    <el-container>
      <!-- 左侧字段 -->
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
      <!-- 中间主布局 -->
      <el-container class="widget-container" direction="vertical">
        <el-header class="widget-container-header">
          <div>
            <template v-if="undoRedo">
              <el-button type="text"
                         size="medium"
                         icon="el-icon-refresh-left"
                         :disabled="historySteps.index == 0"
                         @click="widgetForm = handleUndo()"
              >撤销</el-button>
              <el-button type="text"
                         size="medium"
                         icon="el-icon-refresh-right"
                         :disabled="historySteps.index == historySteps.steps.length - 1"
                         @click="widgetForm = handleRedo()"
              >重做</el-button>
            </template>
          </div>
          <div style="display: flex; align-items: center;">
            <slot name="toolbar-left"/>
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
      <!-- 右侧配置 -->
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
      <!-- 预览 -->
      <el-drawer title="预览"
                 :visible.sync="previewVisible"
                 size="60%"
                 append-to-body
                 :before-close="handleBeforeClose"
      >
        <avue-form v-if="previewVisible"
                   ref="form"
                   v-model="widgetModels"
                   class="preview-form"
                   :option="widgetFormPreview"
                   @submit="handlePreviewSubmit"
        />
        <div class="drawer-foot">
          <el-button size="medium"
                     type="primary"
                     @click="handlePreviewSubmit"
          >确定</el-button>
          <el-button size="medium"
                     type="danger"
                     @click="handleBeforeClose"
          >取消</el-button>
        </div>
      </el-drawer>
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
export default {
  name: 'FormDesign',
  components: { Draggable, WidgetForm, FormConfig, WidgetConfig },
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
        return ['clear', 'preview']
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
      widgetModels: {},
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
        this.transformToAvueOptions(this.widgetForm).then(data => {
          this.widgetFormPreview = data
          this.previewVisible = true
        })
      }
    },
    // 预览 - 弹窗 - 确定
    handlePreviewSubmit (form, done) {
      if (done) {
        this.$alert(this.widgetModels).then(() => {
          done()
        }).catch(() => {
          done()
        })
      } else {
        this.$refs.form.validate((valid, done) => {
          if (valid) {
            this.$alert(this.widgetModels).then(() => {
              done()
            }).catch(() => {
              done()
            })
          }
        })
      }
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
