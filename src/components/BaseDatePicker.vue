<template>
  <el-date-picker
    :value="value"
    type="date"
    value-format="yyyy-MM-dd HH:mm:ss"
    :placeholder="placeholder"
    clearable
    v-bind="$attrs"
    class="base-date-picker"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'BaseDatePicker',
  props: {
    value: {
      type: [String, Date],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  }
}
</script>

<style lang="less">
  .base-date-picker {
    &.el-date-editor {
      &.el-input, .el-input__wrapper {
        width: 100%;
      }
    }
  }
  </style>
