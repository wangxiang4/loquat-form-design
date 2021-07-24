<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'span']" label="表单栅格">
      <el-slider v-model="data.span" :max="24" :min="1" :marks="{12:''}"/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'style.width']" label="组件宽度" >
      <el-input v-model="style.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'placeholder']" label="占位内容">
      <el-input v-model="data.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'value']" label="默认值">
      <el-input v-model="data.value"
                clearable
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'prepend']" label="前缀">
      <el-input v-model="data.prepend"
                clearable
                placeholder="前缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'append']" label="后缀">
      <el-input v-model="data.append"
                clearable
                placeholder="后缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'maxlength']" label="最多输入">
      <el-input v-model="data.maxlength"
                type="number"
                placeholder="请输入字符长度"
      ><template slot="append">个字符</template>
      </el-input>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,'customClass']" label="自定义Class">
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
    <el-form-item v-loquat-has-perm="[originData,optionPerm,1]" label="操作属性">
      <el-checkbox v-model="data.readonly"
                   v-loquat-has-perm="[originData,'readonly']"
      >只读</el-checkbox>
      <el-checkbox v-model="data.showWordLimit"
                   v-loquat-has-perm="[originData,'showWordLimit']"
      >显示计数</el-checkbox>
      <el-checkbox v-model="data.disabled"
                   v-loquat-has-perm="[originData,'disabled']"
      >禁用</el-checkbox>
      <el-checkbox v-model="data.showPassword"
                   v-loquat-has-perm="[originData,'showPassword']"
      >显示密码</el-checkbox>
      <el-checkbox v-model="data.hide"
                   v-loquat-has-perm="[originData,'hide']"
      >隐藏</el-checkbox>
      <el-checkbox v-model="data.hideLabel"
                   v-loquat-has-perm="[originData,'hideLabel']"
      >隐藏标签</el-checkbox>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData,validatePerm,1]" label="校验">
      <div v-loquat-has-perm="[originData,'validateConfig.required']" class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
      <div v-loquat-has-perm="[originData,'validateConfig.type']" class="validate-block">
        <el-checkbox v-model="validateConfig.type" style="margin-right: 10px;"/>
        <el-select v-model.lazy="validateConfig.typeFormat"
                   :disabled="!validateConfig.type"
                   size="mini"
                   placeholder="请选择"
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
      <div v-loquat-has-perm="[originData,'validateConfig.pattern']" class="validate-block">
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
    <el-form-item v-loquat-has-perm="[originData,'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse :value="Object.keys(events)" v-if="!$loquat.validateNull(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :title="`${key} ${$loquat.get(EVENT_DICT,key,'')}`"
                            :key="index"
                            :name="key"
          >
            <div class="event-panel-item">
              <el-select size="mini"
                         v-model="data.events[key]"
                         style="width: 100%; margin-bottom: 5px;"
              >
                <el-option v-for="item in home.widgetForm.eventScript"
                           :key="item.key"
                           :label="item.name"
                           :value="item.name"
                />
              </el-select>
              <i title="编辑代码" class="iconfont icon-code-generation" @click.stop="home.handleActionSettingsSetData({eventName:key,funcName:val})"/>
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
          <el-dropdown-menu slot="dropdown" style="width: 280px">
            <el-dropdown-item v-for="(val,key,index) in data.events"
                              :key="index"
                              :disabled="!!val"
                              @click.native="() => {
                                home.handleActionSettingsSetData({eventName:key})
                                home.handleActionAdd()
                              }"
            >{{`${key} ${$loquat.get(EVENT_DICT,key,'')}`}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { EVENT_DICT } from '@/global/variable'
export default {
  name: 'Input',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    home: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      EVENT_DICT,
      originData: this.$loquat.deepClone(this.data),
      optionPerm: [
        'readonly',
        'showWordLimit',
        'disabled',
        'showPassword',
        'hide',
        'hideLabel'
      ],
      validatePerm: [
        'validateConfig.required',
        'validateConfig.type',
        'validateConfig.pattern'
      ]
    }
  },
  computed: {
    validateConfig () {
      return this.data.validateConfig || {}
    },
    style () {
      return this.data.style || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.data.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  },
  watch: {
    validateConfig: {
      handler (val) {
        const rules = []
        this.data.typePrototype = undefined
        if (val.required) rules.push({ required: true, message: val.requiredMessage || `${this.data.label}必须填写` })
        if (val.type) {
          rules.push({ type: val.typeFormat, message: val.typeMessage || `${this.data.label}格式不正确` })
          if (val.typeFormat === 'number' || val.typeFormat === 'integer' || val.typeFormat === 'float') this.data.typePrototype = 'number'
        }
        if (val.pattern) rules.push({ pattern: val.patternFormat, message: val.patternMessage || `${this.data.label}格式不匹配` })
        this.data.rules = rules
      },
      deep: true
    }
  }
}
</script>
