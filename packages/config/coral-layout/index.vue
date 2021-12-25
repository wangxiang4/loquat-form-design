<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" disabled/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'gutter']" label="栅格间隔">
      <el-input v-model.number="column.gutter" type="number"/>
    </el-form-item>
    <el-form-item v-if="column.flex" v-loquat-has-perm="[column, 'justify']" label="水平排列方式">
      <el-select v-model="column.justify" :style="{ width: '100%' }">
        <el-option label="左对齐" value="start"/>
        <el-option label="右对齐" value="end"/>
        <el-option label="居中" value="center"/>
        <el-option label="两侧间隔相等" value="space-around"/>
        <el-option label="两端对齐" value="space-between"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="column.flex" v-loquat-has-perm="[column, 'align']" label="垂直排列方式">
      <el-select v-model="column.align" :style="{ width: '100%' }">
        <el-option label="顶部对齐" value="top"/>
        <el-option label="居中" value="middle"/>
        <el-option label="底部对齐" value="bottom"/>
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'customClass']" label="自定义Class">
      <el-select v-model="column.customClass"
                 style="width: 100%;"
                 filterable
                 allow-create
                 default-first-option
                 multiple
                 laceholder="请选择"
      >
        <el-option v-for="item in design.styleSheetsArray"
                   :key="item"
                   :label="item"
                   :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, somePermission.operate, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[column, 'flex']" :span="operationComputedSpan">
          <el-checkbox v-model="column.flex">Flex布局</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import { originComponentName } from '@utils'
import permission from '@/config/perm'
export default {
  name: 'CoralLayout',
  inject: ['designProvide'],
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      permission,
      first: false,
      operationComputedSpan: 24 / 2
    }
  },
  computed: {
    design () {
      return this.designProvide || {}
    },
    permConfig () {
      const name = originComponentName(this.$options.name)
      return this.permission.find(item => name === item.component) || {}
    },
    somePermission () {
      return this.permConfig.somePermission || {}
    },
    column () {
      return this.first ? this.data : {}
    }
  },
  mounted () {
    this.first = true
  }
}
</script>
