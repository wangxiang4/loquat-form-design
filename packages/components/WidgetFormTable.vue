<template>
  <div>
    <h3 v-show="column.label"
        style="margin: 10px"
    >{{ column.label }}</h3>
    <draggable class="widget-form-table__content"
               :list="column.children.column"
               :group="{ name: 'form' }"
               ghost-class="ghost"
               :animation="200"
               handle=".widget-form-table__item"
               @add="handleWidgetTableAdd($event, column)"
               @end="$emit('change')"
    >
      <template v-if="column.children.column.length > 0">
        <div v-for="(item, tableIndex) in column.children.column"
             :key="tableIndex"
             class="widget-form-table__item"
             :class="{ active: selectWidget.prop == item.prop, required: item.required }"
             :style="{minWidth: item.width ? `${item.width}px`: '33.3%', width: item.width ? `${item.width}px`: '33.3%'}"
             @click.stop="handleWidgetTableSelect(item)"
        >
          <el-table :data="[item]"
                    border
          >
            <el-table-column :prop="item.prop"
                             :label="item.label"
                             :align="column.children.align"
                             :header-align="column.children.headerAlign"
            >
              <widget-form-item :item="item"
                                :params="column.params"
              />
              <el-button v-if="selectWidget.prop == item.prop"
                         title="删除"
                         class="widget-table-action-delete"
                         circle
                         plain
                         size="small"
                         type="danger"
                         @click.stop="handleWidgetTableDelete(column, tableIndex)"
              >
                <i class="iconfont icon-delete"/>
              </el-button>
              <el-button v-if="selectWidget.prop == item.prop"
                         title="复制"
                         class="widget-table-action-clone"
                         circle
                         plain
                         size="small"
                         type="primary"
                         @click.stop="handleWidgetTableClone(column, item)"
              >
                <i class="iconfont icon-copy"/>
              </el-button>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template v-else>
        <avue-empty size="50"
                    style="width: 100%;"
                    desc="拖拽字段至此"
        />
      </template>
    </draggable>
    <el-button v-if="selectWidget.prop == column.prop"
               title="删除"
               class="widget-action-delete"
               circle
               plain
               size="small"
               type="danger"
               @click.stop="handleWidgetDelete(index)"
    >
      <i class="iconfont icon-delete"/>
    </el-button>
    <el-button v-if="selectWidget.prop == column.prop"
               title="清空"
               class="widget-action-clear"
               circle
               plain
               size="small"
               type="warning"
               @click.stop="handleWidgetClear(index)"
    >
      <i class="iconfont icon-clear"/>
    </el-button>
    <el-button v-if="selectWidget.prop == column.prop"
               title="复制"
               class="widget-action-clone"
               circle
               plain
               size="small"
               type="primary"
               @click.stop="handleWidgetCloneTable(index)"
    >
      <i class="iconfont icon-copy"/>
    </el-button>
  </div>
</template>
<script>
import WidgetFormItem from './WidgetFormItem'
import draggable from 'vuedraggable'

export default {
  name: 'WidgetFormTable',
  components: { WidgetFormItem, draggable },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    column: {
      type: Object,
      default () {
        return {}
      }
    },
    select: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selectWidget: this.select
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
    handleSelectWidget (index) {
      this.selectWidget = this.data.column[index]
    },
    handleWidgetClear (index) {
      this.data.column[index].children.column = []
      this.selectWidget = this.data.column[index]
      this.$emit('change')
    },
    handleWidgetDelete (index) {
      if (this.data.column.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleSelectWidget(index - 1)
      } else this.handleSelectWidget(index + 1)

      this.$nextTick(() => {
        this.data.column.splice(index, 1)
        this.$emit('change')
      })
    },
    handleWidgetCloneTable (index) {
      const cloneData = this.deepClone(this.data.column[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      cloneData.children.column.forEach(t => {
        t.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      })
      this.data.column.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit('change')
      })
    },
    handleWidgetTableAdd (evt, column) {
      let newIndex = evt.newIndex
      const item = evt.item

      if (newIndex == 1 && newIndex > column.children.column.length - 1) newIndex = 0
      if (['子表单', '富文本', '坐标拾取器', '分组'].includes(item.textContent)) {
        column.children.column.splice(newIndex, 1)
        return
      }

      const data = this.deepClone(column.children.column[newIndex])
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      data.subfield = true
      delete data.icon
      this.$set(column.children.column, newIndex, { ...data })
      this.selectWidget = column.children.column[newIndex]

      this.$emit('change')
    },
    handleWidgetTableSelect (data) {
      this.selectWidget = data
    },
    handleWidgetTableClone (column, item) {
      const data = this.deepClone(item)
      data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      this.$set(column.children.column, column.children.column.length, { ...data })
      this.$nextTick(() => {
        this.selectWidget = column.children.column[column.children.column.length - 1]
        this.$emit('change')
      })
    },
    handleWidgetTableDelete (column, index) {
      if (column.children.column.length - 1 == index) {
        if (index == 0) this.selectWidget = column
        else this.selectWidget = column.children.column[index - 1]
      } else this.selectWidget = column.children.column[index + 1]
      this.$nextTick(() => {
        column.children.column.splice(index, 1)
        this.$emit('change')
      })
    }
  }
}
</script>
