<template>
  <el-cascader
    ref="area"
    :value="value"
    :props="props"
    :options="options"
    :placeholder="placeholder"
    filterable
    clearable
    class="area-cascader"
    @change="handleChange"
  />
</template>

<script>
import options from './area.js'
export default {
  name: 'AreaCascader',
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      props: {
        label: 'label',
        value: 'value',
        emitPath: false
      },
      options
    }
  },
  mounted() {
    if(this.$parent.label) {
      this.$el.querySelector('input').id = this.$parent.prop
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      const node = this.$refs.area.getCheckedNodes()?.[0]
      if (node) {
        this.$emit('select', [...new Set(node.pathLabels)])
      }
    }
  }
}
</script>

<style>
.area-cascader {
  width: 100%;
}
</style>
