<template>
  <!--此处参数引用的是表单设计器内部配置不是引用插件配置-->
  <el-table-column v-if="!column.hide"
                   :prop="column.prop"
                   :label="column.label"
                   :show-overflow-tooltip="column.tableColOverHidden"
                   :render-header="column.tableColRenderHeader"
                   :align="column.tableColAlign || childForm.widgetList.align"
                   :header-align="column.tableColHeaderAlign || childForm.widgetList.headerAlign"
                   :width="column.tableColWidth == 0 ? undefined : column.tableColWidth"
                   :fixed="column.tableColFixed"
  >
    <template slot-scope="{row,$index}">
      <slot v-if="childForm.$scopedSlots[column.prop]"
            :row="row"
            :index="$index"
            :column="column"
            :dic="childForm.DIC[column.prop]"
            :readonly="childForm.formReadonly"
            :disabled="childForm.formDisabled"
            :size="childForm.widgetList.size || childForm.listDefaultConfig.size"
            :name="column.prop"
      />
      <span v-else-if="childForm.formDetailModel || column.tableColDetailModel" v-html="row[column.prop]"/>
      <el-form-item v-else :prop="`list.${$index}.${column.prop}`" :rules="column.rules">
        <!--校验错误提示-->
        <el-tooltip :content="(childForm.listError[`list.${$index}.${column.prop}`] || {}).msg"
                    :disabled="!(childForm.listError[`list.${$index}.${column.prop}`] || {}).valid"
                    placement="top"
        >
          <widget v-model="row[column.prop]"
                  :dic="childForm.DIC[column.prop]"
                  :column="column"
                  :props="childForm.widgetList.props"
                  :readonly="childForm.widgetList.readonly || childForm.readonly"
                  :disabled="childForm.widgetList.disabled || childForm.disabled"
                  :size="childForm.widgetList.size || childForm.listDefaultConfig.size"
                  :enter="childForm.widgetList.enter"
                  @enter="childForm.submit"
                  @change="childForm.handleWidgetChange(column)"
          />
        </el-tooltip>
      </el-form-item>
    </template>
  </el-table-column>
</template>

<script>
import widget from '../form/widget'
export default {
  name: 'ColumnSlot',
  inject: ['childForm'],
  components: { widget },
  props: {
    column: Object
  }
}
</script>
