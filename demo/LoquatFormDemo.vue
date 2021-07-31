<template>
  <loquat-form v-model="model" :option="data" @submit="success" @error="error">
    <template slot="input001Label">
      通过插槽重置文本
    </template>
    <template slot="input001Error">
      <div>通过插槽重置错误提示</div>
    </template>
    <!--通过内部给每个Item设置的插槽使用演示:注意只能插入默认插槽-->
    <template slot="button001Type">
      测试插槽
    </template>
  </loquat-form>
</template>

<script>
export default {
  name: 'LoquatFormDemo',
  data () {
    return {
      model: {},
      data: {
        column: [
          {
            display: true,
            // 自定义样式
            className: '',
            prop: 'input001',
            label: '演示文本',
            type: 'input',
            rules: { required: true, message: '演示文本不能为空', trigger: 'blur' },
            labelPosition: 'left',
            labelWidth: 160,
            readonly: false,
            disabled: false,
            size: 'small',
            placeholder: '请输入信息',
            params: {},
            event: {},
            // 等等还可以输入对应loquat组件的一些props
            prepend: '前缀',
            append: '后置'
          },
          {
            // 也可以使用集成第三方库的组件
            prop: 'button001',
            type: 'primary',
            component: 'el-button',
            params: {
              html: 'demo'
            }
          }
        ],
        // 字典全局制定Key值,比如字典{test1:'代码狂热者1',test2:'代码狂热者2'},
        // 我要获取代码狂热者1数据,可以指定字段key,{label:test1}
        props: { },
        enter: true,
        size: 'small',
        labelSuffix: ':',
        statusIcon: true,
        formWidth: '80%',
        labelPosition: 'left',
        labelWidth: 120
      }
    }
  },
  methods: {
    success (e) {
      alert('成功')
    },
    error (e) {
      alert('失败')
    }
  }
}
</script>

<style scoped>

</style>
