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
        v-model="data.params"
        lang="json5"
        theme="textmate"
        style="height: 300px"
      />
    </el-form-item>
    <el-form-item label="自定义事件">
      <ace-editor
        v-model="data.events"
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
  }
}
</script>
