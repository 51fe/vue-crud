<template>
  <div id="app">
    <search-form @search="handleSearch" />
    <div class="box">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="toAdd"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :border="true"
      :height="tableHeight"
      class="main-table"
    >
      <date-column
        prop="date"
        label="日期"
        min-width="120"
      />
      <el-table-column
        prop="userName"
        label="姓名"
        sortable
      />
      <el-table-column
        prop="areaName"
        label="省市区"
        sortable
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip
      />
      <el-table-column
        prop="mobile"
        label="手机号码"
        min-width="120"
      />
      <el-table-column
        v-if="tableData.length > 0"
        :fixed="layout ? 'right': false"
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag
            type="danger"
            size="mini"
            @click="toDelete(row.id)"
          >
            删除
          </el-tag>
          <el-tag
            size="mini"
            @click="toEdit(row)"
          >
            编辑
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <save-form
        :value="form"
        :opened="dialogVisible"
        :loading="saveLoading"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
    <base-pagination
      :total="total"
      :page.sync="params._page"
      :limit.sync="params._limit"
      :layout="layout"
      @pagination="fetchData(params)"
    />
  </div>
</template>

<script>
import { deepClone } from './utils'
import debounce from 'lodash.debounce'
import { addReceipt, delReceipt, editReceipt, getReceiptList } from './api/receipt'
import SearchForm from './components/SearchForm.vue'
import SaveForm from './components/SaveForm.vue'
import BasePagination from './components/BasePagination.vue'
import DateColumn from './components/DateColumn.vue'
import { MessageBox } from 'element-ui'

export default {
  components: { SearchForm, SaveForm, DateColumn, BasePagination },
  data() {
    return {
      dialogVisible: false,
      adding: false,
      loading: false,
      saveLoading: false,
      form: {},
      tableData: [],
      params: {
        _page: 1,
        _limit: 15,
        _sort: 'id',
        _order: 'desc'
      },
      total: 0,
      layout: undefined,
      tableHeight: 0
    }
  },
  computed: {
    title() {
      if (this.adding) return '新增收货'
      return '编辑收货'
    }
  },
  watch: {
    saveLoading(newValue) {
      if (!newValue) {
        this.dialogVisible = false
      }
    }
  },
  created() {
    this.fetchData(this.params)
  },
  mounted() {
    window.addEventListener('resize', debounce(this.responsive, 500))
    // not relayout when testing
    if(process.env.NODE_ENV !== 'test') {
      this.responsive()
    }
  },
  beforeMount() {
    window.removeEventListener('resize', this.responsive)
  },
  methods: {
    responsive ()  {
      if (document.body.clientWidth < 768) {
        this.layout = 'prev, pager, next'
      } else {
        this.layout = undefined
      }
      const el = document.querySelector('.search-form')
      this.tableHeight = document.body?.clientHeight - el?.clientHeight - 110
    },

    handleSearch(keyword) {
      // merge params
      const merged = {
        ...this.params,
        _page: 1,
        ...keyword
      }
      this.fetchData(merged)
    },

    fetchData(params) {
      this.loading = true
      getReceiptList(params)
        .then((data) => {
          this.loading = false
          this.tableData = data.list
          this.total = data.total
        })
        .catch(() => {
          this.loading = false
        })
    },

    // fetch first page data
    refresh() {
      this.params._page = 1
      this.fetchData(this.params)
    },

    toAdd() {
      this.adding = true
      this.dialogVisible = true
      this.form = {}
    },

    toEdit(row) {
      this.adding = false
      this.dialogVisible = true
      this.form = deepClone(row)
    },

    toDelete(id) {
      MessageBox.confirm('确定删除?', {
        title: '提示',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            delReceipt(id).then(() => {
              instance.confirmButtonLoading = false
              done()
              // not call fetchData
              const index = this.tableData.findIndex(item => item.id === id)
              this.tableData.splice(index, 1)
              this.total -= 1
              if(this.total % this.params._limit === 0) {
                this.refresh()
              }
            })
          } else {
            done()
          }
        }
      })
    },

    handleSubmit(form) {
      if (this.adding) {
        this.doAdd(form)
      } else {
        this.doEdit(form)
      }
    },

    doAdd(data) {
      this.saveLoading = true
      addReceipt(data).then(() => {
        this.saveLoading = false
        this.refresh()
      })
      .catch(() => {
        this.saveLoading = false
      })
    },

    doEdit(data) {
      this.saveLoading = true
      editReceipt(data).then(() => {
        this.saveLoading = false
        // not call fetchData
        const index = this.tableData.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.tableData.splice(index, 1, data)
        }
      })
      .catch(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
