<template>
  <div>
    <el-form-item label="默认值">
      <el-input v-model="data.value"
                clearable
                placeholder="默认值"
      />
    </el-form-item>
    <el-form-item label="自定义">
      <el-button type="text"
                 class="danger"
                 @click="handleDicClear"
      >清空
      </el-button>
      <div v-for="(item, index) in data.dicData"
           :key="index"
           class="dic"
      >
        <el-input v-model="item.label"
                  size="mini"
                  placeholder="自定义文字"
                  clearable
                  style="margin-right: 5px"
        />
        <el-input v-model="item.value"
                  size="mini"
                  clearable
                  placeholder="自定义值"
        />
      </div>
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigSwitch',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleDicClear () {
      this.data.dicData = [{ label: '', value: '0' }, { label: '', value: '1' }]
    }
  }
}
</script>
<style lang="scss" scoped>
.dic {
  display: flex;
  margin-bottom: 5px;
}
</style>
