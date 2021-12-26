<template>
  <div :class="['widget-form-container', adapter]" @contextmenu.prevent="">
    <el-form ref="widgetForm"
             :label-position="data.labelPosition || formDefaultConfig.labelPosition"
             :label-width="setPx(data.labelWidth, formDefaultConfig.labelWidth)"
             :label-suffix="data.labelSuffix || formDefaultConfig.labelSuffix"
             :size="data.size || formDefaultConfig.size"
             :style="defaultBackground"
             :class="data.customClass"
    >
      <draggable :list="columns"
                 :group="{ name: 'form' }"
                 ghost-class="ghost"
                 :animation="300"
                 handle=".widget-view-drag"
                 class="widget-form-list"
                 @start="handleDraggableWidget(columns, $event)"
                 @add="handleWidgetAdd"
                 @end="$emit('change')"
      >
        <template v-for="(column, index) in columns">
          <widget-form-item :key="index"
                            :data="data"
                            :widgets="columns"
                            :index="index"
                            :column="column"
                            @select="handleIndexSelectWidget"
                            @clone="handleWidgetClone"
                            @delete="handleWidgetDelete"
          />
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import widgetEmpty from '@/assets/images/widget-empty.png'
import { getWidgetAddData, getWidgetCloneData } from '@utils/dataFormat'
import Draggable from 'vuedraggable'
import { setPx } from '@utils'
import { DEFAULT_CONFIG_INSIDE_FORM } from '@/global/variable'
import widgetFormItem from '@components/WidgetFormItem'
export default {
  name: 'WidgetForm',
  inject: ['designProvide'],
  provide () {
    return {
      formProvide: this
    }
  },
  components: { Draggable, widgetFormItem },
  props: {
    adapter: {
      type: String,
      default: 'pc'
    }
  },
  data () {
    return {
      widgetEmpty,
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM
    }
  },
  computed: {
    defaultBackground () {
      return { background: this.columns.length === 0 ? `url(${widgetEmpty}) no-repeat 50%` : '' }
    },
    design () {
      return this.designProvide || {}
    },
    data () {
      return this.design.widgetForm || {}
    },
    columns () {
      return this.data.column || []
    },
    widgetFormSelect () {
      return this.design.widgetFormSelect || {}
    },
    widgetFormDraggable () {
      return this.design.widgetFormDraggable || {}
    }
  },
  methods: {
    setPx,
    handleDraggableWidget (columns = [], evt) {
      const oldIndex = evt.oldIndex
      this.$set(this.design, 'widgetFormDraggable', columns[oldIndex])
    },
    handleDataSelectWidget (data) {
      this.$set(this.design, 'widgetFormSelect', data)
    },
    handleIndexSelectWidget (index) {
      this.$set(this.design, 'widgetFormSelect', this.columns[index])
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      this.$set(this.columns, newIndex, getWidgetAddData(this.columns[newIndex]))
      this.handleIndexSelectWidget(newIndex)
      this.$nextTick(() => {
        this.$emit('change')
      })
    },
    handleWidgetDelete (index) {
      if (this.columns.length - 1 === index) {
        if (index === 0) this.handleDataSelectWidget({})
        else this.handleIndexSelectWidget(index - 1)
      } else this.handleIndexSelectWidget(index + 1)
      this.$nextTick(() => {
        this.columns.splice(index, 1)
        this.$emit('change')
      })
    },
    handleWidgetClone (index) {
      this.columns.splice(index, 0, getWidgetCloneData(this.columns[index]))
      this.$nextTick(() => {
        this.handleIndexSelectWidget(index + 1)
        this.$emit('change')
      })
    }
  }
}
</script>
