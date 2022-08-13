<template>
  <el-date-picker
    value-format="yyyy-MM-dd HH:mm:ss"
    :placeholder="placeholder"
    clearable
    class="base-date-picker"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'BaseDatePicker',
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    }
  }
}
</script>

<style>
.base-date-picker  .el-date-editor {
  width: 100%;
}
</style>
