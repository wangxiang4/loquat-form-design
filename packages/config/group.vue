<template>
  <div>
    <el-form-item label="图标">
      <avue-input-icon v-model="data.icon"
                       :icon-list="iconList"
                       placeholder="图标"
      />
    </el-form-item>
    <el-form-item label="开启折叠">
      <el-switch v-model="data.arrow"/>
    </el-form-item>
    <el-form-item v-if="data.arrow"
                  label="默认展开"
    >
      <el-switch v-model="data.collapse"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'ConfigGroup',
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
      iconList: [{
        label: 'element-ui',
        list: ['el-icon-info', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question']
      }]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
