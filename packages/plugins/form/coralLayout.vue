<template>
  <el-row :type="column.flex ? 'flex' : undefined"
          :gutter="column.gutter ? column.gutter : 0"
          :justify="column.justify"
          :align="column.align"
          :class="column.customClass"
  >
    <el-col v-for="(col, colIndex) in column.cols"
            :key="colIndex"
            :class="col.customClass"
            :md="col.md"
            :offset="col.offset"
            :push="col.push"
            :pull="col.pull"
    >
      <template v-for="(column, index) in col.list">
        <template v-if="column.type == 'coralLayoutRow'">
          <coral-layout :key="index"
                        :column="column"
                        :widgets="col.list"
                        :loquat-form="loquatForm"
          />
        </template>
        <template v-else>
          <el-form-item v-if="!column.hide"
                        :key="index"
                        :prop="column.prop"
                        :label="column.hideLabel ? '' : column.label"
                        :rules="column.rules"
                        :class="['loquat-form__item--' + (column.labelPosition || loquatForm.widgetForm.labelPosition || labelPosition)].concat(column.customClass || [])"
                        :label-position="column.labelPosition || loquatForm.widgetForm.labelPosition || labelPosition"
                        :label-width="column.hideLabel ? '0' : getLabelWidth(column, loquatForm.widgetForm, labelWidth)"
          >
            <template v-if="$scopedSlots[column.prop + 'Label']" slot="label">
              <slot :name="column.prop + 'Label'"
                    :column="column"
                    :value="loquatForm.form[column.prop]"
                    :readonly="loquatForm.widgetForm.readonly || column.readonly || readonly"
                    :disabled="loquatForm.getDisabled(column)"
                    :size="loquatForm.widgetForm.size || column.size || size"
                    :dic="loquatForm.DIC[column.prop]"
              />
            </template>
            <template v-if="$scopedSlots[column.prop + 'Error']" slot="error" slot-scope="scope">
              <slot :name="column.prop + 'Error'"
                    v-bind="Object.assign(scope, {
                      column,
                      value:loquatForm.form[column.prop],
                      readonly: loquatForm.widgetForm.readonly || column.readonly || readonly,
                      disabled: loquatForm.widgetForm.disabled || column.disabled || disabled,
                      size: loquatForm.widgetForm.size || column.size || size,
                      dic: loquatForm.DIC[column.prop]
                    })"
              />
            </template>
            <slot v-if="$scopedSlots[column.prop]"
                  :name="column.prop"
                  :value="loquatForm.form[column.prop]"
                  :column="column"
                  :readonly="loquatForm.widgetForm.readonly || column.readonly || readonly"
                  :disabled="loquatForm.getDisabled(column)"
                  :size="loquatForm.widgetForm.size || column.size || size"
                  :dic="loquatForm.DIC[column.prop]"
            />
            <form-item v-else
                       :ref="column.prop"
                       v-model="loquatForm.form[column.prop]"
                       :dic="loquatForm.DIC[column.prop]"
                       :type="column._type"
                       :column="column"
                       :props="loquatForm.widgetForm.props"
                       :readonly="loquatForm.widgetForm.readonly || column.readonly || readonly"
                       :disabled="loquatForm.getDisabled(column)"
                       :size="loquatForm.widgetForm.size || column.size || size"
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
            </form-item>
          </el-form-item>
        </template>
      </template>
    </el-col>
  </el-row>
</template>
<script>
import { FORM_DEFAULT_PROP } from '@/global/variable'
import { getLabelWidth } from '@utils/dataFormat'
import formItem from './formItem'
export default {
  name: 'CoralLayout',
  components: { formItem },
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
  data () {
    return {
      ...FORM_DEFAULT_PROP
    }
  },
  methods: {
    getLabelWidth
  }
}
</script>
