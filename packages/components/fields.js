export default [
  {
    title: '基础字段',
    list: [{
      type: 'input',
      label: '单行文本',
      icon: 'icon-input',
      _type: undefined,
      labelWidth: undefined,
      placeholder: undefined,
      value: undefined,
      prepend: undefined,
      append: undefined,
      style: {
        width: '100%'
      },
      maxlength: undefined,
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
      labelWidth: undefined,
      placeholder: undefined,
      value: undefined,
      style: {
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
      type: 'select',
      label: '下拉选择',
      icon: 'icon-select',
      value: undefined,
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: undefined,
      validateConfig: {
        required: false
      },
      showLabel: false,
      style: {
        width: '100%'
      },
      dicData: [
        { label: '选项一', value: 'Option 1' },
        { label: '选项二', value: 'Option 2' },
        { label: '选项三', value: 'Option 3' }
      ],
      static: true,
      remoteType: undefined,
      remoteOption: 'optionDefault',
      filterable: false,
      props: {
        label: 'label',
        value: 'value'
      },
      remoteFunc: 'funcDefault',
      customClass: [],
      labelWidth: undefined,
      hideLabel: false,
      hide: false,
      remoteDataSource: undefined,
      drag: false,
      events: {
        change: '',
        focus: '',
        blur: ''
      }
    }]
  },
  {
    title: '高级字段',
    list: []
  },
  {
    title: '布局字段',
    list: []
  }
]
