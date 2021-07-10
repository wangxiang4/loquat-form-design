<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item label="标题宽度">
      <el-input v-model="data.labelWidth" clearable/>
    </el-form-item>
    <el-form-item label="自定义属性">
      <ace-editor
        v-model="customizeConfig"
        lang="json"
        theme="clouds"
        style="height: 300px"
      />
    </el-form-item>
  </div>
</template>
<script>
import AceEditor from 'v-ace-editor'
import beautifier from '@utils/jsonBeautifier'
export default {
  name: 'ConfigCustom',
  components: { AceEditor },
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
      customizeConfig: ''
    }
  },
  watch: {
    'data.customizeConfig': {
      immediate: true,
      handler: function (val) {
        if (val) this.customizeConfig = beautifier(val)
      }
    },
    customizeConfig (val) {
      try {
        this.data.customizeConfig = eval('(' + val + ')')
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  },
  methods: {
  }
}
</script>
