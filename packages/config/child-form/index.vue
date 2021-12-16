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
    <el-form-item v-loquat-has-perm="[plugin, 'value']" label="默认值">
      <el-button style="width: 100%;"
                 @click="home.childFormModelVisible = true"
      >设置</el-button>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[option, 'emptyText']" label="空数据文本内容">
      <el-input v-model="option.emptyText" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[option, 'indexExecuteLabel']" label="索引列标题">
      <el-input v-model="option.indexExecuteLabel" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[option, 'indexExecuteFixed']" label="索引列固定">
      <el-input v-model="option.indexExecuteFixed" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[option, 'align']" label="列对齐方式">
      <el-input v-model="option.align" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[option, 'headerAlign']" label="列表头对齐方式">
      <el-input v-model="option.headerAlign" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, somePermission.configCenterPerm, 1]" label="配置中心">
      <el-collapse accordion>
        <el-collapse-item v-loquat-has-perm="[plugin, somePermission.pageConfig, 1]" title="分页配置">
          <div v-loquat-has-perm="[pageConfig, 'pagerCount']">
            <span class="horizontal-tip-text">超过多少数目隐藏:</span>
            <el-input-number v-model="pageConfig.pagerCount"
                             style="width: 100%;"
                             size="mini"
                             controls-position="right"
            />
          </div>
          <div v-loquat-has-perm="[pageConfig, 'pageSize']">
            <span class="horizontal-tip-text">每页显示数目:</span>
            <el-input-number v-model="pageConfig.pageSize"
                             style="width: 100%;"
                             size="mini"
                             controls-position="right"
            />
          </div>
          <div v-loquat-has-perm="[pageConfig, 'layout']">
            <span class="horizontal-tip-text">布局:</span>
            <el-input v-model="pageConfig.layout" size="mini" clearable/>
          </div>
          <div v-loquat-has-perm="[plugin, somePermission.pageConfigOperate, 1]">
            <span class="horizontal-tip-text">操作属性:</span>
            <el-row>
              <el-col v-loquat-has-perm="[pageConfig, 'smallPaging']" :span="24">
                <el-checkbox v-model="pageConfig.smallPaging" size="mini">是否使用小分页</el-checkbox>
              </el-col>
              <el-col v-loquat-has-perm="[pageConfig, 'background']" :span="24">
                <el-checkbox v-model="pageConfig.background" size="mini">是否显示背景颜色</el-checkbox>
              </el-col>
              <el-col v-loquat-has-perm="[pageConfig, 'simplePage']" :span="24">
                <el-checkbox v-model="pageConfig.simplePage" size="mini">当只有一页时隐藏分页</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
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
    <el-form-item v-loquat-has-perm="[column, somePermission.operate, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'readonly']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.readonly">只读</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[option, 'stripe']" :span="operationComputedSpan">
          <el-checkbox v-model="option.stripe">是否为斑马纹</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[option, 'showHeader']" :span="operationComputedSpan">
          <el-checkbox v-model="option.showHeader">是否显示表头</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'loading']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.loading">是否显示加载</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'paging']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.paging">是否启动分页</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[option, 'indexExecute']" :span="operationComputedSpan">
          <el-checkbox v-model="option.highlightCurrentRow">是否显示索引列</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[option, 'highlightCurrentRow']" :span="24">
          <el-checkbox v-model="option.highlightCurrentRow">是否要高亮当前行</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[option, 'fit']" :span="24">
          <el-checkbox v-model="option.fit">列的宽度是否自撑开</el-checkbox>
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
        <el-collapse v-if="!validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${get(eventsDic, key, '')}`"
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
            >{{ `${key} ${get(eventsDic, key, '')}` }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import permission from '@/config/perm'
import GlobalConfig from '@/global/config'
import { originComponentName, validateNull, get, deepClone } from '@utils'
export default {
  name: 'ChildForm',
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
      permission,
      first: false,
      eventsDic: GlobalConfig.eventsDic,
      operationComputedSpan: 24 / 2
    }
  },
  computed: {
    permConfig () {
      const name = originComponentName(this.$options.name)
      return this.permission.find(item => name === item.component) || {}
    },
    somePermission () {
      return this.permConfig.somePermission || {}
    },
    column () {
      return this.first ? this.data : {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    option () {
      return this.plugin.option || {}
    },
    pageConfig () {
      return this.plugin.page || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    events () {
      const clone = deepClone(this.column.events)
      for (const val in clone) validateNull(clone[val]) && delete clone[val]
      return clone
    }
  },
  mounted () {
    this.first = true
  },
  methods: {
    get,
    validateNull
  }
}
</script>
