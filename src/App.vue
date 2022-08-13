<template>
  <div id="app">
    <el-form
      inline
      align="right"
      class="search-form"
    >
      <el-form-item>
        <el-input
          v-model.trim="query.userName_like"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="fetchData"
        />
      </el-form-item>
      <el-form-item>
        <base-date-picker
          v-model.trim="query.date_gte"
          placeholder="开始日期"
        />
      </el-form-item>
      <el-form-item>-</el-form-item>
      <el-form-item>
        <base-date-picker
          v-model.trim="query.date_lte"
          placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <base-select
          v-model.trim="query.province"
          :options="provinces"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="fetchData"
        />
      </el-form-item>
    </el-form>

    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="toAdd"
    >
      新增
    </el-button>
    <section class="wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <date-column
          prop="date"
          label="日期"
        />
        <el-table-column
          prop="userName"
          label="姓名"
          sortable
        />
        <dict-column
          :options="provinces"
          prop="province"
          label="省份"
        />
        <el-table-column
          prop="city"
          label="市区"
        />
        <el-table-column
          prop="address"
          label="地址"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="zip"
          label="邮编"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="{row, $index}">
            <el-button
              type="text"
              size="small"
              @click="toDelete(row.id, $index)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="toEdit(row, $index)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog
      v-if="dialogVisible"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <save-form
        v-model="form"
        :loading="cudLoading"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>

    <base-pagination
      :total="total"
      :page.sync="query._page"
      :limit.sync="query._limit"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { provinces } from "./constants";
import { deepClone } from "./utils";
import { addReceipt, delReceipt, editReceipt, getReceiptList } from "./api/receipt";
import SaveForm from "./components/SaveForm";
import BaseSelect from "./components/BaseSelect";
import DictColumn from "./components/DictColumn";
import BaseDatePicker from "./components/BaseDatePicker";
import BasePagination from "./components/BasePagination";
import DateColumn from "./components/DateColumn";

export default {
  components: {DateColumn, BasePagination, BaseDatePicker, DictColumn, BaseSelect, SaveForm  },
  data() {
    return {
      dialogVisible: false,
      index: undefined,
      adding: false,
      loading: false,
      cudLoading: false,
      provinces,
      form: {},
      tableData: [],
      query: {
        _page: 1,
        _limit: 10,
        _sort: 'id',
        _order: 'desc'
      },
      total: 0
    }
  },
  computed: {
    title() {
      if (this.adding) return "新增收货";
      return "编辑收货";
    },
  },
  watch: {
    cudLoading(newValue) {
      if(!newValue) {
        this.dialogVisible = false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toAdd() {
      this.adding = true
      this.dialogVisible = true;
      this.form = {}
    },

    toEdit(row, index) {
      this.adding = false
      this.dialogVisible = true
      this.index = index
      this.form = deepClone(row)
    },

    toDelete(id, index) {
      this.$confirm('确定删除?', {
        type: 'warning'
      }).then(() => {
        this.doDelete(id, index)
      }).catch(() => {
        console.log('canceled')
      })
    },

    fetchData() {
      this.loading = true
      getReceiptList(this.query).then(data => {
        this.loading = false
        this.tableData = data.list
        this.total = data.total
      }).catch(() => {
        this.loading = false
      })
    },

    doAdd(data) {
      this.cudLoading = true
      addReceipt(data).then((data) => {
        this.cudLoading = false
        // not call fetchData
        this.tableData.unshift(data)
        this.total += 1
      }).catch(() => {
        this.cudLoading = false
      })
    },

    doEdit(data) {
      this.cudLoading = true
      editReceipt(data).then((data) => {
        this.cudLoading = false
        // not call fetchData
        this.tableData.splice(this.index, 1, data)
      }).catch(() => {
        this.cudLoading = false
      })
    },

    async doDelete(id, index) {
      this.cudLoading = false
      delReceipt(id).then(() => {
        this.cudLoading = false
        // not call fetchData
        this.tableData.splice(index, 1)
        this.total -= 1
      }).catch(() => {
        this.cudLoading = false
      })
    },

    handleSubmit() {
      if (this.adding) {
        this.doAdd(this.form)
      } else {
        this.doEdit(this.form)
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}
#app {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.search-form .el-date-editor {
  width: 150px;
}
.wrapper {
  height: calc(100% - 180px);
  margin-top: 10px;
  overflow: auto;
}
.el-dialog__body .el-select, .el-dialog__body .el-date-editor.el-input {
  width: 100%;
}
</style>
