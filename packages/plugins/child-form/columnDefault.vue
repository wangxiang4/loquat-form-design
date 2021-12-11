<template>
  <div>
    <el-table-column width="1px"/>
    <!-- 子表单操作列 -->
    <el-table-column v-if="!childForm.widgetList.colDefIndexHide"
                     :fixed="childForm.widgetList.colDefIndexFixed"
                     :label="childForm.widgetList.colDefIndexLabel || childForm.listDefaultConfig.colDefIndexLabel"
                     :width="childForm.widgetList.colDefIndexWidth || childForm.listDefaultConfig.colDefIndexWidth"
                     align="center"
                     header-align="center"
    >
      <template slot="header">
        <el-button v-if="!readonly || !childForm.widgetList.addBtn"
                   @click="childForm.rowCellAdd()"
                   type="primary"
                   size="mini"
                   :disabled="disabled"
                   icon="el-icon-plus"
                   circle
        />
      </template>
      <template slot-scope="scope">
        <el-button v-if="(!readonly || !disabled || !childForm.widgetList.delBtn) && childForm.hoverList[scope.row.$index]"
                   @click="childForm.rowCellRow(scope.row.$index)"
                   type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   circle
        />
        <div v-else>{{scope.row.$index+1}}</div>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'ColumnDefault',
  inject: ['childForm'],
  computed: {
    readonly () {
      return this.childForm.widgetList.readonly || this.childForm.readonly
    },
    disabled () {
      return this.childForm.widgetList.disabled || this.childForm.disabled
    }
  }
}
</script>
