<template>
  <div class="widget-child-form-wrapper">
    <el-table :data="[{}]" class="widget-child-form-left">
      <el-table-column v-if="!configOption.indexExecute"
                       :label="configOption.indexExecuteLabel"
                       :width="50"
                       fixed="left"
      >1</el-table-column>
    </el-table>
    <div class="widget-child-form-content">
      <draggable :list="configOption.column"
                 :group="{ name: 'form' }"
                 ghost-class="ghost"
                 :animation="300"
                 handle=".widget-view-drag"
                 :no-transition-on-drag="true"
                 @add="handleWidgetColAdd($event, col.list)"
                 @end="$emit('change')"
      >
        <transition-group name="fade" tag="div" class="widget-child-form-col">
          <template v-for="(column, index) in configOption.column">
            <div :class="['widget-view' ,{active: selectWidget.prop == column.prop, hide: column.hide}]"
                 style="width: 200px;"
                 @click.stop="handleSelectWidget(index)"
            >
              <el-table :data="[{}]">
                <el-table-column v-if="!configOption.indexExecute"
                                 :label="configOption.indexExecuteLabel"
                                 :width="198"
                >
                  <widget v-model="plugin.value"
                          :column="column"
                          :dic="column.dicData"
                          :props="data.props"
                          :readonly="data.readonly"
                          :disabled="data.disabled"
                          :size="data.size || formDefaultConfig.size"
                          :preview="false"
                  />
                </el-table-column>
              </el-table>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-action">
                <i title="复制" class="iconfont icon-clone" @click.stop="emitInvoke('clone')"/>
                <i title="删除" class="iconfont icon-trash" @click.stop="emitInvoke('delete')"/>
              </div>
              <div v-if="selectWidget.prop == column.prop" class="widget-view-drag">
                <i class="iconfont icon-drag"/>
              </div>
              <div class="widget-view-model">
                <span v-text="column.prop"/>
              </div>
            </div>
          </template>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WidgetCoralLayout',
  props: {
    column: {
      type: Object
    }
  },
  computed: {
    plugin () {
      return this.column.plugin || {}
    },
    configOption () {
      return this.plugin.option || {}
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>
