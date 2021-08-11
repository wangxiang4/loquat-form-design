<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'labelWidth']" label="标签宽度">
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
      params: beautifier(this.data.params) || '{}',
      events: beautifier(this.data.events) || '{}',
      originData: this.$loquat.deepClone(this.data)
    }
  },
  computed: {
    style () {
      return this.data.style || {}
    }
  },
  watch: {
    'data.params' (val) {
      this.params = beautifier(val) || '{}'
    },
    'data.events' (val) {
      this.events = beautifier(val) || '{}'
    },
    params (val) {
      try {
        this.data.params = eval('(' + val + ')')
      } catch (e) {
        // console.error(e)
      }
    },
    events (val) {
      try {
        this.data.events = eval('(' + val + ')')
      } catch (e) {
        // console.error(e)
      }
    }
  }
}
</script>
