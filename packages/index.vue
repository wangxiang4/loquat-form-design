<template>
  <div :class="['form-designer',formKey]">
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
          <template v-if="!$loquat.validateNull(customFields)">
            <div v-for="(field, index) in customFields" :key="index + fields.length">
              <div class="field-title">{{ field.title }}</div>
              <draggable tag="ul"
                         :list="field.list"
                         :group="{ name: 'form', pull: 'clone', put: false }"
                         ghost-class="ghost"
                         :sort="false"
              >
                <template v-for="(item, index) in field.list">
                  <li :key="index" class="field-label">
                    <a style="padding: 0 5px;" @click="handleFieldClick(item)">
                      <i :class="item.icon"/>
                      <span style="margin-left: 5px;">{{ item.title || item.label }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </div>
          </template>
        </div>
      </el-aside>
      <el-container class="widget-container" direction="vertical">
        <el-header class="widget-container-header">
          <div style="display: flex; align-items: center">
            <img :src="require('./assets/images/form.svg')" height="30" width="30">
            <el-divider direction="vertical"/>
            <template v-if="undoRedo">
              <el-tooltip effect="dark" content="撤销" placement="bottom">
                <div style="margin-right: 10px">
                  <el-button type="text"
                             size="medium"
                             :disabled="historySteps.index == 0"
                             @click="widgetForm = handleUndo()"
                  ><i class="icon iconfont icon-undo"/>
                  </el-button>
                </div>
              </el-tooltip>
              <el-tooltip effect="dark" content="重做" placement="bottom">
                <div style="margin-right: 10px">
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
                       @click="handleImportJson"
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
                       @click="handleGenerateJson"
            >生成JSON</el-button>
            <slot name="toolbar"/>
          </div>
        </el-header>
        <el-main :style="defaultBackground">
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
            <widget-config :data="widgetFormSelect" :home="this"/>
          </el-tab-pane>
          <el-tab-pane label="表单属性" name="form" lazy style="padding: 0 10px;">
            <form-config :data="widgetForm" :home="this"/>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <!--弹出窗口-->
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
          <el-button type="primary"
                     size="medium"
                     @click="handlePreviewSubmit"
          >获取数据</el-button>
          <el-button size="medium"
                     @click="handleBeforeClose"
          >关闭</el-button>
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
                    theme="textmate"
                    style="height: 400px"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     size="medium"
                     @click="handleImportJsonSubmit"
          >确定</el-button>
          <el-button size="medium"
                     @click="importJsonVisible = false"
          >取消</el-button>
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
                    theme="textmate"
                    :readonly="true"
                    style="height: 400px"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     size="medium"
                     @click="handleExport"
          >导出</el-button>
          <el-popover placement="top-start" trigger="hover">
            <el-form v-model="jsonOption"
                     style="padding: 0 20px"
                     label-suffix="："
                     label-width="166px"
                     label-position="left"
            >
              <el-form-item label="缩进长度-空格数量">
                <el-slider v-model="jsonOption.space"
                           :disabled="jsonOption.minify"
                           show-stops
                           :marks="{ 1: '1', 2: '2', 3: '3', 4: '4' }"
                           :min="1"
                           :max="4"
                           :step="1"
                />
              </el-form-item>
              <el-form-item label="引号类型">
                <el-switch v-model="jsonOption.quoteType"
                           active-value="single"
                           inactive-value="double"
                           active-text="单引号"
                           inactive-text="双引号"
                />
              </el-form-item>
              <el-form-item label="移除key的引号">
                <el-switch v-model="jsonOption.dropQuotesOnKeys"/>
              </el-form-item>
              <el-form-item label="移除数字字符串的引号">
                <el-switch v-model="jsonOption.dropQuotesOnNumbers"/>
              </el-form-item>
              <el-form-item label="数组折叠">
                <el-switch v-model="jsonOption.inlineShortArrays" :disabled="jsonOption.minify"/>
              </el-form-item>
              <el-form-item label="数组折叠-深度">
                <el-slider v-model="jsonOption.inlineShortArraysDepth"
                           :disabled="jsonOption.minify"
                           show-stops
                           :marks="{ 1: '1', 2: '2', 3: '3', 4: '4' }"
                           :min="1"
                           :max="4"
                           :step="1"
                />
              </el-form-item>
              <el-form-item label="压缩json">
                <el-switch v-model="jsonOption.minify"/>
              </el-form-item>
            </el-form>
            <el-button slot="reference"
                       size="medium"
                       type="primary"
                       style="margin-left: 10px;"
                       @click="handleCopy"
            >复制</el-button>
          </el-popover>
        </span>
      </el-dialog>
      <el-dialog title="表单样式表"
                 class="loquat-dialog"
                 :visible.sync="styleSheetsVisible"
                 :close-on-click-modal="false"
                 width="900px"
                 append-to-body
                 top="3vh"
                 center
      >
        <ace-editor v-model="widgetForm.styleSheets"
                    lang="css"
                    theme="textmate"
                    style="height: 450px"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     size="medium"
                     @click="handleStyleSheetsSubmit"
          >确定</el-button>
          <el-button size="medium"
                     @click="styleSheetsVisible = false"
          >取消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="动作设置"
                 class="loquat-dialog"
                 :visible.sync="actionSettingsVisible"
                 :close-on-click-modal="false"
                 width="1000px"
                 append-to-body
                 top="3vh"
                 center
                 @close="handleActionCancel"
      >
        <el-container style="height: 600px; border: 1px solid rgb(238, 238, 238);">
          <el-container class="event-script-container">
            <el-aside class="event-script-aside" style="width: 320px;">
              <el-container>
                <el-header style="height: 40px">
                  <el-button type="text"
                             size="small"
                             icon="el-icon-plus"
                             @click="handleActionAdd"
                  >添加动作</el-button>
                </el-header>
                <el-main>
                  <el-menu :default-active="actionMenuActive" class="event-script-aside-menu">
                    <el-menu-item v-for="item in widgetForm.eventScript"
                                  :key="item.key"
                                  :index="item.key"
                                  :disabled="actionMenuItemDisabled"
                                  @click.native="handleActionSelect(item.key)"
                    >
                      <div>
                        <span class="event-script-menu-i">Function</span>
                        <div class="event-script-menu-label">{{ item.name }}</div>
                        <div class="event-script-menu-action" v-if="!JS_EXECUTE_INCLUDE.includes(item.name)">
                          <i title="复制" class="iconfont icon-clone" @click.stop="handleActionClone(item)"/>
                          <i title="删除" class="iconfont icon-trash" @click.stop="handleActionDelete(item)"/>
                        </div>
                      </div>
                    </el-menu-item>
                    <!--虚拟表单项-->
                    <el-menu-item v-if="actionMenuItemDisabled" :index="actionForm.key">
                      <div>
                        <span class="event-script-menu-i">Function</span>
                        <div class="event-script-menu-label">{{ actionForm.name }}</div>
                        <div class="event-script-menu-action">
                          <i title="复制" class="iconfont icon-clone" @click.stop="handleActionClone(actionForm)"/>
                          <i title="删除" class="iconfont icon-trash" @click.stop="handleActionDelete(actionForm)"/>
                        </div>
                      </div>
                    </el-menu-item>
                  </el-menu>
                </el-main>
              </el-container>
            </el-aside>
            <el-main class="event-script-main">
              <el-container v-if="actionMainContainerVisible">
                <el-header style="height: 40px">
                  <div class="event-script-action">
                    <el-button size="mini" type="primary" v-if="eventSelect" @click="handleActionConfirm">确定</el-button>
                    <el-button size="mini" type="primary" @click="handleActionSave">保存</el-button>
                    <el-button size="mini" @click="handleActionCancel">取消</el-button>
                  </div>
                </el-header>
                <el-main>
                  <el-form ref="actionForm"
                           :model="actionForm"
                           size="small"
                  >
                    <el-form-item label="Function Name"
                                  prop="name"
                                  :rules="[
                                    { required: true, message:'函数名称不能为空' },
                                    { validator: handleActionFormNameValidate, trigger: 'blur' }
                                  ]"
                                  label-width="130px"
                    >
                      <el-input v-model="actionForm.name"
                                :disabled="JS_EXECUTE_INCLUDE.includes(actionForm.name)"
                      />
                    </el-form-item>
                    <el-form-item prop="func" label-width="0">
                      <div class="code-line">Function () {</div>
                      <ace-editor v-model="actionForm.func"
                                  lang="json"
                                  theme="textmate"
                                  style="width: 100%; height: 380px;border:1px solid #dcdfe6;"
                      />
                      <div class="code-line">}</div>
                    </el-form-item>
                  </el-form>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </el-container>
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
import beautifier from '@utils/jsonBeautifier'
import clipboard from '@utils/clipboard'
import { KEY_COMPONENT_NAME_LINE, IMPORT_JSON_TEMPLATE, JS_EXECUTE_INCLUDE } from '@/global/variable'
import { randomId } from '@utils'
import { insertCss, parseCss, classCss } from '@utils/dom'
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
      JS_EXECUTE_INCLUDE,
      widgetForm: {
        column: [],
        labelPosition: 'left',
        labelWidth: 120,
        size: 'small',
        styleSheets: '',
        customClass: [],
        eventScript: [
          {
            'key': 'mounted',
            'name': 'mounted',
            'func': ''
          },
          {
            'key': 'qrkooxrj',
            'name': 'func_qrkooxrj',
            'func': ''
          }
        ]
      },
      configTab: 'widget',
      widgetFormSelect: {},
      widgetFormPreview: {},
      previewVisible: false,
      importJsonVisible: false,
      generateJsonVisible: false,
      styleSheetsVisible: false,
      actionSettingsVisible: false,
      widgetModels: {},
      importJson: '',
      generateJson: '',
      history: {
        index: 0,
        maxStep: 20,
        steps: []
      },
      jsonOption: {},
      styleSheetsArray: [],
      formKey: '',
      actionForm: {},
      actionMenuActive: '',
      actionMenuItemDisabled: false,
      actionMainContainerVisible: false,
      eventSelect: ''
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
    },
    defaultBackground () {
      return { background: (this.widgetForm.column?.length || 0) === 0 ? `url(${widgetEmpty}) no-repeat 50%` : '' }
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
    this.formKey = KEY_COMPONENT_NAME_LINE + randomId()
    this.handleStyleSheetsCore()
  },
  beforeDestroy () {
    insertCss([], this.formKey)
  },
  methods: {
    // 处理加载历史数据
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
        steps: [this.$loquat.deepClone({ ...this.widgetForm, ...options })],
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
    // 初始化预览
    handlePreview () {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0) this.$message.error('没有需要展示的内容')
      else {
        this.widgetFormPreview = this.$loquat.deepClone(this.widgetForm)
        this.previewVisible = true
      }
    },
    // 处理预览确定动作
    handlePreviewSubmit () {
      this.handleResetJson()
      this.$refs.previewForm.validate(valid => {
        if (valid) {
          const clone = this.$loquat.deepClone(this.widgetModels)
          this.generateJson = beautifier(clone, {
            quoteType: 'double',
            dropQuotesOnKeys: false
          })
          this.generateJsonVisible = true
        }
      })
    },
    // 处理预览关闭前重置数据
    handleBeforeClose () {
      this.$refs.previewForm.resetForm()
      this.widgetModels = {}
      this.previewVisible = false
    },
    // 处理清空动作
    handleClear () {
      if (this.widgetForm && this.widgetForm.column && this.widgetForm.column.length > 0) {
        this.$set(this.widgetForm, 'column', [])
        this.$set(this, 'widgetModels', {})
        this.$set(this, 'widgetFormSelect', {})
        this.handleHistoryChange(this.widgetForm)
      } else this.$message.error('没有需要清空的内容')
    },
    // 初始化导入JSON
    handleImportJson () {
      this.importJson = IMPORT_JSON_TEMPLATE
      this.importJsonVisible = true
    },
    // 导入JSON确定
    handleImportJsonSubmit () {
      try {
        this.widgetForm = JSON.parse(this.importJson)
        this.importJsonVisible = false
        this.handleHistoryChange(this.widgetForm)
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // 初始化生成JSON
    handleGenerateJson () {
      this.handleResetJson()
      const clone = this.$loquat.deepClone(this.widgetForm)
      this.generateJson = beautifier(clone, {
        quoteType: 'double',
        dropQuotesOnKeys: false
      })
      this.generateJsonVisible = true
    },
    // 生成JSON复制
    handleCopy () {
      const data = eval('(' + this.generateJson + ')')
      clipboard({
        text: beautifier(data, { ...this.jsonOption })
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
    // 生成JSON导出
    handleExport () {
      const encodedData = encodeURIComponent(this.generateJson)
      const filename = Date.now() + '.json'
      const href = 'data:application/json;charset=UTF-8,' + encodedData
      const a = document.createElement('a')
      a.download = filename // 指定下载的文件名
      a.href = href //  URL对象
      a.click() // 模拟点击
      URL.revokeObjectURL(a.href) // 释放URL 对象
    },
    // 重置Json配置数据
    handleResetJson () {
      this.jsonOption = {
        space: 2,
        dropQuotesOnKeys: true,
        dropQuotesOnNumbers: false,
        inlineShortArrays: false,
        inlineShortArraysDepth: 1,
        quoteType: 'single',
        minify: false
      }
    },
    // 处理样式表提交
    handleStyleSheetsSubmit () {
      this.styleSheetsVisible = false
      this.handleStyleSheetsCore()
    },
    // 处理样式表核心逻辑
    handleStyleSheetsCore () {
      const css = parseCss(this.widgetForm.styleSheets)
      insertCss(css, this.formKey)
      this.styleSheetsArray = classCss(css)
    },
    // 处理动作设置添加
    handleActionAdd () {
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      const id = randomId()
      this.actionForm = {
        'key': id,
        'name': `fun_${id}`,
        'func': ''
      }
      this.actionMenuItemDisabled = true
      this.actionMainContainerVisible = true
      this.actionMenuActive = id
    },
    // 处理动作设置菜单选择
    handleActionSelect (key) {
      if (this.actionForm?.key === key) return
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      this.actionForm = this.$loquat.deepClone(this.widgetForm.eventScript.find(item => item.key === key))
      this.actionMainContainerVisible = true
    },
    // 处理动作设置保存
    handleActionSave () {
      this.$refs.actionForm.validate((valid, msg) => {
        if (valid) {
          const index = this.widgetForm.eventScript.findIndex(item => item.key === this.actionForm.key)
          index === -1 ? this.widgetForm.eventScript.push(Object({ ...this.actionForm })) : this.widgetForm.eventScript.splice(index, 1, Object({ ...this.actionForm }))
          this.actionMenuItemDisabled = false
          this.$message.success('保存成功')
        }
      })
    },
    // 处理动作设置克隆
    handleActionClone (data) {
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      this.actionForm = { ...data }
      this.actionForm.key = randomId()
      this.actionForm.name += '_copy'
      this.actionMenuItemDisabled = true
      this.actionMainContainerVisible = true
      this.actionMenuActive = this.actionForm.key
    },
    // 处理动作设置删除
    handleActionDelete (data) {
      this.$confirm(`确定要删除该方法 [${data.name}] ?`, '警告', {
        type: 'warning'
      }).then(() => {
        this.actionForm?.key === data.key ? this.actionMainContainerVisible = false : ''
        const index = this.widgetForm.eventScript.findIndex(item => item.key === data.key)
        if (index === -1) {
          this.actionForm = {}
          this.actionMenuItemDisabled = false
        } else {
          this.widgetForm.eventScript.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    // 处理动作设置取消
    handleActionCancel () {
      this.actionForm = {}
      this.actionMenuActive = randomId()
      this.actionMenuItemDisabled = false
      this.actionMainContainerVisible = false
    },
    // 处理动作设置确认
    handleActionConfirm () {
      if (Object.hasOwnProperty.call(this.widgetFormSelect.events, this.eventSelect)) {
        this.$set(this.widgetFormSelect.events, this.eventSelect, this.actionForm.name)
      }
      this.eventSelect = ''
      this.handleActionCancel()
      this.actionSettingsVisible = false
    },
    // 设置动作设置初始值
    handleActionSettingsSetData (key, val) {
      this.eventSelect = key
      this.actionSettingsVisible = true
      if (!this.$loquat.validateNull(val)) {
        this.actionForm = this.widgetForm.eventScript.find(item => item.name === val)
        this.actionMenuActive = this.actionForm?.key
        this.actionMainContainerVisible = true
      }
    },
    // 处理函数名称不能重复校验
    handleActionFormNameValidate (rule, value, callback) {
      this.widgetForm.eventScript.find(item => item.name === value) ? callback(new Error('方法名称不能重复')) : callback()
    }
  }
}
</script>

<style lang="scss">
@import 'packages/assets/styles/designer/index';
</style>
