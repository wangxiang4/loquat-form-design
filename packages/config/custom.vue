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
        v-model="params"
        lang="json"
        theme="textmate"
        style="height: 300px"
      />
    </el-form-item>
  </div>
</template>
<script>
import AceEditor from 'v-ace-editor'
import beautifier from '@utils/jsonBeautifier'
export default {
  name: 'Custom',
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
      params: ''
    }
  },
  watch: {
    'data.params': {
      immediate: true,
      handler: function (val) {
        if (val) {
          const clone = this.$loquat.deepClone(val)
          this.params = beautifier(clone, {
            quoteType: 'double',
            dropQuotesOnKeys: false
          })
        }
      }
    },
    params (val) {
      try {
        this.data.params = eval('(' + val + ')')
        // eslint-disable-next-line no-empty
      } catch (e) { }
    }
  }
}
</script>
