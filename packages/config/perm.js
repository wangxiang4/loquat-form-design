/**
 * @program: loquat-form-design
 *
 * @description: 参数规范许可配置
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-10-29
 **/

/** 许可配置映射标识 **/
const permission = {
  input: {
    operate: [
      'plugin.readonly',
      'plugin.showWordLimit',
      'plugin.disabled',
      'plugin.showPassword',
      'hide',
      'hideLabel'
    ],
    defaultValue: [
      'value',
      'type'
    ],
    validate: [
      'validateConfig.required',
      'validateConfig.type',
      'validateConfig.pattern'
    ],
    validateType: [
      'validateConfig.type',
      'plugin.type'
    ]
  },
  inputColor: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled',
      'plugin.showAlpha'
    ],
    defaultValue: [
      'value',
      'showAlpha'
    ]
  }
}

export default [
  {
    component: 'Input',
    somePermission: {
      operate: permission.input.operate
    },
    everyPermission: {
      defaultValue: permission.input.defaultValue,
      validateType: permission.input.validateType
    },
    someAndEveryPermission: {
      validate: [
        permission.input.validate,
        [permission.input.validateType]
      ]
    }
  },
  {
    component: 'InputColor',
    somePermission: {
      operate: permission.inputColor.operate
    },
    everyPermission: {
      defaultValue: permission.inputColor.defaultValue
    }
  }
]
