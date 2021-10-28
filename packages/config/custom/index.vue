<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'label']" label="标题">
      <el-input v-model="column.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="column.labelWidth" type="number" placeholder="请输入标签宽度"/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'params']" label="自定义属性">
      <ace-editor
        v-model="column.params"
        lang="json5"
        theme="textmate"
        style="height: 300px"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'events']" label="自定义事件">
      <ace-editor
        v-model="column.events"
        lang="javascript"
        theme="textmate"
        style="height: 300px"
      />
    </el-form-item>
  </div>
</template>
<script>
import AceEditor from 'v-ace-editor'
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
      first: false
    }
  },
  computed: {
    column () {
      return this.first ? this.data : {}
    }
  },
  mounted () {
    this.first = true
  }
}
</script>
