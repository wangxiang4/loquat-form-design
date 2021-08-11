<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度"/>
    </el-form-item>
    <el-form-item label="自定义属性">
      <ace-editor
        v-model="params"
        lang="json5"
        theme="textmate"
        style="height: 300px"
      />
    </el-form-item>
    <el-form-item label="自定义事件">
      <ace-editor
        v-model="events"
        lang="javascript"
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
      type: Object
    }
  },
  data () {
    return {
      params: '',
      events: ''
    }
  },
  computed: {
    style () {
      return this.data.style || {}
    }
  },
  watch: {
    'data.params': {
      handler (val) {
        this.params = beautifier(val) || ''
      },
      immediate: true
    },
    'data.events': {
      handler (val) {
        this.events = beautifier(val) || ''
      },
      immediate: true
    },
    params (val) {
      try {
        this.data.params = eval('(' + val + ')')
      } catch (e) {
        console.warn('自定义参数数据解析失败,请调整参数后重试')
      }
    },
    events (val) {
      try {
        this.data.events = eval('(' + val + ')')
      } catch (e) {
        console.warn('自定义事件数据解析失败,请调整参数后重试')
      }
    }
  }
}
</script>
