<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'effect']" label="主题">
      <el-switch v-model="data.effect"
                 :disabled="data.effectType === 'default'"
                 active-value="dark"
                 inactive-value="light"
                 active-text="黑暗"
                 inactive-text="明亮"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'effectType']" label="主题类型">
      <el-select v-model="data.effectType"
                 style="width: 100%;"
      >
        <el-option value="default"/>
        <el-option value="success"/>
        <el-option value="info"/>
        <el-option value="warning"/>
        <el-option value="error"/>
        <el-option value="tip"/>
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'value']" label="默认值">
      <el-input v-model="data.value"
                type="textarea"
                :rows="5"
                clearable
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customClass']" label="自定义Class">
      <loquat-select v-model="data.customClass"
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
      </loquat-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[data, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'center']" :span="operationComputedSpan">
          <el-checkbox v-model="data.center">文字居中</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Font',
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
        'hide',
        'hideLabel'
      ]
    }
  },
  computed: {
  }
}
</script>
