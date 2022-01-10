<template>
  <div>
    <template v-if="column.type == 'coralLayout'">
      <coral-layout ref="coralLayout" :column="column"/>
    </template>
    <template v-else>
      <el-form-item v-if="!(form.requiredHideIds.includes(column.prop) || column.hide)"
                    :prop="column.prop"
                    :rules="column.rules"
                    :label="column.hideLabel ? '' : column.label"
                    :class="['loquat-form__item--' + (column.labelPosition || widgetForm.labelPosition || formDefaultConfig.labelPosition)].concat(column.customClass || [])"
                    :label-position="column.labelPosition || widgetForm.labelPosition || formDefaultConfig.labelPosition"
                    :label-width="column.hideLabel ? '0' : getLabelWidth(column, widgetForm, formDefaultConfig.labelWidth)"
      >
        <template v-if="$scopedSlots[column.prop + 'Label']" slot="label">
          <slot :name="column.prop + 'Label'"
                :column="column"
                :value="form.form[column.prop]"
                :readonly="form.readonly || column.readonly"
                :disabled="form.disabled || column.disabled"
                :size="widgetForm.size || column.size || formDefaultConfig.size"
                :dic="form.DIC[column.prop]"
          />
        </template>
        <template v-if="$scopedSlots[column.prop + 'Error']" slot="error" slot-scope="scope">
          <slot :name="column.prop + 'Error'"
                v-bind="Object.assign(scope, {
                  column: column,
                  value: form.form[column.prop],
                  readonly: form.readonly || column.readonly,
                  disabled: form.disabled || column.disabled,
                  size: widgetForm.size || column.size || formDefaultConfig.size,
                  dic: form.DIC[column.prop]
                })"
          />
        </template>
        <slot v-if="$scopedSlots[column.prop]"
              :name="column.prop"
              :column="column"
              :value="form.form[column.prop]"
              :readonly="form.readonly || column.readonly"
              :disabled="form.disabled || column.disabled"
              :size="widgetForm.size || column.size || formDefaultConfig.size"
              :dic="form.DIC[column.prop]"
        />
        <widget v-else
                ref="widget"
                v-model="form.form[column.prop]"
                :dic="form.DIC[column.prop]"
                :column="column"
                :props="widgetForm.props"
                :readonly="form.readonly"
                :disabled="(form.requiredDisableIds.includes(column.prop) || form.disabled)"
                :size="widgetForm.size || formDefaultConfig.size"
                :enter="widgetForm.enter"
                @enter="form.submit"
                @change="form.handleWidgetChange(column)"
        >
          <template v-for="item in $scopedSlots[column.prop + 'Type'] ? [column] : []"
                    :slot="column.prop + 'Type'"
                    slot-scope="scope"
          >
            <slot :name="item.prop + 'Type'" v-bind="scope"/>
          </template>
        </widget>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import { getLabelWidth } from '@utils/dataFormat'
import widget from './widget'
export default {
  name: 'Item',
  inject: ['formProvide'],
  components: { widget, coralLayout: () => import('./coralLayout') },
  props: {
    column: {
      type: Object
    }
  },
  computed: {
    form () {
      return this.formProvide || {}
    },
    widgetForm () {
      return this.form.widgetForm || {}
    },
    formDefaultConfig () {
      return this.form.formDefaultConfig || {}
    }
  },
  methods: {
    getLabelWidth
  }
}
</script>
