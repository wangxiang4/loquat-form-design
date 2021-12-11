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
    <!-- 分页-目前只支持内部操作,外部不能操作只能配置页面默认参数 -->
    <!-- 根据我的开发经验来说,如果提供给外部使用的话,无非就是分页实时查询数据库的数据,但是这样也会引发一个问题,不能拿取全部的数据了 -->
    <!-- 导致后端保存数据不好保存,因为这是子表单后端保存数据就只能先删后保存,但是也可以解决这个问题,实现一个实时数据操作池就可以解决这个问题 -->
    <!-- 比如添加一条数据就把他放到新增池中,删除也是一样的放到删除池,目前由于是写第一版,不打算实现,后面再说 -->
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
    }
  },
  data () {
    return {
      list: [],
      pagingList: [],
      first: false,
      configOption: {},
      listDefaultConfig: DEFAULT_CONFIG_INSIDE_LIST,
      listId: '',
      DIC: {},
      listError: {},
      hoverList: []
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
    // table列插槽定义
    tableColSlot () {
      const result = []
      this.columns.forEach(item => {
        if (this.$scopedSlots[item.prop]) result.push(item.prop)
      })
      return result
    },
    pagingEnable () {
      return this.widgetList.paging || this.listDefaultConfig.paging
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
      handler (val) {
        this.initVal()
      },
      deep: true
    }
  },
  created () {
    this.initVal()
  },
  beforeDestroy () {
    insertCss([], this.listId)
  },
  methods: {
    initVal () {
      this.configOption = this.option
      insertCss([], this.listId)
      this.listId = KEY_COMPONENT_NAME.concat(randomId8())
      insertCss(parseCss(this.widgetList.styleSheets), this.listId)
      this.form = deepClone({ ...formInitVal(this.columns), ...this.form })
      this.list = this.value
    },
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
        this.list.push(row)
      }
      if (typeof this.widgetList.rowAddFun === 'function') {
        this.widgetList.rowAddFun(callback)
      } else callback()
      if (this.pagingEnable) this.$refs.page.lastPage()
    },
    // 单元格删除
    rowCellRow (index) {
      const callback = () => {
        const list = this.deepClone(this.list)
        list.splice(index, 1)
        this.list = list
      }
      if (typeof this.widgetList.rowDelFun === 'function') {
        this.widgetList.rowDelFun(this.list[index], callback)
      } else callback()
      // 重新排序表格列序号
      this.list.forEach((ele, index) => { ele = Object.assign(ele, { $index: index }) })
      if (this.pagingEnable) this.$refs.page.autoPrevPage()
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

