<template>
  <div>
    <child-form :page.sync="page">
      <template slot="empty">
        没有数据
      </template>
      <template slot="headPage">
        分页头部插槽
      </template>
      <!--<template slot="input_j5vFQOMI" slot-scope="scope">
        列插槽{{ scope }}
      </template>-->
    </child-form>
    <el-button @click="testPage">测试分页</el-button>
  </div>
</template>

<script>
import childForm from '../packages/plugins/child-form'
export default {
  name: 'LoquatUploadDemo',
  components: { childForm },
  data () {
    return {
      option: {
        'indexExecuteLabel': '序列操作',
        'column': [{
          'type': 'input',
          'label': '单行文本',
          'labelWidth': '',
          'hide': false,
          'hideLabel': false,
          'customClass': [],
          'validateConfig': {
            'required': true,
            'type': false,
            'pattern': false
          },
          'events': {
            'change': '',
            'focus': '',
            'blur': ''
          },
          'plugin': {
            'type': 'text',
            'value': '',
            'prepend': '',
            'append': '',
            'maxlength': '',
            'placeholder': '',
            'readonly': false,
            'showWordLimit': false,
            'disabled': false,
            'showPassword': false,
            'customizeStyle': {
              'width': '100%'
            }
          },
          'prop': 'input_j5vFQOMI'
        }],
        'labelPosition': 'right',
        'labelWidth': 90,
        'size': 'small',
        'styleSheets': '',
        'customClass': [],
        'eventScript': [{
          'key': 'mounted',
          'name': 'mounted',
          'func': ''
        }],
        'dataSource': [{
          'key': 'upload',
          'name': 'Get Upload Token',
          'url': 'http://tools-server.making.link/api/uptoken',
          'method': 'GET',
          'auto': true,
          'thirdPartyAxios': false,
          'headers': {},
          'params': {},
          'requestFunc': 'return config;',
          'responseFunc': 'return res.uptoken;',
          'errorFunc': ''
        }, {
          'key': 'options',
          'name': 'Get Options',
          'url': 'http://tools-server.making.link/api/new/options',
          'method': 'GET',
          'auto': true,
          'thirdPartyAxios': false,
          'headers': {},
          'params': {},
          'requestFunc': 'return config;',
          'responseFunc': 'return res.data;',
          'errorFunc': ''
        }]
      },
      data: [{ input_j5vFQOMI: '详情信息' }],
      page: {
        total: 0,        // 总页数
        pagerCount: 7,   // 超过多少条隐藏
        currentPage: 1,  // 当前页数
        pageSize: 3,     // 每页显示多少条
        smallPaging: true, // 是否使用小分页
        simplePage: false, // 当只有一页时隐藏分页
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, prev, pager, next',
        background: false // 背景颜色
      }
    }
  },
  methods: {
    testPage () {
      this.page = {
        currentPage: 1,
        pageSize: 3
      }
    }
  }
}
</script>

<style scoped>

</style>
