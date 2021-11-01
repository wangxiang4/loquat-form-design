<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'label']" label="标题">
      <el-input v-model="column.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="column.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[customizeStyle, 'width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'placeholder']" label="占位内容">
      <el-input v-model="plugin.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, everyPermission.defaultValue, 2]" label="默认值">
      <el-input v-model="plugin.value"
                clearable
                :type="plugin.type"
                :rows="5"
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'prepend']" label="前缀">
      <el-input v-model="plugin.prepend"
                clearable
                placeholder="前缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'append']" label="后缀">
      <el-input v-model="plugin.append"
                clearable
                placeholder="后缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'maxlength']" label="最多输入">
      <el-input v-model="plugin.maxlength"
                type="number"
                placeholder="请输入字符长度"
      ><template slot="append">个字符</template>
      </el-input>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'customClass']" label="自定义Class">
      <el-select v-model="column.customClass"
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
    <el-form-item v-loquat-has-perm="[column, somePermission.operate, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[plugin, 'readonly']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.readonly">只读</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'showWordLimit']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.showWordLimit">显示计数</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'showPassword']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.showPassword">显示密码</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hideLabel">隐藏标签</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, someAndEveryPermission.validate, 3]" label="校验">
      <div v-loquat-has-perm="[validateConfig, 'required']" class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
      <div v-loquat-has-perm="[column, everyPermission.validateType, 2]" class="validate-block">
        <el-checkbox v-model="validateConfig.type"
                     style="margin-right: 10px;"
                     @change="(mark) => {
                       plugin.type = ''
                       mark && ['number', 'integer', 'float'].includes(validateConfig.typeFormat)
                         ? plugin.type = 'number'
                         : ''
                     }"
        />
        <el-select v-model.lazy="validateConfig.typeFormat"
                   :disabled="!validateConfig.type"
                   size="mini"
                   placeholder="请选择"
                   @change="['number', 'integer', 'float'].includes(validateConfig.typeFormat) ? plugin.type = 'number' : plugin.type = ''"
        >
          <el-option value="string" label="字符串"/>
          <el-option value="number" label="数字"/>
          <el-option value="integer" label="整数"/>
          <el-option value="float" label="浮点数"/>
          <el-option value="url" label="URL地址"/>
          <el-option value="email" label="邮箱地址"/>
          <el-option value="hex" label="十六进制"/>
        </el-select>
        <el-input v-show="validateConfig.type"
                  v-model.lazy="validateConfig.typeMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
      <div v-loquat-has-perm="[validateConfig, 'pattern']" class="validate-block">
        <el-checkbox v-model="validateConfig.pattern" style="margin-right: 10px;"/>
        <el-input v-model.lazy="validateConfig.patternFormat"
                  :disabled="!validateConfig.pattern"
                  size="mini"
                  style="width: 239px;"
                  placeholder="填写正则表达式"
        />
        <el-input v-show="validateConfig.pattern"
                  v-model.lazy="validateConfig.patternMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!$loquat.validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :name="key"
                            :title="`${key} ${$loquat.get(eventsDic, key, '')}`"
          >
            <div class="event-panel-item">
              <el-select v-model="column.events[key]"
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
              <i title="删除" class="iconfont icon-trash" @click.stop="column.events[key] = ''"/>
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
            <el-dropdown-item v-for="(val,key,index) in column.events"
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
import permission from '@/config/perm'
import { originComponentName } from '@utils'
import { EVENTS_DIC } from '@/global/variable'
export default {
  name: 'Input',
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
      permission,
      first: false,
      eventsDic: EVENTS_DIC,
      operationComputedSpan: 24 / 2
    }
  },
  computed: {
    permConfig () {
      const name = originComponentName(this.$options.name)
      return this.permission.find(item => name === item.component) || {}
    },
    somePermission () {
      return this.permConfig.somePermission || {}
    },
    everyPermission () {
      return this.permConfig.everyPermission || {}
    },
    someAndEveryPermission () {
      return this.permConfig.someAndEveryPermission || {}
    },
    column () {
      return this.first ? this.data : {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    customizeStyle () {
      return this.plugin.customizeStyle || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.column.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  },
  mounted () {
    this.first = true
  }
}
</script>
