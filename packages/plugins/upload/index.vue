<template>
  <div v-loading.lock="loading" class="loquat-upload">
    <el-upload :class="{ 'loquat-upload__img': isAvatarImg, 'loquat-upload__disabled': (disabled || !tokenOnline) }"
               :action="action"
               :accept="acceptList"
               :limit="limit"
               :drag="drag"
               :multiple="isAvatarImg?false:multiple"
               :show-file-list="isAvatarImg?false:showFileList"
               :list-type="listType"
               :disabled="disabled"
               :file-list="fileList"
               :style="customizeStyle"
               :http-request="httpUpload"
               :before-remove="handleBeforeRemove"
               :on-remove="handleRemove"
               :on-preview="handlePreview"
               :on-exceed="handleExceed"
               :on-change="handleFileChange"
    >
      <template v-if="listType=='picture-card'">
        <i class="el-icon-plus"/>
      </template>
      <template v-else-if="isAvatarImg">
        <slot v-if="$scopedSlots.default" :file="{url:avatarImgUrl}"/>
        <template v-else>
          <img v-if="avatarImgUrl"
               :src="avatarImgUrl"
               v-bind="imgParams"
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
               @click.stop="handlePreview({url:avatarImgUrl})"
            />
            <i v-if="!disabled"
               class="el-icon-delete"
               @click.stop="handleAvatarRemove(avatarImgUrl)"
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
import axios from 'loquat-axios'
import GlobalConfig from '@/global/config'
import { detailImg } from '@utils/watermark'
import ImagePreview from '@components/Helper/ImagePreview'
import { getFileUrl, byteCapacityCompute, urlJoin, get, validateNull, deepClone } from '@utils'
import { UPLOAD_CONFIG_PROPS, TYPE_LIST } from '@/global/variable'
export default {
  name: 'Upload',
  inheritAttrs: false,
  props: {
    value: { type: Array },
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
      default: () => UPLOAD_CONFIG_PROPS
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fileSize: {
      type: Number
    },
    byteUnit: {
      type: String,
      default: 'KB'
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
    dic: {
      type: String,
      default: ''
    },
    showCanvas: {
      type: Boolean,
      default: false
    },
    canvasOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 跨域提供凭证,一般用于跨域携带cookie
    withCredentials: {
      type: Boolean,
      default: false
    },
    domain: {
      type: String,
      default: ''
    },
    stringMode: {
      type: Boolean,
      default: false
    },
    customizeStyle: {
      type: Object
    },
    uploadRemove: Function,
    uploadRemoveBefore: Function,
    uploadPreview: Function,
    uploadSuccess: Function,
    uploadError: Function,
    uploadAfter: Function,
    uploadBefore: Function,
    uploadExceed: Function,
    httpRequest: Function
  },
  data () {
    return {
      text: [],
      menu: false,
      loading: false,
      tokenOnline: false,
      uploadConfigDefault: UPLOAD_CONFIG_PROPS
    }
  },
  computed: {
    homeUrl () {
      return this.uploadConfig.home || this.uploadConfigDefault.home
    },
    fileName () {
      return this.uploadConfig.fileName || this.uploadConfigDefault.fileName
    },
    resKey () {
      return this.uploadConfig.res || this.uploadConfigDefault.res
    },
    resUrlKey () {
      return this.uploadConfig.resUrl || this.uploadConfigDefault.resUrl
    },
    nameKey: function () {
      return this.uploadConfig.name || this.uploadConfigDefault.name
    },
    urlKey: function () {
      return this.uploadConfig.url || this.uploadConfigDefault.url
    },
    isQiniuOss () {
      return this.oss === 'qiniu'
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
          // 处理单个url链接取最后为label
          if (this.getStringMode) name = ele.substring(ele.lastIndexOf('/') + 1)
          list.push({
            uid: index + '',
            status: 'done',
            name: this.getStringMode ? name : ele[this.nameKey],
            url: getFileUrl(this.homeUrl, this.getStringMode ? ele : ele[this.urlKey])
          })
        }
      })
      return list
    },
    isAvatarImg () {
      return this.listType === 'picture-img'
    },
    avatarImgUrl () {
      return !validateNull(this.text) && getFileUrl(this.homeUrl, this.text[0])
    },
    getStringMode () {
      return this.isAvatarImg ? true : this.stringMode
    },
    imgParams () {
      if (TYPE_LIST.video.test(this.avatarImgUrl)) {
        return Object.assign({
          is: 'video'
        }, this.params)
      }
      return this.params
    },
    previewFileListMode () {
      return (this.listType !== 'picture-card' && !this.isAvatarImg)
    }
  },
  watch: {
    text: {
      handler (n) {
        this.handleChange(n)
      }
    },
    value: {
      handler () {
        this.initVal()
      }
    },
    dic: {
      handler (n) {
        if (this.oss && validateNull(n)) {
          this.tokenOnline = false
        } else this.tokenOnline = true
      },
      immediate: true
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    initVal () {
      this.text = this.value
    },
    // 处理上传外部链接地址
    handleExternalLinkUrl (response) {
      if (this.isQiniuOss) {
        return urlJoin(this.domain, response.key)
      } else {
        return get(response, this.resUrlKey, '')
      }
    },
    // 处理上传移除
    handleRemove (file, fileList) {
      this.fileList.forEach((ele, index) => {
        if (ele.uid === file.uid) this.text.splice(index, 1)
      })
      this.uploadRemove && this.uploadRemove(file, fileList)
    },
    // 处理上传移除前
    handleBeforeRemove (file, fileList) {
      if (typeof this.uploadRemoveBefore === 'function') {
        return this.uploadRemoveBefore(file, fileList, this.column)
      } else {
        return Promise.resolve()
      }
    },
    // 处理预览
    handlePreview (file) {
      const callback = () => {
        const url = file.url
        // 处理如果是目前文件是列表显示直接利用浏览器预览
        if (this.previewFileListMode) {
          window.open(url)
        } else {
          // 使用预览组件查看
          const list = deepClone(this.fileList)
          const index = list.findIndex(ele => ele.url === url)
          const imagePreview = ImagePreview(this)
          imagePreview(list, index)
        }
      }
      if (typeof this.uploadPreview === 'function') {
        this.uploadPreview(file, this.column, callback)
      } else {
        callback()
      }
    },
    // 扩展内部文件上传
    httpUpload (config) {
      if (typeof this.httpRequest === 'function') {
        this.httpRequest(config)
        return
      }
      this.loading = true
      let file = config.file
      const originFile = config.file
      const fileSize = byteCapacityCompute(file.size, this.byteUnit)
      if (!validateNull(fileSize) && fileSize > this.fileSize) {
        this.handleError('文件太大不符合')
        return
      }
      const done = () => {
        let ossConfig = {}
        let url = this.action
        let withCredentials = this.withCredentials
        const param = new FormData()
        const headers = Object.assign(this.headers, { 'Content-Type': 'multipart/form-data' })
        const callback = (newFile) => {
          for (const o in this.data) param.append(o, this.data[o])
          const uploadFile = newFile || file;
          // 开始发送请求上传文件
          (() => {
            param.append(this.fileName, uploadFile)
            // 使用七牛OSS请求数据处理
            if (this.isQiniuOss) {
              param.append('token', this.dic)
              ossConfig = GlobalConfig.qiniu
              url = ossConfig.up
              withCredentials = false
            }
            return axios.post(url, param, {
              headers,
              withCredentials
            })
          })().then(res => {
            const responseData = get(res.data, this.resKey, '')
            // 成功调用外部提供上传后接口
            if (typeof this.uploadAfter === 'function') {
              this.uploadAfter(
                responseData,
                this.handleSuccess(responseData, uploadFile),
                () => { this.loading = false },
                this.column
              )
            } else this.handleSuccess(responseData, uploadFile)
          }).catch(error => {
            // 异常调用外部提供上传后接口
            if (typeof this.uploadAfter === 'function') {
              this.uploadAfter(
                error,
                this.handleError,
                () => { this.loading = false },
                this.column
              )
            } else this.handleError(error)
          })
        }
        if (typeof this.uploadBefore === 'function') {
          this.uploadBefore(
            originFile,
            callback,
            () => { this.loading = false },
            this.column
          )
        } else callback()
      }
      // 是否开启水印,注意只有图片类型可以开启水印
      if (this.showCanvas && file.type.indexOf('image') !== -1) {
        detailImg(file, this.canvasOption).then(res => {
          file = res
          done()
        })
      } else done()
    },
    // 处理上传成功
    handleSuccess (res, uploadFile) {
      this.loading = false
      const url = this.handleExternalLinkUrl(res)
      if (this.isAvatarImg) {
        this.text.splice(0, 1, url)
      } else if (this.getStringMode) {
        this.text.push(url)
      } else {
        this.text.push({ [this.nameKey]: uploadFile.name, [this.urlKey]: url })
      }
      this.uploadSuccess && this.uploadSuccess(res, uploadFile, this.fileList, this.column)
    },
    // 处理上传超出扩展
    handleExceed (files, fileList) {
      this.uploadExceed && this.uploadExceed(this.limit, files, fileList, this.column)
    },
    // 处理上传异常扩展
    handleError (err) {
      this.loading = false
      this.uploadError && this.uploadError(err, this.fileList, this.column)
    },
    // 处理头像移除操作
    handleAvatarRemove (file) {
      this.handleBeforeRemove(file, this.fileList).then(() => {
        this.text = []
        this.menu = false
      }).catch(() => {
      })
    },
    handleChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleFileChange (file, fileList) {
      fileList.splice(fileList.length - 1, 1)
    }
  }
}
</script>
