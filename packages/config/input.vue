<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="data.value"
                clearable
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item label="前缀">
      <el-input v-model="data.prepend"
                clearable
                placeholder="前缀"
      />
    </el-form-item>
    <el-form-item label="后缀">
      <el-input v-model="data.append"
                clearable
                placeholder="后缀"
      />
    </el-form-item>
    <el-form-item label="最大长度">
      <el-input-number v-model="data.maxlength"
                       controls-position="right"
                       placeholder="最大长度"
      />
    </el-form-item>
    <el-form-item v-if="data.type != 'password'"
                  label="显示计数"
    >
      <el-switch v-model="data.showWordLimit"/>
    </el-form-item>
    <el-form-item v-if="data.type == 'password'"
                  label="显示密码"
    >
      <el-switch v-model="data.showPassword"/>
    </el-form-item>
    <el-form-item label="是否只读">
      <el-switch v-model="data.readonly"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"/>
      <el-input v-if="data.required"
                v-model.lazy="data.pattern"
                placeholder="正则表达式"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigInput',
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
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null
      }
    }
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `${this.data.label}必须填写` }
      else this.validator.required = null

      this.generateRule()
    },
    'data.pattern': function (val) {
      if (val) this.validator.pattern = { pattern: new RegExp(val), message: `${this.data.label}格式不匹配` }
      else this.validator.pattern = null

      // delete this.data.pattern
      this.generateRule()
    }
  },
  methods: {
    generateRule () {
      const rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) rules.push(this.validator[key])
      })
      this.data.rules = rules
    }
  }
}
</script>
