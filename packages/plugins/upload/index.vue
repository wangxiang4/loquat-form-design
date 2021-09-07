<template>
  <div v-loading.lock="loading" class="loquat-upload">
    <el-upload :class="{'loquat-upload__list':listType=='picture-img','upload':disabled}"
               :action="action"
               :on-remove="handleRemove"
               :accept="acceptList"
               :before-remove="beforeRemove"
               :multiple="multiple"
               :on-preview="handlePreview"
               :limit="limit"
               :http-request="httpUpload"
               :drag="drag"
               :show-file-list="isPictureImg?false:showFileList"
               :list-type="listType"
               :on-change="handleFileChange"
               :on-exceed="handleExceed"
               :disabled="disabled"
               :file-list="fileList"
               @click.native="handleClick"
    >
      <template v-if="listType=='picture-card'">
        <i class="el-icon-plus"/>
      </template>
      <template v-else-if="listType=='picture-img'">
        <slot v-if="$scopedSlots.default" :file="{url:imgUrl}"/>
        <template v-else>
          <img v-if="imgUrl"
               :src="imgUrl"
               v-bind="allParams"
               class="loquat-upload__avatar"
               @mouseover="menu=true"
          >
          <i v-else class="el-icon-plus loquat-upload__icon"/>
          <div v-if="menu"
               class="el-upload-list__item-actions loquat-upload__menu"
               @mouseover="menu=true"
               @mouseout="menu=false"
               @click.stop="()=>{return false}"
          >
            <i class="el-icon-zoom-in"
               @click.stop="handlePreview({url:imgUrl})"
            />
            <i v-if="!disabled"
               class="el-icon-delete"
               @click.stop="handleDelete(imgUrl)"
            />
          </div>
        </template>
      </template>
      <template v-else-if="drag">
        <i class="el-icon-upload"/>
        <div class="el-upload__text">
          {{ '将文件拖到此处，或' }}
          <em>{{ '点击上传' }}</em>
        </div>
      </template>
      <template v-else>
        <el-button size="small" type="primary">{{ '点击上传' }}</el-button>
      </template>
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
      <template v-if="$scopedSlots.default" slot="file" slot-scope="scope">
        <slot v-bind="scope"/>
      </template>
    </el-upload>
  </div>
</template>

<script>
import { bindEvent } from '@utils/plugins'
import packages from '@/utils/packages'
import { getToken } from '@utils/qiniuOss'
import { getClient } from '@utils/aliOss'
import { DIC_PROPS } from '@/global/variable'
import axios from 'axios'
import { detailImg } from '@utils/watermark'
export default {
  name: 'Upload',
  props: {
    listType: {
      type: String
    },
    action: {
      type: String,
      default: ''
    },
    accept: {
      type: [String, Array],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    drag: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: ''
    },
    uploadConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // img属性绑定参数
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 当前传入进来的表单item数据
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fileSize: {
      type: Number
    },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    oss: {
      type: String
    },
    props: {
      type: Object,
      default: () => DIC_PROPS
    },
    canvasOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onRemove: Function,
    uploadDelete: Function,
    uploadPreview: Function,
    httpRequest: Function,
    uploadError: Function,
    uploadAfter: Function,
    uploadBefore: Function,
    uploadExceed: Function
  },
  data () {
    return {
      res: '',
      loading: false,
      text: [],
      file: {},
      menu: false,
      propsDefault: DIC_PROPS
    }
  },
  computed: {
    homeUrl () {
      return this.uploadConfig.home || ''
    },
    fileName () {
      return this.uploadConfig.fileName || 'file'
    },
    resKey: function () {
      return this.uploadConfig.res || ''
    },
    urlKey: function () {
      return this.uploadConfig.url || 'url'
    },
    nameKey: function () {
      return this.uploadConfig.name || 'name'
    },
    isQiniuOss () {
      return this.oss === 'qiniu'
    },
    isAliOss () {
      return this.oss === 'ali'
    },
    isArrayStringMode () {
      return this.text.every(el => typeof el === 'string')
    },
    labelKey: function () {
      return this.props.label || this.propsDefault.label
    },
    valueKey: function () {
      return this.props.value || this.propsDefault.value
    },
    acceptList () {
      if (Array.isArray(this.accept)) {
        return this.accept.join(',')
      }
      return this.accept
    },
    fileList () {
      const list = [];
      (this.text || []).forEach((ele, index) => {
        if (ele) {
          let name
          // 处理单个url链接取最后为label,当label名字获取不到时使用(备用)
          if (typeof ele === 'string') {
            const i = ele.lastIndexOf('/')
            name = ele.substring(i + 1)
          }
          list.push({
            uid: index + '',
            status: 'done',
            isImage: ele.isImage || this.$loquat.typeList.img.test(ele[this.valueKey] || ele),
            name: ele[this.labelKey] || name,
            url: getFileUrl(this.homeUrl, ele[this.valueKey] || ele)
          })
        }
      })
      return list
    },
    isPictureImg () {
      return this.listType === 'picture-img'
    },
    // 单个头像图片
    imgUrl () {
      if (!this.$loquat.validateNull(this.text)) {
        return getFileUrl(this.homeUrl, this.text[0])
      }
      return ''
    },
    allParams () {
      if (this.$loquat.typeList.video.test(this.imgUrl)) {
        return Object.assign({
          is: 'video'
        }, this.params)
      }
      return this.params
    }
  },
  methods: {
    handleClick (event) {
      bindEvent(this, 'click', event)
    },
    handleRemove (file, fileList) {
      this.onRemove && this.onRemove(file, fileList)
      this.delete(file)
    },
    beforeRemove (file) {
      if (typeof this.uploadDelete === 'function') {
        return this.uploadDelete(file, this.column)
      } else {
        return Promise.resolve()
      }
    },
    handlePreview (file) {
      const callback = () => {
        const url = file.url
        const list = this.fileList.map(ele => Object.assign(ele, {
          type: this.$loquat.typeList.video.test(ele.url) ? 'video' : ''
        }))
        const index = this.fileList.findIndex(ele => {
          return ele.url === url
        })
        this.$loquat.imagePreview(list, index)
      }
      if (typeof this.uploadPreview === 'function') {
        this.uploadPreview(file, this.column, callback)
      } else {
        callback()
      }
    },
    httpUpload (config) {
      if (typeof this.httpRequest === 'function') {
        this.httpRequest(config)
        return
      }
      this.loading = true
      let file = config.file
      const fileSize = file.size / 1024
      this.file = config.file
      if (!this.$loquat.validateNull(fileSize) && fileSize > this.fileSize) {
        this.hide('文件太大不符合')
        return
      }
      const headers = Object.assign(this.headers, { 'Content-Type': 'multipart/form-data' })
      // oss配置属性
      let ossConfig = {}
      let client = {}
      const param = new FormData()
      const done = () => {
        const callback = (newFile) => {
          let url = this.action
          // 附加属性
          for (const o in this.data) {
            param.append(o, this.data[o])
          }
          const uploadFile = newFile || file
          param.append(this.fileName, uploadFile)
          // 七牛云oss存储
          if (this.isQiniuOss) {
            if (!window.CryptoJS) {
              packages.logs('CryptoJS')
              this.hide()
              return
            }
            ossConfig = this.$loquat.qiniu
            const token = getToken(ossConfig.AK, ossConfig.SK, {
              scope: ossConfig.scope,
              deadline: new Date().getTime() + ossConfig.deadline * 3600
            })
            param.append('token', token)
            url = ossConfig.bucket
          } else if (this.isAliOss) {
            if (!window.OSS) {
              packages.logs('AliOSS')
              this.hide()
              return
            }
            ossConfig = this.$loquat.ali
            client = getClient(ossConfig)
          }
          (() => {
            if (this.isAliOss) {
              return client.put(uploadFile.name, uploadFile, {
                headers: this.headers
              })
            } else {
              return axios.post(url, param, { headers })
            }
          })()
            .then(res => {
              this.res = {}
              if (this.isQiniuOss) {
                res.data.key = ossConfig.url + res.data.key
              }

              if (this.isAliOss) {
                this.res = this.$loquat.get(res, this.resKey, '')
              } else {
                this.res = this.$loquat.get(res.data, this.resKey, '')
              }

              if (typeof this.uploadAfter === 'function') {
                this.uploadAfter(
                  this.res,
                  this.show,
                  () => {
                    this.loading = false
                  },
                  this.column
                )
              } else this.show(this.res)
            })
            .catch(error => {
              if (typeof this.uploadAfter === 'function') {
                this.uploadAfter(error, this.hide, () => {
                  this.loading = false
                }, this.column)
              } else this.hide(error)
            })
        }
        if (typeof this.uploadBefore === 'function') {
          this.uploadBefore(this.file, callback, () => {
            this.loading = false
          }, this.column)
        } else callback()
      }
      // 是否开启水印
      if (!this.$loquat.validateNull(this.canvasOption)) {
        detailImg(file, this.canvasOption).then(res => {
          file = res
          done()
        })
      } else {
        done()
      }
    },
    handleFileChange (file, fileList) {
      fileList.splice(fileList.length - 1, 1)
    },
    handleExceed (files, fileList) {
      this.uploadExceed && this.uploadExceed(this.limit, files, fileList, this.column)
    },
    handleDelete (file) {
      this.beforeRemove(file).then(() => {
        this.text = []
        this.menu = false
      }).catch(() => {
      })
    },
    hide (msg) {
      this.loading = false
      this.handleError(msg)
    },
    handleError (error) {
      this.uploadError && this.uploadError(error, this.column)
    },
    show (data) {
      this.loading = false
      this.handleSuccess(data || this.res)
    },
    handleSuccess (file) {
      if (this.isPictureImg) {
        this.text.splice(0, 1, file[this.urlKey])
      } else if (this.isArrayStringMode) {
        this.text.push(file[this.urlKey])
      } else {
        const obj = {}
        obj[this.labelKey] = file[this.nameKey]
        obj[this.valueKey] = file[this.urlKey]
        this.text.push(obj)
      }
    }
  }
}

function getFileUrl (home, uri = '') {
  return uri.match(/(^http:\/\/|^https:\/\/|^\/\/|data:image\/)/) ? uri : home + uri
}
</script>
