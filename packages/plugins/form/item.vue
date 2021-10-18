<template>
  <div>
    <template v-if="column.type == 'coralLayoutRow'">
      <coral-layout :column="column"
                    :widgets="widgets"
                    :loquat-form="loquatForm"
      />
    </template>
    <template v-else>
      <el-form-item v-if="!column.hide"
                    :prop="column.prop"
                    :rules="column.rules"
                    :label="column.hideLabel ? '' : column.label"
                    :class="['loquat-form__item--' + (column.labelPosition || loquatForm.widgetForm.labelPosition || loquatForm.labelPosition)].concat(column.customClass || [])"
                    :label-position="column.labelPosition || loquatForm.widgetForm.labelPosition || loquatForm.labelPosition"
                    :label-width="column.hideLabel ? '0' : getLabelWidth(column, loquatForm.widgetForm, loquatForm.labelWidth)"
      >
        <template v-if="$scopedSlots[column.prop + 'Label']" slot="label">
          <slot :name="column.prop + 'Label'"
                :column="column"
                :value="loquatForm.form[column.prop]"
                :readonly="loquatForm.widgetForm.readonly || column.readonly || loquatForm.readonly"
                :disabled="loquatForm.widgetForm.disabled || column.disabled || loquatForm.disabled"
                :size="loquatForm.widgetForm.size || column.size || loquatForm.size"
                :dic="loquatForm.DIC[column.prop]"
          />
        </template>
        <template v-if="$scopedSlots[column.prop + 'Error']" slot="error" slot-scope="scope">
          <slot :name="column.prop + 'Error'"
                v-bind="Object.assign(scope, {
                  column: column,
                  value:loquatForm.form[column.prop],
                  readonly: loquatForm.widgetForm.readonly || column.readonly || loquatForm.readonly,
                  disabled: loquatForm.widgetForm.disabled || column.disabled || loquatForm.disabled,
                  size: loquatForm.widgetForm.size || column.size || loquatForm.size,
                  dic: loquatForm.DIC[column.prop]
                })"
          />
        </template>
        <slot v-if="$scopedSlots[column.prop]"
              :name="column.prop"
              :column="column"
              :value="loquatForm.form[column.prop]"
              :readonly="loquatForm.widgetForm.readonly || column.readonly || loquatForm.readonly"
              :disabled="loquatForm.widgetForm.disabled || column.disabled || loquatForm.disabled"
              :size="loquatForm.widgetForm.size || column.size || loquatForm.size"
              :dic="loquatForm.DIC[column.prop]"
        />
        <widget v-else
                :ref="column.prop"
                v-model="loquatForm.form[column.prop]"
                :dic="loquatForm.DIC[column.prop]"
                :column="column"
                :props="loquatForm.widgetForm.props"
                :readonly="loquatForm.widgetForm.readonly || loquatForm.readonly"
                :disabled="loquatForm.widgetForm.disabled || loquatForm.disabled"
                :size="loquatForm.widgetForm.size || loquatForm.size"
                :enter="loquatForm.widgetForm.enter"
                @enter="loquatForm.submit"
                @change="loquatForm.propChange(column)"
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
  components: { widget, coralLayout: () => import('./coralLayout') },
  props: {
    column: {
      type: Object
    },
    widgets: {
      required: true,
      type: Array
    },
    loquatForm: {
      required: true,
      type: Object
    }
  },
  methods: {
    getLabelWidth
  }
}
</script>
