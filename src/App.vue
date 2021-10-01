<template>
  <div id="app">
    <loquat-form-design style="height: 100vh;"
                        :options="options"
                        :custom-fields="customFields"
    />
    <loquat-upload-demo/>
  </div>
</template>

<script>
import LoquatUploadDemo from '/demo/LoquatUploadDemo'
export default {
  name: 'App',
  components: { LoquatUploadDemo },
  data () {
    return {
      customFields: [{
        title: '自定义字段',
        list: [
          {
            title: '分割线',
            component: 'el-divider',
            icon: 'iconfont icon-divider',
            label: '',
            labelWidth: 0,
            params: {
              html: '<h3 style="color:red">分割线标题</h3>',
              contentPosition: 'left'
            }
          },
          {
            title: '警告',
            component: 'el-alert',
            icon: 'el-icon-warning',
            label: '',
            labelWidth: 0,
            params: {
              title: '警告警告警告警告',
              type: 'success'
            },
            events: {
              close () {
                console.log('alert关闭事件')
              }
            }
          }
        ]
      }],
      // 设置表单配置会覆盖掉内部的默认配置
      options: { column: [] }
    }
  }
}
</script>
