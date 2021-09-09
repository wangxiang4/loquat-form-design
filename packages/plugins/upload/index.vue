<template>
  <div class="loquat-upload">
    <el-upload :class="{ 'loquat-upload__list':listType=='picture-img', 'loquat-upload__disabled':disabled }"
               :action="action"
               :accept="acceptList"
               :multiple="multiple"
               :limit="limit"
               :drag="drag"
               :show-file-list="isPictureImg?false:showFileList"
               :list-type="listType"
               :disabled="disabled"
               :file-list="fileList"
               :http-request="httpUpload"
               :before-remove="handleBeforeRemove"
               :on-remove="handleRemove"
               :on-preview="handlePreview"
               :on-change="handleFileChange"
               :on-exceed="handleExceed"
               :on-error="handleError"
               :on-success="handleSuccess"
    >
      <template v-if="listType=='picture-card'">
        <i class="el-icon-plus"/>
      </template>
      <template v-else-if="listType=='picture-img'">
        <slot v-if="$scopedSlots.default" :file="{url:imgUrl}"/>
        <template v-else>
          <img v-if="imgUrl"
               :src="imgUrl"
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
               @click.stop="handlePreview({url:imgUrl})"
            />
            <i v-if="!disabled"
               class="el-icon-delete"
               @click.stop="handleAvatarRemove(imgUrl)"
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
import packages from '@/utils/packages'
import { getToken } from '@utils/qiniuOss'
import { getClient } from '@utils/aliOss'
import axios from 'loquat-axios'
import { detailImg } from '@utils/watermark'
import { getFileUrl, deepClone } from '@utils'
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
    params: {
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
    canvasOption: {
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
      reqs: {},
      menu: false
    }
  },
  computed: {
    homeUrl () {
      return this.uploadConfig.home || ''
    },
    urlKey () {
      return this.uploadConfig.url || 'url'
    },
    fileName () {
      return this.uploadConfig.fileName || 'file'
    },
    resKey () {
      return this.uploadConfig.res || ''
    },
    isQiniuOss () {
      return this.oss === 'qiniu'
    },
    isAliOss () {
      return this.oss === 'ali'
    },
    acceptList () {
      if (Array.isArray(this.accept)) {
        return this.accept.join(',')
      }
      return this.accept
    },
    fileList () {
      // 添加额外的参数
      return (this.text || []).map(ele => {
        const files = Object.assign(ele, {
          isImage: ele.isImage || this.$loquat.typeList.img.test(ele[this.urlKey]),
          url: getFileUrl(this.homeUrl, ele[this.urlKey] || ele.response?.[this.urlKey])
        })
        return files
      })
    },
    isPictureImg () {
      return this.listType === 'picture-img'
    },
    imgUrl () {
      if (!this.$loquat.validateNull(this.text)) {
        return getFileUrl(this.homeUrl, this.text[0]?.[this.urlKey] || this.text[0]?.response?.[this.urlKey])
      }
      return ''
    },
    imgParams () {
      if (this.$loquat.typeList.video.test(this.imgUrl)) {
        return Object.assign({
          is: 'video'
        }, this.params)
      }
      return this.params
    }
  },
  methods: {
    // 处理上传移除
    handleRemove (file, fileList) {
      this.uploadRemove && this.uploadRemove(file, fileList)
    },
    // 处理上传移除前
    handleBeforeRemove (file, fileList) {
      this.handleAbort(file)
      if (typeof this.uploadRemoveBefore === 'function') {
        return this.uploadRemoveBefore(file, fileList)
      } else {
        return Promise.resolve()
      }
    },
    // 处理预览
    handlePreview (file) {
      const callback = () => {
        const url = file.url
        const list = this.fileList.map(ele => Object.assign(ele, {
          type: this.$loquat.typeList.video.test(ele.url) ? 'video' : ''
        }))
        const index = this.fileList.findIndex(ele => ele.url === url)
        this.$loquat.imagePreview(list, index)
      }
      if (typeof this.uploadPreview === 'function') {
        this.uploadPreview(file, callback)
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
      let file = config.file
      const fileSize = file.size / 1024
      if (!this.$loquat.validateNull(fileSize) && fileSize > this.fileSize) {
        config.onError('文件太大不符合')
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
              config.onError('七牛云oss存储检测不存在CryptoJS文件')
              return
            }
            ossConfig = this.$loquat.qiniu
            const token = getToken(ossConfig.AK, ossConfig.SK, {
              scope: ossConfig.scope,
              deadline: new Date().getTime() + ossConfig.deadline * 3600
            })
            param.append('token', token)
            url = ossConfig.bucket
          // 阿里云oss存储
          } else if (this.isAliOss) {
            if (!window.OSS) {
              packages.logs('AliOSS')
              config.onError('阿里云oss存储检测不存在AliOSS文件')
              return
            }
            ossConfig = this.$loquat.ali
            client = getClient(ossConfig)
          }
          (() => {
            if (this.isAliOss) { // 使用aliOss客户端传输套接字
              return client.put(uploadFile.name, uploadFile, {
                headers: this.headers
              })
            } else { // 使用axios传输套接字
              return axios.post(url, param, {
                headers,
                onUploadProgress: function progress (e) {
                  if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100
                  }
                  config.onProgress(e)
                },
                cancelToken: new axios.CancelToken(c => { this.reqs[file.uid] = c }),
                withCredentials: this.withCredentials
              })
            }
          })()
            .then(res => {
              let responseData
              if (this.isQiniuOss) {
                res.data.key = ossConfig.url + res.data.key
              }

              if (this.isAliOss) {
                responseData = deepClone(this.$loquat.get(res, this.resKey, ''))
              } else {
                responseData = deepClone(this.$loquat.get(res.data, this.resKey, ''))
              }

              if (typeof this.uploadAfter === 'function') {
                this.uploadAfter(responseData, config.onSuccess(responseData))
              } else config.onSuccess(responseData)
            })
            .catch(error => {
              if (typeof this.uploadAfter === 'function') {
                this.uploadAfter(error, config.onError(error))
              } else config.onError(error)
            })
        }
        if (typeof this.uploadBefore === 'function') {
          this.uploadBefore(file, callback)
        } else callback()
      }
      // 是否开启水印
      if (!this.$loquat.validateNull(this.canvasOption)) {
        detailImg(file, this.canvasOption).then(res => {
          file = res
          done()
        })
      } else done()
    },
    // 处理上传成功
    handleSuccess (res, file, fileList) {
      this.uploadSuccess && this.uploadSuccess(res, file, fileList)
      delete this.reqs[file.uid]
    },
    // 处理文件修改
    handleFileChange (file, fileList) {
      this.text = fileList
    },
    // 处理上传超出扩展
    handleExceed (files, fileList) {
      this.uploadExceed && this.uploadExceed(this.limit, files, fileList)
    },
    // 处理上传异常扩展
    handleError (err, file, fileList) {
      this.uploadError && this.uploadError(err, file, fileList)
      delete this.reqs[file.uid]
    },
    // 处理头像移除操作
    handleAvatarRemove (file) {
      // 考虑到需要做后续处理所以决定把删除前函数抽出来
      this.handleBeforeRemove(file, this.text).then(() => {
        this.text = []
        this.menu = false
      }).catch(() => {
      })
    },
    // 处理取消请求,防止上传还没完成就删除文件
    handleAbort (file) {
      const { reqs } = this
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else { // 全部执行取消请求
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    }
  }
}
</script>
