<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customizeStyle.width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'placeholder']" label="占位内容">
      <el-input v-model="data.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, staticPerm, 1]" label="选项">
      <el-radio-group v-model="data.static"
                      size="mini"
                      style="margin-bottom: 10px;"
      >
        <el-radio-button :label="true">静态数据</el-radio-button>
        <el-radio-button :label="false">动态数据</el-radio-button>
      </el-radio-group>
      <template v-if="data.static">
        <el-button style="width: 100%;"
                   @click="home.handleCascadeOptionSetData(data.dicData)"
        >设置</el-button>
      </template>
      <div v-if="!data.static">
        <el-radio-group v-model="data.remoteType">
          <el-radio label="datasource" >数据源</el-radio>
          <el-radio label="option">赋值变量</el-radio>
          <el-radio label="func">方法函数</el-radio>
        </el-radio-group>
        <template v-if="data.remoteType === 'datasource'">
          <el-select v-model="data.remoteDataSource"
                     size="mini"
                     style="width: 100%; margin-bottom: 5px;"
                     placeholder="请选择"
          >
            <el-option v-for="item in home.widgetForm.dataSource"
                       :key="item.key"
                       :label="item.name"
                       :value="item.key"
            />
          </el-select>
        </template>
        <template v-if="data.remoteType === 'option'">
          <el-input v-model="data.remoteOption"
                    size="mini"
                    style="margin-bottom: 5px;"
                    clearable
          />
        </template>
        <template v-if="data.remoteType === 'func'">
          <el-input v-model="data.remoteFunc"
                    size="mini"
                    style="margin-bottom: 5px;"
                    clearable
          />
        </template>
        <el-input v-model="prop.value" size="mini" clearable>
          <template #prepend>值</template>
        </el-input>
        <el-input v-model="prop.label" size="mini" clearable>
          <template #prepend>标签</template>
        </el-input>
        <el-input v-model="prop.children" size="mini" clearable>
          <template #prepend>子选项</template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item v-if="data.static" v-loquat-has-perm="[data, 'value']" label="默认值">
      <el-cascader v-model="data.value"
                   style="width: 100%;"
                   :options="data.dicData"
                   clearable
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'customClass']" label="自定义Class">
      <loquat-select v-model="data.customClass"
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
      </loquat-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, operationPerm, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[data, 'multiple']" :span="operationComputedSpan">
          <el-checkbox v-model="data.multiple" @change="$set(data, 'value', [])">是否多选</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'filterable']" :span="operationComputedSpan">
          <el-checkbox v-model="data.filterable">是否可搜索</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="data.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[data, 'clearable']" :span="operationComputedSpan">
          <el-checkbox v-model="data.clearable">显示清除按钮</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[data, 'validateConfig.required']" label="校验">
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
    <el-form-item v-loquat-has-perm="[data,'events']" label="动作设置">
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
  name: 'Cascader',
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
        'multiple',
        'filterable',
        'readonly',
        'disabled',
        'hide',
        'hideLabel',
        'clearable'
      ],
      staticPerm: [
        'static',
        'dicData',
        'remoteType',
        'remoteDataSource',
        'remoteOption',
        'remoteFunc',
        'prop.value',
        'prop.label',
        'prop.children'
      ]
    }
  },
  computed: {
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
    },
    prop () {
      return this.data.props || {}
    }
  },
  methods: {
  }
}
</script>
