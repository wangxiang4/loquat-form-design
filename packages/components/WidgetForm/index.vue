<template>
  <div :class="['widget-form-container', adapter]" @contextmenu.prevent="">
    <el-form ref="widgetForm"
             :label-position="data.labelPosition || formDefaultConfig.labelPosition"
             :label-width="$loquat.setPx(data.labelWidth, formDefaultConfig.labelWidth)"
             :label-suffix="data.labelSuffix || formDefaultConfig.labelSuffix"
             :size="data.size || formDefaultConfig.size"
             :style="defaultBackground"
             :class="data.customClass"
    >
      <draggable :list="data.column"
                 :group="{ name: 'form' }"
                 ghost-class="ghost"
                 :animation="300"
                 handle=".widget-view-drag"
                 :no-transition-on-drag="true"
                 @add="handleWidgetAdd"
                 @end="$emit('change')"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(column, index) in data.column">
            <widget-form-item :key="index"
                              :data="data"
                              :widgets="data.column"
                              :index="index"
                              :column="column"
                              :select.sync="selectWidget"
                              @select="handleSelectWidget"
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
import { DEFAULT_CONFIG_INSIDE_FORM } from '@/global/variable'
import widgetFormItem from '@components/WidgetFormItem'
export default {
  name: 'WidgetForm',
  components: { Draggable, widgetFormItem },
  props: {
    data: {
      type: Object
    },
    select: {
      type: Object
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
      selectWidget: this.select
    }
  },
  computed: {
    defaultBackground () {
      return { background: (this.data.column?.length || 0) === 0 ? `url(${widgetEmpty}) no-repeat 50%` : '' }
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
      this.$set(this.data.column, newIndex, getWidgetAddData(this.data.column[newIndex]))
      this.handleSelectWidget(newIndex)
      this.$nextTick(() => {
        this.$emit('change')
      })
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
      this.data.column.splice(index, 0, getWidgetCloneData(this.data.column[index]))
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit('change')
      })
    }
  }
}
</script>
