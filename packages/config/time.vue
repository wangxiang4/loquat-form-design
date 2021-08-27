<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'customizeStyle.width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-if="!data.isRange" v-loquat-has-perm="[originData, 'placeholder']" label="占位内容">
      <el-input v-model="data.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-if="data.isRange" v-loquat-has-perm="[originData, 'startPlaceholder']" label="开始时间占位内容">
      <el-input v-model="data.startPlaceholder"
                clearable
                placeholder="开始时间占位内容"
      />
    </el-form-item>
    <el-form-item v-if="data.isRange" v-loquat-has-perm="[originData, 'endPlaceholder']" label="结束时间占位内容">
      <el-input v-model="data.endPlaceholder"
                clearable
                placeholder="结束时间占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'valueFormat']" label="值格式化">
      <el-input v-model="data.valueFormat" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'format']" label="显示格式化">
      <el-input v-model="data.format" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'value']" label="默认值">
      <el-time-picker v-model="data.value"
                      style="width: 100%;"
                      clearable
                      :arrow-control="data.arrowControl"
                      :value-format="data.format"
                      :is-range="data.isRange"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'customClass']" label="自定义Class">
      <el-select v-model="data.customClass"
                 style="width: 100%;"
                 filterable
                 allow-create
                 default-first-option
                 multiple
                 laceholder="请选择"
      >
        <el-option v-for="item in home.styleSheetsArray"
                   :key="item"
                   :label="item"
                   :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[originData, 'readonly']" :span="operationComputedSpan">
          <el-checkbox v-model="data.readonly">只读</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="data.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'editable']" :span="operationComputedSpan">
          <el-checkbox v-model="data.editable">文本框可输入</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'isRange']" :span="operationComputedSpan">
          <el-checkbox v-model="data.isRange"
                       @change="$set(data, 'value', '')"
          >是否为范围选择</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'clearable']" :span="operationComputedSpan">
          <el-checkbox v-model="data.clearable">显示清除按钮</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'arrowControl']" :span="24">
          <el-checkbox v-model="data.arrowControl">使用箭头进行时间选择</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'validateConfig.required']" label="校验">
      <div class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!$loquat.validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${$loquat.get(EVENT_DICT, key, '')}`"
                            :name="key"
          >
            <div class="event-panel-item">
              <el-select v-model="data.events[key]"
                         size="mini"
                         style="width: 100%; margin-bottom: 5px;"
              >
                <el-option v-for="item in home.widgetForm.eventScript"
                           :key="item.key"
                           :label="item.name"
                           :value="item.name"
                />
              </el-select>
              <i title="编辑代码" class="iconfont icon-code-generation" @click.stop="home.handleActionSettingsSetData({ eventName: key, funcName: val })"/>
              <i title="删除" class="iconfont icon-trash" @click.stop="data.events[key] = ''"/>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dropdown style="width: 100%; margin-top: 5px;"
                     placement="bottom"
                     trigger="click"
        >
          <el-button size="mini"
                     type="primary"
                     plain
                     style="width: 100%;"
          >新增动作<i class="el-icon-plus"/>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 280px;">
            <el-dropdown-item v-for="(val,key,index) in data.events"
                              :key="index"
                              :disabled="!!val"
                              @click.native="() => {
                                home.handleActionSettingsSetData({ eventName: key })
                                home.handleActionAdd()
                              }"
            >{{ `${key} ${$loquat.get(EVENT_DICT, key, '')}` }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { EVENT_DICT } from '@/global/variable'
export default {
  name: 'Time',
  props: {
    data: {
      type: Object
    },
    home: {
      type: Object
    }
  },
  data () {
    return {
      EVENT_DICT,
      operationComputedSpan: 24 / 2,
      operationPerm: [
        'readonly',
        'disabled',
        'hide',
        'hideLabel',
        'editable',
        'isRange',
        'clearable',
        'arrowControl'
      ]
    }
  },
  computed: {
    originData () {
      return this.$loquat.deepClone(this.data)
    },
    validateConfig () {
      return this.data.validateConfig || {}
    },
    customizeStyle () {
      return this.data.customizeStyle || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.data.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  }
}
</script>
