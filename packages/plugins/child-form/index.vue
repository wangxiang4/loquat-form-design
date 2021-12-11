<template>
  <div :class="['loquat-child-form', listId]">
    <el-form :model="cellForm"
             :show-message="false"
             @validate="handleValidate"
             ref="cellForm"
    >
      <el-table :data="cellForm.list"
                :size="widgetList.size || listDefaultConfig.size"
                :border="widgetList.border || listDefaultConfig.border"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
      >
        <!-- 暂无数据提醒 -->
        <template slot="empty">
          <div class="loquat-child-form__empty">
            <slot v-if="$slots.empty" name="empty"/>
            <empty v-else
                   size="50"
                   image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                   :desc="widgetList.emptyText || '暂无数据'"
            />
          </div>
        </template>
        <column :columns="columns">
          <!--渲染头部操作列-->
          <column-default slot="header"/>
          <!--渲染插槽列表-->
          <template v-for="item in tableColSlot"
                    slot-scope="scope"
                    :slot="item"
          >
            <slot v-bind="scope" :name="item"/>
          </template>
        </column>
      </el-table>
    </el-form>
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
  </div>
</template>

<script>
import empty from '../empty'
import tablePage from './page'
import column from './column'
import columnDefault from './columnDefault'
import { deepClone, randomId8, validateNull } from '@utils'
import { insertCss, parseCss } from '@utils/dom'
import { DEFAULT_CONFIG_INSIDE_LIST, KEY_COMPONENT_NAME } from '@/global/variable'
import { designTransformPreview, formInitVal } from '@utils/dataFormat'
export default {
  name: 'ChildForm',
  provide () {
    return {
      childForm: this
    }
  },
  components: { empty, tablePage, column, columnDefault },
  props: {
    // 表格配置(跟表单配置类似)
    option: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    // 表格list
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    /** 把一些需要常用的配置提取出来,如果使用option更新常用参数需要重新转换数据,消耗性能 */
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
    // 是否显示删除按钮
    delBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示新增按钮
    addBtn: {
      type: Boolean,
      default: true
    },
    // 详细模式
    detailModel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listId: '',
      list: [],
      pagingList: [],
      first: false,
      configOption: {},
      listDefaultConfig: DEFAULT_CONFIG_INSIDE_LIST,
      DIC: {},
      listError: {},
      hoverMark: {}
    }
  },
  computed: {
    widgetList () {
      return designTransformPreview(this)
    },
    columns () {
      return this.widgetList.column || []
    },
    // 列表单
    cellForm () {
      const list = this.pagingEnable ? this.pagingList : this.list
      return { list }
    },
    // 列插槽定义
    tableColSlot () {
      const result = []
      this.columns.forEach(item => {
        if (this.$scopedSlots[item.prop]) result.push(item.prop)
      })
      return result
    },
    // 分页是否启动
    pagingEnable () {
      return this.widgetList.paging || this.listDefaultConfig.paging
    },
    // 设置子表单是否只读
    formReadonly () {
      return this.widgetList.readonly || this.readonly
    },
    // 设置子表单是否禁用
    formDisabled () {
      return this.widgetList.disabled || this.disabled
    },
    // 设置子表单详细模式
    formDetailModel () {
      return this.widgetList.detailModel || this.detailModel
    }
  },
  watch: {
    list: {
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
    this.initOption()
  },
  mounted () {
    this.initVal()
    this.pagingEnable && this.$refs.page.homePage()
  },
  beforeDestroy () {
    insertCss([], this.listId)
  },
  methods: {
    initVal () {
      this.list = this.value
      this.list.forEach((item, index) => Object.assign(item, { $index: index }))
    },
    initOption () {
      this.configOption = this.option
      insertCss([], this.listId)
      this.listId = KEY_COMPONENT_NAME.concat(randomId8())
      insertCss(parseCss(this.widgetList.styleSheets), this.listId)
    },
    // 处理部件修改动作
    handleWidgetChange (column) {
      if (this.$refs.cellForm) this.$refs.cellForm.validateField(column.prop)
    },
    // 处理校验信息
    handleValidate (prop, valid, msg) {
      // 存储校验(成功|失败)信息
      if (!this.listError[prop]) this.$set(this.listError, prop, { valid: false, msg: '' })
      this.listError[prop].valid = !valid
      this.listError[prop].msg = msg
    },
    // 单元格新增
    rowCellAdd (row = {}) {
      const callback = () => {
        const len = this.list.length
        const formDefault = formInitVal(this.columns)
        row = deepClone(Object.assign({ $index: len }, formDefault, row))
        this.controlOperateOrigin = 'insideCellAdd'
        this.list.push(row)
      }
      if (typeof this.widgetList.rowAddFun === 'function') {
        this.widgetList.rowAddFun(callback)
      } else callback()
      this.pagingEnable && this.$refs.page.lastPage()
    },
    // 单元格删除
    rowCellRow (index) {
      const callback = () => {
        const list = deepClone(this.list)
        list.splice(index, 1)
        this.controlOperateOrigin = 'insideCellRow'
        this.list = list
      }
      if (typeof this.widgetList.rowDelFun === 'function') {
        this.widgetList.rowDelFun(this.list[index], callback)
      } else callback()
      if (this.pagingEnable) {
        this.$refs.page.rePaging()
        this.$refs.page.autoPrevPage()
      }
    },
    // 当单元格 hover 进入时会触发该事件
    cellMouseEnter (row, column, cell, event) {
      const index = row.$index
      if (!this.formReadonly || !this.formDisabled || this.delBtn) {
        this.hoverMark = { [index]: true }
      }
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当单元格 hover 退出时会触发该事件
    cellMouseLeave (row, column, cell, event) {
      if (!this.formReadonly || !this.formDisabled || this.delBtn) {
        this.hoverMark = {}
      }
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

