<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" disabled/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'gutter']" label="栅格间隔">
      <el-input v-model.number="data.gutter" type="number"/>
    </el-form-item>
    <el-form-item v-if="data.flex" v-loquat-has-perm="[data, 'justify']" label="水平排列方式">
      <el-select v-model="data.justify" :style="{ width: '100%' }">
        <el-option label="左对齐" value="start"/>
        <el-option label="右对齐" value="end"/>
        <el-option label="居中" value="center"/>
        <el-option label="两侧间隔相等" value="space-around"/>
        <el-option label="两端对齐" value="space-between"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="data.flex" v-loquat-has-perm="[data, 'align']" label="垂直排列方式">
      <el-select v-model="data.align" :style="{ width: '100%' }">
        <el-option label="顶部对齐" value="top"/>
        <el-option label="居中" value="middle"/>
        <el-option label="底部对齐" value="bottom"/>
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customClass']" label="自定义Class">
      <el-select v-model="data.customClass"
                 style="width: 100%;"
                 filterable
                 allow-create
                 default-first-option
                 multiple
                 laceholder="请选择"
      >
        <el-option v-for="item in home.styleSheetsArray"
                   :key="item"
                   :label="item"
                   :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[data, 'flex']" :span="operationComputedSpan">
          <el-checkbox v-model="data.flex">Flex布局</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'CoralLayoutRow',
  props: {
    data: {
      type: Object
    },
    home: {
      type: Object
    }
  },
  data () {
    return {
      operationComputedSpan: 24 / 2,
      operationPerm: [
        'flex',
        'hide'
      ]
    }
  }
}
</script>
