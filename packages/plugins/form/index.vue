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
import { formClearVal, formInitVal, designTransformPreview } from '@utils/dataFormat'
import { FORM_DEFAULT_PROP, KEY_COMPONENT_NAME_LINE } from '@/global/variable'
import { randomId8, deepClone } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import item from './item'
export default {
  name: 'Form',
  inheritAttrs: false,
  components: { item },
  props: {
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {},
      first: false,
      loquatForm: this,
      ...FORM_DEFAULT_PROP,
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
        if (this.first || !this.$loquat.validateNull(val)) {
          this.first = true
          this.handleChange(val)
        } else {
          this.first = true
        }
      },
      deep: true
    },
    value: {
      immediate: true,
      handler (val) {
        this.form = val
      },
      deep: true
    },
    disabled (val) {
      this.$emit('update:disabled', val)
    }
  },
  created () {
    this.$nextTick(() => {
      this.initialize()
      this.$nextTick(() => this.clearValidate())
    })
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    initialize () {
      this.formId = KEY_COMPONENT_NAME_LINE + randomId8()
      insertCss(parseCss(this.widgetForm.styleSheets), this.formId)
      this.form = deepClone({ ...formInitVal(this.columns), ...this.form })
    },
    propChange (column) {
      if (this.$refs.form) this.$refs.form.validateField(column.prop)
    },
    validate (callback) {
      this.$refs.form.validate((valid, msg) => {
        if (valid) {
          callback(true, this.formDisable)
        } else {
          callback(false, this.formDisable, msg)
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
      this.$refs.form.clearValidate(list)
    },
    resetForm () {
      const row = this.widgetForm.rowKey || 'id'
      this.form = formClearVal(this.form, (this.widgetForm.clearExclude || []).concat([row]))
      this.$nextTick(() => {
        this.clearValidate()
        this.$emit('reset-change')
      })
    },
    resetFields () {
      this.$refs.form.resetFields()
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    formActivation () {
      this.disabled = false
    },
    formDisable () {
      this.disabled = true
    }
  }
}
</script>
