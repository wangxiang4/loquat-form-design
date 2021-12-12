<template>
  <!--此处参数引用的是表单设计器内部配置不是引用插件配置-->
  <el-table-column v-if="!column.hide"
                   :prop="column.prop"
                   :label="column.label"
                   :class-name="validate && 'required'"
                   :show-overflow-tooltip="column.overHidden"
                   :render-header="column.renderHeader"
                   :align="column.align || childForm.widgetChildForm.align"
                   :header-align="column.headerAlign || childForm.widgetChildForm.headerAlign"
                   :width="column.width == 0 ? undefined : column.width"
                   :min-width="column.minWidth"
                   :fixed="column.fixed || undefined"
  >
    <template slot-scope="{row,$index}">
      <!--设置自定义列内容渲染插槽,满足自定义需求-->
      <slot v-if="childForm.$scopedSlots[column.prop]"
            :row="row"
            :index="$index"
            :column="column"
            :dic="childForm.DIC[column.prop]"
            :readonly="childForm.readonly || column.readonly"
            :disabled="childForm.disabled || column.disabled"
            :size="childForm.widgetChildForm.size || childForm.childFormDefaultConfig.size"
            :name="column.prop"
      />
      <span v-else-if="column.detailModel || childForm.detailModel" v-html="row[column.prop]"/>
      <el-form-item v-else
                    :prop="`list.${$index}.${column.prop}`"
                    :rules="column.rules"
                    :class="column.customClass"
      >
        <widget v-model="row[column.prop]"
                :dic="childForm.DIC[column.prop]"
                :column="column"
                :props="childForm.widgetChildForm.props"
                :readonly="childForm.readonly"
                :disabled="childForm.disabled"
                :size="childForm.widgetChildForm.size || childForm.childFormDefaultConfig.size"
                :enter="childForm.widgetChildForm.enter"
                @enter="childForm.submit"
                @change="childForm.handleWidgetChange(column)"
        />
      </el-form-item>
    </template>
  </el-table-column>
</template>

<script>
import { validateNull } from '@utils'
import widget from '../form/widget'
export default {
  name: 'ColumnSlot',
  inject: ['childForm'],
  components: { widget },
  props: {
    column: Object
  },
  computed: {
    plugin () {
      return this.column.plugin || {}
    },
    validate () {
      return !validateNull(this.column.rules)
    }
  }
}
</script>
