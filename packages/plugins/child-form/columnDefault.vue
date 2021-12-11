<template>
  <div>
    <el-table-column width="1px"/>
    <!-- 子表单操作列 -->
    <el-table-column v-if="!childForm.widgetChildForm.indexExecute"
                     :fixed="childForm.widgetChildForm.indexExecuteFixed"
                     :width="childForm.widgetChildForm.indexExecuteWidth || childForm.childFormDefaultConfig.indexExecuteWidth"
                     align="center"
                     header-align="center"
    >
      <template slot="header">
        <el-button v-if="!childForm.readonly"
                   @click="childForm.rowCellAdd()"
                   type="primary"
                   size="mini"
                   :disabled="childForm.disabled"
                   icon="el-icon-plus"
                   circle
        />
      </template>
      <template slot-scope="scope">
        <el-button v-if="(!childForm.readonly || !childForm.disabled) && childForm.hoverMark[scope.row.$index]"
                   @click="childForm.rowCellDel(scope.row.$index)"
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
