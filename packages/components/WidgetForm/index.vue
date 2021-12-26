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
                 :no-transition-on-drag="true"
                 @start="handleDraggableWidget(columns, $event)"
                 @add="handleWidgetAdd"
                 @end="$emit('change')"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(column, index) in columns">
            <widget-form-item :key="index"
                              :data="data"
                              :widgets="columns"
                              :index="index"
                              :column="column"
                              :select.sync="selectWidget"
                              :draggable.sync="draggableWidget"
                              @select="handleIndexSelectWidget"
                              @clone="handleWidgetClone"
                              @delete="handleWidgetDelete"
                              @change="$emit('change')"
            />
          </template>
        </transition-group>
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
  components: { Draggable, widgetFormItem },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    select: {
      type: Object,
      default: () => {
        return {}
      }
    },
    draggable: {
      type: Object,
      default: () => {
        return {}
      }
    },
    adapter: {
      type: String,
      default: 'pc'
    }
  },
  data () {
    return {
      widgetEmpty,
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM,
      selectWidget: this.select,
      draggableWidget: this.draggable
    }
  },
  computed: {
    defaultBackground () {
      return { background: this.columns.length === 0 ? `url(${widgetEmpty}) no-repeat 50%` : '' }
    },
    columns () {
      return this.data.column || []
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
    },
    draggable (val) {
      this.draggableWidget = val
    },
    draggableWidget: {
      handler (val) {
        this.$emit('update:draggable', val)
      },
      deep: true
    }
  },
  methods: {
    setPx,
    handleDataSelectWidget (data) {
      this.selectWidget = data
    },
    handleDraggableWidget (columns = [], evt) {
      const oldIndex = evt.oldIndex
      this.draggableWidget = columns[oldIndex]
    },
    handleIndexSelectWidget (index) {
      this.selectWidget = this.columns[index]
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
        if (index === 0) this.selectWidget = {}
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
