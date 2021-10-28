/**
 * @program: loquat-form-design
 *
 * @description: 参数规范许可配置
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-10-29
 **/
export default [
  {
    component: 'Input',
    somePermission: {
      operation: [
        'plugin.readonly',
        'plugin.showWordLimit',
        'plugin.disabled',
        'plugin.showPassword',
        'hide',
        'hideLabel'
      ]
    },
    everyPermission: {}
  }
]
