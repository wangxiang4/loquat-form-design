<template>
  <div>
    <el-form-item v-loquat-has-perm="[data, 'offset']" label="栅格左侧的间隔格数">
      <el-input-number v-model.number="data.offset"
                       :min="0"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'push']" label="栅格向右移动格数">
      <el-input-number v-model.number="data.push"
                       :min="0"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'pull']" label="栅格向左移动格数">
      <el-input-number v-model.number="data.pull"
                       :min="0"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'xs']" label="响应式栅格占据的列数(超小|xs)">
      <el-input-number v-model.number="data.xs"
                       :min="1"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'sm']" label="响应式栅格占据的列数(小|sm)">
      <el-input-number v-model.number="data.sm"
                       :min="1"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'md']" label="响应式栅格占据的列数(中等|md)">
      <el-input-number v-model.number="data.md"
                       :min="1"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'lg']" label="响应式栅格占据的列数(大|lg)">
      <el-input-number v-model.number="data.lg"
                       :min="1"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'xl']" label="响应式栅格占据的列数(超大|xl)">
      <el-input-number v-model.number="data.xl"
                       :min="1"
                       :max="24"
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
  </div>
</template>

<script>
export default {
  name: 'CoralLayoutCol',
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
    }
  }
}
</script>
