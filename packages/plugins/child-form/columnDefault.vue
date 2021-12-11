<template>
  <div>
    <el-table-column width="1px"/>
    <!-- 子表单操作列 -->
    <el-table-column v-if="!childForm.widgetList.colDefIndexHide"
                     :fixed="childForm.widgetList.colDefIndexFixed"
                     :width="childForm.widgetList.colDefIndexWidth || childForm.listDefaultConfig.colDefIndexWidth"
                     align="center"
                     header-align="center"
    >
      <template slot="header">
        <el-button v-if="!childForm.formReadonly || !childForm.widgetList.addBtn"
                   @click="childForm.rowCellAdd()"
                   type="primary"
                   size="mini"
                   :disabled="childForm.formDisabled"
                   icon="el-icon-plus"
                   circle
        />
      </template>
      <template slot-scope="scope">
        <el-button v-if="(!childForm.formReadonly || !childForm.formDisabled || !childForm.widgetList.delBtn) && childForm.hoverMark[scope.row.$index]"
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
  inject: ['childForm']
}
</script>
