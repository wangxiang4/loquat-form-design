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
  cascader: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.multiple',
      'plugin.filterable',
      'plugin.disabled',
      'plugin.clearable'
    ],
    operateMultiple: [
      'plugin.multiple',
      'plugin.value'
    ],
    options: [
      'remote',
      'dicData',
      'remoteType',
      'remoteDataSource',
      'remoteOption',
      'remoteFunc',
      'plugin.value',
      'plugin.props.value',
      'plugin.props.label',
      'plugin.props.children'
    ],
    defaultValue: [
      'dicData',
      'plugin.value'
    ]
  },
  checkbox: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.all',
      'plugin.disabled'
    ],
    options: [
      'remote',
      'dicData',
      'remoteType',
      'remoteDataSource',
      'remoteOption',
      'remoteFunc',
      'plugin.value',
      'plugin.showLabel',
      'plugin.props.value',
      'plugin.props.label'
    ]
  },
  coralLayout: {
    operate: [
      'flex',
      'hide'
    ]
  },
  date: {
    displayType: [
      'type',
      'value',
      'format',
      'valueFormat'
    ],
    defaultValue: [
      'value',
      'type',
      'valueFormat',
      'format'
    ],
    operate: [
      'plugin.readonly',
      'plugin.disabled',
      'hide',
      'hideLabel',
      'timestamp',
      'plugin.editable',
      'plugin.clearable'
    ],
    operateTimestamp: [
      'timestamp',
      'plugin.value',
      'plugin.valueFormat',
      'plugin.type'
    ]
  },
  font: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.center'
    ],
    theme: [
      'effect',
      'effectType'
    ]
  },
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
  },
  inputNumber: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled'
    ],
    defaultValue: [
      'value',
      'step',
      'minRows',
      'maxRows'
    ]
  },
  radio: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled'
    ],
    options: [
      'remote',
      'dicData',
      'remoteType',
      'remoteFunc',
      'remoteOption',
      'remoteDataSource',
      'plugin.value',
      'plugin.showLabel',
      'plugin.props.value',
      'plugin.props.label'
    ]
  },
  rate: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled',
      'plugin.showScore',
      'plugin.allowHalf'
    ],
    defaultValue: [
      'value',
      'max',
      'allowHalf'
    ]
  },
  select: {
    options: [
      'remote',
      'dicData',
      'remoteType',
      'remoteDataSource',
      'remoteOption',
      'remoteFunc',
      'plugin.value',
      'plugin.multiple',
      'plugin.showLabel',
      'plugin.props.value',
      'plugin.props.label'
    ],
    operate: [
      'plugin.multiple',
      'plugin.filterable',
      'hide',
      'plugin.disabled',
      'hideLabel',
      'plugin.clearable',
      'plugin.drag'
    ],
    operateMultiple: [
      'plugin.multiple',
      'plugin.value',
      'plugin.drag'
    ]
  },
  slider: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled',
      'plugin.showInput'
    ],
    defaultValue: [
      'value',
      'min',
      'max',
      'step',
      'showInput'
    ]
  },
  switch: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.disabled'
    ]
  },
  time: {
    operate: [
      'hide',
      'hideLabel',
      'plugin.readonly',
      'plugin.disabled',
      'plugin.editable',
      'plugin.range',
      'plugin.clearable',
      'plugin.arrowControl'
    ],
    operateRange: [
      'plugin.range',
      'plugin.value'
    ],
    defaultValue: [
      'value',
      'valueFormat',
      'format'
    ]
  },
  upload: {
    oss: [
      'plugin.oss',
      'remote'
    ],
    getToken: [
      'remoteType',
      'remoteDataSource',
      'remoteFunc'
    ],
    fileSize: [
      'fileSize',
      'byteUnit'
    ],
    uploadConfig: [
      'uploadConfig.home',
      'uploadConfig.fileName',
      'uploadConfig.resUrl',
      'uploadConfig.res'
    ],
    canvasConfig: [
      'canvasOption.text',
      'canvasOption.fontFamily',
      'canvasOption.color',
      'canvasOption.fontSize',
      'canvasOption.opacity',
      'canvasOption.bottom',
      'canvasOption.right',
      'canvasOption.ratio'
    ],
    operate: [
      'hide',
      'hideLabel',
      'plugin.drag',
      'plugin.disabled',
      'plugin.showCanvas',
      'plugin.withCredentials',
      'plugin.multiple',
      'plugin.showFileList'
    ]
  }
}

export default [
  {
    component: 'Cascader',
    everyPermission: {
      defaultValue: permission.cascader.defaultValue,
      options: permission.cascader.options
    },
    someAndEveryPermission: {
      operate: [
        permission.cascader.operate,
        [permission.cascader.operateMultiple]
      ]
    }
  },
  {
    component: 'Checkbox',
    somePermission: {
      operate: permission.checkbox.operate
    },
    everyPermission: {
      options: permission.checkbox.options
    }
  },
  {
    component: 'CoralLayout',
    somePermission: {
      operate: permission.coralLayout.operate
    }
  },
  {
    component: 'Date',
    everyPermission: {
      defaultValue: permission.date.defaultValue,
      displayType: permission.date.displayType,
      operateTimestamp: permission.date.operateTimestamp
    },
    someAndEveryPermission: {
      operate: [
        permission.date.operate,
        [permission.date.operateTimestamp]
      ]
    }
  },
  {
    component: 'Font',
    somePermission: {
      operate: permission.font.operate
    },
    everyPermission: {
      theme: permission.font.theme
    }
  },
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
  },
  {
    component: 'InputNumber',
    somePermission: {
      operate: permission.inputNumber.operate
    },
    everyPermission: {
      defaultValue: permission.inputNumber.defaultValue
    }
  },
  {
    component: 'Radio',
    somePermission: {
      operate: permission.radio.operate
    },
    everyPermission: {
      options: permission.radio.options
    }
  },
  {
    component: 'Rate',
    somePermission: {
      operate: permission.rate.operate
    },
    everyPermission: {
      options: permission.rate.options
    }
  },
  {
    component: 'Select',
    everyPermission: {
      options: permission.select.options,
      operateMultiple: permission.select.operateMultiple
    },
    someAndEveryPermission: {
      operate: [
        permission.select.operate,
        [permission.select.operateMultiple]
      ]
    }
  },
  {
    component: 'Slider',
    somePermission: {
      operate: permission.slider.operate
    },
    everyPermission: {
      defaultValue: permission.slider.defaultValue
    }
  },
  {
    component: 'Switch',
    somePermission: {
      operate: permission.switch.operate
    }
  },
  {
    component: 'Time',
    everyPermission: {
      defaultValue: permission.time.defaultValue,
      operateRange: permission.time.operateRange
    },
    someAndEveryPermission: {
      operate: [
        permission.time.operate,
        [permission.time.operateRange]
      ]
    }
  },
  {
    component: 'Upload',
    somePermission: {
      uploadConfig: permission.upload.uploadConfig,
      canvasConfig: permission.upload.canvasConfig,
      configCenterPerm: [...permission.upload.uploadConfig, ...permission.upload.canvasConfig],
      operate: permission.upload.operate
    },
    everyPermission: {
      oss: permission.upload.oss,
      getToken: permission.upload.getToken,
      fileSize: permission.upload.fileSize
    }
  }
]
