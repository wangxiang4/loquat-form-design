<template>
  <div class="widget-form-container">
    <el-form ref="widgetForm"
             :label-position="data.labelPosition || labelPosition"
             :label-width="$loquat.setPx(data.labelWidth,labelWidth)"
             :label-suffix="data.labelSuffix || labelSuffix"
             :size="size"
             :class="data.customClass"
    >
      <draggable class="widget-form-list"
                 :list="data.column"
                 :group="{ name: 'form' }"
                 ghost-class="ghost"
                 :animation="300"
                 handle=".widget-view-drag"
                 @add="handleWidgetAdd"
                 @end="$emit('change')"
      >
        <template v-for="(column, index) in data.column">
          <el-col :key="index"
                  :style="{
                    paddingLeft:$loquat.setPx((data.gutter || 0)/2),
                    paddingRight:$loquat.setPx((data.gutter || 0)/2)
                  }"
                  :span="column.span || data.span || span"
                  :md="column.span || data.span || span"
                  :sm="12"
                  :xs="24"
                  :offset="column.offset || offset"
                  @click.native="handleSelectWidget(index)"
          >
            <div :class="['widget-view',{active: selectWidget.prop == column.prop}]">
              <el-form-item class="widget-form-item"
                            :class="[{
                              'readonly': column.readonly,
                              'hide': column.hide,
                              'required': $loquat.get(column,'validateConfig.required')
                            }].concat(column.customClass||[])"
                            :prop="column.prop"
                            :label="column.hideLabel ? '' : column.label"
                            :label-width="column.hideLabel ? '0' : getLabelWidth(column,data,labelWidth)"
                            :label-position="column.labelPosition || data.labelPosition || labelPosition"
              >
                <loquat-form-item :column="column"
                                  :event-script="data.eventScript"
                                  :props="data.props"
                                  :readonly="data.readonly || column.readonly"
                                  :disabled="data.disabled || column.disabled"
                                  :size="data.size || column.size"
                />
              </el-form-item>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
                <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(index)"/>
                <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
              </div>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
                <i class="iconfont icon-drag"/>
              </div>
              <div class="widget-view-model">
                <span v-text="column.prop"/>
              </div>
            </div>
          </el-col>
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import { getLabelWidth } from '@utils/dataFormat'
import Draggable from 'vuedraggable'
import { FORM_DEFAULT_PROP } from '@/global/variable'
export default {
  name: 'WidgetForm',
  components: { Draggable },
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
      ...FORM_DEFAULT_PROP,
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
    getLabelWidth,
    handleSelectWidget (index) {
      this.selectWidget = this.data.column[index]
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      const data = this.$loquat.deepClone(this.data.column[newIndex])
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      delete data.icon
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
      const cloneData = this.$loquat.deepClone(this.data.column[index])
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
