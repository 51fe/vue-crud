<template>
  <el-table-column v-bind="$attrs">
    <template slot-scope="scope">
      {{ getLabel(options, scope.row[$attrs.prop]) }}
    </template>
  </el-table-column>
</template>

<script>
import { getLabel } from "../utils";
export default {
  name: 'DictColumn',
  props: {
    // 下拉选项数组
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      getLabel
    }
  },
}
</script>
