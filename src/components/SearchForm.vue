<template>
  <dl
    class="search-form"
    data-testid="search-form"
    @keyup.enter="handleSearch"
  >
    <dd class="item">
      <base-input
        v-model="form.userName_like"
        placeholder="请输入姓名"
      />
      <base-input
        v-model="form.mobile_like"
        placeholder="请输入手机号"
      />
    </dd>
    <dd class="item date-item">
      <base-date-picker
        v-model="form.date_gte"
        placeholder="开始日期"
      />
      <base-date-picker
        v-model="form.date_lte"
        placeholder="结束日期"
      />
    </dd>
    <dd class="item">
      <base-select
        v-model="form.areaName_like"
        :options="provinces"
        placeholder="请选择省"
        @change="changeProvince"
      />
      <base-select
        v-model="form.area_like"
        :options="cities"
        placeholder="请选择市"
        @change="changeCity"
      />
    </dd>
    <dd class="item">
      <base-select
        v-model="form.area"
        :options="areas"
        placeholder="请选择区"
      />
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        title="搜索"
        @click="handleSearch"
      />
    </dd>
  </dl>
</template>

<script>
import options from '../components/AreaCascader/area.js'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseDatePicker from './BaseDatePicker.vue'

export default {
  name: 'SearchForm',
  components: { BaseInput, BaseSelect, BaseDatePicker },
  data() {
    return {
      form: {},
      cities: [],
      areas: []
    }
  },
  computed: {
    provinces() {
      return options.map(item => {
        return {
          label: item.label,
          value: item.label
        }
      })
    }
  },
  methods: {
    changeProvince(value){
      if (value) {
        const children = options.find((item) => item.label === value).children
        if (children) {
          this.cities = children.map((item) => {
            return {
              label: item.label,
              // 1...4 for city area code
              value: Math.floor(item.value / 100),
              children: item.children
            }
          })
        }
      } else {
        // reset
        this.form.area_like =  undefined
        this.form.area =  undefined
        this.cities = []
        this.areas = []
      }
    },
    changeCity(value) {
      // reset
      if (value) {
        const city = this.cities.find((item) => item.value === value)
        if(city) {
          this.areas = city.children ?? []
        }
      } else {
        this.form.area =  undefined
        this.areas = []
      }
    },
    handleSearch() {
      this.$emit('search', this.form)
    }
  }
}
</script>

<style lang="less">
  .search-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    .item {
      margin-right: 10px;
      margin-bottom: 10px;
      .el-input,
      .base-select,
      .base-date-picker {
        width: 140px;
      }
      .el-input+.el-input {
        margin-left: 10px;
      }
      .base-select+.base-select {
        margin-left: 10px;
      }
      .el-button {
        margin-left: 20px;
      }
    }
  }
  @media screen and (max-width: 767px) {
    .search-form {
      .item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .el-input,
        .base-select {
          width: 100%;
        }
      }
    }
  }
  </style>
