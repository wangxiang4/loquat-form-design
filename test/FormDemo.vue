<template>
  <loquat-form v-model="test" :option="data"/>
</template>

<script>
export default {
  name: 'FormDemo',
  data () {
    return {
      test: {},
      data: {
        column: [
          {
            span: 24,
            offset: 6,
            display: true,
            className: 'cursor',
            prop: 'codeZealotInput',
            label: '代码狂热者测试文本',
            type: 'input',
            rules: { required: true, message: '代码狂热者测试文本不能为空', trigger: 'blur' },
            labelPosition: 'left',
            labelWidth: 120,
            readonly: false,
            disabled: false,
            size: 'small',
            placeholder: '请输入信息',
            params: {},
            event: {},
            // 等等还可以输入对应loquat组件的一些props
            prepend: '前缀',
            append: '后置'
          }
        ],
        // 字典全局制定Key值,比如字典{test1:'代码狂热者1',test2:'代码狂热者2'},
        // 我要获取代码狂热者1数据,可以指定字段key,{label:test1}
        props: { },
        enter: true,
        gutter: '10',
        size: 'small',
        labelSuffix: ':',
        statusIcon: true,
        formWidth: '80%',
        labelPosition: 'left',
        labelWidth: 120,
        componentSize: 'small'
      }
    }
  }
}
</script>

<style scoped>

</style>
