<template>
  <el-select
    :value="value"
    placeholder="请选择"
    clearable
    @change="$emit('input', $event)"
    @clear="$emit('input', undefined)"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>

export default {
  name: "BaseSelect",
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    options: {
      type: Array,
      default: () => []
    },
  }
}
</script>
