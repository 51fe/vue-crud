<template>
  <el-form
    ref="form"
    :model="form"
    label-width="60px"
  >
    <el-form-item label="日期">
      <base-date-picker v-model="form.date" />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]"
      label="姓名"
      prop="userName"
    >
      <el-input
        v-model="form.userName"
        placeholder="请输入"
        clearable
      />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '省份不能为空' }]"
      label="省份"
      prop="province"
    >
      <base-select
        v-model.number="form.province"
        :options="provinces"
      />
    </el-form-item>
    <el-form-item label="市区">
      <base-input v-model="form.city" />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '地址不能为空', trigger: 'blur' }]"
      label="地址"
      prop="address"
    >
      <base-input v-model="form.address" />
    </el-form-item>
    <el-form-item
      :rules="[{ validator: zipValidator }]"
      label="邮编"
      prop="zip"
    >
      <base-input v-model="form.zip" />
    </el-form-item>
    <el-form-item align="right">
      <el-button @click="$emit('cancel')">
        取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { provinces } from "../constants";
import { zipValidator } from "../utils/validate";
import BaseInput from "./BaseInput";
import BaseDatePicker from "./BaseDatePicker";
import BaseSelect from "./BaseSelect";
export default {
  name: "SaveForm",
  components: {BaseSelect, BaseDatePicker, BaseInput},
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
      provinces,
      zipValidator
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("submit")
        }
      })
    }
  }
}
</script>
