<template>
  <el-input
    :max-length="200"
    placeholder="请输入"
    clearable
    v-bind="$attrs"
    class="base-input"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'BaseInput'
}
</script>

<style>
.base-input {
  width: 100%;
}
</style>
