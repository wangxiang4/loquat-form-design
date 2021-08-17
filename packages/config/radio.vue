<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="data.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'label']" label="标题">
      <el-input v-model="data.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'style.width']" label="组件宽度" >
      <el-input v-model="style.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="data.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, 'inline']" label="布局方式">
      <el-radio-group v-model="data.inline">
        <el-radio-button :label="false">块级</el-radio-button>
        <el-radio-button :label="true">行内</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[originData, staticPerm, 1]" label="选项">
      <el-radio-group v-model="data.static"
                      size="mini"
                      style="margin-bottom: 10px;"
                      @change="(check) => {
                        check ? $set(data, 'value', false) : $set(data, 'showLabel', true)
                        $set(data, 'value', '')
                      }"
      >
        <el-radio-button :label="true">静态数据</el-radio-button>
        <el-radio-button :label="false">动态数据</el-radio-button>
      </el-radio-group>
      <template v-if="data.static">
        <el-checkbox v-model="data.showLabel">是否显示标签</el-checkbox>
        <el-radio-group v-model="data.value" size="mini">
          <draggable tag="ul"
                     :list="data.dicData"
                     :group="{ name: 'radioDicData' }"
                     ghost-class="ghost"
                     handle=".drag-item"
          >
            <li v-for="(item, index) in data.dicData" :key="index">
              <el-radio :label="item.value" style="margin-right: 3px;">
                <el-input v-model="item.value"
                          :style="{ width: data.showLabel ? '90px' : '180px' }"
                          size="mini"
                          clearable
                />
                <el-input v-if="data.showLabel"
                          v-model="item.label"
                          style="width: 90px"
                          size="mini"
                          clearable
                />
              </el-radio>
              <i class="drag-item el-icon-s-operation"
                 style="font-size: 16px; margin: 0 5px; cursor: move;"
              />
              <el-button circle
                         plain
                         type="danger"
                         size="mini"
                         icon="el-icon-minus"
                         style="padding: 4px;margin-left: 5px;"
                         @click="handleRemoveFields(index)"
              />
            </li>
          </draggable>
        </el-radio-group>
        <div style="margin-left: 22px;">
          <el-button type="text"
                     @click="handleAddFields"
          >添加选项</el-button>
          <el-button type="text"
                     @click="$set(data, 'value', '')"
          >重置选择</el-button>
        </div>
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
        <el-col v-loquat-has-perm="[originData, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="data.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[originData, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="data.hideLabel">隐藏标签</el-checkbox>
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
    <el-form-item v-loquat-has-perm="[originData,'events']" label="动作设置">
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
import Draggable from 'vuedraggable'
import { EVENT_DICT } from '@/global/variable'

export default {
  name: 'Radio',
  components: { Draggable },
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
        'disabled',
        'hide',
        'hideLabel'
      ],
      staticPerm: [
        'static',
        'showLabel',
        'value',
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
    originData () {
      return this.$loquat.deepClone(this.data)
    },
    validateConfig () {
      return this.data.validateConfig || {}
    },
    style () {
      return this.data.style || {}
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
    handleRemoveFields (index) {
      this.data.dicData.splice(index, 1)
    },
    handleAddFields () {
      this.data.showLabel
        ? this.data.dicData.push({ label: '新选项', value: '新选项' })
        : this.data.dicData.push(Object({ value: '新选项' }))
    }
  }
}
</script>
