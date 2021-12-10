<template>
  <div>
    <!-- 子表单操作列 -->
    <el-table-column v-if="!childForm.widgetList.colDefIndexHide"
                     :fixed="childForm.widgetList.colDefIndexFixed"
                     :label="childForm.widgetList.colDefIndexLabel || childForm.listDefaultConfig.colDefIndexLabel"
                     :width="childForm.widgetList.colDefIndexWidth || childForm.listDefaultConfig.colDefIndexWidth"
                     align="center"
                     header-align="center"
    >
      <template slot="header" slot-scope="scope">
        <el-button v-if="addBtnDisplay(scope)"
                   @click="addRow(scope.row.$index)"
                   type="primary"
                   size="mini"
                   :disabled="childForm.widgetList.disabled || childForm.disabled"
                   icon="el-icon-plus"
                   circle
        />
      </template>
      <template slot-scope="scope">
        <el-button v-if="deleteBtnDisplay"
                   @click="delRow(scope.row.$index)"
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
    deleteBtnDisplay (scope) {
      return (!(this.childForm.widgetList.readonly || this.childForm.readonly) ||
          !(this.childForm.widgetList.disabled || this.childForm.disabled) || !this.childForm.widgetList.delBtn) &&
          this.childForm.hoverList[scope.row.$index]
    },
    addBtnDisplay () {
      return !(this.childForm.widgetList.readonly || this.childForm.readonly) || !this.childForm.widgetList.addBtn
    }
  }
}
</script>
