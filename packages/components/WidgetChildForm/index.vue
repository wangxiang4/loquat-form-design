<template>
  <div class="widget-child-form-wrapper">
    <el-table :data="[{}]" class="widget-child-form-left">
      <el-table-column v-if="!configOption.indexExecute"
                       :label="configOption.indexExecuteLabel"
                       :width="50"
                       fixed="left"
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
                 @add="handleWidgetColAdd($event, childFormColumn)"
                 @end="$emit('change')"
      >
        <transition-group name="fade" tag="div" class="widget-child-form-col">
          <template v-for="(column, index) in childFormColumn">
            <div :key="index"
                 :class="['widget-view' ,{
                   active: selectWidget.prop == column.prop,
                   hide: column.hide
                 }]"
                 style="width: 200px;"
                 @click.stop="handleWidgetDataSelect(column)"
            >
              <el-table :data="[{}]">
                <el-table-column :label="column.label" :width="198">
                  <widget v-model="plugin.value"
                          :column="column"
                          :dic="column.dicData"
                          :props="data.props"
                          :readonly="data.readonly"
                          :disabled="data.disabled"
                          :size="data.size || widgetFormItem.size"
                          :preview="false"
                  />
                </el-table-column>
              </el-table>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
                <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(childFormColumn, index)"/>
                <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(childFormColumn, index)"/>
              </div>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
                <i class="iconfont icon-drag"/>
              </div>
              <div class="widget-view-model">
                <span v-text="column.prop"/>
              </div>
            </div>
          </template>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>
<script>
import { getWidgetAddData, getWidgetCloneData } from '@utils/dataFormat'
export default {
  name: 'WidgetChildForm',
  props: {
    column: {
      type: Object
    },
    select: {
      type: Object
    }
  },
  inject: ['widgetFormItem'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  computed: {
    plugin () {
      return this.column.plugin || {}
    },
    configOption () {
      return this.plugin.option || {}
    },
    childFormColumn () {
      return this.configOption.column || []
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
    // 处理选择部件,根据数据
    handleWidgetDataSelect (data) {
      this.selectWidget = data
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (evt, list) {
      const newIndex = evt.newIndex
      this.$set(list, newIndex, getWidgetAddData(list[newIndex]))
      this.handleWidgetDataSelect(list[newIndex])
      this.$nextTick(() => {
        this.$emit('change')
      })
    },
    // 处理插件克隆
    handleWidgetClone (list, index) {
      list.splice(index, 0, getWidgetCloneData(list[index]))
      this.$nextTick(() => {
        this.handleWidgetDataSelect(list[index + 1])
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
