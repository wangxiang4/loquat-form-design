<template>
  <div class="widget-form-container">
    <el-form ref="widgetForm"
             :label-position="data.labelPosition || 'left'"
             :label-width="data.labelWidth ? `${data.labelWidth}px` : '100px' "
             :label-suffix="data.labelSuffix"
             :model="form"
             size="small"
    >
      <el-row :gutter="data.gutter">
        <draggable class="widget-form-list"
                   :list="data.column"
                   :group="{ name: 'form' }"
                   ghost-class="ghost"
                   :animation="300"
                   @add="handleWidgetAdd"
                   @end="$emit('change')"
        >
          <template v-for="(column, index) in data.column">
            <el-col :key="index"
                    :md="column.span || 12"
                    :xs="24"
                    :offset="column.offset || 0"
            >
              <el-form-item class="widget-form-item"
                            :label="column.label"
                            :label-width="column.labelWidth"
                            :prop="column.prop"
                            :class="{ active: selectWidget.prop == column.prop, 'required': column.required }"
                            @click.native="handleSelectWidget(index)"
              >
                <widget-form-item :item="column"
                                  :params="column.params"
                />
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
                           title="复制"
                           class="widget-action-clone"
                           circle
                           plain
                           size="small"
                           type="primary"
                           @click.stop="handleWidgetClone(index)"
                >
                  <i class="iconfont icon-clone"/>
                </el-button>
              </el-form-item>
            </el-col>
          </template>
        </draggable>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import Draggable from 'vuedraggable'

export default {
  name: 'WidgetForm',
  components: { Draggable, WidgetFormItem },
  props: {
    data: {
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
    }
  },
  data () {
    return {
      selectWidget: this.select,
      form: {}
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
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      const data = this.deepClone(this.data.column[newIndex])
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      delete data.icon
      delete data.subfield
      if (data.type == 'title') {
        delete data.label
        this.form[data.prop] = data.value
      }
      this.$set(this.data.column, newIndex, data)
      this.handleSelectWidget(newIndex)

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
    handleWidgetClone (index) {
      const cloneData = this.deepClone(this.data.column[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      this.data.column.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit('change')
      })
    }
  }
}
</script>
