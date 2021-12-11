<template>
  <div>
    <child-form v-model="data"
                :option="option"
    />
  </div>
</template>

<script>
import childForm from '../packages/plugins/child-form'
export default {
  name: 'LoquatUploadDemo',
  components: { childForm },
  data () {
    return {
      option: {
        'column': [{
          'type': 'input',
          'label': '单行文本',
          'labelWidth': '',
          'hide': false,
          'hideLabel': false,
          'customClass': [],
          'validateConfig': {
            'required': false,
            'type': false,
            'pattern': false
          },
          'events': {
            'change': '',
            'focus': '',
            'blur': ''
          },
          'plugin': {
            'type': 'text',
            'value': '',
            'prepend': '',
            'append': '',
            'maxlength': '',
            'placeholder': '',
            'readonly': false,
            'showWordLimit': false,
            'disabled': false,
            'showPassword': false,
            'customizeStyle': {
              'width': '100%'
            }
          },
          'prop': 'input_j5vFQOMI'
        }],
        'labelPosition': 'right',
        'labelWidth': 90,
        'size': 'small',
        'styleSheets': '',
        'customClass': [],
        'eventScript': [{
          'key': 'mounted',
          'name': 'mounted',
          'func': ''
        }],
        'dataSource': [{
          'key': 'upload',
          'name': 'Get Upload Token',
          'url': 'http://tools-server.making.link/api/uptoken',
          'method': 'GET',
          'auto': true,
          'thirdPartyAxios': false,
          'headers': {},
          'params': {},
          'requestFunc': 'return config;',
          'responseFunc': 'return res.uptoken;',
          'errorFunc': ''
        }, {
          'key': 'options',
          'name': 'Get Options',
          'url': 'http://tools-server.making.link/api/new/options',
          'method': 'GET',
          'auto': true,
          'thirdPartyAxios': false,
          'headers': {},
          'params': {},
          'requestFunc': 'return config;',
          'responseFunc': 'return res.data;',
          'errorFunc': ''
        }]
      },
      data: []
    }
  }
}
</script>

<style scoped>

</style>
