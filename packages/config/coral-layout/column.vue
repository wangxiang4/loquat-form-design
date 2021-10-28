<template>
  <div>
    <el-form-item v-loquat-has-perm="[column, 'md']" label="栅格占据的列数">
      <el-input-number v-model.number="column.md"
                       :min="1"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'offset']" label="栅格左侧的间隔格数">
      <el-input-number v-model.number="column.offset"
                       :min="0"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'push']" label="栅格向右移动格数">
      <el-input-number v-model.number="column.push"
                       :min="0"
                       :max="24"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'pull']" label="栅格向左移动格数">
      <el-input-number v-model.number="column.pull"
                       :min="0"
                       :max="24"
      />
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
        <el-option v-for="item in home.styleSheetsArray"
                   :key="item"
                   :label="item"
                   :value="item"
        />
      </el-select>
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
