<template>
  <el-card class="box-card" shadow="always">
    <div slot="header" style="height: 40px">
      <!--      <span>订单信息管理</span>-->
      <el-input
        style="width: 300px;position: absolute;right: 150px;"
        placeholder="输入订单号进行搜索"
        prefix-icon="el-icon-search"
        v-model="search"
        clearable
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" style="float: right;" @click="fetchData">搜索</el-button>

    </div>
    <el-table
      ref="multipleTable"
      :loading="listLoading"
      :data="list"

      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <!--<el-table-column
        type="selection"
        sortable
        width="30"/>-->
      <el-table-column
        prop="orderId"

        sortable
        label="编号"/>

      <el-table-column
        prop="payOrderId"
        label="订单号"/>
      <el-table-column
        prop="orderType"
        label="预订方式">
      </el-table-column>
      <el-table-column
        prop="roomType"
        label="房间类型"/>
      <el-table-column
        prop="name"
        label="预订人姓名"/>
      <el-table-column
        prop="phone"
        width="110"
        label="预留手机号">
      </el-table-column>
      <el-table-column
        prop="orderDate"
        label="预订日期">
        <template slot-scope="scope">
          <span>{{ scope.row.orderDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderDays"
        label="预定天数">
      </el-table-column>
      <el-table-column
        label="订单状态">
        <template slot-scope="scope">
          <!--          {{ scope.row.orderStatus | getOrderStatus }}-->
          <span v-if="scope.row.orderStatus === 1" style="color: green">已支付</span>
          <span v-if="scope.row.orderStatus === 2" style="color: #13a4e8">已消费</span>
          <span v-if="scope.row.orderStatus === 0" style="color: orange">未支付</span>
          <span v-if="scope.row.orderStatus === -1" style="color: red">已取消</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="订单消费">
        <template slot-scope="scope">
          ￥ {{ scope.row.orderCost }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">

          <i class="el-icon-time"/>
          <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间">
        <template slot-scope="scope">

          <i class="el-icon-time"/>
          <span style="margin-left: 10px">{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-popover
              v-model="scope.row.visible2"
              placement="top"
              width="160">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" round @click="scope.row.visible2 = false">取消</el-button>
                <el-button type="danger" size="mini" round @click="handleDel(scope.row)">确定</el-button>
              </div>
              <el-button slot="reference" :loading="scope.row.loading" size="mini" type="danger"
                         @click="scope.row.visible2 = true">删除
              </el-button>
            </el-popover>
          </template>
        </el-table-column>-->

    </el-table>

    <div style="padding: 14px;">
      <div class="bottom">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import { delOrder, getAllOrder } from '../../api/order'

export default {
  name: 'Order',
  data() {
    return {
      total: 7,//总条数
      currentPage: 1,//当前页
      pageSize: 10,
      search: '',//查询的关键字
      list: [{}, {}, {}, {}],
      visible2: false,
      loading: null,
      listLoading: false,
      multipleSelection: null
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    fetchData() {
      getAllOrder(this.currentPage,this.pagesize,this.search).then(response => {
        console.log(response)
        this.list = response.data.list
        this.total=response.data.total
        this.list.reverse()
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.toString()
        })
      })
    },
    navigateTo(val) {
      this.$router.push('/order/' + val)
    },
    massDeletion() {
    },
    handleDel(row) {
      row.visible2 = false
      row.loading = true
      delOrder(row.orderId).then(response => {
        const res = response
        if (res.code === 1000) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.list = null
          row.loading = false
          this.fetchData()
        } else {
          this.$message({
            message: '删除失败！',
            type: 'error'
          })
        }
      }).catch(error => {
        row.loading = false
        console.log(error)
      })
      row.loading = false
      this.fetchData()
    },
    handleEdit(index, row) {
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange() {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>
