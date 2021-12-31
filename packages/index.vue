<template>
  <el-container :class="['form-designer', formId]">
    <el-main class="widget-form-main">
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
                           @start="handleDraggableWidget(field.list, $event)"
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
            <template v-if="!validateNull(getCustomFields)">
              <div v-for="(field, index) in getCustomFields" :key="index + fields.length">
                <div class="field-title">{{ field.title }}</div>
                <draggable tag="ul"
                           :list="field.list"
                           :group="{ name: 'form', pull: 'clone', put: false }"
                           ghost-class="ghost"
                           :sort="false"
                           @start="handleDraggableWidget(field.list, $event)"
                >
                  <template v-for="(item, index) in field.list">
                    <li :key="index" class="field-label">
                      <a @click="handleFieldClick(item)">
                        <i class="icon" :class="item.icon"/>
                        <span>{{ item.title || item.label }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </div>
            </template>
          </div>
        </el-aside>
        <el-container class="widget-container" direction="vertical">
          <el-header class="btn-bar">
            <svg-icon class="bar-icon" icon-class="homeIcon"/>
            <div class="btn-diviler"/>
            <div class="btn-bar-plat">
              <a :class="{ active: adapter==='pc' }"
                 @click="adapter = 'pc'"
              ><i class="iconfont icon-pc"/></a>
              <a :class="{ active: adapter==='pad' }"
                 @click="adapter = 'pad'"
              ><i class="iconfont icon-pad"/></a>
              <a :class="{ active: adapter==='mobile' }"
                 @click="adapter = 'mobile'"
              ><i class="iconfont icon-mobile"/></a>
            </div>
            <div class="btn-diviler"/>
            <div v-if="undoRedo" class="btn-bar-action">
              <el-tooltip effect="dark" content="撤销" placement="bottom">
                <el-button type="text"
                           size="medium"
                           icon="iconfont icon-undo"
                           :disabled="historySteps.index == 0"
                           @click="handleWidgetFormUndo"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="重做" placement="bottom">
                <el-button type="text"
                           size="medium"
                           icon="iconfont icon-redo"
                           :disabled="historySteps.index == (historySteps.steps.length - 1)"
                           @click="handleWidgetFormRedo"
                />
              </el-tooltip>
            </div>
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
            <slot name="toolbar-right"/>
          </el-header>
          <el-main>
            <widget-form ref="widgetForm"
                         :adapter="adapter"
                         @change="handleHistoryChange({
                           widgetForm: widgetForm,
                           widgetFormSelect: widgetFormSelect
                         })"
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
        <!--弹出窗口-->
        <el-dialog title="预览"
                   class="loquat-dialog"
                   :visible.sync="previewVisible"
                   :close-on-click-modal="false"
                   append-to-body
                   center
                   fullscreen
                   @close="widgetModels = {}"
        >
          <div :class="['form-preview', adapter]">
            <plugin-form v-if="previewVisible"
                         ref="previewForm"
                         v-model="widgetModels"
                         :option="widgetFormPreview"
                         :disabled="previewDisableSwitch"
                         @submit="handlePreviewGetData"
            />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary"
                       size="medium"
                       @click="handlePreviewGetData"
            >获取数据</el-button>
            <el-button size="medium"
                       @click="handlePreviewFormReset"
            >重置</el-button>
            <el-button size="medium"
                       @click="previewDisableSwitch = !previewDisableSwitch"
            > {{ previewDisableSwitch ? '启动编辑' : '禁用编辑' }} </el-button>
            <el-button size="medium"
                       @click="previewVisible = false"
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
                      style="height: 400px;"
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
                      style="height: 400px;"
          />
          <span slot="footer" class="dialog-footer">
            <el-button type="primary"
                       size="medium"
                       @click="handleExport"
            >导出</el-button>
            <el-popover placement="top-start" trigger="hover">
              <el-form v-model="jsonOption"
                       style="padding: 0 20px;"
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
                   @open="styleSheets = widgetForm.styleSheets"
        >
          <ace-editor v-model="styleSheets"
                      lang="css"
                      theme="textmate"
                      style="height: 450px;"
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
                  <el-header style="height: 40px;">
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
                          <div v-if="!formCallbackHooks.includes(item.key)" class="event-script-menu-action">
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
                  <el-header style="height: 40px;">
                    <div class="event-script-action">
                      <el-button v-if="eventSelect" size="mini" type="primary" @click="handleActionConfirm">确定</el-button>
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
                                      { required: true, message: '函数名称不能为空' },
                                      { validator: handleActionFormNameValidate, trigger: 'blur' }
                                    ]"
                                    label-width="130px"
                      >
                        <el-input v-model="actionForm.name"
                                  :disabled="formCallbackHooks.includes(actionForm.key)"
                        />
                      </el-form-item>
                      <el-form-item prop="func" label-width="0">
                        <div class="code-line">Function () {</div>
                        <ace-editor v-model="actionForm.func"
                                    lang="javascript"
                                    theme="textmate"
                                    style="height: 380px;border:1px solid #dcdfe6;"
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
        <el-dialog title="数据源设置"
                   class="loquat-dialog"
                   :visible.sync="dataSourceSettingsVisible"
                   :close-on-click-modal="false"
                   width="1000px"
                   append-to-body
                   top="3vh"
                   center
                   @close="handleDataSourceCancel"
        >
          <el-container style="height: 600px; border: 1px solid rgb(238, 238, 238);">
            <el-container class="data-source-container">
              <el-aside class="data-source-aside" style="width: 320px;">
                <el-container>
                  <el-header style="height: 40px;">
                    <el-button type="text"
                               size="small"
                               icon="el-icon-plus"
                               @click="handleDataSourceAdd"
                    >添加数据源</el-button>
                  </el-header>
                  <el-main>
                    <el-menu :default-active="dataSourceMenuActive" class="data-source-aside-menu">
                      <el-menu-item v-for="item in widgetForm.dataSource"
                                    :key="item.key"
                                    :index="item.key"
                                    :disabled="dataSourceMenuItemDisabled"
                                    @click.native="handleDataSourceSelect(item.key)"
                      >
                        <div>
                          <span :class="['data-source-menu-i', item.method]">{{ item.method }}</span>
                          <div class="data-source-menu-label">{{ item.name }}</div>
                          <div class="data-source-menu-action">
                            <i title="复制" class="iconfont icon-clone" @click.stop="handleDataSourceClone(item)"/>
                            <i title="删除" class="iconfont icon-trash" @click.stop="handleDataSourceDelete(item)"/>
                          </div>
                        </div>
                      </el-menu-item>
                      <!--虚拟表单项-->
                      <el-menu-item v-if="dataSourceMenuItemDisabled" :index="dataSourceForm.key">
                        <div>
                          <span :class="['data-source-menu-i', dataSourceForm.method]">{{ dataSourceForm.method }}</span>
                          <div class="data-source-menu-label">{{ dataSourceForm.name }}</div>
                          <div class="data-source-menu-action">
                            <i title="复制" class="iconfont icon-clone" @click.stop="handleDataSourceClone(dataSourceForm)"/>
                            <i title="删除" class="iconfont icon-trash" @click.stop="handleDataSourceDelete(dataSourceForm)"/>
                          </div>
                        </div>
                      </el-menu-item>
                    </el-menu>
                  </el-main>
                </el-container>
              </el-aside>
              <el-main class="data-source-main">
                <el-container v-if="dataSourceMainContainerVisible">
                  <el-header style="height: 40px;">
                    <div class="data-source-action">
                      <el-button size="mini" type="primary" @click="handleDataSourceSave">保存</el-button>
                      <el-button size="mini" @click="handleDataSourceRequestTest">请求测试</el-button>
                      <el-button size="mini" @click="handleDataSourceCancel">取消</el-button>
                    </div>
                  </el-header>
                  <el-main>
                    <el-form ref="dataSourceForm"
                             :model="dataSourceForm"
                             size="small"
                             label-width="79px"
                    >
                      <el-form-item label="名称"
                                    prop="name"
                                    :rules="[
                                      { required: true, message: '数据源名称不能为空' },
                                      { validator: handleDataSourceFormNameValidate, trigger: 'blur' }
                                    ]"
                      ><el-input v-model="dataSourceForm.name"/>
                      </el-form-item>
                      <el-form-item label="请求地址"
                                    prop="url"
                                    :rules="[
                                      { required: true, message: '请求地址不能为空' },
                                      { type: 'url', message: 'url格式不正确'}
                                    ]"
                      ><el-input v-model="dataSourceForm.url"
                                 size="small"
                                 type="textarea"
                                 :rows="1"
                      />
                      </el-form-item>
                      <el-form-item label="请求方法" prop="method">
                        <el-radio-group v-model="dataSourceForm.method">
                          <el-radio-button label="GET">GET</el-radio-button>
                          <el-radio-button label="POST">POST</el-radio-button>
                          <el-radio-button label="PUT">PUT</el-radio-button>
                          <el-radio-button label="DELETE">DELETE</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="请求头部" prop="headers">
                        <div class="array-dynamic-container">
                          <div v-for="(item, index) in dataSourceForm.headers" :key="index" class="array-dynamic-item" >
                            <el-input v-model="item.key"
                                      size="small"
                                      clearable
                                      type="textarea"
                                      :rows="1"
                                      placeholder="KEY"
                            />
                            <el-input v-model="item.value"
                                      size="small"
                                      clearable
                                      type="textarea"
                                      :rows="1"
                                      placeholder="VALUE"
                            />
                            <el-button circle
                                       plain
                                       type="danger"
                                       size="small"
                                       icon="el-icon-minus"
                                       @click="dataSourceForm.headers.splice(index, 1)"
                            />
                          </div>
                          <el-button type="text" @click="dataSourceForm.headers.push({})">添加</el-button>
                        </div>
                      </el-form-item>
                      <el-form-item label="请求参数" prop="params">
                        <div class="array-dynamic-container">
                          <div v-for="(item, index) in dataSourceForm.params" :key="index" class="array-dynamic-item" >
                            <el-input v-model="item.key"
                                      size="small"
                                      type="textarea"
                                      :rows="1"
                                      placeholder="KEY"
                            />
                            <el-input v-model="item.value"
                                      size="small"
                                      type="textarea"
                                      :rows="1"
                                      placeholder="VALUE"
                            />
                            <el-button circle
                                       plain
                                       type="danger"
                                       size="small"
                                       icon="el-icon-minus"
                                       @click="dataSourceForm.params.splice(index, 1)"
                            />
                          </div>
                          <el-button type="text" @click="dataSourceForm.params.push({})">添加</el-button>
                        </div>
                      </el-form-item>
                      <el-form-item label="是否使用第三方axios" prop="thirdPartyAxios" label-width="155px">
                        <el-switch v-model="dataSourceForm.thirdPartyAxios"/>
                      </el-form-item>
                      <el-form-item label="是否表单初始化发送请求" prop="auto" label-width="175px">
                        <el-switch v-model="dataSourceForm.auto"/>
                      </el-form-item>
                      <el-form-item label="数据处理">
                        <el-collapse :value="['requestFunc', 'responseFunc', 'errorFunc']">
                          <el-collapse-item name="requestFunc" title="请求发送前：">
                            <div class="code-desc">// config: 发出请求的可用配置选项;</div>
                            <div class="code-desc">// 通过 config.url 可以更改请求地址，通过 config.headers 可以更改请求头部</div>
                            <div class="code-desc">// 通过 config.data 可以更改发送的数据，（GET 请求不适用，需要更改 config.params）</div>
                            <div class="code-line">(config) => {</div>
                            <ace-editor ref="requestFuncAce"
                                        v-model="dataSourceForm.requestFunc"
                                        lang="javascript"
                                        :readonly="dataSourceForm.thirdPartyAxios"
                                        theme="textmate"
                                        style="height: 148px; border:1px solid #dcdfe6;"
                            />
                            <div class="code-line">}</div>
                          </el-collapse-item>
                          <el-collapse-item name="responseFunc" title="请求返回响应数据时：">
                            <div class="code-desc">// 默认直接返回响应数据 res，可以在下方对数据进行处理</div>
                            <div class="code-line">(res) => {</div>
                            <ace-editor v-model="dataSourceForm.responseFunc"
                                        lang="javascript"
                                        theme="textmate"
                                        style="height: 148px; border:1px solid #dcdfe6;"
                            />
                            <div class="code-line">}</div>
                          </el-collapse-item>
                          <el-collapse-item name="errorFunc" title="请求发生错误时：">
                            <div class="code-line">(error) => {</div>
                            <ace-editor v-model="dataSourceForm.errorFunc"
                                        lang="javascript"
                                        theme="textmate"
                                        style="height: 148px; border:1px solid #dcdfe6;"
                            />
                            <div class="code-line">}</div>
                          </el-collapse-item>
                        </el-collapse>
                      </el-form-item>
                    </el-form>
                  </el-main>
                </el-container>
              </el-main>
            </el-container>
          </el-container>
        </el-dialog>
        <el-dialog title="选项"
                   class="loquat-dialog"
                   :visible.sync="cascadeOptionVisible"
                   :close-on-click-modal="false"
                   width="800px"
                   append-to-body
                   top="3vh"
                   center
        >
          <ace-editor v-model="cascadeOption"
                      lang="json"
                      theme="textmate"
                      style="height: 400px;"
          />
          <span slot="footer" class="dialog-footer">
            <el-button type="primary"
                       size="medium"
                       @click="handleCascadeOptionSubmit"
            >确定</el-button>
            <el-button size="medium"
                       @click="cascadeOptionVisible = false"
            >取消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="子表单默认值"
                   class="loquat-dialog"
                   :visible.sync="childFormModelVisible"
                   :close-on-click-modal="false"
                   width="800px"
                   append-to-body
                   top="3vh"
                   center
        >
          <plugin-child-form v-model="plugin.value" v-bind="plugin"/>
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import history from './mixins/history'
import Draggable from 'vuedraggable'
import WidgetForm from './components/WidgetForm'
import FormConfig from './components/FormConfig'
import WidgetConfig from './components/WidgetConfig'
import AceEditor from 'v-ace-editor'
import beautifier from '@utils/jsonBeautifier'
import clipboard from '@utils/clipboard'
import codeBeautifier from 'js-beautify'
import request from '@utils/request'
import packages from '@utils/packages'
import pluginForm from '@/plugins/form'
import pluginChildForm from '@/plugins/child-form'
import { insertCss, parseCss, classCss } from '@utils/dom'
import GlobalConfig from './global/config'
import { randomId8, getObjType, getWidgetFormDefaultConfig, getJsonOptionDefaultConfig, validateNull, deepClone } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'
import SvgIcon from '@components/Helper/SvgIcon'
export default {
  name: 'FormDesign',
  provide () {
    return {
      designProvide: this
    }
  },
  components: { Draggable, WidgetForm, FormConfig, WidgetConfig, AceEditor, pluginForm, SvgIcon, pluginChildForm },
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
        GlobalConfig.fields.forEach(f => {
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
      formId: '',
      adapter: 'pc',
      fields: GlobalConfig.fields,
      formCallbackHooks: GlobalConfig.formExecuteCallbackHooks,
      widgetForm: getWidgetFormDefaultConfig(),
      configTab: 'widget',
      widgetFormSelect: {},
      widgetFormDraggable: {},
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
      jsonOption: getJsonOptionDefaultConfig(),
      styleSheetsArray: [],
      actionForm: {},
      actionMenuActive: '',
      actionMenuItemDisabled: false,
      actionMainContainerVisible: false,
      eventSelect: '',
      dataSourceSettingsVisible: false,
      dataSourceMenuActive: '',
      dataSourceForm: {},
      dataSourceMenuItemDisabled: false,
      dataSourceMainContainerVisible: false,
      styleSheets: '',
      previewDisableSwitch: false,
      cascadeOptionVisible: false,
      cascadeOption: '',
      childFormModelVisible: false
    }
  },
  computed: {
    plugin () {
      return this.widgetFormSelect.plugin || {}
    },
    leftWidth () {
      if (typeof this.asideLeftWidth === 'string') {
        return this.asideLeftWidth
      } else return `${this.asideLeftWidth}px`
    },
    rightWidth () {
      if (typeof this.asideRightWidth === 'string') {
        return this.asideRightWidth
      } else return `${this.asideRightWidth}px`
    },
    getCustomFields () {
      const customFields = deepClone(this.customFields)
      // 处理第三方传入的自定义属性与自定义事件代码美化
      customFields.forEach(item => {
        getObjType(item.list) === 'array' && item.list.forEach(field => {
          !validateNull(field.params)
            ? field.params = codeBeautifier.js(beautifier(field.params), GlobalConfig.beautifierDefaultsConf) : ''
          !validateNull(field.events)
            ? field.events = codeBeautifier.js(beautifier(field.events), GlobalConfig.beautifierDefaultsConf) : ''
        })
      })
      return customFields
    }
  },
  watch: {
    options: {
      handler (val) {
        this.setWidgetFormJson(val)
      },
      deep: true
    }
  },
  mounted () {
    this.handleLoadStorage()
    this.handleStyleSheetsCore()
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    validateNull,
    /** 处理加载历史数据 */
    handleLoadStorage () {
      let options = this.options
      if (typeof options === 'string') {
        try {
          options = eval('(' + options + ')')
        } catch (e) {
          console.error('非法配置')
          options = { column: [] }
        }
      }
      const initData = this.initHistory({
        index: 0,
        maxStep: 20,
        steps: [deepClone({
          widgetForm: { ...this.widgetForm, ...options },
          widgetFormSelect: this.widgetFormSelect
        })],
        storage: this.storage
      })
      this.widgetForm = initData.widgetForm
      if (this.undoRedo) {
        window.addEventListener('keydown', (evt) => {
          // 监听 cmd + z / ctrl + z 撤销
          if ((evt.metaKey && !evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && !evt.shiftKey && evt.keyCode == 90)) {
            this.handleWidgetFormUndo()
          }
          // 监听 cmd + shift + z / ctrl + shift + z / ctrl + y 重做
          if ((evt.metaKey && evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && evt.shiftKey && evt.keyCode == 90) || (evt.ctrlKey && evt.keyCode == 89)) {
            this.handleWidgetFormRedo()
          }
        }, false)
      }
    },
    /** 左侧字段点击 */
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
    /** 初始化预览 */
    handlePreview () {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0) this.$message.error('没有需要展示的内容')
      else {
        this.widgetFormPreview = deepClone(this.widgetForm)
        this.previewVisible = true
      }
    },
    /** 处理预览获取模型数据动作 */
    handlePreviewGetData () {
      this.jsonOption = getJsonOptionDefaultConfig()
      this.$refs.previewForm.validate(valid => {
        if (valid) {
          const clone = deepClone(this.widgetModels)
          this.generateJson = codeBeautifier.js(beautifier(clone), GlobalConfig.beautifierDefaultsConf)
          this.generateJsonVisible = true
        }
      })
    },
    /** 处理清空动作 */
    handleClear () {
      if (this.widgetForm && this.widgetForm.column && this.widgetForm.column.length > 0) {
        this.$set(this.widgetForm, 'column', [])
        this.widgetModels = {}
        this.widgetFormSelect = {}
        this.handleHistoryChange({
          widgetForm: this.widgetForm,
          widgetFormSelect: {}
        })
      } else this.$message.error('没有需要清空的内容')
    },
    /** 初始化导入JSON */
    handleImportJson () {
      const data = getWidgetFormDefaultConfig()
      this.importJson = codeBeautifier.js(beautifier(data), GlobalConfig.beautifierDefaultsConf)
      this.importJsonVisible = true
    },
    /** 导入JSON确定 */
    handleImportJsonSubmit () {
      try {
        const data = getWidgetFormDefaultConfig()
        const options = eval('(' + this.importJson + ')')
        this.widgetForm = deepClone({ ...data, ...options })
        this.importJsonVisible = false
        this.handleHistoryChange({
          widgetForm: this.widgetForm,
          widgetFormSelect: {}
        })
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    /** 初始化生成JSON */
    handleGenerateJson () {
      this.jsonOption = getJsonOptionDefaultConfig()
      this.generateJson = this.getWidgetFormJson()
      this.generateJsonVisible = true
    },
    /** 生成JSON复制 */
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
    /** 生成JSON导出 */
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
    /** 处理样式表提交 */
    handleStyleSheetsSubmit () {
      this.widgetForm.styleSheets = this.styleSheets
      this.styleSheetsVisible = false
      this.handleStyleSheetsCore()
    },
    /** 处理样式表核心逻辑 */
    handleStyleSheetsCore () {
      this.formId = KEY_COMPONENT_NAME.concat(randomId8())
      const css = parseCss(this.widgetForm.styleSheets)
      insertCss(css, this.formId)
      this.styleSheetsArray = classCss(css)
    },
    /** 处理动作设置添加 */
    handleActionAdd () {
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      const id = randomId8()
      this.actionForm = {
        key: id,
        name: `fun_${id}`,
        func: ''
      }
      this.actionMenuItemDisabled = true
      this.actionMainContainerVisible = true
      this.actionMenuActive = id
    },
    /** 处理动作设置菜单选择 */
    handleActionSelect (key) {
      if (this.actionForm.key === key) return
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      this.actionForm = deepClone(this.widgetForm.eventScript.find(item => item.key === key))
      this.actionMainContainerVisible = true
    },
    /** 处理动作设置保存 */
    handleActionSave () {
      this.$refs.actionForm.validate((valid, msg) => {
        if (valid) {
          !this.widgetForm.eventScript ? this.widgetForm.eventScript = [] : ''
          const index = this.widgetForm.eventScript.findIndex(item => item.key === this.actionForm.key)
          index === -1
            ? this.widgetForm.eventScript.push(Object({ ...this.actionForm }))
            : this.widgetForm.eventScript.splice(index, 1, Object({ ...this.actionForm }))
          this.actionMenuItemDisabled = false
          this.$message.success('保存成功')
        }
      })
    },
    /** 处理动作设置克隆 */
    handleActionClone (data) {
      if (this.actionMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      this.actionForm = { ...data }
      this.actionForm.key = randomId8()
      this.actionForm.name += '_copy'
      this.actionMenuItemDisabled = true
      this.actionMainContainerVisible = true
      this.actionMenuActive = this.actionForm.key
    },
    /** 处理动作设置删除 */
    handleActionDelete (data) {
      this.$confirm(`确定要删除该方法 [${data.name}] ?`, '警告', {
        type: 'warning'
      }).then(() => {
        !this.widgetForm.eventScript ? this.widgetForm.eventScript = [] : ''
        this.actionForm.key === data.key ? this.actionMainContainerVisible = false : ''
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
    /** 处理动作设置取消 */
    handleActionCancel () {
      this.actionForm = {}
      this.actionMenuActive = randomId8()
      this.actionMenuItemDisabled = false
      this.actionMainContainerVisible = false
    },
    /** 处理动作设置确认 */
    handleActionConfirm () {
      this.$refs.actionForm.validate((valid, msg) => {
        if (valid) {
          !this.widgetForm.eventScript ? this.widgetForm.eventScript = [] : ''
          const index = this.widgetForm.eventScript.findIndex(item => item.key === this.actionForm.key)
          index === -1
            ? this.widgetForm.eventScript.push(Object({ ...this.actionForm }))
            : this.widgetForm.eventScript.splice(index, 1, Object({ ...this.actionForm }))
          this.$set(this.widgetFormSelect.events, this.eventSelect, this.actionForm.name)
          this.eventSelect = ''
          this.handleActionCancel()
          this.actionSettingsVisible = false
        }
      })
    },
    /** 处理动作设置初始值 */
    handleActionSettingsSetData (obj) {
      const { eventName, funcName } = obj
      this.eventSelect = eventName
      this.actionSettingsVisible = true
      if (funcName && getObjType(funcName) === 'string') {
        const actionForm = this.widgetForm.eventScript.find(item => item.name === obj.funcName)
        if (!actionForm) return
        this.actionForm = actionForm
        this.actionMenuActive = this.actionForm.key
        this.actionMainContainerVisible = true
      }
    },
    /** 处理函数名称不能重复校验 */
    handleActionFormNameValidate (rule, value, callback) {
      !this.widgetForm.eventScript ? this.widgetForm.eventScript = [] : ''
      const eventScript = deepClone(this.widgetForm.eventScript)
      eventScript.find(item => {
        // 如果是编辑模式,则需把当前的对象剔除
        if (item.key !== this.actionForm.key) return item.name === value
        else return false
      }) ? callback(new Error('方法名称不能重复')) : callback()
    },
    /** 处理数据源设置添加 */
    handleDataSourceAdd () {
      if (this.dataSourceMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      const id = randomId8()
      this.dataSourceForm = {
        key: id,
        name: `DataSource_${id}`,
        url: '',
        method: 'GET',
        auto: true,
        thirdPartyAxios: false,
        headers: [],
        params: [],
        requestFunc: 'return config;',
        responseFunc: 'return res;',
        errorFunc: ''
      }
      this.dataSourceMenuItemDisabled = true
      this.dataSourceMainContainerVisible = true
      this.dataSourceMenuActive = id
    },
    /** 处理数据源设置菜单选择 */
    handleDataSourceSelect (key) {
      if (this.dataSourceForm.key === key) return
      if (this.dataSourceMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      const dataSource = deepClone(this.widgetForm.dataSource.find(item => item.key === key))
      dataSource.headers = Object.entries(dataSource.headers).map(([k, v]) => ({ key: k, value: v }))
      dataSource.params = Object.entries(dataSource.params).map(([k, v]) => ({ key: k, value: v }))
      !dataSource.requestFunc ? dataSource.requestFunc = 'return config;' : ''
      !dataSource.responseFunc ? dataSource.responseFunc = 'return res;' : ''
      this.dataSourceForm = dataSource
      this.dataSourceMainContainerVisible = true
    },
    /** 处理数据源设置保存 */
    handleDataSourceSave () {
      this.$refs.dataSourceForm.validate((valid, msg) => {
        if (valid) {
          const dataSource = deepClone(this.dataSourceForm)
          dataSource.headers = Object(...dataSource.headers.map(({ key, value }) => ({ [key]: value })))
          dataSource.params = Object(...dataSource.params.map(({ key, value }) => ({ [key]: value })))
          const index = this.widgetForm.dataSource.findIndex(item => item.key === this.dataSourceForm.key)
          index === -1 ? this.widgetForm.dataSource.push(Object(dataSource)) : this.widgetForm.dataSource.splice(index, 1, Object(dataSource))
          this.dataSourceMenuItemDisabled = false
          this.$message.success('保存成功')
        }
      })
    },
    /** 处理数据源设置克隆 */
    handleDataSourceClone (data) {
      if (this.dataSourceMenuItemDisabled) return this.$message.warning('存在未保存的数据，请先保存')
      this.dataSourceForm = deepClone(data)
      this.dataSourceForm.key = randomId8()
      this.dataSourceForm.name += '_copy'
      this.dataSourceForm.headers = Object.entries(this.dataSourceForm.headers).map(([k, v]) => ({ key: k, value: v }))
      this.dataSourceForm.params = Object.entries(this.dataSourceForm.params).map(([k, v]) => ({ key: k, value: v }))
      !this.dataSourceForm.requestFunc ? this.dataSourceForm.requestFunc = 'return config;' : ''
      !this.dataSourceForm.responseFunc ? this.dataSourceForm.responseFunc = 'return res;' : ''
      this.dataSourceMenuItemDisabled = true
      this.dataSourceMainContainerVisible = true
      this.dataSourceMenuActive = this.dataSourceForm.key
    },
    /** 处理数据源设置删除 */
    handleDataSourceDelete (data) {
      this.$confirm(`确定要删除该方法 [${data.name}] ?`, '警告', {
        type: 'warning'
      }).then(() => {
        this.dataSourceForm?.key === data.key ? this.dataSourceMainContainerVisible = false : ''
        const index = this.widgetForm.dataSource.findIndex(item => item.key === data.key)
        if (index === -1) {
          this.dataSourceForm = {}
          this.dataSourceMenuItemDisabled = false
        } else {
          this.widgetForm.dataSource.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    /** 处理数据源设置取消 */
    handleDataSourceCancel () {
      this.dataSourceForm = {}
      this.dataSourceMenuActive = randomId8()
      this.dataSourceMenuItemDisabled = false
      this.dataSourceMainContainerVisible = false
    },
    /** 处理数据源名称不能重复校验 */
    handleDataSourceFormNameValidate (rule, value, callback) {
      const dataSource = deepClone(this.widgetForm.dataSource)
      dataSource.find(item => {
        // 如果是编辑模式,则需把当前的对象剔除
        if (item.key !== this.dataSourceForm.key) return item.name === value
        else return false
      }) ? callback(new Error('数据源名称不能重复')) : callback()
    },
    /** 处理数据源设置请求测试 */
    handleDataSourceRequestTest () {
      this.$refs.dataSourceForm.validate((valid, msg) => {
        if (valid) {
          const param = (({ url, method, headers, params }) => {
            const requestParam = { url, method, headers, params }
            requestParam.headers = Object(...requestParam.headers.map(({ key, value }) => ({ [key]: value })))
            requestParam.params = Object(...requestParam.params.map(({ key, value }) => ({ [key]: value })))
            return requestParam
          })(this.dataSourceForm)
          // 是否使用第三方Axios请求
          if (this.dataSourceForm.thirdPartyAxios) {
            !validateNull(GlobalConfig.axiosInstance) ? GlobalConfig.axiosInstance(param).then(res => {
              try {
                const execute = new Function('res', this.dataSourceForm.responseFunc)(res)
                this.$alert(JSON.stringify(execute), { confirmButtonText: '确定' })
              } catch (e) {
                this.$alert(e, { confirmButtonText: '确定' })
              }
            }).catch(error => {
              try {
                const execute = new Function('error', this.dataSourceForm.errorFunc)(error)
                this.$alert(JSON.stringify(execute), { confirmButtonText: '确定' })
              } catch (e) {
                this.$alert(e, { confirmButtonText: '确定' })
              }
            }) : packages.logs('thirdPartyAxios')
          } else {
            request.interceptors.request.empty()
            this.dataSourceForm.method !== 'GET' && request.interceptors.request.use(config => {
              return new Function('config', this.dataSourceForm.requestFunc)(config)
            }, undefined)
            request(param).then(res => {
              try {
                const execute = new Function('res', this.dataSourceForm.responseFunc)(res)
                this.$alert(JSON.stringify(execute), { confirmButtonText: '确定' })
              } catch (e) {
                this.$alert(e, { confirmButtonText: '确定' })
              }
            }).catch(error => {
              try {
                const execute = new Function('error', this.dataSourceForm.errorFunc)(error)
                this.$alert(execute, { confirmButtonText: '确定' })
              } catch (e) {
                this.$alert(e, { confirmButtonText: '确定' })
              }
            })
          }
        }
      })
    },
    /** 处理预览表单重置 */
    handlePreviewFormReset () {
      this.$refs.previewForm.resetForm()
    },
    /** 处理级联静态数据设置对话框提交 */
    handleCascadeOptionSubmit () {
      try {
        const plugin = this.widgetFormSelect.plugin || {}
        const cascadeOptionData = eval('(' + this.cascadeOption + ')')
        this.$set(this.widgetFormSelect, 'dicData', cascadeOptionData)
        this.$set(plugin, 'value', [])
        this.cascadeOptionVisible = false
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    /** 处理级联静态数据设置对话框初始值 */
    handleCascadeOptionSetData (obj) {
      const clone = deepClone(obj)
      this.cascadeOption = codeBeautifier.js(beautifier(clone), GlobalConfig.beautifierDefaultsConf)
      this.cascadeOptionVisible = true
    },
    /** 处理部件表单撤回 */
    handleWidgetFormUndo () {
      const undo = this.handleUndo()
      this.widgetForm = undo.widgetForm
      this.widgetFormSelect = undo.widgetFormSelect
    },
    /** 处理部件表单重做 */
    handleWidgetFormRedo () {
      const redo = this.handleRedo()
      this.widgetForm = redo.widgetForm
      this.widgetFormSelect = redo.widgetFormSelect
    },
    /** 处理当前拖拽部件数据 */
    handleDraggableWidget (columns, evt) {
      this.$refs.widgetForm.handleDraggableWidget(columns, evt)
    },
    /** 获取部件表单数据 */
    getWidgetFormJson () {
      const clone = deepClone(this.widgetForm)
      return codeBeautifier.js(beautifier(clone), GlobalConfig.beautifierDefaultsConf)
    },
    /** 设置部件表单数据 */
    setWidgetFormJson (data) {
      let options = data
      if (typeof options === 'string') {
        try {
          options = eval('(' + options + ')')
        } catch (e) {
          console.error('非法配置')
          options = { column: [] }
        }
      }
      const defaultWidgetForm = getWidgetFormDefaultConfig()
      this.widgetForm = deepClone({ ...defaultWidgetForm, ...options })
    }
  }
}
</script>

<style lang="scss">
@import 'packages/assets/styles';
</style>
