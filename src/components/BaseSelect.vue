<template>
  <el-select
    v-model="current"
    :multiple="multiple"
    :placeholder="placeholder"
    filterable
    clearable
    class="base-select"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
const toNumber = (str) => isNaN?.(str) ? str : Number(str)
export default {
  name: 'BaseSelect',
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    options: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    current: {
      get() {
        const value = this.value
        if (value && typeof value === 'string') {
          if (this.multiple) {
            return value.split(',').map(item => toNumber(item))
          }
          return toNumber(value)
        }
        return value
      },
      set(value) {
        if(this.multiple) {
          value = value.join(',')
        }
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style>
.base-select {
  width: 100%;
}
</style>
