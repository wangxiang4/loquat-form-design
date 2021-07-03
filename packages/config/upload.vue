<template>
  <div>
    <el-form-item v-if="!data.oss"
                  label="上传地址"
    >
      <el-input v-model="data.action"
                clearable
                placeholder="上传地址"
      />
    </el-form-item>
    <el-form-item v-if="!data.oss"
                  label="接受文件类型"
                  label-width="110px"
    >
      <el-input v-model="data.accept"
                clearable
                placeholder="接受文件类型，如：image/png,image/jpg"
      />
    </el-form-item>
    <el-form-item label="OSS">
      <template slot="label">
        <el-link :underline="false"
                 href="https://avuejs.com/doc/form/form-upload-qiniu"
                 target="_blank"
        >OSS <i class="el-icon-question"/></el-link>
      </template>
      <el-select v-model="data.oss"
                 placeholder="oss不写则为普通上传"
                 clearable
                 style="width: 100%"
      >
        <el-option label="阿里"
                   value="ali"
        />
        <el-option label="七牛"
                   value="qiniu"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="是否拖拽上传"
                  label-width="110px"
    >
      <el-switch v-model="data.drag"/>
    </el-form-item>
    <el-form-item v-if="!data.drag"
                  label="文件列表类型"
                  label-width="110px"
    >
      <el-select v-model="data.listType"
                 placeholder="文件列表类型"
                 clearable
      >
        <el-option label="附件"
                   value="text"
        />
        <el-option label="照片墙"
                   value="picture-card"
        />
        <el-option label="头像"
                   value="picture-img"
        />
        <el-option label="缩略图"
                   value="picture"
        />
      </el-select>
    </el-form-item>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;"
      >参数设置：</label>
      <div class="el-form-item__content">
        请求头
        <avue-dynamic v-model="data.headersConfig"
                      :children="option"
        />
        请求体
        <avue-dynamic v-model="data.dataConfig"
                      :children="option"
        />
      </div>
    </div>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;"
      >
        <el-link :underline="false"
                 href="https://avuejs.com/doc/form/form-upload"
                 target="_blank"
        >上传参数设置 <i class="el-icon-question"/></el-link>
      </label>
      <div class="el-form-item__content">
        上传成功返回结构体的图片地址
        <el-input v-model="data.propsHttp.url"
                  size="small"
                  placeholder="上传成功返回结构体的图片地址"
        />
        上传成功返回结构体的图片的姓名
        <el-input v-model="data.propsHttp.name"
                  size="small"
                  placeholder="上传成功返回结构体的图片的姓名"
        />
        返回结构体的层次
        <el-input v-model="data.propsHttp.res"
                  size="small"
                  placeholder="返回结构体的层次"
        />
        文件名称
        <el-input v-model="data.propsHttp.fileName"
                  size="small"
                  placeholder="文件名称，默认file"
        />
      </div>
    </div>
    <el-form-item label="是否显示已上传文件列表"
                  label-width="180px"
    >
      <el-switch v-model="data.showFileList"/>
    </el-form-item>
    <el-form-item label="文件大小">
      <el-input-number v-model="data.fileSize"
                       controls-position="right"
                       placeholder="文件大小限制（字节）"
                       :min="0"
                       style="width: 100%;"
      />
    </el-form-item>
    <el-form-item label="上传限制提示"
                  label-width="110px"
    >
      <el-input v-model="data.tip"
                clearable
                placeholder="上传限制提示"
      />
    </el-form-item>
    <el-form-item label="上传中提示"
                  label-width="110px"
    >
      <el-input v-model="data.loadText"
                clearable
                placeholder="上传中提示"
      />
    </el-form-item>
    <el-form-item label="是否多文件上传"
                  label-width="130px"
    >
      <el-switch v-model="data.multiple"/>
    </el-form-item>
    <el-form-item v-if="data.multiple"
                  label="多文件数量限制"
                  label-width="130px"
    >
      <el-input-number v-model="data.limit"
                       controls-position="right"
                       placeholder="多文件上传数量限制"
                       :min="1"
                       style="width: 100%;"
      />
    </el-form-item>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;"
      >水印设置：</label>
      <div class="el-form-item__content">
        水印文字
        <el-input v-model="data.canvasOption.text"
                  size="small"
                  clearable
                  placeholder="水印文字"
        />
        字体类型
        <el-input v-model="data.canvasOption.fontFamily"
                  size="small"
                  clearable
                  placeholder="字体类型"
        />
        字体颜色
        <avue-input-color v-model="data.canvasOption.color"
                          size="small"
                          placeholder="字体颜色"
        />
        字体大小
        <el-input-number v-model="data.canvasOption.fontSize"
                         size="small"
                         controls-position="right"
                         placeholder="字体大小"
        />
        文字的透明度
        <el-input-number v-model="data.canvasOption.opacity"
                         size="small"
                         controls-position="right"
                         placeholder="文字的透明度"
                         :step="10"
                         :min="10"
                         :max="100"
        />
        文字距离图片底部的距离<br>
        <el-input-number v-model="data.canvasOption.bottom"
                         controls-position="right"
                         placeholder="文字距离图片底部的距离"
                         size="small"
        />
        文字距离图片右边的距离<br>
        <el-input-number v-model="data.canvasOption.right"
                         controls-position="right"
                         placeholder="文字距离图片右边的距离"
                         size="small"
        />
        压缩图片比率<br>
        <el-input-number v-model="data.canvasOption.ratio"
                         controls-position="right"
                         placeholder="压缩图片比率"
                         :step="0.1"
                         :min="0"
                         :max="1"
                         size="small"
        />
      </div>
    </div>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"/>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"/>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'ConfigUpload',
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
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null
      },
      option: {
        column: [{
          type: 'input',
          prop: 'key',
          label: 'key'
        }, {
          type: 'input',
          prop: 'value',
          label: 'value'
        }]
      }
    }
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `${this.data.label}必须填写` }
      else this.validator.required = null

      this.generateRule()
    },
    'data.drag': function (val) {
      if (val) delete this.data.listType
    }
  },
  methods: {
    generateRule () {
      const rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) rules.push(this.validator[key])
      })
      this.data.rules = rules
    }
  }
}
</script>
