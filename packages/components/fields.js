export default [
  {
    title: '基础字段',
    list: [{
      type: 'input',
      label: '单行文本',
      icon: 'icon-input',
      _type: '',
      labelWidth: '',
      placeholder: '',
      value: '',
      prepend: '',
      append: '',
      maxlength: '',
      customizeStyle: {
        width: '100%'
      },
      customClass: [],
      readonly: false,
      showWordLimit: false,
      disabled: false,
      showPassword: false,
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
      }
    }, {
      type: 'textarea',
      label: '多行文本',
      icon: 'icon-textarea',
      labelWidth: '',
      placeholder: '',
      value: '',
      customizeStyle: {
        width: '100%'
      },
      customClass: [],
      readonly: false,
      disabled: false,
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
      }
    }, {
      type: 'number',
      label: '计数器',
      icon: 'icon-number',
      labelWidth: '',
      value: 0,
      customizeStyle: {
        width: '100%'
      },
      minRows: 0,
      maxRows: 9,
      step: 1,
      precision: 0,
      controlsPosition: '',
      customClass: [],
      disabled: false,
      hide: false,
      hideLabel: false,
      validateConfig: {
        required: false
      },
      events: {
        change: '',
        focus: '',
        blur: ''
      }
    }, {
      type: 'select',
      label: '下拉选择',
      icon: 'icon-select',
      value: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      validateConfig: {
        required: false
      },
      showLabel: false,
      customizeStyle: {
        width: '100%'
      },
      dicData: [
        { label: '选项一', value: 'Option 1' },
        { label: '选项二', value: 'Option 2' },
        { label: '选项三', value: 'Option 3' }
      ],
      static: true,
      remoteType: '',
      remoteOption: 'optionDefault',
      filterable: false,
      props: {
        label: 'label',
        value: 'value'
      },
      remoteFunc: 'funcDefault',
      customClass: [],
      labelWidth: '',
      hideLabel: false,
      hide: false,
      remoteDataSource: '',
      drag: false,
      events: {
        change: '',
        focus: '',
        blur: ''
      }
    }, {
      type: 'radio',
      label: '单选框',
      icon: 'icon-radio',
      value: '',
      disabled: false,
      validateConfig: {
        required: false
      },
      showLabel: false,
      customizeStyle: {
        width: '100%'
      },
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
      static: true,
      remoteType: '',
      remoteOption: 'optionDefault',
      props: {
        label: 'label',
        value: 'value'
      },
      remoteFunc: 'funcDefault',
      customClass: [],
      labelWidth: '',
      hideLabel: false,
      hide: false,
      inline: false,
      remoteDataSource: '',
      events: {
        change: ''
      }
    }, {
      type: 'checkbox',
      label: '多选框',
      icon: 'icon-check-box',
      value: [],
      disabled: false,
      validateConfig: {
        required: false
      },
      showLabel: false,
      customizeStyle: {
        width: '100%'
      },
      static: true,
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
      props: {
        label: 'label',
        value: 'value'
      },
      remoteFunc: 'funcDefault',
      customClass: [],
      labelWidth: '',
      hideLabel: false,
      hide: false,
      inline: false,
      all: false,
      remoteDataSource: '',
      events: {
        change: ''
      }
    }, {
      type: 'time',
      label: '时间选择器',
      icon: 'icon-time',
      value: '',
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss',
      labelWidth: '',
      readonly: false,
      disabled: false,
      isRange: false,
      editable: true,
      clearable: true,
      arrowControl: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      customizeStyle: {
        width: '100%'
      },
      validateConfig: {
        required: false
      },
      hideLabel: false,
      hide: false,
      customClass: [],
      events: {
        change: '',
        focus: '',
        blur: ''
      }
    }, {
      type: 'date',
      label: '日期选择器',
      icon: 'icon-date',
      value: '',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      labelWidth: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      hideLabel: false,
      hide: false,
      timestamp: false,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      customizeStyle: {
        width: '100%'
      },
      validateConfig: {
        required: false
      },
      customClass: [],
      events: {
        change: '',
        focus: '',
        blur: ''
      }
    }, {
      type: 'rate',
      label: '评价',
      icon: 'icon-score',
      max: 5,
      value: 0,
      labelWidth: '',
      showScore: false,
      allowHalf: false,
      disabled: false,
      hideLabel: false,
      hide: false,
      validateConfig: {
        required: false
      },
      customClass: [],
      events: {
        change: ''
      }
    }, {
      type: 'color',
      label: '颜色选择器',
      icon: 'icon-color',
      value: '',
      customizeStyle: {
        width: '100%'
      },
      labelWidth: '',
      showAlpha: false,
      disabled: false,
      hideLabel: false,
      hide: false,
      validateConfig: {
        required: false
      },
      customClass: [],
      events: {
        change: ''
      }
    }, {
      type: 'switch',
      label: '开关',
      icon: 'icon-switch',
      value: false,
      labelWidth: '',
      disabled: false,
      hideLabel: false,
      hide: false,
      validateConfig: {
        required: false
      },
      customClass: [],
      events: {
        change: ''
      }
    }, {
      type: 'slider',
      label: '滑块',
      icon: 'icon-slider',
      value: 0,
      labelWidth: '',
      customizeStyle: {
        width: '100%'
      },
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      hideLabel: false,
      hide: false,
      showInput: false,
      validateConfig: {
        required: false
      },
      customClass: [],
      events: {
        change: ''
      }
    }, {
      type: 'font',
      label: '文字',
      icon: 'icon-font',
      value: 'This is a text',
      effect: 'light',
      effectType: 'default',
      labelWidth: '',
      center: false,
      hideLabel: false,
      hide: false,
      customClass: []
    }]
  },
  {
    title: '高级字段',
    list: [{
      type: 'upload',
      label: '文件',
      icon: 'icon-file-upload',
      labelWidth: '',
      customizeStyle: {
        width: '100%'
      },
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
      uploadConfig: {
        home: 'http://localhost:8888',
        url: '',
        fileName: '',
        res: '',
        externalLink: 'data',
        externalLinkQiniu: 'key'
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
      disabled: false,
      hideLabel: false,
      hide: false,
      static: false,
      remoteType: 'datasource',
      remoteFunc: 'funcGetToken',
      remoteDataSource: '',
      customClass: [],
      validateConfig: {
        required: false
      },
      events: {
        uploadSuccess: '',
        uploadError: '',
        uploadRemove: ''
      }
    }]
  },
  {
    title: '布局字段',
    list: []
  }
]
