<template>
  <div class="form-config-container">
    <el-form label-position="top" size="small">
      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签宽度">
        <el-input-number
          v-model="data.labelWidth"
          :min="80"
          :max="200"
          :step="10"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.componentSize">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FormConfig',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
