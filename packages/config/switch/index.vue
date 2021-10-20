<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'value']" label="默认值">
      <el-switch v-model="plugin.value"/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customClass']" label="自定义Class">
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
    <el-form-item v-loquat-has-perm="[data, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
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
    <el-form-item v-loquat-has-perm="[data, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!$loquat.validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${$loquat.get(eventsDic, key, '')}`"
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
  name: 'Switch',
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
      eventsDic: EVENTS_DIC,
      operationComputedSpan: 24 / 2,
      operationPerm: [
        'hide',
        'hideLabel',
        'plugin.disabled'
      ]
    }
  },
  computed: {
    plugin () {
      return this.data.plugin || {}
    },
    validateConfig () {
      return this.data.validateConfig || {}
    },
    events () {
      const clone = this.$loquat.deepClone(this.data.events)
      for (const val in clone) this.$loquat.validateNull(clone[val]) && delete clone[val]
      return clone
    }
  }
}
</script>
