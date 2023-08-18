<template>
  <div class="source">
    <div class="dashboard-text">欢迎: <span>{{ name }}</span></div>
    <el-row v-loading="listLoading" :gutter="20">
      <el-col :span="1" class="align-left-col">
        <div class="data">
          <el-statistic group-separator="," :precision="0" decimal-separator="." :value="userTotal" :title="title">
            <template slot="prefix">
              <i class="el-icon-s-data" style="color:red" />
            </template>
          </el-statistic>
        </div>
        <div class="data">
          <el-statistic group-separator="," :precision="0" decimal-separator="." :value="todayResist" :title="title2">
            <template slot="prefix">
              <i class="el-icon-user-solid" style="color:orange" />
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { recap } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      title: '用户总数',
      title2: '今日注册',
      userTotal: null,
      todayResist: 0,
      listLoading: true
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'email',
      'uid',
      'avatar'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      recap().then(response => {
        this.userTotal = response.data.userTotal
        this.todayResist = response.data.todayResist
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.source {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-text {
  font-size: 18px;
  margin-bottom: 20px;
}

.dashboard-text span {
  font-size: 24px;
  margin: 0;
  padding: 5px 0;
  color: red;
  line-height: normal;
}

.el-row {
  margin-top: 20px;
}

.data {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(255, 1, 1, 0.1);
}

.el-statistic {
  font-size: 36px;
  color: #ff9900;
}

.align-left-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
