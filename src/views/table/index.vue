<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :border="true"
      :fit="true"
      :highlight-current-row="false"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginCode }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="学号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">踢下线</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">禁止登录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const data = {
        page: 1,
        pageSize: 10
      }
      this.listLoading = true
      console.log('============')
      console.log(data)
      console.log('============')
      getList(data).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  /* 100% 屏幕宽度减去左右 20px 的间距 */
  width: calc(100% - 40px);
   /* 设置左右 20px 的外边距 */
  margin: 0 20px;
}
.custom-link {
  /* 设置链接之间的右侧边距 */
  margin-right: 10px;
  /* 设置链接之间的右侧边距 */
  margin-left: 10px;
}
</style>
