<template>
  <div :class="['widget-child-form-view' ,{
         active: selectWidget.prop == column.prop
       }]"
       style="width: 200px;"
       @click.stop="form.handleDataSelectWidget(column)"
  >
    <el-table :data="[{}]"
              :cell-class-name="tableBackgroundClass"
              :header-cell-class-name="tableBackgroundClass"
    >
      <el-table-column :label="column.label"
                       :class-name="validateConfig.required?'required':''"
                       :width="198"
      >
        <widget v-model="column.value"
                :column="column"
                :dic="column.dicData"
                :props="data.props"
                :size="data.size || formDefaultConfig.size"
                :preview="false"
        />
      </el-table-column>
    </el-table>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
      <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(index)"/>
      <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
    </div>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
      <i class="iconfont icon-drag"/>
    </div>
    <div class="widget-view-model">
      <span v-text="column.prop"/>
    </div>
  </div>
</template>

<script>
import { getWidgetCloneData } from '@utils/dataFormat'
import widget from '@/plugins/form/widget'
export default {
  name: 'WidgetChildFormItem',
  inject: ['childFormProvide'],
  components: { widget },
  props: {
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number
    }
  },
  computed: {
    childForm () {
      return this.childFormProvide || {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    tableBackgroundClass () {
      const classDef = {
        hide: this.column.hide,
        readonly: this.plugin.readonly
      }
      let className = ''
      for (const key in classDef) {
        if (classDef[key]) {
          className = key
          break
        }
      }
      return className
    },
    form () {
      return this.childForm.form || {}
    },
    data () {
      return this.childForm.data || {}
    },
    formDefaultConfig () {
      return this.childForm.formDefaultConfig || {}
    },
    selectWidget () {
      return this.childForm.selectWidget || {}
    },
    childFormColumns () {
      return this.childForm.childFormColumns || []
    }
  },
  methods: {
    // 处理插件克隆
    handleWidgetClone (index) {
      this.childFormColumns.splice(index, 0, getWidgetCloneData(this.childFormColumns[index]))
      this.$nextTick(() => {
        this.form.handleDataSelectWidget(this.childFormColumns[index + 1])
        this.from.$emit('change')
      })
    },
    // 处理插件删除
    handleWidgetDelete (index) {
      if (this.childFormColumns.length - 1 === index) {
        if (index === 0) this.form.handleDataSelectWidget({})
        else this.form.handleDataSelectWidget(this.childFormColumns[index - 1])
      } else this.form.handleDataSelectWidget(this.childFormColumns[index + 1])
      this.$nextTick(() => {
        this.childFormColumns.splice(index, 1)
        this.from.$emit('change')
      })
    }
  }
}
</script>
