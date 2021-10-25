<template>
  <div :class="['loquat-form', formId]" :style="{ width: $loquat.setPx(widgetForm.formWidth, '100%') }">
    <el-form ref="form"
             :model="form"
             :status-icon="widgetForm.statusIcon"
             :label-suffix="widgetForm.labelSuffix || formDefaultConfig.labelSuffix"
             :size="widgetForm.size || formDefaultConfig.size"
             :label-position="widgetForm.labelPosition || formDefaultConfig.labelPosition"
             :label-width="$loquat.setPx(widgetForm.labelWidth, formDefaultConfig.labelWidth)"
             :class="widgetForm.customClass"
             @submit.native.prevent
    >
      <template v-for="(column, index) in columns">
        <item :key="index"
              :column="column"
              :widgets="columns"
              :home="home"
        />
      </template>
    </el-form>
  </div>
</template>

<script>
import { formClearVal, formInitVal, designTransformPreview } from '@utils/dataFormat'
import { DEFAULT_CONFIG_INSIDE_FORM, KEY_COMPONENT_NAME } from '@/global/variable'
import { randomId8, deepClone } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import item from './item'
export default {
  name: 'Form',
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
      home: this,
      first: false,
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM,
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
      handler (val) {
        this.form = val
      },
      deep: true
    }
  },
  created () {
    this.initVal()
    this.$nextTick(() => this.clearValidate())
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    initVal () {
      this.formId = KEY_COMPONENT_NAME.concat(randomId8())
      insertCss(parseCss(this.widgetForm.styleSheets), this.formId)
      this.form = deepClone({ ...formInitVal(this.columns), ...this.form })
    },
    handleWidgetChange (column) {
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
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
