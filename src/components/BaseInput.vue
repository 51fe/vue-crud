<template>
  <el-input
    :value="value"
    :max-length="200"
    :placeholder="placeholder"
    clearable
    class="base-input"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  mounted() {
    if(this.$parent.label) {
      this.$el.querySelector('input').id = this.$parent.prop
    }
  }
}
</script>

<style>
.base-input {
  width: 100%;
}
</style>
