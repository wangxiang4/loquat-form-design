<template>
  <div>
    <template v-if="column.type == 'coralLayout'">
      <coral-layout :column="column"
                    :widgets="widgets"
                    :home="home"
      />
    </template>
    <template v-else>
      <el-form-item v-if="!column.hide"
                    :prop="column.prop"
                    :rules="column.rules"
                    :label="column.hideLabel ? '' : column.label"
                    :class="['loquat-form__item--' + (column.labelPosition || home.widgetForm.labelPosition || home.formDefaultConfig.labelPosition)].concat(column.customClass || [])"
                    :label-position="column.labelPosition || home.widgetForm.labelPosition || home.formDefaultConfig.labelPosition"
                    :label-width="column.hideLabel ? '0' : getLabelWidth(column, home.widgetForm, home.formDefaultConfig.labelWidth)"
      >
        <template v-if="$scopedSlots[column.prop + 'Label']" slot="label">
          <slot :name="column.prop + 'Label'"
                :column="column"
                :value="home.form[column.prop]"
                :readonly="home.readonly || column.readonly"
                :disabled="home.disabled || column.disabled"
                :size="home.widgetForm.size || column.size || home.formDefaultConfig.size"
                :dic="home.DIC[column.prop]"
          />
        </template>
        <template v-if="$scopedSlots[column.prop + 'Error']" slot="error" slot-scope="scope">
          <slot :name="column.prop + 'Error'"
                v-bind="Object.assign(scope, {
                  column: column,
                  value: home.form[column.prop],
                  readonly: home.readonly || column.readonly,
                  disabled: home.disabled || column.disabled,
                  size: home.widgetForm.size || column.size || home.formDefaultConfig.size,
                  dic: home.DIC[column.prop]
                })"
          />
        </template>
        <slot v-if="$scopedSlots[column.prop]"
              :name="column.prop"
              :column="column"
              :value="home.form[column.prop]"
              :readonly="home.readonly || column.readonly"
              :disabled="home.disabled || column.disabled"
              :size="home.widgetForm.size || column.size || home.formDefaultConfig.size"
              :dic="home.DIC[column.prop]"
        />
        <widget v-else
                :ref="column.prop"
                v-model="home.form[column.prop]"
                :dic="home.DIC[column.prop]"
                :column="column"
                :props="home.widgetForm.props"
                ::readonly="home.readonly"
                :disabled="home.disabled"
                :size="home.widgetForm.size || home.formDefaultConfig.size"
                :enter="home.widgetForm.enter"
                @enter="home.submit"
                @change="home.handleWidgetChange(column)"
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
    home: {
      required: true,
      type: Object
    }
  },
  methods: {
    getLabelWidth
  }
}
</script>
