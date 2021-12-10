<template>
  <div>
    <template v-for="column in list">
      <column-slot :column="column" :column-option="columnOption">
        <template slot-scope="scope" :slot="column.prop">
          <slot v-bind="scope" :name="column.prop"/>
        </template>
      </column-slot>
    </template>
  </div>

</template>

<script>
import columnSlot from './columnSlot'
export default {
  name: 'Column',
  inject: ['table'],
  components: { columnSlot },
  data () {
    return {}
  },
  provide () {
    return {
      table: this.table
    }
  },
  props: {
    columnOption: Array
  },
  computed: {
    list () {
      let result = [...this.columnOption];
      result = arraySort(result, 'index', (a, b) => this.crud.objectOption[a.prop]?.index - this.crud.objectOption[b.prop]?.index)
      return result;
    }
  }
}
</script>

