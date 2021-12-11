<template>
  <div v-if="pageFlag && childForm.pagingEnable" class="loquat-child-form__pagination" >
    <slot name="headPage"/>
    <el-pagination :small="defaultPage.smallPaging"
                   :disabled="defaultPage.disabled"
                   :layout="defaultPage.layout"
                   :total="defaultPage.total"
                   :hide-on-single-page="defaultPage.simplePage"
                   :pager-count="defaultPage.pagerCount"
                   :current-page.sync="defaultPage.currentPage"
                   :background="defaultPage.background"
                   :page-size="defaultPage.pageSize"
                   :page-sizes="defaultPage.pageSizes"
                   @prev-click="prevClick"
                   @next-click="nextClick"
                   @size-change="sizeChange"
                   @current-change="currentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Page',
  inject: ['childForm'],
  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      defaultPage: {
        total: 0,        // 总页数
        pagerCount: 7,   // 超过多少条隐藏
        currentPage: 1,  // 当前页数
        pageSize: 10,    // 每页显示多少条
        smallPaging: true, // 是否使用小分页
        simplePage: false, // 当只有一页时隐藏分页
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, prev, pager, next',
        background: true // 背景颜色
      }
    }
  },
  created () {
    this.pageInit()
  },
  watch: {
    page: {
      handler () {
        this.pageInit()
      },
      deep: true
    },
    // 当外部修改total触发
    'defaultPage.total' (val) {
      // 当最后一页数据全删除完了,自动调用上一页数据
      if (this.defaultPage.total === (this.defaultPage.currentPage - 1) * this.defaultPage.pageSize && this.defaultPage.total != 0) {
        this.defaultPage.currentPage = this.defaultPage.currentPage - 1
        /** 分页这里需要考虑两种情况,表单内部使用,提供此组件给外部使用 **/
        this.childForm.$emit('pagination', { currentPage: this.defaultPage.currentPage, pageSize: this.defaultPage.pageSize })
        this.localPaging()
        this.updateValue()
      }
    }
  },
  computed: {
    pageFlag () {
      return this.defaultPage.total > 0
    }
  },
  methods: {
    // 初始化分页配置参数
    pageInit () {
      this.defaultPage = Object.assign(this.defaultPage, this.page, {
        total: Number(this.page.total || this.defaultPage.total),
        pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
        currentPage: Number(this.page.currentPage || this.defaultPage.currentPage),
        pageSize: Number(this.page.pageSize || this.defaultPage.pageSize)
      })
      this.updateValue()
    },
    // 更新外部分页配置参数
    updateValue () {
      this.childForm.$emit('update:page', this.defaultPage)
    },
    // 下一页事件
    nextClick (val) {
      this.childForm.$emit('next-click', val)
    },
    // 上一页事件
    prevClick (val) {
      this.childForm.$emit('prev-click', val)
    },
    // 页大小回调
    sizeChange (val) {
      // 当调整每页显示条数,重置当前页码
      this.defaultPage.currentPage = 1
      this.defaultPage.pageSize = val
      /** 分页这里需要考虑两种情况,表单内部使用,提供此组件给外部使用 **/
      this.childForm.$emit('pagination', { currentPage: this.defaultPage.currentPage, pageSize: this.defaultPage.pageSize })
      this.localPaging()
    },
    // 本地分页
    localPaging () {
      const array = this.childForm.list
      const offset = (this.defaultPage.currentPage - 1) * this.defaultPage.pageSize
      // 兼容外部使用pagination重新赋值分页数据,只要超过总数量则显示全部数量
      // 列如当前{pageSize:5,currentPage:2,array:[1,2,3,4,5]},如果没处理这样分页到第二页是没有数据的,处理后可直接获取全部数据
      const pagingList = (offset + this.defaultPage.pageSize > array.length) ? array.slice(0, array.length) : array.slice(offset, offset + this.defaultPage.pageSize)
      this.childForm.pagingList = pagingList
      this.defaultPage.total = array.length
      this.updateValue()
    },
    // 链接到最后一页
    lastPage () {
      const computeLastPage = this.defaultPage.total % this.defaultPage.pageSize == 0
        ? this.defaultPage.total / this.defaultPage.pageSize
        : Math.ceil(this.defaultPage.total / this.defaultPage.pageSize)
      this.defaultPage.currentPage = computeLastPage
      this.localPaging()
    },
    // 页码回调
    currentChange (val) {
      /** 分页这里需要考虑两种情况,表单内部使用,提供此组件给外部使用 **/
      this.childForm.$emit('pagination', { currentPage: val, pageSize: this.defaultPage.pageSize })
      this.localPaging()
    }
  }
}
</script>
