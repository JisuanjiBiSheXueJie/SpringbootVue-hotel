<template>
  <div id="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>快捷操作</span>
          </div>
          <el-button type="primary" @click="dialogFormVisible = true">入住登记</el-button>
          <el-button type="primary" @click="dialogout=true">退房结账</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>当前日期</span>
          </div>
          <p>{{ new Date() | formatDay }}</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>数据展示</span>
          </div>
          <div>系统已注册用户人数：
            <el-tag>{{userCount}}</el-tag>
          </div>
          <div>系统已接受订单数量：
            <el-tag>{{orderCount}}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>客房住宿率</span>
          </div>
          <div id="liveRate" style="left:0;width: 100%;height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>房型比例</span>
          </div>
          <div id="roomType" style="left:0;width: 100%;height: 250px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>订单量</span>
          </div>
          <div id="order" style="left:0;width: 100%;height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>各类型客房订单比例</span>
          </div>
          <div id="orderType" style="left:0;width: 100%;height: 250px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="入住登记" :visible.sync="dialogFormVisible">
      <el-form inline :model="form">
        <el-form-item label="预订人姓名">
          <el-input v-model="form.name" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item label="预留手机号">
          <el-input v-model="form.phone" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findOrder()">查询</el-button>
        </el-form-item>
      </el-form>
      <div v-if="isOrderShown && order!=null" style="font-size: 13px;">
        <span style="font-size: 15px;font-weight: bold"> 订单号：{{ order.payOrderId }}</span><br>
        预订方式： {{ order.orderType }}<br>
        预订房型： {{ order.roomType }}<br>
        预订日期： {{ order.orderDate | formatDay }}<br>
        预订天数： {{ order.orderDays }}天<br>
        预订费用： {{ order.orderCost }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelIn()">取 消</el-button>
        <el-button type="primary" @click="inputInfo">办理入住</el-button>
      </div>


    </el-dialog>

    <el-dialog title="入住人信息" :visible.sync="dialogPersonInfo" width="90%">
      <el-form inline :model="persons" label-width="120px">
        <el-form-item label="入住人">
          <el-input v-model="persons.name" autoComplete="on" style="width:100%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="入住人数">
          <el-input v-model="persons.peoCount" autoComplete="on" style="width:100%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="persons.ids" autoComplete="on" style="width:120%" placeholder="多人以逗号隔开"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div v-if="roomNumShow!==null" style="float: left">
          <span style="font-size: 20px;">入住房间号为：</span>
          <el-tag type="success" effect="plain">{{roomNumShow}}</el-tag>
        </div>
        <el-button type="primary" @click="cancelPerson">关闭</el-button>
        <el-button type="danger" @click="checkIn">确定入住</el-button>
      </div>
    </el-dialog>

    <el-dialog title="退房结账" :visible.sync="dialogout" width="50%">
      <el-form inline :model="rooms" label-width="120px">
        <el-form-item label="房间号">
          <el-input v-model="rooms.roomNumber" autoComplete="on" style="width:100%" placeholder="请输入退房号码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="checkoutEvent">确定</el-button>
      </el-form>


    </el-dialog>
  </div>
</template>

<script>
import { getOrderByNameAndPhone, getOrderCount } from '../../api/order'
import { getAllUser, getUserCount } from '../../api/user'
import { checkIn, checkOut } from '../../api/checkIn'

export default {
  name: 'Home',
  data() {
    return {
      dialogout: false,
      roomNumber: null,
      dialogFormVisible: false,
      dialogPersonInfo: false,
      userCount: 1203,
      orderCount: 12032,
      form: {
        name: '',
        phone: ''
      },
      rooms: {
        roomNumber: null
      },
      persons: {
        name: '',
        peoCount: '',
        ids: '',
        orderId: ''
      },
      roomNumShow: null,
      isOrderShown: false,
      order: {
        payOrderId: 1,
        orderType: null,
        roomType: null,
        orderDays: null,
        orderCost: null
      }
    }
  },
  created: function() {
    this.getCount()
  },
  mounted() {
    this.rtChart()
    this.lrChart()
    this.orderChart()
    this.ortChart()
  },
  methods: {
    //退房申请
    checkoutEvent() {
      checkOut(this.rooms.roomNumber).then(result => {
        console.log(result.data)
        //退房成功
        if (result.code === 1000) {
          this.$message.success('退房成功')
          this.dialogout = false
        } else {
          this.$message.warning('退房失败')
        }
      })
    },
    /*获取订单量和用户数量*/
    getCount() {
      getUserCount().then(response => {
        this.userCount = response.data
      })
      getOrderCount().then(res => {
        this.orderCount = res.data
      })
    },

    rtChart() {
      var rtChart = this.$echarts.init(document.getElementById('roomType'), 'light')
      rtChart.setOption({
        tooltip: {},
        series: [{
          name: '比例',
          type: 'pie',
          radius: '55%',
          data: [
            { value: 35, name: '单人房' },
            { value: 55, name: '大床房' },
            { value: 45, name: '双床房' },
            { value: 55, name: '商务大床房' },
            { value: 45, name: '商务双床房' },
            { value: 35, name: '豪华大床房' }
          ]
        }]
      })
    },
    lrChart() {
      var myChart = this.$echarts.init(document.getElementById('liveRate'), 'light')
      myChart.setOption({

        xAxis: {
          type: 'category',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          axisLabel: {
            formatter: '{value} 月'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [{
          data: [50, 68, 55.4, 53.2, 76.6, 80.6, 47.6, 45.7, 67.2, 58.3, 78.4, 94.2],
          type: 'line'
        }]
      })
    },
    orderChart() {
      var myChart = this.$echarts.init(document.getElementById('order'), 'light')
      myChart.setOption({
        itemStyle: {
          color: '#409EFF'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          axisLabel: {
            formatter: '{value} 月'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 单'
          }
        },
        series: [{
          name: '订单量',
          data: [432, 568, 469, 532, 766, 806, 476, 457, 672, 583, 784, 942],
          type: 'bar'
        }]
      })
    },
    ortChart() {
      var rtChart = this.$echarts.init(document.getElementById('orderType'), 'light')
      rtChart.setOption({
        tooltip: {},
        series: [{
          name: '比例',
          type: 'pie',
          radius: '55%',
          data: [
            { value: 35, name: '单人房' },
            { value: 15, name: '大床房' },
            { value: 10, name: '双床房' },
            { value: 15, name: '商务大床房' },
            { value: 5, name: '商务双床房' },
            { value: 20, name: '豪华大床房' }
          ]
        }]
      })
    },
    cancelIn() {
      this.dialogFormVisible = false
      this.order = null
      this.isOrderShown = false
    },
    cancelPerson() {
      this.dialogPersonInfo = false
      // this.
    },
    findOrder() {
      getOrderByNameAndPhone(this.form).then(res => {
        console.log(res)
        this.order = res.data
      })
      console.log(this.order)
      if (this.order == null) {
        this.$message.warning('找不到相关预订信息！请检查')
        return
      } else {
        this.isOrderShown = true
      }
    },

    inputInfo() {
      console.log(this.order)
      if (this.order !== null) {
        this.dialogFormVisible = false
        // 开启新的提示框
        this.dialogPersonInfo = true
      }
    },
    //todo
    checkIn() {
      console.log('checkin------')

      //输入入住人数、入住人、身份证号
      this.persons.orderId = this.order.payOrderId
      checkIn(this.persons).then(res => {
        console.log(res)
        if (res.code === 1000) {
          this.roomNumShow = res.data.roomNumber
          // this.dialogPersonInfo = false
          this.order = null
          this.isOrderShown = false
        }
      })

    }

  }
}
</script>

<style scoped>

.el-row {
  margin: 10px 5px;
}

.el-card {
  text-align: center;
}
</style>
