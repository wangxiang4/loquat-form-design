<template>
  <div :class="['loquat-form', formId]" :style="{ width: $loquat.setPx(widgetForm.formWidth, '100%') }">
    <el-form ref="form"
             :model="form"
             :status-icon="widgetForm.statusIcon"
             :label-suffix="widgetForm.labelSuffix || labelSuffix"
             :size="widgetForm.size || size"
             :label-position="widgetForm.labelPosition || labelPosition"
             :label-width="$loquat.setPx(widgetForm.labelWidth, labelWidth)"
             :class="widgetForm.customClass"
             @submit.native.prevent
    >
      <template v-for="(column, index) in columns">
        <item :key="index"
              :column="column"
              :widgets="columns"
              :loquat-form="loquatForm"
        />
      </template>
    </el-form>
  </div>
</template>

<script>
import { formClearVal, formInitVal, getLabelWidth, designTransformPreview } from '@utils/dataFormat'
import { FORM_DEFAULT_PROP, KEY_COMPONENT_NAME_LINE } from '@/global/variable'
import { randomId8, deepClone } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import item from './item'
export default {
  name: 'Form',
  inheritAttrs: false,
  components: { item },
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
      form: {},
      loquatForm: this,
      ...FORM_DEFAULT_PROP,
      formCreate: false,
      formDefault: {},
      formVal: {},
      formId: '',
      DIC: {}
    }
  },
  computed: {
    widgetForm () {
      return designTransformPreview(this)
    },
    columns () {
      return this.widgetForm.column || []
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
      this.formId = KEY_COMPONENT_NAME_LINE + randomId8()
      const css = parseCss(this.widgetForm.styleSheets)
      insertCss(css, this.formId)
    })
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    getLabelWidth,
    dataFormat () {
      this.formDefault = formInitVal(this.columns)
      const value = deepClone(this.formDefault)
      this.setForm(deepClone(Object.assign(value, this.formVal)))
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
      const row = this.widgetForm.rowKey || 'id'
      this.form = formClearVal(this.form, (this.widgetForm.clearExclude || []).concat([row]))
    },
    resetFields () {
      this.$refs.form.resetFields()
    },
    useActivation () {
      this.disabled = false
    },
    useDisabled () {
      this.disabled = true
    }
  }
}
</script>
