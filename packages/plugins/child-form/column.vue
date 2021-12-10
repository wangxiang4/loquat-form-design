<template>
  <div>
    <!--前置预设列-->
    <slot name="header"/>
    <!--动态列-->
    <template v-for="(column, index) in list">
      <column-slot :key="index" :column="column" :column-option="columnOption">
        <template slot-scope="scope" :slot="column.prop">
          <slot v-bind="scope" :name="column.prop"/>
        </template>
      </column-slot>
    </template>
    <!--前置菜单操作列-->
    <slot name="footer"/>
  </div>
</template>

<script>
import columnSlot from './columnSlot'
export default {
  name: 'Column',
  inject: ['childForm'],
  components: { columnSlot },
  provide () {
    return {
      childForm: this.childForm
    }
  },
  props: {
    columns: {
      type: Array
    }
  },
  computed: {
    list () {
      const result = [...this.columns]
      return result
    }
  }
}
</script>

