<template>
  <div @click.stop="emitInvoke('select')">
    <div :class="['widget-view',
                  'widget-child-form', {
                    active: selectWidget.prop == column.prop,
                    readonly: plugin.readonly,
                    hide: column.hide
                  }]"
    >
      <el-form-item class="widget-form-item"
                    :class="[{
                      required: validateConfig.required
                    }].concat(column.customClass||[])"
                    :prop="column.prop"
                    :label="column.hideLabel ? '' : column.label"
                    :label-width="column.hideLabel ? '0' : getLabelWidth(column, data, formDefaultConfig.labelWidth)"
                    :label-position="column.labelPosition || data.labelPosition || formDefaultConfig.labelPosition"
      >
        <div class="widget-child-form-wrapper">
          <el-table :data="[{}]"
                    class="widget-child-form-left"
                    row-class-name="widget-child-form-row"
          >
            <el-table-column v-if="!configOption.indexExecute"
                             :label="configOption.indexExecuteLabel"
                             :width="50"
            >1</el-table-column>
          </el-table>
          <div class="widget-child-form-content">
            <div v-if="childFormColumns.length == 0"
                 class="child-form-empty"
            >将字段拖拽到此处</div>
            <draggable :list="childFormColumns"
                       :group="{ name: 'form', put: handleExcludeDraggable }"
                       ghost-class="ghost"
                       :animation="300"
                       handle=".widget-view-drag"
                       class="widget-child-form-col"
                       :style="{width: `calc(${columnCalcWidth}px)`}"
                       @start="handleDraggableWidget(childFormColumns, $event)"
                       @add="handleWidgetColAdd"
                       @end="$emit('change')"
            >
              <template v-for="(column, index) in childFormColumns">
                <widget-child-form-item :key="index"
                                        :data="data"
                                        :column="column"
                                        :index="index"
                                        :select.sync="selectWidget"
                                        :widgets="childFormColumns"
                />
              </template>
            </draggable>
          </div>
        </div>
      </el-form-item>
      <div v-if="selectWidget.prop == column.prop" class="widget-view-action widget-layout-action">
        <i title="复制" class="iconfont icon-clone" @click.stop="emitInvoke('clone')"/>
        <i title="删除" class="iconfont icon-trash" @click.stop="emitInvoke('delete')"/>
      </div>
      <div v-if="selectWidget.prop == column.prop" class="widget-view-drag widget-layout-drag">
        <i class="iconfont icon-drag"/>
      </div>
      <div class="widget-view-model">
        <span v-text="column.prop"/>
      </div>
    </div>
  </div>
</template>
<script>
import { getLabelWidth, getWidgetAddData } from '@utils/dataFormat'
import widgetChildFormItem from '../WidgetChildFormItem'
import { CHILD_FORM_DRAGGABLE_EXCLUDE_TYPES, DEFAULT_CONFIG_INSIDE_FORM } from '@/global/variable'
export default {
  name: 'WidgetChildForm',
  components: { widgetChildFormItem },
  props: {
    data: {
      type: Object
    },
    column: {
      type: Object
    },
    select: {
      type: Object
    },
    draggable: {
      type: Object
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
    configOption () {
      return this.plugin.option || {}
    },
    childFormColumns () {
      return this.configOption.column || []
    },
    columnCalcWidth () {
      return (this.childFormColumns.length * 200) + 200
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
    },
    draggable (val) {
      this.draggableWidget = val
    },
    draggableWidget: {
      handler (val) {
        this.$emit('update:draggable', val)
      },
      deep: true
    }
  },
  methods: {
    getLabelWidth,
    emitInvoke (methodName) {
      this.$parent.emitInvoke(methodName)
    },
    handleDataSelectWidget (data) {
      this.selectWidget = data
    },
    handleDraggableWidget (columns = [], evt) {
      const oldIndex = evt.oldIndex
      this.draggableWidget = columns[oldIndex]
    },
    // 排除一些不支持新增的插件,防止一些递归错误,子表单组件没做递归处理
    handleExcludeDraggable () {
      return !CHILD_FORM_DRAGGABLE_EXCLUDE_TYPES.includes(this.draggableWidget.type)
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (evt) {
      const newIndex = evt.newIndex
      this.$set(this.childFormColumns, newIndex, getWidgetAddData(this.childFormColumns[newIndex]))
      this.handleDataSelectWidget(this.childFormColumns[newIndex])
      this.$nextTick(() => {
        this.$emit('change')
      })
    }
  }
}
</script>
