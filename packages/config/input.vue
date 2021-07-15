<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'span']" label="表单栅格">
      <el-slider v-model="data.span" :max="24" :min="1" :marks="{12:''}"/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'style.width']" label="组件宽度" >
      <el-input v-model="style.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'placeholder']" label="占位内容">
      <el-input v-model="data.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'value']" label="默认值">
      <el-input v-model="data.value"
                clearable
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'prepend']" label="前缀">
      <el-input v-model="data.prepend"
                clearable
                placeholder="前缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'append']" label="后缀">
      <el-input v-model="data.append"
                clearable
                placeholder="后缀"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,'maxlength']" label="最多输入">
      <el-input v-model="data.maxlength"
                type="number"
                placeholder="请输入字符长度"
      ><template slot="append">个字符</template>
      </el-input>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,optionPerm,1]" label="操作属性">
      <el-checkbox v-model="data.readonly"
                   v-loquat-has-perm="[data,'readonly']"
      >只读</el-checkbox>
      <el-checkbox v-model="data.showWordLimit"
                   v-loquat-has-perm="[data,'showWordLimit']"
      >显示计数</el-checkbox>
      <el-checkbox v-model="data.disabled"
                   v-loquat-has-perm="[data,'disabled']"
      >禁用</el-checkbox>
      <el-checkbox v-model="data.showPassword"
                   v-loquat-has-perm="[data,'showPassword']"
      >显示密码</el-checkbox>
      <el-checkbox v-model="data.hide"
                   v-loquat-has-perm="[data,'hide']"
      >隐藏</el-checkbox>
      <el-checkbox v-model="data.hideLabel"
                   v-loquat-has-perm="[data,'hideLabel']"
      >隐藏标签</el-checkbox>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data,validatePerm,1]" label="校验">
      <div v-loquat-has-perm="[data,'validateConfig.required']" class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
      <div v-loquat-has-perm="[data,'validateConfig.type']" class="validate-block">
        <el-checkbox v-model="validateConfig.type" style="margin-right: 10px;"/>
        <el-select v-model.lazy="validateConfig.typeFormat"
                   :disabled="!validateConfig.type"
                   size="mini"
                   placeholder="请选择"
        >
          <el-option value="string" label="字符串"/>
          <el-option value="number" label="数字"/>
          <el-option value="boolean" label="布尔值"/>
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
      <div v-loquat-has-perm="[data,'validateConfig.pattern']" class="validate-block">
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
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
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
    }
  },
  watch: {
    validateConfig: {
      handler (val) {
        const rules = []
        if (val.required) rules.push({ required: true, message: val.requiredMessage || `${this.data.label}必须填写` })
        if (val.type) rules.push({ type: val.typeFormat, message: val.typeMessage || `${this.data.label}格式不正确` })
        if (val.pattern) rules.push({ pattern: val.patternFormat, message: val.patternMessage || `${this.data.label}格式不匹配` })
        this.data.rules = rules
      },
      deep: true
    }
  }
}
</script>
