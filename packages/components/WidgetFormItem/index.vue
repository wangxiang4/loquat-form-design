<template>
  <div>
    <template v-if="column.type == 'coralLayout'">
      <widget-coral-layout :column="column"
                           :data="data"
                           :index="index"
                           :widgets="widgets"
                           :select.sync="selectWidget"
                           @change="$emit('change')"
      />
    </template>
    <template v-else>
      <div @click.stop="emitInvoke('select')">
        <div :class="[
          'widget-view', {
            'widget-child-form': column.type == 'childForm',
            active: selectWidget.prop == column.prop,
            readonly: plugin.readonly,
            hide: column.hide
          }]"
        >
          <el-form-item class="widget-form-item"
                        :class="[{
                          required: validateConfig.required
                        }].concat(column.customClass||[])"
                        :prop="column.prop"
                        :label="column.hideLabel ? '' : column.label"
                        :label-width="column.hideLabel ? '0' : getLabelWidth(column, data, formDefaultConfig.labelWidth)"
                        :label-position="column.labelPosition || data.labelPosition || formDefaultConfig.labelPosition"
          >
            <widget-child-form v-if="column.type == 'childForm'" :column="column"/>
            <widget v-else
                    v-model="plugin.value"
                    :column="column"
                    :dic="column.dicData"
                    :props="data.props"
                    :readonly="data.readonly"
                    :disabled="data.disabled"
                    :size="data.size || formDefaultConfig.size"
                    :preview="false"
            />
          </el-form-item>
          <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
            <i title="复制" class="iconfont icon-clone" @click.stop="emitInvoke('clone')"/>
            <i title="删除" class="iconfont icon-trash" @click.stop="emitInvoke('delete')"/>
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
  </div>
</template>

<script>
import { getLabelWidth } from '@utils/dataFormat'
import { DEFAULT_CONFIG_INSIDE_FORM } from '@/global/variable'
import widget from '@/plugins/form/widget'
import widgetChildForm from '../WidgetChildForm'
export default {
  name: 'WidgetFormItem',
  components: { widget, widgetChildForm, widgetCoralLayout: () => import('@components/WidgetCoralLayout') },
  props: {
    data: {
      type: Object
    },
    column: {
      type: Object
    },
    select: {
      type: Object
    },
    index: {
      type: Number
    },
    widgets: {
      required: true,
      type: Array
    },
    layoutType: {
      type: String,
      default: 'widgets'
    }
  },
  data () {
    return {
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM,
      selectWidget: this.select
    }
  },
  computed: {
    plugin () {
      return this.column.plugin || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
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
    emitInvoke (methodName) {
      switch (this.layoutType) {
        case 'widgets':
          if (methodName === 'select') this.$emit('select', this.index)
          if (methodName === 'clone') this.$emit('clone', this.index)
          if (methodName === 'delete') this.$emit('delete', this.index)
          break
        case 'coralLayout':
          if (methodName === 'select') this.$emit('select', this.widgets[this.index])
          if (methodName === 'clone') this.$emit('clone', this.widgets, this.index)
          if (methodName === 'delete') this.$emit('delete', this.widgets, this.index)
          break
      }
    }
  }
}
</script>
