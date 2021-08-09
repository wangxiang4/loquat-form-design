<template>
  <div :class="['loquat-form', formId]" :style="{ width: $loquat.setPx(parentOption.formWidth, '100%') }">
    <el-form ref="form"
             :status-icon="parentOption.statusIcon"
             :model="form"
             :label-suffix="parentOption.labelSuffix || labelSuffix"
             :size="parentOption.size || size"
             :label-position="parentOption.labelPosition || labelPosition"
             :label-width="$loquat.setPx(parentOption.labelWidth, labelWidth)"
             :class="parentOption.customClass"
             @submit.native.prevent
    >
      <template v-for="(column, index) in columnOption">
        <template v-if="column.type == 'coralLayout'">
          珊瑚布局组件区域
        </template>
        <template v-else>
          <el-form-item v-if="!column.hide"
                        :key="index"
                        :prop="column.prop"
                        :label="column.hideLabel ? '' : column.label"
                        :rules="column.rules"
                        :class="['loquat-form__item--' + (column.labelPosition || parentOption.labelPosition || labelPosition)].concat(column.customClass || [])"
                        :label-position="column.labelPosition || parentOption.labelPosition || labelPosition"
                        :label-width="column.hideLabel ? '0' :getLabelWidth(column, parentOption, labelWidth)"
          >
            <template v-if="$scopedSlots[column.prop + 'Label']" slot="label">
              <slot :name="column.prop + 'Label'"
                    :column="column"
                    :value="form[column.prop]"
                    :readonly="parentOption.readonly || column.readonly || readonly"
                    :disabled="getDisabled(column)"
                    :size="parentOption.size || column.size || size"
                    :dic="DIC[column.prop]"
              />
            </template>
            <template v-if="$scopedSlots[column.prop + 'Error']" slot="error" slot-scope="scope">
              <slot :name="column.prop + 'Error'"
                    v-bind="Object.assign(scope, {
                      column,
                      value:form[column.prop],
                      readonly: parentOption.readonly || column.readonly || readonly,
                      disabled: parentOption.disabled || column.disabled || disabled,
                      size: parentOption.size || column.size || size,
                      dic: DIC[column.prop]
                    })"
              />
            </template>
            <slot v-if="$scopedSlots[column.prop]"
                  :name="column.prop"
                  :value="form[column.prop]"
                  :column="column"
                  :readonly="parentOption.readonly || column.readonly || readonly"
                  :disabled="getDisabled(column)"
                  :size="parentOption.size || column.size || size"
                  :dic="DIC[column.prop]"
            />
            <form-item v-else
                       :ref="column.prop"
                       :dic="DIC[column.prop]"
                       v-model="form[column.prop]"
                       :event-script="parentOption.eventScript"
                       :column="column"
                       :props="parentOption.props"
                       :readonly="parentOption.readonly || column.readonly || readonly"
                       :disabled="getDisabled(column)"
                       :size="parentOption.size || column.size || size"
                       :enter="parentOption.enter"
                       @enter="submit"
                       @change="propChange(column)"
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
    </el-form>
  </div>
</template>

<script>
import { clearVal, formInitVal, getLabelWidth, designTransformPreview } from '@utils/dataFormat'
import { FORM_DEFAULT_PROP, KEY_COMPONENT_NAME_LINE } from '@/global/variable'
import formItem from './item'
import { randomId } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
export default {
  name: 'Form',
  components: { formItem },
  props: {
    reset: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    value: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      ...FORM_DEFAULT_PROP,
      form: {},
      formCreate: false,
      formDefault: {},
      formVal: {},
      formId: '',
      allDisabled: false,
      DIC: {}
    }
  },
  computed: {
    parentOption () {
      return designTransformPreview(this)
    },
    columnOption () {
      return this.parentOption.column || []
    }
  },
  watch: {
    form: {
      handler (val) {
        if (this.formCreate) this.setVal()
      },
      deep: true
    },
    value: {
      handler (val) {
        if (this.formCreate) {
          this.setForm(val)
        } else {
          this.formVal = Object.assign(this.formVal, val || {})
        }
      },
      deep: true,
      immediate: true
    }},
  created () {
    this.$nextTick(() => {
      this.dataFormat()
      this.setVal()
      this.clearValidate()
      this.formCreate = true
      this.formId = KEY_COMPONENT_NAME_LINE + randomId()
      const css = parseCss(this.parentOption.styleSheets)
      insertCss(css, this.formId)
    })
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    getLabelWidth,
    dataFormat () {
      this.formDefault = formInitVal(this.columnOption)
      const value = this.$loquat.deepClone(this.formDefault.tableForm)
      this.setForm(this.$loquat.deepClone(Object.assign(value, this.formVal)))
    },
    setForm (value) {
      Object.keys(value).forEach(ele => {
        const result = value[ele]
        this.$set(this.form, ele, result)
      })
    },
    setVal () {
      this.$emit('input', this.form)
      this.$emit('change', this.form)
    },
    propChange (column) {
      if (this.$refs.form) this.$refs.form.validateField(column.prop)
    },
    validate (callback) {
      this.$refs.form.validate((valid, msg) => {
        if (valid) {
          callback(true)
        } else {
          callback(false, msg)
        }
      })
    },
    submit () {
      this.validate((valid, msg) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          this.$emit('error', msg)
        }
      })
    },
    clearValidate (list) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate(list)
      })
    },
    resetForm () {
      this.clearValidate()
      if (this.reset) {
        this.clearVal()
      }
      this.$emit('input', this.form)
      this.$emit('reset-change')
    },
    clearVal () {
      const row = this.parentOption.rowKey || 'id'
      this.form = clearVal(this.form, (this.parentOption.clearExclude || []).concat([row]))
    },
    resetFields () {
      this.$refs.form.resetFields()
    },
    getDisabled (column) {
      return this.parentOption.disabled || column.disabled || this.allDisabled
    },
    useActivation () {
      this.allDisabled = false
    },
    useDisabled () {
      this.allDisabled = true
    }
  }
}
</script>
