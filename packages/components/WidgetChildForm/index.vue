<template>
  <div @click.stop="formItem.emitInvoke('select')">
    <div :class="['widget-view',
                  'widget-child-form', {
                    active: formItem.selectWidget.prop == formItem.column.prop,
                    readonly: formItem.plugin.readonly,
                    hide: formItem.column.hide
                  }]"
    >
      <el-form-item class="widget-form-item"
                    :class="[{
                      required: formItem.validateConfig.required
                    }].concat(formItem.column.customClass||[])"
                    :prop="formItem.column.prop"
                    :label="formItem.column.hideLabel ? '' : formItem.column.label"
                    :label-width="formItem.column.hideLabel? '0' : formItem.getLabelWidth(formItem.column, formItem.data, formItem.formDefaultConfig.labelWidth)"
                    :label-position="formItem.column.labelPosition || formItem.data.labelPosition || formItem.formDefaultConfig.labelPosition"
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
            <div v-if="childFormColumn.length == 0"
                 class="child-form-empty"
            >将字段拖拽到此处</div>
            <draggable :list="childFormColumn"
                       :group="{ name: 'form' }"
                       ghost-class="ghost"
                       :animation="300"
                       handle=".widget-view-drag"
                       :no-transition-on-drag="true"
                       @add="handleWidgetColAdd($event)"
                       @end="formItem.$emit('change')"
            >
              <transition-group name="fade" tag="div" class="widget-child-form-col" :style="{width: `calc(${columnCalcWidth}px)`}">
                <template v-for="(column, index) in childFormColumn">
                  <widget-child-form-item :key="index" :column="column" :index="index"/>
                </template>
              </transition-group>
            </draggable>
          </div>
        </div>
      </el-form-item>
      <div v-if="formItem.selectWidget.prop == formItem.column.prop" class="widget-view-action widget-layout-action">
        <i title="复制" class="iconfont icon-clone" @click.stop="formItem.emitInvoke('clone')"/>
        <i title="删除" class="iconfont icon-trash" @click.stop="formItem.emitInvoke('delete')"/>
      </div>
      <div v-if="formItem.selectWidget.prop == formItem.column.prop" class="widget-view-drag widget-layout-drag">
        <i class="iconfont icon-drag"/>
      </div>
      <div class="widget-view-model">
        <span v-text="formItem.column.prop"/>
      </div>
    </div>
  </div>
</template>
<script>
import { getWidgetAddData } from '@utils/dataFormat'
import widgetChildFormItem from '../WidgetChildFormItem'
export default {
  name: 'WidgetChildForm',
  components: { widgetChildFormItem },
  inject: ['widgetFormItem'],
  provide () {
    return {
      widgetChildForm: this
    }
  },
  computed: {
    formItem () {
      return this.widgetFormItem || {}
    },
    configOption () {
      return this.formItem.plugin.option || {}
    },
    childFormColumn () {
      return this.configOption.column || []
    },
    columnCalcWidth () {
      return (this.childFormColumn.length * 200) + 200
    }
  },
  methods: {
    // 处理选择部件,根据数据
    handleWidgetDataSelect (data) {
      this.formItem.selectWidget = data
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (evt) {
      const newIndex = evt.newIndex
      this.$set(this.childFormColumn, newIndex, getWidgetAddData(this.childFormColumn[newIndex]))
      this.handleWidgetDataSelect(this.childFormColumn[newIndex])
      this.$nextTick(() => {
        this.formItem.$emit('change')
      })
    }
  }
}
</script>
