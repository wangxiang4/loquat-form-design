<template>
  <div :class="['loquat-child-form', formId]" :style="{ width: setPx(widgetChildForm.formWidth, '100%') }">
    <el-form ref="childForm"
             :model="childForm"
             :status-icon="widgetChildForm.statusIcon"
             :size="widgetChildForm.size || childFormDefaultConfig.size"
             :class="widgetChildForm.customClass"
             @submit.native.prevent
    >
      <el-table ref="table"
                :data="childForm.list"
                :border="true"
                :fit="widgetChildForm.fit"
                :stripe="widgetChildForm.stripe"
                :default-sort="widgetChildForm.defaultSort"
                :show-header="widgetChildForm.showHeader"
                :size="widgetChildForm.size || childFormDefaultConfig.size"
                :highlight-current-row="widgetChildForm.highlightCurrentRow"
                :max-height="widgetChildForm.maxHeight"
                v-loading="loading"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
      >
        <!-- 暂无数据提醒 -->
        <template slot="empty">
          <slot v-if="$slots.empty" name="empty"/>
          <template v-else>{{ widgetChildForm.emptyText || '暂无数据' }}</template>
        </template>
        <column :columns="columns">
          <!--渲染头部操作列-->
          <column-default slot="header"/>
          <!--渲染插槽列表-->
          <template v-for="item in columnSlot" slot-scope="scope" :slot="item">
            <slot v-bind="scope" :name="item"/>
          </template>
        </column>
      </el-table>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-button v-if="!this.readonly || !this.disabled"
                   :size="widgetChildForm.size || childFormDefaultConfig.size"
                   type="text"
                   icon="el-icon-plus"
                   @click="rowCellAdd()"
        >添加</el-button>
      </el-col>
      <el-col :span="12">
        <!-- 分页-目前只支持本地分页 -->
        <!-- 根据我的开发经验来说,如果提供远程请求分页数据,无非就是点击页码实时查询数据库的分页数据,但是这样也会引发一个问题,不能拿取全部的数据了 -->
        <!-- 导致数据的一些增删改操作无效,假设(pageSize:5)比如远程请求分页第一页拿到5条数据,此时我删除了第一页的3条数据,然后在远程请求第二页 -->
        <!-- 此时第一页我删除的3条数据信息丢失了,会导致删除无效,但是也可以解决这个问题,实现一个实时数据操作池,然后那操作池的数据去比对远程请求分页数据 -->
        <!-- 就可以解决这个问题,目前由于是写第一版,不打算实现,后面再说 -->
        <table-page ref="page" :page="page">
          <template slot="headPage">
            <slot name="headPage"/>
          </template>
        </table-page>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tablePage from './page'
import column from './column'
import columnDefault from './columnDefault'
import { deepClone, randomId8, validateNull, setPx, getObjType } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import { DEFAULT_CONFIG_INSIDE_CHILD_FORM, KEY_COMPONENT_NAME } from '@/global/variable'
import { designTransformPreview, formInitVal } from '@utils/dataFormat'
export default {
  name: 'ChildForm',
  provide () {
    return {
      childFormProvide: this
    }
  },
  components: { tablePage, column, columnDefault },
  props: {
    value: {},
    // 表格配置(跟表单配置类似)
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格分页配置
    page: {
      type: Object,
      default () {
        return {}
      }
    },
    // 全局插件禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 全局插件只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 详细模式
    detailModel: {
      type: Boolean,
      default: false
    },
    // table加载
    loading: {
      type: Boolean,
      default: false
    },
    // 是否启动分页
    paging: {
      type: Boolean,
      default: true
    },
    // 回调函数
    rowCellAddFun: Function,
    rowCellDelFun: Function
  },
  data () {
    return {
      text: [],
      pagingList: [],
      hoverMark: {},
      first: false,
      configOption: {},
      childFormDefaultConfig: DEFAULT_CONFIG_INSIDE_CHILD_FORM,
      formId: '',
      DIC: {}
    }
  },
  computed: {
    // 子表单主体配置
    widgetChildForm () {
      return designTransformPreview(this) || {}
    },
    // 子表单列配置
    columns () {
      return this.widgetChildForm.column || []
    },
    // 子表单model
    childForm () {
      const list = this.paging ? this.pagingList : this.list
      return { list }
    },
    // 列插槽定义
    columnSlot () {
      const result = []
      // 此子表单为表格预览方式,固然没有布局组件也就没有递归,可以直接循环获取插槽
      this.columns.forEach(item => { this.$scopedSlots[item.prop] && result.push(item.prop) })
      return result
    },
    list () {
      if (getObjType(this.text) === 'array') {
        this.text.forEach((item, index) => Object.assign(item, { $index: index }))
        return this.text
      } else return []
    }
  },
  watch: {
    text: {
      handler (n) {
        if (this.first || !validateNull(n)) {
          this.first = true
          this.handleChange(n)
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
    this.$nextTick(() => {
      this.paging && this.$refs.page.homePage()
      this.clearValidate()
    })
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
      insertCss(parseCss(this.widgetChildForm.styleSheets), this.formId)
    },
    // 处理部件修改动作
    handleWidgetChange (column) {
      if (this.$refs.childForm) this.$refs.childForm.validateField(column.prop)
    },
    // 单元格新增
    rowCellAdd (row = {}) {
      const callback = () => {
        const len = this.list.length
        const formDefault = formInitVal(this.columns)
        row = deepClone(Object.assign({ $index: len }, formDefault, row))
        this.list.push(row)
      }
      if (typeof this.rowCellAddFun === 'function') {
        this.rowCellAddFun(callback)
      } else callback()
      this.paging && this.$refs.page.lastPage()
      this.$emit('row-add', row)
    },
    // 单元格删除
    rowCellDel (index) {
      const callback = () => {
        this.list.splice(index, 1)
      }
      if (typeof this.rowCellDelFun === 'function') {
        this.rowCellDelFun(this.list[index], callback)
      } else callback()
      if (this.paging) {
        this.$refs.page.rePaging()
        this.$refs.page.autoPrevPage()
      }
      this.$emit('row-del')
    },
    // 当单元格 hover 进入时会触发该事件
    cellMouseEnter (row, column, cell, event) {
      const index = row.$index
      if (!this.readonly || !this.disabled) {
        this.hoverMark = { [index]: true }
      }
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当单元格 hover 退出时会触发该事件
    cellMouseLeave (row, column, cell, event) {
      if (!this.readonly || !this.disabled) {
        this.hoverMark = {}
      }
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    clearValidate (list) {
      this.$refs.childForm.clearValidate(list)
    },
    validate () {
      return new Promise(resolve => {
        this.$refs.childForm.validate((valid, msg) => {
          resolve(msg)
        })
      })
    },
    // 校验一行表单字段
    validateRowCellField (index) {
      let result = true
      for (const item of this.$refs.childForm.fields) {
        if (item.prop.split('.')[1] == index) {
          this.$refs.childForm.validateField(item.prop, (error) => {
            if (error) result = false
          })
        }
        if (!result) break
      }
      return result
    },
    submit () {
      this.validate().then(msg => {
        if (validateNull(msg)) {
          this.$emit('submit', this.list)
        } else {
          this.$emit('error', msg)
        }
      })
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

