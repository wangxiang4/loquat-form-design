<template>
  <div>
    <el-form-item label="默认值">
      <a href="https://avuejs.com/doc/plugins/map-plugins"
         target="_blank"
         style="color: #409EFF;"
      >详细文档</a><br>
      <el-input v-model="data.value"
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigMap',
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
