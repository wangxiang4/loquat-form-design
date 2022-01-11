<template>
  <div :class="['loquat-form', formId]" :style="{ width: setPx(widgetForm.formWidth, '100%') }">
    <el-form ref="form"
             :model="form"
             :status-icon="widgetForm.statusIcon"
             :label-suffix="widgetForm.labelSuffix || formDefaultConfig.labelSuffix"
             :size="widgetForm.size || formDefaultConfig.size"
             :label-position="widgetForm.labelPosition || formDefaultConfig.labelPosition"
             :label-width="setPx(widgetForm.labelWidth, formDefaultConfig.labelWidth)"
             :class="widgetForm.customClass"
             @submit.native.prevent
    >
      <template v-for="(column, index) in columns">
        <item :key="index"
              :ref="column.prop"
              :column="column"
        />
      </template>
    </el-form>
  </div>
</template>

<script>
import { formClearVal, formInitVal, designTransformPreview } from '@utils/dataFormat'
import { DEFAULT_CONFIG_INSIDE_FORM, KEY_COMPONENT_NAME } from '@/global/variable'
import { randomId8, deepClone, validateNull, getObjType } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import item from './item'
import { setPx } from '@utils'
export default {
  name: 'Form',
  provide () {
    return {
      formProvide: this
    }
  },
  components: { item },
  props: {
    value: {},
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: {},
      first: false,
      configOption: {},
      formDefaultConfig: DEFAULT_CONFIG_INSIDE_FORM,
      formId: '',
      DIC: {},
      showIds: [],
      disableIds: []
    }
  },
  computed: {
    widgetForm () {
      return designTransformPreview(this) || {}
    },
    columns () {
      return this.widgetForm.column || []
    },
    callbackHooks () {
      return this.widgetForm._callbackHooks || {}
    },
    pluginImplantPaths () {
      return this.widgetForm._pluginImplantPaths || {}
    },
    // 如果需要修改属性不影响别的部件,建议克隆
    widgets () {
      return this.widgetForm._widgets || []
    },
    childForms () {
      return this.widgets.filter(col => col.type == 'childForm' && !col.hide)
    },
    form () {
      return getObjType(this.text) === 'object' ? this.text : {}
    }
  },
  watch: {
    text: {
      handler (val) {
        if (this.first || !validateNull(val)) {
          this.first = true
          this.handleChange(val)
        } else {
          this.first = true
        }
      },
      deep: true
    },
    value: {
      handler () {
        this.initVal()
      },
      deep: true
    },
    option: {
      handler () {
        this.initOption()
      },
      deep: true
    }
  },
  created () {
    this.initVal()
    this.initOption()
    this.$nextTick(() => this.clearValidate())
  },
  mounted () {
    this.callbackHooks.mounted && this.callbackHooks.mounted()
  },
  beforeDestroy () {
    insertCss([], this.formId)
  },
  methods: {
    setPx,
    initVal () {
      this.text = this.value
    },
    initOption () {
      this.configOption = this.option
      insertCss([], this.formId)
      this.formId = KEY_COMPONENT_NAME.concat(randomId8())
      insertCss(parseCss(this.widgetForm.styleSheets), this.formId)
      this.text = deepClone({ ...formInitVal(this.columns), ...this.form })
    },
    handleWidgetChange (column) {
      if (this.$refs.form) this.$refs.form.validateField(column.prop)
    },
    validate (callback) {
      this.$refs.form.validate((valid, msg) => {
        const childFormValidates = []
        const childFormProps = []
        const childFormError = {}
        this.childForms.forEach(item => {
          childFormProps.push(item.prop)
          // eval内部不支持箭头函数this作用域绑定,只支持当前函数作用域绑定
          // eslint-disable-next-line no-unused-vars
          const _this = this
          childFormValidates.push(eval(`${this.pluginImplantPaths[item.prop]}.validate()`))
        })
        Promise.all(childFormValidates).then(res => {
          res.forEach((error, index) => {
            if (!validateNull(error)) {
              childFormError[childFormProps[index]] = error
            }
          })
          const errorMessages = Object.assign(childFormError, msg)
          if (validateNull(errorMessages)) {
            callback(true)
          } else {
            callback(false, errorMessages)
          }
        })
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
      this.text = formClearVal(this.form, (this.widgetForm.clearExclude || []).concat([row]))
      this.$nextTick(() => {
        this.clearValidate()
        this.$emit('reset-change')
      })
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    setShowIds (ids) {
      getObjType(ids) === 'array' && (this.showIds = ids)
    },
    setDisableIds (ids) {
      getObjType(ids) === 'array' && (this.disableIds = ids)
    }
  }
}
</script>
