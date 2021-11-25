<template>
  <el-select ref="main"
             v-model="text"
             class="loquat-select"
             :size="size"
             :loading="loading"
             :loading-text="loadingText"
             :multiple="multiple"
             :filterable="remote?true:filterable"
             :remote="remote"
             :no-match-text="noMatchText"
             :no-data-text="noDataText"
             :remote-method="handleRemoteMethod"
             :collapse-tags="tags"
             :clearable="disabled?false:clearable"
             :placeholder="placeholder"
             :multiple-limit="limit"
             :allow-create="allowCreate"
             :default-first-option="defaultFirstOption"
             :disabled="disabled"
             :style="customizeStyle"
             @focus="handleFocus"
             @blur="handleBlur"
             @click.native="handleClick"
  >
    <template v-if="group">
      <el-option-group v-for="(item,index) in netDic"
                       :key="index"
                       :label="getLabelText(item)"
      >
        <el-option v-for="(citem,cindex) in item[groupsKey]"
                   :key="cindex"
                   :disabled="citem[disabledKey]"
                   :label="getLabelText(citem)"
                   :value="citem[valueKey]"
        >
          <slot v-if="$scopedSlots.default"
                :label="labelKey"
                :value="valueKey"
                :showLabel="showLabel"
                :item="citem"
          />
          <template v-else>
            <span>{{ getLabelText(citem) }}</span>
            <span v-if="citem.desc"
                  class="loquat-select__desc"
            >{{ citem.desc }}</span>
          </template>
        </el-option>
      </el-option-group>
    </template>
    <template v-else>
      <el-option v-for="(item,index) in netDic"
                 :key="index"
                 :disabled="item[disabledKey]"
                 :label="getLabelText(item)"
                 :value="item[valueKey]"
      >
        <slot v-if="$scopedSlots.default"
              :label="labelKey"
              :value="valueKey"
              :showLabel="showLabel"
              :item="item"
        />
        <template v-else>
          <span>{{ getLabelText(item) }}</span>
          <span v-if="item[descKey]"
                class="loquat-select__desc"
          >{{ item[descKey] }}</span>
        </template>
      </el-option>
    </template>
  </el-select>
</template>

<script>
import packages from '@utils/packages'
import { bindEvent } from '@utils/plugins'
import { DIC_PROPS } from '@/global/variable'
import { validateNull } from '@utils'
export default {
  name: 'Select',
  props: {
    value: {},
    dic: {
      type: Array,
      default: () => []
    },
    loadingText: {
      type: String
    },
    noMatchText: {
      type: String
    },
    noDataText: {
      type: String
    },
    drag: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Boolean,
      default: false
    },
    tags: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    filterable: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    defaultFirstOption: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    group: {
      type: Boolean,
      default: false
    },
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    typeFormat: Function,
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    customizeStyle: {
      type: Object
    }
  },
  data () {
    return {
      created: false,
      netDic: [],
      loading: false,
      text: undefined,
      propsDefault: DIC_PROPS
    }
  },
  computed: {
    groupsKey () {
      return this.props.groups || this.propsDefault.groups
    },
    disabledKey () {
      return this.props.disabled || this.propsDefault.disabled
    },
    valueKey () {
      return this.props.value || this.propsDefault.value
    },
    labelKey () {
      return this.props.label || this.propsDefault.label
    },
    descKey () {
      return this.props.desc || this.propsDefault.desc
    }
  },
  watch: {
    value: {
      handler (val) {
        this.initVal()
        // 值改变时候请求远端接口
        if (!validateNull(val)) {
          if (this.remote && !this.created) {
            this.created = true
            this.handleRemoteMethod(this.multiple ? this.text.join(',') : this.text)
          }
        }
      }
    },
    dic: {
      handler (val) {
        this.netDic = val
      },
      immediate: true
    },
    text: {
      handler (n) {
        this.handleChange(n)
      }
    }
  },
  created () {
    this.initVal()
  },
  mounted () {
    if (this.drag) {
      this.setSort()
    }
  },
  methods: {
    initVal () {
      this.text = this.value
    },
    setSort () {
      if (!window.Sortable) {
        packages.logs('Sortable')
        return
      }
      const el = this.$refs.main.$el.querySelectorAll('.el-select__tags > span')[0]
      this.sortable = window.Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.value.splice(evt.oldIndex, 1)[0]
          this.value.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    handleRemoteMethod (query) {
      this.$emit('remoteMethod', query)
    },
    handleFocus (event) {
      bindEvent(this, 'focus', event)
    },
    handleBlur (event) {
      bindEvent(this, 'blur', event)
    },
    handleClick (event) {
      bindEvent(this, 'click', event)
    },
    getLabelText (item) {
      if (validateNull(item)) return ''
      if (typeof this.typeFormat === 'function') {
        return this.typeFormat(item, this.labelKey, this.valueKey)
      }
      return (this.showLabel && item[this.labelKey]) ? item[this.labelKey] : item[this.valueKey]
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}

</script>
