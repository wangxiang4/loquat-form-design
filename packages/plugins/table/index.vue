<template>
  <div class="loquat-table">
    <el-table :data="paging?pagingText:text"
              :size="size"
              :border="true"
    >
      <!-- 暂无数据提醒 -->
      <template slot="empty">
        <div class="loquat-table__empty">
          <slot v-if="$slots.empty" name="empty"/>
          <empty v-else
                 size="50"
                 image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                 :desc="emptyText"
          />
        </div>
      </template>
      <column :columnOption="columnOption">
        <column-default ref="columnDefault"
                        slot="header">
          <template slot-scope="{row,index}"
                    slot="expand">
            <slot :row="row"
                  :index="index"
                  name="expand"></slot>
          </template>
        </column-default>
        <template v-for="item in mainSlot"
                  slot-scope="scope"
                  :slot="item">
          <slot v-bind="scope"
                :name="item"></slot>
        </template>
        <column-menu slot="footer">
          <template slot="menu"
                    slot-scope="scope">
            <slot name="menu"
                  v-bind="scope"></slot>
          </template>
          <template slot="menuBtn"
                    slot-scope="scope">
            <slot name="menuBtn"
                  v-bind="scope"></slot>
          </template>
        </column-menu>
      </column>
    </el-table>
    <!-- 分页-目前只支持内部操作,外部不能操作只能配置页面默认参数 -->
    <!-- 根据我的开发经验来说,如果提供给外部使用的话,无非就是分页实时查询数据库的数据,但是这样也会引发一个问题,不能拿取全部的数据了 -->
    <!-- 导致后端保存数据不好保存,因为这是子表单后端保存数据就只能先删后保存,但是也可以解决这个问题,实现一个实时数据操作池就可以解决这个问题 -->
    <!-- 比如添加一条数据就把他放到新增池中,删除也是一样的放到删除池,目前由于是写第一版,不打算实现,后面再说 -->
    <div v-if="paging" >
      <el-pagination v-show="pageConfig.total > 0"
                     :layout="pageConfig.layout"
                     :total="pageConfig.total"
                     :pager-count="pageConfig.pagerCount"
                     :hide-on-single-page="pageConfig.simplePage"
                     :current-page.sync="pageConfig.currentPage"
                     :background="pageConfig.background"
                     :page-size="pageConfig.pageSize"
                     :page-sizes="pageConfig.pageSizes"
                     @prev-click="prevClick"
                     @next-click="nextClick"
                     @size-change="sizeChange"
                     @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { DEFAULT_PAGE_CONFIG } from '@/global/variable'
import empty from '../empty'
export default {
  name: 'Table',
  provide () {
    return {
      table: this
    }
  },
  components: { empty },
  props: {
    value: { type: Array },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String
    },
    paging: {
      type: Boolean,
      default: true
    },
    page: {
      type: Object,
      default: () => DEFAULT_PAGE_CONFIG
    },
    pagingSizeChange: Function,
    pagingCurrentChange: Function
  },
  data () {
    return {
      text: [],
      pagingText: [],
      pageConfig: {}
    }
  },
  computed: {
  },
  watch: {
    text: {
      handler (n) {
        this.handleChange(n)
      }
    },
    value: {
      handler () {
        this.initVal()
      }
    },
    page: {
      immediate: true,
      handler (val) {
        this.pageConfig = val
      }
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    initVal () {
      this.text = this.value
    },
    /** 分页这里需要考虑两种情况,表单内部使用,提供此组件给外部使用 **/
    pageInit () {
      this.defaultPage = Object.assign(this.defaultPage, this.page, {
        total: Number(this.page.total || this.defaultPage.total),
        pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
        currentPage: Number(this.page.currentPage || this.defaultPage.currentPage),
        pageSize: Number(this.page.pageSize || this.defaultPage.pageSize)
      })
      this.updateValue()
    },
    // 下一页事件
    handleNextClick (val) {
      this.$emit('next-click', val)
    },
    // 上一页事件
    handlePrevClick (val) {
      this.$emit('prev-click', val)
    },
    // 页大小回调
    handleSizeChange (val) {
      if (typeof this.pagingSizeChange === 'function') {
        this.pagingSizeChange(val)
      } else {
        this.defaultPage.currentPage = 1;
        this.defaultPage.pageSize = val;
        this.updateValue();
        this.crud.$emit("on-load", this.defaultPage);
        this.crud.$emit("size-change", val);
      }
    },
    // 页码回调
    handleCurrentChange (val) {
      if (typeof this.pagingCurrentChange === 'function') {
        this.pagingCurrentChange(val)
      } else {
        this.updateValue();
        this.crud.$emit("on-load", this.defaultPage);
        this.crud.$emit("current-change", val);
      }
    },
    // 处理更新第三方使用组件page信息
    handleUpdateValue () {
      this.$emit('update:page', this.pageConfig)
    },
    // 处理本地分页
    handleLocalPaging () {

    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

