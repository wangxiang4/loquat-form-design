<template>
  <div class="widget-view coral-layout-row"
       :class="{active: selectWidget.prop == column.prop}"
       @click.stop="handleSelectWidget(index)"
  >
    <el-row :type="column.flex ? 'flex' : undefined"
            :gutter="column.gutter"
            :justify="column.justify"
            :align="column.align"
            :class="column.customClass"
    >
      <el-col v-for="(col, colIndex) in column.cols"
              :key="colIndex"
              class="coral-layout-col"
              :class="[{
                active: selectWidget.prop == col.prop
              }].concat(col.customClass||[])"
              :xs="col.xs"
              :sm="col.sm"
              :md="col.md"
              :lg="col.lg"
              :xl="col.xl"
              @click.native.stop="handleWidgetDataSelect(col)"
      >
        <draggable :list="col.list"
                   :group="{ name: 'form' }"
                   ghost-class="ghost"
                   class="widget-col-list"
                   :animation="300"
                   handle=".widget-view-drag"
                   :no-transition-on-drag="true"
                   @add="handleWidgetColAdd($event, col.list)"
                   @end="$emit('change')"
        >
          <template v-for="(column, index) in col.list">
            <template v-if="column.type == 'coralLayoutRow'">
              <coral-layout :key="index"
                            :column="column"
                            :data="col.list"
                            :index="index"
                            :select.sync="selectWidget"
                            @change="$emit('change')"
              />
            </template>
            <template v-else>
              <div :key="index" @click.stop="handleWidgetDataSelect(col.list[index])">
                <div :class="['widget-view', { active: selectWidget.prop == column.prop }]">
                  <el-form-item class="widget-form-item"
                                :class="[{
                                  'readonly': column.readonly,
                                  'hide': column.hide,
                                  'required': $loquat.get(column, 'validateConfig.required')
                                }].concat(column.customClass||[])"
                                :prop="column.prop"
                                :label="column.hideLabel ? '' : column.label"
                                :label-width="column.hideLabel ? '0' : getLabelWidth(column, data, labelWidth)"
                                :label-position="column.labelPosition || data.labelPosition || labelPosition"
                  >
                    <loquat-form-item :column="column"
                                      :props="data.props"
                                      :value="column.value"
                                      :readonly="data.readonly || column.readonly"
                                      :disabled="data.disabled || column.disabled"
                                      :size="data.size || column.size"
                                      :dic="column.dicData"
                                      :type="column._type"
                                      :preview="false"
                    />
                  </el-form-item>
                  <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
                    <i title="复制" class="iconfont icon-clone" @click.stop="handleWidgetClone(col.list, index)"/>
                    <i title="删除" class="iconfont icon-trash" @click.stop="handleWidgetDelete(col.list, index)"/>
                  </div>
                  <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
                    <i class="iconfont icon-drag"/>
                  </div>
                  <div class="widget-view-model">
                    <span v-text="column.prop"/>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </draggable>
        <div v-if="selectWidget.prop == col.prop" class="widget-view-action widget-col-action">
          <i title="复制"
             class="iconfont icon-clone"
             @click.stop="handleColumnClone(colIndex)"
          />
          <i v-if="column.cols.length > 1"
             title="删除"
             class="iconfont icon-trash"
             @click.stop="handleColumnDelete(colIndex)"
          />
        </div>
      </el-col>
    </el-row>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-action widget-col-action">
      <i title="添加列" class="iconfont icon-add" @click.stop="handleColumnAdd"/>
      <i title="复制" class="iconfont icon-clone" @click.stop="handleRowClone"/>
      <i title="删除" class="iconfont icon-trash" @click.stop="handleRowDelete"/>
    </div>
    <div v-if="selectWidget.prop == column.prop" class="widget-view-drag widget-col-drag">
      <i class="iconfont icon-drag"/>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getObjType } from '@utils'
import { getLabelWidth } from '@utils/dataFormat'
import { FORM_DEFAULT_PROP } from '@/global/variable'
export default {
  name: 'CoralLayout',
  props: {
    data: {
      type: Object
    },
    column: {
      type: Object
    },
    select: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  components: { draggable },
  data () {
    return {
      selectWidget: this.select,
      ...FORM_DEFAULT_PROP
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    getLabelWidth,
    // 处理选择部件,根据索引
    handleSelectWidget (index) {
      this.selectWidget = this.data.column[index]
    },
    // 处理选择部件,根据数据
    handleWidgetDataSelect (data) {
      this.selectWidget = data
    },
    // 处理行克隆操作
    handleRowClone () {
      const cloneData = this.$loquat.deepClone(this.column)
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      getObjType(cloneData.cols) === 'array' && cloneData.cols.forEach(item => {
        if (!item.prop) item.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      })
      this.data.column.splice(this.index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(this.index + 1)
        this.$emit('change')
      })
    },
    // 处理行删除操作
    handleRowDelete () {
      if (this.data.column.length - 1 === this.index) {
        if (this.index === 0) this.selectWidget = {}
        else this.handleSelectWidget(this.index - 1)
      } else this.handleSelectWidget(this.index + 1)
      this.$nextTick(() => {
        this.data.column.splice(this.index, 1)
        this.$emit('change')
      })
    },
    // 处理列添加操作
    handleColumnAdd () {
      const colPreset = {
        type: 'coralLayoutCol',
        offset: 0,
        push: 0,
        pull: 0,
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24,
        list: [],
        customClass: []
      }
      colPreset.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      getObjType(this.column.cols) === 'array'
        ? this.column.cols.push(colPreset) : this.$loquat.log.warning('未设置cols参数,注意类型为Array')
    },
    // 处理列克隆操作
    handleColumnClone (index) {
      const cloneData = this.$loquat.deepClone(this.column.cols[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      this.column.cols.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleWidgetDataSelect(this.column.cols[index])
        this.$emit('change')
      })
    },
    // 处理列删除操作
    handleColumnDelete (index) {
      if (this.column.cols.length - 1 === index) {
        if (index === 0) this.handleWidgetDataSelect({})
        else this.handleWidgetDataSelect(this.column.cols[index - 1])
      } else this.handleWidgetDataSelect(this.column.cols[index + 1])
      this.$nextTick(() => {
        this.column.cols.splice(index, 1)
        this.$emit('change')
      })
    },
    // 处理部件列拖拽新增
    handleWidgetColAdd (evt, list) {
      const newIndex = evt.newIndex
      const data = this.$loquat.deepClone(list[newIndex])
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      delete data.icon
      // todo: 可以自定义处理插件的数据
      switch (data.type) {
        case 'coralLayout' :
          getObjType(data.cols) === 'array' && data.cols.forEach(item => {
            if (!item.prop) item.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
          })
          break
      }
      this.$set(list, newIndex, data)
      this.handleWidgetDataSelect(list[newIndex])
      this.$emit('change')
    },
    // 处理部件克隆
    handleWidgetClone (list, index) {
      const cloneData = this.$loquat.deepClone(list[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      list.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleWidgetDataSelect(list[index])
        this.$emit('change')
      })
    },
    // 处理部件删除
    handleWidgetDelete (list, index) {
      if (list.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleWidgetDataSelect(list[index - 1])
      } else this.handleWidgetDataSelect(list[index + 1])
      this.$nextTick(() => {
        list.splice(index, 1)
        this.$emit('change')
      })
    }
  }
}
</script>
