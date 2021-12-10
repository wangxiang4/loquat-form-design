/**
 * @program: loquat-form-design
 *
 * @description: 字段插件配置文件
 * 设计思路: 采用插件配置与表单设计器内部配置两者独立风格,互不影响,确保两者配置不会起冲突
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-10-4
 **/

export default [
  {
    title: '基础字段',
    list: [{
      type: 'input',
      label: '单行文本',
      icon: 'icon-input',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false,
        type: false,
        pattern: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        type: 'text',
        value: '',
        prepend: '',
        append: '',
        maxlength: '',
        placeholder: '',
        readonly: false,
        showWordLimit: false,
        disabled: false,
        showPassword: false,
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'textarea',
      label: '多行文本',
      icon: 'icon-textarea',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false,
        pattern: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        type: 'textarea',
        value: '',
        placeholder: '',
        readonly: false,
        disabled: false,
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'inputNumber',
      label: '计数器',
      icon: 'icon-number',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        value: 0,
        minRows: 0,
        maxRows: 9,
        step: 1,
        precision: 0,
        controlsPosition: '',
        disabled: false,
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'select',
      label: '下拉选择',
      icon: 'icon-select',
      labelWidth: '',
      remote: false,
      dicData: [
        { label: '选项一', value: 'Option 1' },
        { label: '选项二', value: 'Option 2' },
        { label: '选项三', value: 'Option 3' }
      ],
      remoteType: 'datasource',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      remoteDataSource: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        value: '',
        multiple: false,
        disabled: false,
        clearable: false,
        placeholder: '',
        showLabel: false,
        filterable: false,
        drag: false,
        props: {
          label: 'label',
          value: 'value'
        },
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'radio',
      label: '单选框',
      icon: 'icon-radio',
      labelWidth: '',
      remote: false,
      dicData: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remoteType: 'datasource',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      remoteDataSource: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        value: '',
        disabled: false,
        showLabel: false,
        inline: false,
        props: {
          label: 'label',
          value: 'value'
        }
      }
    }, {
      type: 'checkbox',
      label: '多选框',
      icon: 'icon-check-box',
      labelWidth: '',
      remote: false,
      dicData: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },
        {
          value: 'Option 3'
        }
      ],
      remoteType: 'datasource',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      remoteDataSource: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        value: [],
        disabled: false,
        showLabel: false,
        inline: false,
        all: false,
        props: {
          label: 'label',
          value: 'value'
        }
      }
    }, {
      type: 'time',
      label: '时间选择器',
      icon: 'icon-time',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        value: '',
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
        readonly: false,
        disabled: false,
        range: false,
        editable: true,
        clearable: true,
        arrowControl: true,
        placeholder: '',
        startPlaceholder: '',
        endPlaceholder: '',
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'date',
      label: '日期选择器',
      icon: 'icon-date',
      labelWidth: '',
      timestamp: false,
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        type: 'date',
        value: '',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        readonly: false,
        disabled: false,
        editable: true,
        clearable: true,
        placeholder: '',
        startPlaceholder: '',
        endPlaceholder: '',
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'rate',
      label: '评价',
      icon: 'icon-score',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        max: 5,
        value: 0,
        labelWidth: '',
        showScore: false,
        allowHalf: false,
        disabled: false
      }
    }, {
      type: 'inputColor',
      label: '颜色选择器',
      icon: 'icon-color',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        value: '',
        showAlpha: false,
        disabled: false,
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'switch',
      label: '开关',
      icon: 'icon-switch',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        value: false,
        disabled: false
      }
    }, {
      type: 'slider',
      label: '滑块',
      icon: 'icon-slider',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: ''
      },
      plugin: {
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        showInput: false,
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'font',
      label: '文字',
      icon: 'icon-font',
      labelWidth: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      plugin: {
        value: 'This is a text',
        effect: 'light',
        effectType: 'default',
        center: false
      }
    }]
  },
  {
    title: '高级字段',
    list: [{
      type: 'upload',
      label: '文件',
      icon: 'icon-file-upload',
      labelWidth: '',
      remote: false,
      remoteType: 'datasource',
      remoteFunc: 'funcGetToken',
      remoteDataSource: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        uploadSuccess: '',
        uploadError: '',
        uploadRemove: ''
      },
      plugin: {
        action: 'http://localhost:8888/common/upload',
        headers: [],
        data: [],
        accept: '',
        listType: 'text',
        drag: false,
        withCredentials: false,
        showFileList: true,
        multiple: false,
        limit: 10,
        fileSize: 2,
        tip: '',
        oss: '',
        byteUnit: 'MB',
        domain: 'http://tcdn.form.making.link/',
        showCanvas: false,
        disabled: false,
        uploadConfig: {
          home: 'http://localhost:8888',
          resUrl: '',
          fileName: '',
          res: ''
        },
        canvasOption: {
          fontSize: 16,
          opacity: 100,
          bottom: 10,
          right: 10,
          ratio: 1,
          text: '商用通用大水印',
          fontFamily: 'microsoft yahei',
          color: '#999'
        },
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'cascader',
      label: '级联选择器',
      icon: 'icon-cascade',
      labelWidth: '',
      remote: false,
      dicData: [
        {
          value: 'Option 1',
          label: 'Option 1',
          children: [
            {
              value: 'Option 1 - children',
              label: 'Option 1 - children'
            }
          ]
        },
        {
          value: 'Option 2',
          label: 'Option 2',
          children: [
            {
              value: 'Option 2 - children',
              label: 'Option 2 - children'
            }
          ]
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remoteType: 'datasource',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      remoteDataSource: '',
      hide: false,
      hideLabel: false,
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      },
      plugin: {
        value: [],
        multiple: false,
        disabled: false,
        clearable: false,
        placeholder: '',
        filterable: false,
        props: {
          label: 'label',
          value: 'value',
          children: 'children'
        },
        customizeStyle: {
          width: '100%'
        }
      }
    }, {
      type: 'childForm',
      label: '子表单',
      icon: 'icon-child-form',
      plugin: {
      },
      events: {
        change: '',
        rowAdd: '',
        rowRemove: '',
        rowChange: ''
      }
    }]
  },
  {
    title: '布局字段',
    list: [
      {
        type: 'coralLayout',
        label: '珊瑚布局',
        icon: 'icon-coral',
        flex: true,
        gutter: 0,
        justify: 'start',
        align: 'top',
        hide: false,
        cols: [
          {
            type: 'coralLayoutCol',
            offset: 0,
            push: 0,
            pull: 0,
            md: 24,
            list: [],
            customClass: []
          }
        ],
        customClass: []
      }
    ]
  }
]
