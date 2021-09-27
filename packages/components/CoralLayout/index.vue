<template>
  <div class="widget-view coral-layout-row"
       :class="{active: selectWidget.prop == column.prop, hide: column.hide}"
       @click.stop="handleSelectWidget(index)"
  >
    <el-row :type="column.flex ? 'flex' : undefined"
            :gutter="column.gutter ? column.gutter : 0"
            :justify="column.justify"
            :align="column.align"
            :class="column.customClass"
    >
      <el-col v-for="(col, colIndex) in column.cols"
              :key="colIndex"
              class="coral-layout-col"
              :class="[{
                active: selectWidget.prop == col.prop
              }].concat(col.customClass||[])"
              :md="col.md"
              :offset="col.offset"
              :push="col.push"
              :pull="col.pull"
              @click.native.stop="handleWidgetDataSelect(col)"
      >
        <draggable :list="col.list"
                   :group="{ name: 'form' }"
                   ghost-class="ghost"
                   class="widget-col-list"
                   :animation="300"
                   handle=".widget-view-drag"
                   :no-transition-on-drag="true"
                   @add="handleWidgetColAdd($event, col.list)"
                   @end="$emit('change')"
        >
          <template v-for="(column, index) in col.list">
            <template v-if="column.type == 'coralLayoutRow'">
              <coral-layout :key="index"
                            :column="column"
                            :data="data"
                            :widgets="col.list"
                            :index="index"
                            :select.sync="selectWidget"
                            @change="$emit('change')"
              />
            </template>
            <template v-else>
              <div :key="index" @click.stop="handleWidgetDataSelect(col.list[index])">
                <div :class="[
                  'widget-view', {
                    active: selectWidget.prop == column.prop,
                    readonly: column.readonly,
                    hide: column.hide
                  }]"
                >
                  <el-form-item class="widget-form-item"
                                :class="[{
                                  required: $loquat.get(column, 'validateConfig.required')
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
                  <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
                    <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(col.list, index)"/>
                    <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(col.list, index)"/>
                  </div>
                  <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
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
        <div v-if="selectWidget.prop == col.prop" class="widget-view-action widget-col-action">
          <i title="复制"
             class="iconfont icon-clone"
             @click.stop="handleColumnClone(colIndex)"
          />
          <i v-if="column.cols.length > 1"
             title="删除"
             class="iconfont icon-trash"
             @click.stop="handleColumnDelete(colIndex)"
          />
        </div>
      </el-col>
    </el-row>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-action widget-col-action">
      <i title="添加列" class="iconfont icon-add" @click.stop="handleColumnAdd"/>
      <i title="复制" class="iconfont icon-clone" @click.stop="handleRowClone"/>
      <i title="删除" class="iconfont icon-trash" @click.stop="handleRowDelete"/>
    </div>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-drag widget-col-drag">
      <i class="iconfont icon-drag"/>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getObjType } from '@utils'
import { getLabelWidth, fieldTransformWidget } from '@utils/dataFormat'
import { FORM_DEFAULT_PROP } from '@/global/variable'
import { handleRowDeepClone, handleColumnDeepClone } from '@utils/layout'
export default {
  name: 'CoralLayout',
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
    index: {
      type: Number
    },
    widgets: {
      required: true,
      type: Array
    }
  },
  components: { draggable },
  data () {
    return {
      ...FORM_DEFAULT_PROP,
      selectWidget: this.select,
      colPreset: {
        type: 'coralLayoutCol',
        offset: 0,
        push: 0,
        pull: 0,
        md: 24,
        list: [],
        customClass: []
      }
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
    getLabelWidth,
    // 处理选择部件,根据索引
    handleSelectWidget (index) {
      this.selectWidget = this.widgets[index]
    },
    // 处理选择部件,根据数据
    handleWidgetDataSelect (data) {
      this.selectWidget = data
    },
    // 处理行克隆操作
    handleRowClone () {
      this.widgets.splice(this.index, 0, handleRowDeepClone(this.column))
      this.$nextTick(() => {
        this.handleSelectWidget(this.index + 1)
        this.$emit('change')
      })
    },
    // 处理行删除操作
    handleRowDelete () {
      if (this.widgets.length - 1 === this.index) {
        if (this.index === 0) this.selectWidget = {}
        else this.handleSelectWidget(this.index - 1)
      } else this.handleSelectWidget(this.index + 1)
      this.$nextTick(() => {
        this.widgets.splice(this.index, 1)
        this.$emit('change')
      })
    },
    // 处理列添加操作
    handleColumnAdd () {
      const colPreset = this.$loquat.deepClone(this.colPreset)
      colPreset.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      getObjType(this.column.cols) === 'array'
        ? this.column.cols.push(colPreset) : this.$loquat.log.warning('未设置cols参数,注意类型为Array')
    },
    // 处理列克隆操作
    handleColumnClone (index) {
      this.column.cols.splice(index, 0, handleColumnDeepClone(this.column.cols[index]))
      this.$nextTick(() => {
        this.handleWidgetDataSelect(this.column.cols[index])
        this.$emit('change')
      })
    },
    // 处理列删除操作
    handleColumnDelete (index) {
      if (this.column.cols.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleWidgetDataSelect(this.column.cols[index - 1])
      } else this.handleWidgetDataSelect(this.column.cols[index + 1])
      this.$nextTick(() => {
        this.column.cols.splice(index, 1)
        this.$emit('change')
      })
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (evt, list) {
      const newIndex = evt.newIndex
      const data = this.$loquat.deepClone(list[newIndex])
      this.$set(list, newIndex, fieldTransformWidget(data))
      this.handleWidgetDataSelect(list[newIndex])
      this.$emit('change')
    },
    // 处理插件克隆
    handleWidgetClone (list, index) {
      const cloneData = this.$loquat.deepClone(list[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      list.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleWidgetDataSelect(list[index])
        this.$emit('change')
      })
    },
    // 处理插件删除
    handleWidgetDelete (list, index) {
      if (list.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleWidgetDataSelect(list[index - 1])
      } else this.handleWidgetDataSelect(list[index + 1])
      this.$nextTick(() => {
        list.splice(index, 1)
        this.$emit('change')
      })
    }
  }
}
</script>
