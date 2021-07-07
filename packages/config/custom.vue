<template>
  <div>
    <el-form-item label="标题宽度">
      <el-input v-model="data.labelWidth"
                clearable
                placeholder="标题宽度"
      />
    </el-form-item>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;"
      >自定义属性：</label>
      <div class="el-form-item__content">
        <ace-editor
          v-model="test"
          lang="html"
          theme="ambiance"
          style="height: 300px"
        />
      </div>
    </div>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;"
      >自定义事件：</label>
      <div class="el-form-item__content">
        <!--<monaco-editor v-model="event"
                       height="300"
                       :key-index="data.prop"
                       :options="options"
        />-->
      </div>
    </div>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
  </div>
</template>
<script>
import AceEditor from 'v-ace-editor'

export default {
  name: 'ConfigCustom',
  components: { AceEditor },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      test: '',
      params: this.data.params || {},
      event: this.data.event || {},
      options: {
        minimap: {
          enabled: false
        }
      }
    }
  },
  watch: {
    'data.params' (val) {
      this.params = val || {}
    },
    'data.event' (val) {
      this.event = val || {}
    },
    params (val) {
      try {
        this.data.params = eval('(' + val + ')')
      } catch (e) {
        // console.error(e)
      }
    },
    event (val) {
      try {
        this.data.event = eval('(' + val + ')')
      } catch (e) {
        // console.error(e)
      }
    }
  },
  methods: {
  }
}
</script>
