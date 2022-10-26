<template>
  <el-table-column
    v-bind="$attrs"
    sortable
    min-width="100"
  >
    <template slot-scope="scope">
      {{ parseDateTime(scope.row[$attrs.prop], format) }}
    </template>
  </el-table-column>
</template>
<script>
import { parseDateTime } from '../utils'

export default {
  name: 'DateColumn',
  props: {
    format: {
      type: String,
      default: '{y}-{m}-{d}'
    }
  },
  data() {
    return {
      parseDateTime
    }
  }
}
</script>
