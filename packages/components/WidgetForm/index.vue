<template>
  <div :class="['widget-form-container', adapter]" @contextmenu.prevent="">
    <el-form ref="widgetForm"
             :label-position="data.labelPosition || labelPosition"
             :label-width="$loquat.setPx(data.labelWidth, labelWidth)"
             :label-suffix="data.labelSuffix || labelSuffix"
             :size="size"
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
            <template v-if="column.type == 'coralLayoutRow'">
              <coral-layout :key="index"
                            :column="column"
                            :data="data"
                            :widgets="data.column"
                            :index="index"
                            :select.sync="selectWidget"
                            @change="$emit('change')"
              />
            </template>
            <template v-else>
              <div :key="index" @click.stop="handleSelectWidget(index)">
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
                    <form-item :column="column"
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
              </div>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import widgetEmpty from '@/assets/images/widget-empty.png'
import { getLabelWidth, fieldTransformWidget } from '@utils/dataFormat'
import Draggable from 'vuedraggable'
import { FORM_DEFAULT_PROP } from '@/global/variable'
import coralLayout from '@components/CoralLayout'
import formItem from '@/plugins/form/formItem'
export default {
  name: 'WidgetForm',
  components: { Draggable, coralLayout, formItem },
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
      ...FORM_DEFAULT_PROP,
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
    getLabelWidth,
    handleSelectWidget (index) {
      this.selectWidget = this.data.column[index]
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      const data = this.$loquat.deepClone(this.data.column[newIndex])
      this.$set(this.data.column, newIndex, fieldTransformWidget(data))
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
