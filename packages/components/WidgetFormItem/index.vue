<template>
  <div>
    <template v-if="column.type == 'coralLayout'">
      <widget-coral-layout :column="column"
                           :index="index"
                           :widgets="widgets"
      />
    </template>
    <template v-else-if="column.type == 'childForm'">
      <widget-child-form/>
    </template>
    <template v-else>
      <div @click.stop="emitInvoke('select')">
        <div :class="[
          'widget-view', {
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
            <widget v-model="plugin.value"
                    :column="column"
                    :dic="column.dicData"
                    :props="data.props"
                    :size="data.size || formDefaultConfig.size"
                    :preview="false"
            />
          </el-form-item>
          <div v-if="selectWidget.prop == column.prop"
               :class="['widget-view-action', {
                 'widget-layout-action': column.type == 'childForm'
               }]"
          >
            <i title="复制" class="iconfont icon-clone" @click.stop="emitInvoke('clone')"/>
            <i title="删除" class="iconfont icon-trash" @click.stop="emitInvoke('delete')"/>
          </div>
          <div v-if="selectWidget.prop == column.prop"
               :class="['widget-view-drag', {
                 'widget-layout-drag': column.type == 'childForm'
               }]"
          >
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
import widget from '@/plugins/form/widget'
import widgetChildForm from '../WidgetChildForm'
export default {
  components: { widget, widgetChildForm, widgetCoralLayout: () => import('@components/WidgetCoralLayout') },
  inject: ['formProvide'],
  provide () {
    return {
      formItemProvide: this
    }
  },
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
    },
    layoutType: {
      type: String,
      default: 'widgets'
    }
  },
  computed: {
    form () {
      return this.formProvide || {}
    },
    data () {
      return this.form.data || {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    formDefaultConfig () {
      return this.form.formDefaultConfig || {}
    },
    selectWidget () {
      return this.form.widgetFormSelect || {}
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
