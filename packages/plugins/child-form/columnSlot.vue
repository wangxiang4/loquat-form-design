<template>
  <!--此处参数引用的是表单设计器内部配置不是引用插件配置-->
  <el-table-column v-if="!column.hide"
                   :key="column.prop"
                   :prop="column.prop"
                   :label="column.label"
                   :render-header="column.tableColRenderHeader"
                   :align="column.tableColAlign || table.align"
                   :header-align="column.tableColHeaderAlign || table.headerAlign"
                   :width="column.tableColumnWidth == 0 ? undefined : column.tableColumnWidth"
                   :fixed="column.tableColFixed"
  >
    <template slot-scope="{row,$index}">
      <el-form-item :prop="`list.${$index}.${column.prop}`" :rules="column.rules">
        <el-tooltip :content="(table.listError[`list.${$index}.${column.prop}`] || {}).msg"
                    :disabled="!(table.listError[`list.${$index}.${column.prop}`] || {}).valid"
                    placement="top"
        >
          <form-temp :column="column"
                     :size="crud.isMediumSize"
                     :dic="(crud.cascaderDIC[$index] || {})[column.prop] || crud.DIC[column.prop]"
                     :props="column.props || crud.tableOption.props"
                     :readonly="column.readonly"
                     :disabled="crud.disabled || crud.tableOption.disabled || column.disabled  || crud.btnDisabledList[$index]"
                     :clearable="vaildData(column.clearable,false)"
                     v-bind="$uploadFun(column,crud)"
                     v-model="row[column.prop]"
                     @change="columnChange($index,row,column)"/>

          <widget v-model="row[column.prop]"
                  :dic="table.dic[column.prop]"
                  :column="column"
                  :props="home.widgetForm.props"
                  :readonly="home.widgetForm.readonly || home.formDefaultConfig.readonly"
                  :disabled="home.widgetForm.disabled || home.disabled"
                  :size="home.widgetForm.size || home.formDefaultConfig.size"
                  :enter="home.widgetForm.enter"
                  @enter="home.submit"
                  @change="home.handleWidgetChange(column)"
          />
        </el-tooltip>
      </el-form-item>
      <slot :row="row"
            :index="$index"
            :dic="crud.DIC[column.prop]"
            :size="crud.isMediumSize"
            :label="handleShowLabel(row,column,crud.DIC[column.prop])"
            :name="column.prop"
            v-else-if="crud.$scopedSlots[column.prop]"></slot>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'ColumnSlot',
  inject: ['table'],
  components: {
    formTemp
  },
  props: {
    column: Object,
    columnOption: Array,
  },
  created () {
    const list = [
      'getColumnProp',
    ];
    Object.keys(this.dynamic).forEach(ele => {
      if (list.includes(ele)) {
        this[ele] = this.dynamic[ele];
      }
    });
  },
  methods: {
    allParams (item) {
      return {
        is: this.$typeList.video.test(item) ? 'video' : 'img'
      }
    },
    vaildLabel (column, row, val) {
      if (column.rules && row.$cellEdit) {
        return val
      }
    },
    handleShowLabel (row, column, DIC) {
      let result = "";
      if (!this.validatenull(DIC)) {
        result = detail(row, column, this.crud.tableOption, DIC);
        row["$" + column.prop] = result;
      }
      return result;
    },
    columnChange ($index, row, column) {
      if (this.validatenull(count[$index])) count[$index] = 0
      count[$index] = count[$index] + 1;
      if (column.cascader) this.handleChange(column, row)
      if (count[$index] % this.crud.cellChangeCount === 0) {
        if (typeof column.change === 'function' && column.cell === true) {
          column.change({ row, column, index: $index, value: row[column.prop] })
        }
        this.crud.$emit('column-change', { row, column, index: $index, value: row[column.prop] })
      }
    },
    handleChange (column, row) {
      this.$nextTick(() => {
        const columnOption = [...this.crud.propOption];
        //本节点;
        const cascader = column.cascader;
        const str = cascader.join(",");
        const columnNextProp = cascader[0];
        const value = row[column.prop];
        const rowIndex = row.$index;
        // 下一个节点
        const columnNext = this.findObject(this.columnOption, columnNextProp)
        if (this.validatenull(columnNext)) return
        // 如果本节点没有字典则创建节点数组
        if (this.validatenull(this.crud.cascaderDIC[rowIndex])) {
          this.$set(this.crud.cascaderDIC, rowIndex, {});
        }
        if (this.crud.formIndexList.includes(rowIndex)) {
          //清空子类字典
          cascader.forEach(ele => {
            this.$set(this.crud.cascaderDIC[rowIndex], ele.prop, []);
            cascader.forEach(ele => (row[ele] = ""));
          });
        }
        //最后一级
        if (
          this.validatenull(cascader) ||
          this.validatenull(value) ||
          this.validatenull(columnNext)
        ) {
          return;
        }
        sendDic({
          column: columnNext,
          value: value,
          form: row
        }).then(
          res => {
            //首次加载的放入队列记录
            if (!this.crud.formIndexList.includes(rowIndex)) this.crud.formIndexList.push(rowIndex);
            const dic = Array.isArray(res) ? res : [];
            // 修改字典
            this.$set(this.crud.cascaderDIC[rowIndex], columnNextProp, dic);

            if (!this.validatenull(dic[columnNext.cascaderIndex]) && !this.validatenull(dic) && !this.validatenull(columnNext.cascaderIndex)) {
              row[columnNextProp] = dic[columnNext.cascaderIndex][(columnNext.props || {}).value || DIC_PROPS.value]
            }
          }
        );
      })

    },
    openImg (list, index) {
      list = list.map(ele => {
        return { thumbUrl: ele, url: ele }
      })
      this.$ImagePreview(list, index);
    },
    corArray (list, separator = DIC_SPLIT) {
      if (this.validatenull(list)) {
        return []
      } else if (!Array.isArray(list)) {
        return list.split(separator);
      }
      return list
    },
    handleDetail (row, column) {
      let result = row[column.prop];
      let DIC = column.parentProp ? (this.crud.cascaderDIC[row.$index] || {})[column.prop] : this.crud.DIC[column.prop]
      result = detail(row, column, this.crud.tableOption, DIC);
      if (!this.validatenull(DIC)) {
        row["$" + column.prop] = result;
      }
      return result;
    },
    getImgList (row, column) {
      let url = (column.propsHttp || {}).home || ''
      let value = (column.props || {}).value || DIC_PROPS.value;
      if (this.validatenull(row[column.prop])) return []
      if (column.listType == 'picture-img') return [url + row[column.prop]]
      let list = this.corArray(this.deepClone(row[column.prop]), column.separator);
      list.forEach((ele, index) => {
        if (typeof ele === 'object') {
          list[index] = url + ele[value];
        } else {
          list[index] = url + ele;
        }
      })
      return list;
    },
  }
}
</script>
