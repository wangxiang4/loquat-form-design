<template>
  <div id="app">
    <loquat-form-design style="height: 100vh;"
                        :options="options"
                        :custom-fields="customFields"
    />
    <FormDemo/>
  </div>
</template>

<script>
import FormDemo from '../test/FormDemo'
export default {
  name: 'App',
  components: {
    FormDemo
  },
  data () {
    return {
      customFields: [
        {
          title: '分割线',
          type: 'divider',
          component: 'el-divider', // ele分割线
          span: 24,
          icon: 'el-icon-eleme',
          tips: '看我：自定义属性怎么用？',
          labelWidth: '0px',
          customizeConfig: {
            html: '<h3 style="color:red">分割线标题</h3>',
            contentPosition: 'left'
          }
        },
        {
          title: '警告',
          component: 'el-alert',
          labelWidth: '0px',
          span: 24,
          icon: 'el-icon-warning',
          tips: '看我：自定义事件怎么用？',
          customizeConfig: {
            title: '警告警告警告警告',
            type: 'success'
          }
        }
      ],
      options: { column: [] }
    }
  },
  methods: {
  }
}
</script>
