<template>
  <div class="widget-view coral-layout-row"
       :class="{active: select.prop == column.prop}"
       @click.stop="$emit('selectWidget', index)"
  >
    <el-row type="flex"
            :gutter="column.gutter ? column.gutter : 0"
            :justify="column.justify"
            :align="column.align"
    >
      <el-col v-for="(col, colIndex) in column.cols"
              :key="colIndex"
              class="coral-layout-col"
              :class="{active: select.prop == col.prop}"
              :span="col.span ? col.span : 0"
              @click.native.stop="$emit('update:select', col)"
      >
        <draggable v-model="col.list"
                   :no-transition-on-drag="true"
                   class="widget-col-list"
                   v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                   @add="$emit('widgetAdd')"
                   @end="$emit('change')"
        >
          <template v-for="(column, index) in data.column">
            <template v-if="column.type == 'coralLayout'">
              <coral-layout :key="index"/>
            </template>
            <template v-else>
              <div :key="index" @click.stop="handleSelectWidget(index)">
                <div :class="['widget-view', { active: selectWidget.prop == column.prop }]">
                  <el-form-item class="widget-form-item"
                                :class="[{
                                  'readonly': column.readonly,
                                  'hide': column.hide,
                                  'required': $loquat.get(column, 'validateConfig.required')
                                }].concat(column.customClass||[])"
                                :prop="column.prop"
                                :label="column.hideLabel ? '' : column.label"
                                :label-width="column.hideLabel ? '0' : getLabelWidth(column, data, labelWidth)"
                                :label-position="column.labelPosition || data.labelPosition || labelPosition"
                  >
                    <loquat-form-item :column="column"
                                      :props="data.props"
                                      :value="column.value"
                                      :readonly="data.readonly || column.readonly"
                                      :disabled="data.disabled || column.disabled"
                                      :size="data.size || column.size"
                                      :dic="column.dicData"
                                      :type="column._type"
                                      :preview="false"
                    />
                  </el-form-item>
                  <div v-if="select.prop == column.prop" class="widget-view-action">
                    <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(index)"/>
                    <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
                  </div>
                  <div v-if="select.prop == column.prop" class="widget-view-drag">
                    <i class="iconfont icon-drag"/>
                  </div>
                  <div class="widget-view-model">
                    <span v-text="column.prop"/>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </draggable>
        <div v-if="select.prop == col.prop" class="widget-view-action widget-col-action">
          <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(index)"/>
          <i v-if="column.cols.length > 1" title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
        </div>
      </el-col>
    </el-row>
    <div v-if="select.prop == column.prop" class="widget-view-action widget-col-action">
      <i title="添加列" class="iconfont icon-add" @click.stop="handleWidgetClone(index)"/>
      <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(index)"/>
      <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
    </div>
    <div v-if="select.prop == column.prop" class="widget-view-drag widget-col-drag">
      <i class="iconfont icon-drag"/>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'CoralLayout',
  props: ['data', 'column', 'select', 'index'],
  components: { draggable },
  data () {
    return {
    }
  }
}
</script>
