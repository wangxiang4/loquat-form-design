<template>
  <div :class="['widget-child-form-view' ,{
         active: selectWidget.prop == column.prop
       }]"
       style="width: 200px;"
       @click.stop="handleDataSelectWidget(column)"
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
import { DEFAULT_CONFIG_INSIDE_FORM } from '@/global/variable'
export default {
  name: 'WidgetChildFormItem',
  components: { widget },
  props: {
    data: {
      type: Object
    },
    column: {
      type: Object
    },
    index: {
      type: Number
    },
    select: {
      type: Object
    },
    widgets: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM,
      selectWidget: this.select,
      draggableWidget: this.draggable
    }
  },
  computed: {
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
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    handleDataSelectWidget (data) {
      this.selectWidget = data
    },
    // 处理插件克隆
    handleWidgetClone (index) {
      this.widgets.splice(index, 0, getWidgetCloneData(this.widgets[index]))
      this.$nextTick(() => {
        this.handleDataSelectWidget(this.widgets[index + 1])
        this.$emit('change')
      })
    },
    // 处理插件删除
    handleWidgetDelete (index) {
      if (this.widgets.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleDataSelectWidget(this.widgets[index - 1])
      } else this.handleDataSelectWidget(this.widgets[index + 1])
      this.$nextTick(() => {
        this.widgets.splice(index, 1)
        this.$emit('change')
      })
    }
  }
}
</script>
