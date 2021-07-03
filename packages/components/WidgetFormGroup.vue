<template>
  <div>
    <h4 v-show="column.label"
        class="widget-form-group__head"
    ><i v-show="column.icon"
        :class="column.icon"
        style="margin-right: 10px;"
    />{{ column.label }}</h4>
    <draggable class="widget-form-group__body"
               :list="column.children.column"
               :group="{ name: 'form' }"
               ghost-class="ghost"
               :animation="200"
               @add="handleWidgetGroupAdd($event, column)"
               @end="$emit('change')"
    >
      <template v-for="(item, groupIndex) in column.children.column">
        <div v-if="item.type == 'dynamic'"
             :key="groupIndex"
             class="widget-form-table"
             :class="{ active: selectWidget.prop == item.prop }"
             @click.stop="handleWidgetTableSelect(item)"
        >
          <widget-form-table :data="column.children"
                             :column="item"
                             :index="groupIndex"
                             :select.sync="selectWidget"
                             @change="$emit('change')"
          />
        </div>
        <el-col v-else
                :key="groupIndex"
                :md="item.span || 12"
                :xs="24"
                :offset="item.offset || 0"
        >
          <el-form-item class="widget-form-group__item"
                        :label="item.label"
                        :prop="item.prop"
                        :class="{ active: selectWidget.prop == item.prop, 'required': item.required }"
                        @click.native.stop="handleWidgetTableSelect(item)"
          >
            <widget-form-item :item="item"
                              :params="column.params"
            />
            <el-button v-if="selectWidget.prop == item.prop"
                       title="删除"
                       class="widget-form-group__item--delete"
                       circle
                       plain
                       type="danger"
                       @click.stop="handleWidgetTableDelete(column, groupIndex)"
            >
              <i class="iconfont icon-delete"/>
            </el-button>
            <el-button v-if="selectWidget.prop == item.prop"
                       title="复制"
                       class="widget-form-group__item--clone"
                       circle
                       plain
                       type="primary"
                       @click.stop="handleWidgetTableClone(column, item)"
            >
              <i class="iconfont icon-copy"/>
            </el-button>
          </el-form-item>
        </el-col>
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
import WidgetFormTable from './WidgetFormTable'
import draggable from 'vuedraggable'

export default {
  name: 'WidgetFormGroup',
  components: { WidgetFormItem, WidgetFormTable, draggable },
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
    },
    handleWidgetGroupAdd (evt, column) {
      let newIndex = evt.newIndex
      const item = evt.item

      if (newIndex == 1 && newIndex > column.children.column.length - 1) newIndex = 0
      if (['分组'].includes(item.textContent)) {
        column.children.column.splice(newIndex, 1)
        return
      }

      const data = this.deepClone(column.children.column[newIndex])
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      delete data.icon
      if (data.type == 'dynamic') data.span = 24
      else data.span = 12
      this.$set(column.children.column, newIndex, { ...data })
      this.selectWidget = column.children.column[newIndex]

      this.$emit('change')
    }
  }
}
</script>
