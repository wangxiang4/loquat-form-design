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
      customClass: [],
      hide: false,
      hideLabel: false,
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
        customizeStyle: {
          width: '100%'
        },
        readonly: false,
        showWordLimit: false,
        disabled: false,
        showPassword: false
      }
    }, {
      type: 'textarea',
      label: '多行文本',
      icon: 'icon-textarea',
      labelWidth: '',
      customClass: [],
      hide: false,
      hideLabel: false,
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
        customizeStyle: {
          width: '100%'
        },
        readonly: false,
        disabled: false
      }
    }, {
      type: 'inputNumber',
      label: '计数器',
      icon: 'icon-number',
      labelWidth: '',
      customClass: [],
      hide: false,
      hideLabel: false,
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
        customizeStyle: {
          width: '100%'
        },
        minRows: 0,
        maxRows: 9,
        step: 1,
        precision: 0,
        controlsPosition: '',
        disabled: false
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
      remoteType: '',
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
        customizeStyle: {
          width: '100%'
        },
        filterable: false,
        props: {
          label: 'label',
          value: 'value'
        },
        drag: false
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
      remoteType: '',
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
        props: {
          label: 'label',
          value: 'value'
        },
        inline: false
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
      remoteType: '',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      hide: false,
      hideLabel: false,
      customClass: [],
      remoteDataSource: '',
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
        props: {
          label: 'label',
          value: 'value'
        },
        inline: false,
        all: false
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
        customizeStyle: {
          width: '100%'
        },
        readonly: false,
        disabled: false,
        range: false,
        editable: true,
        clearable: true,
        arrowControl: true,
        placeholder: '',
        startPlaceholder: '',
        endPlaceholder: ''
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
        customizeStyle: {
          width: '100%'
        },
        showAlpha: false,
        disabled: false
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
        customizeStyle: {
          width: '100%'
        },
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        showInput: false
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
      remote: true,
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
        tip: '',
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
        oss: '',
        byteUnit: 'MB',
        domain: 'http://tcdn.form.making.link/',
        customizeStyle: {
          width: '100%'
        },
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
        showCanvas: false,
        disabled: false
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
      remoteType: '',
      remoteOption: 'optionDefault',
      remoteFunc: 'funcDefault',
      remoteDataSource: '',
      validateConfig: {
        required: false
      },
      hide: false,
      hideLabel: false,
      customClass: [],
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
        customizeStyle: {
          width: '100%'
        },
        filterable: false,
        props: {
          label: 'label',
          value: 'value',
          children: 'children'
        }
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
