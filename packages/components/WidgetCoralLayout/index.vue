<template>
  <div class="widget-view widget-coral-layout"
       :class="{active: selectWidget.prop == column.prop, hide: column.hide}"
       @click.stop="form.handleDataSelectWidget(widgets[index])"
  >
    <el-row :type="column.flex ? 'flex' : undefined"
            :gutter="column.gutter"
            :justify="column.justify"
            :align="column.align"
            :class="column.customClass"
    >
      <el-col v-for="(col, colIndex) in coralLayoutColumns"
              :key="colIndex"
              class="widget-coral-layout-col"
              :class="[{
                active: selectWidget.prop == col.prop
              }].concat(col.customClass||[])"
              :md="col.md"
              :offset="col.offset"
              :push="col.push"
              :pull="col.pull"
              @click.native.stop="form.handleDataSelectWidget(col)"
      >
        <draggable :list="col.list"
                   :group="{ name: 'form' }"
                   ghost-class="ghost"
                   :animation="300"
                   handle=".widget-view-drag"
                   class="widget-col-list"
                   @start="form.handleDraggableWidget(col.list, $event)"
                   @add="handleWidgetColAdd(col.list, $event)"
                   @end="form.$emit('change')"
        >
          <template v-for="(column, index) in col.list">
            <widget-form-item :key="index"
                              :widgets="col.list"
                              :index="index"
                              :column="column"
                              layout-type="coralLayout"
                              @select="form.handleDataSelectWidget"
                              @clone="handleWidgetClone"
                              @delete="handleWidgetDelete"
                              @change="form.$emit('change')"
            />
          </template>
        </draggable>
        <div v-if="selectWidget.prop == col.prop" class="widget-view-action widget-layout-action">
          <i title="复制"
             class="iconfont icon-clone"
             @click.stop="handleColumnClone(colIndex)"
          />
          <i v-if="coralLayoutColumns.length > 1"
             title="删除"
             class="iconfont icon-trash"
             @click.stop="handleColumnDelete(colIndex)"
          />
        </div>
      </el-col>
    </el-row>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-action widget-layout-action">
      <i title="添加列" class="iconfont icon-add" @click.stop="handleColumnAdd"/>
      <i title="复制" class="iconfont icon-clone" @click.stop="handleRowClone"/>
      <i title="删除" class="iconfont icon-trash" @click.stop="handleRowDelete"/>
    </div>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-drag widget-layout-drag">
      <i class="iconfont icon-drag"/>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getWidgetAddData, getWidgetCloneData } from '@utils/dataFormat'
import { coralLayoutRowDeepClone, coralLayoutColumnDeepClone } from '@utils/layout'
import widgetFormItem from '@components/WidgetFormItem'
export default {
  name: 'WidgetCoralLayout',
  components: { draggable, widgetFormItem },
  inject: ['formItemProvide'],
  props: {
    column: {
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
  data () {
    return {
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
  computed: {
    formItem () {
      return this.formItemProvide || {}
    },
    coralLayoutColumns () {
      return this.column.cols || []
    },
    form () {
      return this.formItem.form || {}
    },
    selectWidget () {
      return this.form.widgetFormSelect || {}
    }
  },
  methods: {
    // 处理行克隆操作
    handleRowClone () {
      this.widgets.splice(this.index, 0, coralLayoutRowDeepClone(this.column))
      this.$nextTick(() => {
        this.form.handleIndexSelectWidget(this.index + 1)
        this.form.$emit('change')
      })
    },
    // 处理行删除操作
    handleRowDelete () {
      if (this.widgets.length - 1 === this.index) {
        if (this.index === 0) this.form.handleDataSelectWidget({})
        else this.form.handleIndexSelectWidget(this.index - 1)
      } else this.form.handleIndexSelectWidget(this.index + 1)
      this.$nextTick(() => {
        this.widgets.splice(this.index, 1)
        this.form.$emit('change')
      })
    },
    // 处理列添加操作
    handleColumnAdd () {
      this.coralLayoutColumns.push(getWidgetAddData(this.colPreset))
      this.$nextTick(() => {
        this.form.$emit('change')
      })
    },
    // 处理列克隆操作
    handleColumnClone (index) {
      this.coralLayoutColumns.splice(index, 0, coralLayoutColumnDeepClone(this.coralLayoutColumns[index]))
      this.$nextTick(() => {
        this.form.handleDataSelectWidget(this.coralLayoutColumns[index + 1])
        this.form.$emit('change')
      })
    },
    // 处理列删除操作
    handleColumnDelete (index) {
      if (this.coralLayoutColumns.length - 1 === index) {
        if (index === 0) this.form.handleDataSelectWidget({})
        else this.form.handleDataSelectWidget(this.coralLayoutColumns[index - 1])
      } else this.form.handleDataSelectWidget(this.coralLayoutColumns[index + 1])
      this.$nextTick(() => {
        this.coralLayoutColumns.splice(index, 1)
        this.form.$emit('change')
      })
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (list, evt) {
      const newIndex = evt.newIndex
      this.$set(list, newIndex, getWidgetAddData(list[newIndex]))
      this.form.handleDataSelectWidget(list[newIndex])
      this.$nextTick(() => {
        this.form.$emit('change')
      })
    },
    // 处理插件克隆
    handleWidgetClone (list, index) {
      list.splice(index, 0, getWidgetCloneData(list[index]))
      this.$nextTick(() => {
        this.form.handleDataSelectWidget(list[index + 1])
        this.form.$emit('change')
      })
    },
    // 处理插件删除
    handleWidgetDelete (list, index) {
      if (list.length - 1 === index) {
        if (index === 0) this.form.handleDataSelectWidget({})
        else this.form.handleDataSelectWidget(list[index - 1])
      } else this.form.handleDataSelectWidget(list[index + 1])
      this.$nextTick(() => {
        list.splice(index, 1)
        this.form.$emit('change')
      })
    }
  }
}
</script>
