<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px"
    class="save-form"
  >
    <el-form-item
      label="日期"
      prop="date"
    >
      <base-date-picker v-model="form.date" />
    </el-form-item>
    <el-form-item
      label="姓名"
      prop="userName"
    >
      <base-input v-model="form.userName" />
    </el-form-item>
    <el-form-item
      label="市区"
      prop="area"
    >
      <area-cascader
        v-model="form.area"
        @select="form.areaName=$event.join('')"
      />
    </el-form-item>
    <el-form-item
      label="地址"
      prop="address"
    >
      <base-input v-model="form.address" />
    </el-form-item>
    <el-form-item
      label="手机号"
      prop="mobile"
    >
      <base-input v-model="form.mobile" />
    </el-form-item>
    <el-form-item class="footer-item">
      <el-button @click="$emit('cancel')">
        取 消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import rules from '../utils/rules'
import AreaCascader from './AreaCascader/index.vue'
import BaseInput from './BaseInput.vue'
import BaseDatePicker from './BaseDatePicker.vue'

export default {
  name: 'SaveForm',
  components: { AreaCascader, BaseInput, BaseDatePicker },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.value,
      rules
    }
  },

  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form )
        }
      })
    }
  }
}
</script>

<style lang="less">
.save-form {
  .el-input {
    width: 100%;
  }
  .footer-item {
    margin-bottom: 0;
    .el-form-item__content {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
