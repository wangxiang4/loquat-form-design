<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'label']" label="标题">
      <el-input v-model="column.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="column.labelWidth" type="number" placeholder="请输入标签宽度"/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[customizeStyle, 'width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'type']" label="显示类型" >
      <el-select v-model="plugin.type"
                 clearable
                 style="width: 100%;"
                 @change="() => {
                   $set(plugin, 'value', '')
                   $set(plugin, 'format', handleFormatType(plugin.type,1))
                   $set(plugin, 'valueFormat', handleFormatType(plugin.type,0))
                 }"
      >
        <el-option value="year"/>
        <el-option value="month"/>
        <el-option value="date"/>
        <el-option value="dates"/>
        <el-option value="datetime"/>
        <el-option value="datetimerange"/>
        <el-option value="daterange"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="!plugin.type.includes('range')" v-loquat-has-perm="[plugin, 'placeholder']" label="占位内容">
      <el-input v-model="plugin.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-if="plugin.type.includes('range')" v-loquat-has-perm="[plugin, 'startPlaceholder']" label="开始时间占位内容">
      <el-input v-model="plugin.startPlaceholder"
                clearable
                placeholder="开始时间占位内容"
      />
    </el-form-item>
    <el-form-item v-if="plugin.type.includes('range')" v-loquat-has-perm="[plugin, 'endPlaceholder']" label="结束时间占位内容">
      <el-input v-model="plugin.endPlaceholder"
                clearable
                placeholder="结束时间占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'valueFormat']" label="值格式化">
      <el-input v-if="!column.timestamp"
                v-model="plugin.valueFormat"
                clearable
      />
      <el-input v-else
                :value="$set(plugin, 'valueFormat', 'timestamp')"
                :disabled="true"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'format']" label="显示格式化">
      <el-input v-model="plugin.format" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'value']" label="默认值">
      <el-date-picker v-if="!plugin.type.includes('range')"
                      v-model="plugin.value"
                      key="1"
                      style="width: 100%;"
                      :type="plugin.type"
                      :value-format="plugin.valueFormat"
                      :format="plugin.format"
      />
      <el-date-picker v-if="plugin.type.includes('range')"
                      v-model="plugin.value"
                      key="2"
                      style="width: 100%;"
                      :type="plugin.type"
                      :value-format="plugin.valueFormat"
                      :format="plugin.format"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'customClass']" label="自定义Class">
      <el-select v-model="column.customClass"
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
    <el-form-item v-loquat-has-perm="[column, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[plugin, 'readonly']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.readonly">只读</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'editable']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.editable">文本框可输入</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'clearable']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.clearable">显示清除按钮</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'timestamp']" :span="operationComputedSpan">
          <el-checkbox v-model="column.timestamp"
                       @change="(check) => {
                         $set(plugin, 'value', '')
                         check || $set(plugin, 'valueFormat', handleFormatType(plugin.type,0))
                       }"
          >是否获取时间戳</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[validateConfig, 'required']" label="校验">
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
    <el-form-item v-loquat-has-perm="[column, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!$loquat.validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${$loquat.get(eventsDic, key, '')}`"
                            :name="key"
          >
            <div class="event-panel-item">
              <el-select v-model="column.events[key]"
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
              <i title="删除" class="iconfont icon-trash" @click.stop="column.events[key] = ''"/>
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
            <el-dropdown-item v-for="(val,key,index) in column.events"
                              :key="index"
                              :disabled="!!val"
                              @click.native="() => {
                                home.handleActionSettingsSetData({ eventName: key })
                                home.handleActionAdd()
                              }"
            >{{ `${key} ${$loquat.get(eventsDic, key, '')}` }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { EVENTS_DIC } from '@/global/variable'
export default {
  name: 'Date',
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
      first: false,
      eventsDic: EVENTS_DIC,
      operationComputedSpan: 24 / 2,
      operationPerm: [
        'readonly',
        'disabled',
        'hide',
        'hideLabel',
        'editable',
        'clearable'
      ]
    }
  },
  computed: {
    column () {
      return this.first ? this.data : {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    customizeStyle () {
      return this.plugin.customizeStyle || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.column.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  },
  mounted () {
    this.first = true
  },
  methods: {
    // 获取格式类型,可以通过设置选择显示格式(1)或值格式(0)
    handleFormatType (type, option) {
      switch (type) {
        case 'year':
          return option ? 'yyyy' : 'yyyy'
        case 'week':
          return option ? 'yyyy 第 WW 周' : 'yyyy-MM-dd HH:mm:ss'
        case 'month':
        case 'monthrange':
          return option ? 'yyyy-MM' : 'yyyy-MM'
        case 'date':
        case 'dates':
        case 'daterange':
          return option ? 'yyyy-MM-dd' : 'yyyy-MM-dd'
        case 'datetime':
        case 'datetimerange':
          return option ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm:ss'
      }
    }
  }
}
</script>
