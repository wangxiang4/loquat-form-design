`<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[customizeStyle, 'width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'tip']" label="字段提示" >
      <el-input v-model="plugin.tip" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'oss']" label="OSS" >
      <el-radio-group v-model="plugin.oss"
                      @change="option => {
                        if(!option) $set(data, 'remote', false)
                        else $set(data, 'remote', true)
                      }"
      >
        <el-radio-button label="">
          普通请求
        </el-radio-button>
        <el-radio-button label="qiniu">
          七牛OSS
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'action']" v-if="!plugin.oss" label="上传地址" >
      <el-input v-model="plugin.action" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'domain']" v-if="plugin.oss" label="Domain" >
      <el-input v-model="plugin.domain" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, remotePerm, 1]" v-if="plugin.oss" label="获取Token" >
      <el-radio-group v-model="data.remoteType">
        <el-radio label="datasource">数据源</el-radio>
        <el-radio label="func">方法函数</el-radio>
      </el-radio-group>
      <template v-if="data.remoteType === 'datasource'">
        <el-select v-model="data.remoteDataSource"
                   style="width: 100%; margin-bottom: 5px;"
                   placeholder="请选择"
        >
          <el-option v-for="item in home.widgetForm.dataSource"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key"
          />
        </el-select>
      </template>
      <template v-if="data.remoteType === 'func'">
        <el-input v-model="data.remoteFunc"
                  style="margin-bottom: 5px;"
                  clearable
        />
      </template>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'limit']" label="最大上传数" >
      <el-input v-model.number="plugin.limit" type="number" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'accept']" label="文件类型">
      <el-select v-model="plugin.accept"
                 placeholder="请选择文件类型"
                 :style="{ width: '100%' }"
                 clearable
      >
        <el-option label="图片" value="image/*" />
        <el-option label="视频" value="video/*" />
        <el-option label="音频" value="audio/*" />
        <el-option label="excel" value=".xls,.xlsx" />
        <el-option label="word" value=".doc,.docx" />
        <el-option label="pdf" value=".pdf" />
        <el-option label="txt" value=".txt" />
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'headers']" label="设置上传的请求头部" >
      <ul>
        <li v-for="(item, index) in plugin.headers" :key="index" style="margin-bottom: 5px;">
          <el-input v-model="item.key"
                    type="textarea"
                    style="width: 100px;margin-right: 5px;"
                    size="mini"
                    :rows="1"
                    clearable
                    placeholder="KEY"
          />
          <el-input v-model="item.value"
                    type="textarea"
                    style="width: 130px;"
                    size="mini"
                    :rows="1"
                    clearable
                    placeholder="VALUE"
          />
          <el-button circle
                     plain
                     type="danger"
                     size="mini"
                     icon="el-icon-minus"
                     style="padding: 4px;margin-left: 5px;"
                     @click="plugin.headers.splice(index, 1)"
          />
        </li>
      </ul>
      <div>
        <el-button type="text" @click="plugin.headers.push({key: '', value: '' })">添加</el-button>
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'data']" label="设置上传的请求参数" >
      <ul>
        <li v-for="(item, index) in plugin.data" :key="index" style="margin-bottom: 5px;">
          <el-input v-model="item.key"
                    type="textarea"
                    style="width: 100px;margin-right: 5px;"
                    size="mini"
                    :rows="1"
                    clearable
                    placeholder="KEY"
          />
          <el-input v-model="item.value"
                    type="textarea"
                    style="width: 130px;"
                    size="mini"
                    :rows="1"
                    clearable
                    placeholder="VALUE"
          />
          <el-button circle
                     plain
                     type="danger"
                     size="mini"
                     icon="el-icon-minus"
                     style="padding: 4px;margin-left: 5px;"
                     @click="plugin.data.splice(index, 1)"
          />
        </li>
      </ul>
      <div>
        <el-button type="text" @click="plugin.data.push({key: '', value: '' })">添加</el-button>
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'listType']" label="文件列表类型" >
      <el-radio-group v-model="plugin.listType">
        <el-radio-button label="text">
          附件
        </el-radio-button>
        <el-radio-button label="picture-card">
          照片墙
        </el-radio-button>
        <el-radio-button label="picture-img">
          头像
        </el-radio-button>
        <el-radio-button label="picture">
          缩略图
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, ['fileSize', 'byteUnit'], 1]" label="文件大小" >
      <el-input v-model.number="plugin.fileSize" placeholder="请输入文件大小">
        <el-select slot="append" v-model="plugin.byteUnit" :style="{ width: '66px' }">
          <el-option label="KB" value="KB" />
          <el-option label="MB" value="MB" />
          <el-option label="GB" value="GB" />
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, configCenterPerm, 1]" label="配置中心">
      <el-collapse accordion>
        <el-collapse-item v-loquat-has-perm="[plugin, uploadConfigPerm, 1]" title="上传配置">
          <div v-loquat-has-perm="[uploadConfig, 'home']">
            <span class="horizontal-tip-text">首页地址:</span>
            <el-input v-model="uploadConfig.home" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[uploadConfig, 'fileName']">
            <span class="horizontal-tip-text">文件字段名:</span>
            <el-input v-model="uploadConfig.fileName" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[uploadConfig, 'res']">
            <span class="horizontal-tip-text">响应数据键:</span>
            <el-input v-model="uploadConfig.res" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[uploadConfig, 'resUrl']">
            <span class="horizontal-tip-text">响应数据url键:</span>
            <el-input v-model="uploadConfig.resUrl" size="mini" clearable/>
          </div>
        </el-collapse-item>
        <el-collapse-item v-loquat-has-perm="[plugin, canvasOptionPerm, 1]" title="水印配置">
          <div v-loquat-has-perm="[canvasOption, 'text']">
            <span class="horizontal-tip-text">水印文字:</span>
            <el-input v-model="canvasOption.text" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[canvasOption, 'fontFamily']">
            <span class="horizontal-tip-text">字体类型:</span>
            <el-input v-model="canvasOption.fontFamily" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[canvasOption, 'color']">
            <span class="horizontal-tip-text">字体颜色:</span>
            <loquat-input-color v-model="canvasOption.color" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[canvasOption, 'fontSize']">
            <span class="horizontal-tip-text">字体大小:</span>
            <el-input-number v-model="canvasOption.fontSize"
                             style="width: 100%;"
                             size="mini"
                             controls-position="right"
            />
          </div>
          <div v-loquat-has-perm="[canvasOption, 'opacity']">
            <span class="horizontal-tip-text">文字的透明度:</span>
            <el-input-number v-model="canvasOption.opacity"
                             style="width: 100%;"
                             size="mini"
                             controls-position="right"
                             :step="10"
                             :min="10"
                             :max="100"
            />
          </div>
          <div v-loquat-has-perm="[canvasOption, 'bottom']">
            <span class="horizontal-tip-text">文字距离图片底部的距离:</span>
            <el-input-number v-model="canvasOption.bottom"
                             style="width: 100%;"
                             controls-position="right"
                             size="mini"
            />
          </div>
          <div v-loquat-has-perm="[canvasOption, 'right']">
            <span class="horizontal-tip-text">文字距离图片右边的距离:</span>
            <el-input-number v-model="canvasOption.right"
                             style="width: 100%;"
                             controls-position="right"
                             size="mini"
            />
          </div>
          <div v-loquat-has-perm="[canvasOption, 'fontSize']">
            <span class="horizontal-tip-text">压缩图片比率:</span>
            <el-input-number v-model="canvasOption.ratio"
                             style="width: 100%;"
                             controls-position="right"
                             :step="0.1"
                             :min="0"
                             :max="1"
                             size="mini"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customClass']" label="自定义Class">
      <el-select v-model="data.customClass"
                 style="width: 100%;"
                 filterable
                 allow-create
                 default-first-option
                 multiple
                 laceholder="请选择"
      >
        <el-option v-for="item in home.styleSheetsArray"
                   :key="item"
                   :label="item"
                   :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'showCanvas']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.showCanvas">开启水印</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'drag']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.drag">是否拖拽上传</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'multiple']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.multiple">是否多选</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'withCredentials']" v-if="!data.oss" :span="24">
          <el-checkbox v-model="plugin.withCredentials">跨域请求是否提供凭据信息</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'showFileList']" :span="24">
          <el-checkbox v-model="plugin.showFileList">是否显示已上传文件列表</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[validateConfig, 'required']" label="校验">
      <div class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!$loquat.validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${$loquat.get(eventsDic, key, '')}`"
                            :name="key"
          >
            <div class="event-panel-item">
              <el-select v-model="data.events[key]"
                         size="mini"
                         style="width: 100%; margin-bottom: 5px;"
              >
                <el-option v-for="item in home.widgetForm.eventScript"
                           :key="item.key"
                           :label="item.name"
                           :value="item.name"
                />
              </el-select>
              <i title="编辑代码" class="iconfont icon-code-generation" @click.stop="home.handleActionSettingsSetData({ eventName: key, funcName: val })"/>
              <i title="删除" class="iconfont icon-trash" @click.stop="data.events[key] = ''"/>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dropdown style="width: 100%; margin-top: 5px;"
                     placement="bottom"
                     trigger="click"
        >
          <el-button size="mini"
                     type="primary"
                     plain
                     style="width: 100%;"
          >新增动作<i class="el-icon-plus"/>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 280px;">
            <el-dropdown-item v-for="(val,key,index) in data.events"
                              :key="index"
                              :disabled="!!val"
                              @click.native="() => {
                                home.handleActionSettingsSetData({ eventName: key })
                                home.handleActionAdd()
                              }"
            >{{ `${key} ${$loquat.get(eventsDic, key, '')}` }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { EVENTS_DIC } from '@/global/variable'
export default {
  name: 'Upload',
  props: {
    data: {
      type: Object
    },
    home: {
      type: Object
    }
  },
  data () {
    return {
      eventsDic: EVENTS_DIC,
      operationComputedSpan: 24 / 2,
      operationPerm: [
        'hide',
        'hideLabel',
        'plugin.drag',
        'plugin.disabled',
        'plugin.showCanvas',
        'plugin.withCredentials',
        'plugin.multiple',
        'plugin.showFileList'
      ],
      uploadConfigPerm: [
        'uploadConfig.home',
        'uploadConfig.fileName',
        'uploadConfig.resUrl',
        'uploadConfig.res'
      ],
      canvasOptionPerm: [
        'canvasOption.fontSize',
        'canvasOption.opacity',
        'canvasOption.bottom',
        'canvasOption.right',
        'canvasOption.ratio',
        'canvasOption.text',
        'canvasOption.fontFamily',
        'canvasOption.color'
      ],
      remotePerm: [
        'remoteType',
        'remoteDataSource',
        'remoteFunc'
      ]
    }
  },
  computed: {
    configCenterPerm () {
      return [...this.uploadConfigPerm, ...this.canvasOptionPerm]
    },
    plugin () {
      return this.data.plugin || {}
    },
    customizeStyle () {
      return this.plugin.customizeStyle || {}
    },
    uploadConfig () {
      return this.plugin.uploadConfig || {}
    },
    canvasOption () {
      return this.plugin.canvasOption || {}
    },
    validateConfig () {
      return this.data.validateConfig || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.data.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  }
}
</script>
