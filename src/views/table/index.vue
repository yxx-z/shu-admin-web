<template>
  <div class="app-container">
    <div class="query">
      <el-form ref="queryForm" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="账号">
          <el-input v-model="formInline.loginCode" placeholder="账号" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formInline.loginName" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formInline.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      <el-table-column label="账号" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginCode }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="学号" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-popconfirm class="editButton" title="确定下线该用户吗？" @confirm="handleOff(scope.row.id)">
            <el-button slot="reference" type="primary" size="mini">下线</el-button>
          </el-popconfirm>
          <el-popconfirm class="editButton" icon="el-icon-warning" title="确定封禁该用户吗？" @confirm="handleBanned(scope.row.id)">
            <!-- <el-button slot="reference" type="danger" size="mini">封禁</el-button> -->
            <el-button v-if="scope.row.disable" slot="reference" type="warning" size="mini">解封</el-button>
            <el-button v-else slot="reference" type="danger" size="mini">封禁</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :pager-count="5" :page-count="pages" :total="pageTotal" @current-change="handlePageChange" @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { getList, kickOut, banned } from '@/api/table'

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
      listLoading: true,
      pages: null,
      pageTotal: null,
      // 当前页码 默认值
      page: 1,
      // 页面大小 默认值，根据实际情况设置
      pageSize: 10,
      formInline: {
        loignCode: '',
        loginName: '',
        email: ''
      }
    }
  },
  created() {
    const data = {
      page: this.page,
      pageSize: this.pageSize
    }
    this.fetchData(data)
  },
  methods: {
    // // 重置
    resetForm() {
      this.formInline.loginCode = ''
      this.formInline.loginName = ''
      this.formInline.email = ''
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        loginCode: this.loginCode,
        loginName: this.loginName,
        email: this.email
      }
      this.fetchData(data)
    },
    // 下线用户
    handleOff(id) {
      const data = {
        id
      }
      this.kickOutMethod(data)
    },
    // 封禁用户
    handleBanned(id) {
      const data = {
        id
      }
      this.bannedMethod(data)
    },
    // 条件搜索
    onSubmit() {
      const data = {
        loginCode: this.formInline.loginCode,
        loginName: this.formInline.loginName,
        email: this.formInline.email,
        page: this.page,
        pageSize: this.pageSize
      }
      console.log('submit!')
      this.fetchData(data)
    },

    // 更改分页页面大小
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize
      const data = {
        loginCode: this.formInline.loginCode,
        loginName: this.formInline.loginName,
        email: this.formInline.email,
        page: this.page,
        pageSize: newPageSize
      }
      // 发送网络请求给后端接口，将新的页码传递过去
      this.fetchData(data)
    },

    handlePageChange(newPage) {
      // 当页码改变时，触发该方法
      this.page = newPage
      const data = {
        loginCode: this.formInline.loginCode,
        loginName: this.formInline.loginName,
        email: this.formInline.email,
        page: this.page,
        pageSize: this.pageSize
      }
      // 发送网络请求给后端接口，将新的页码传递过去
      this.fetchData(data)
    },

    // 分页方法
    fetchData(data) {
      this.listLoading = true
      getList(data).then(response => {
        this.list = response.data.records
        this.pages = response.data.pages
        this.pageTotal = response.data.total
        this.listLoading = false
      })
    },

    // 下线用户方法
    kickOutMethod(data) {
      kickOut(data).then(response => {
        this.$message({
          message: '下线' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
        const data = {
          loginCode: this.loginCode,
          loginName: this.loginName,
          email: this.email,
          page: this.page,
          pageSize: this.pageSize
        }
        this.fetchData(data)
      })
    },

    // 封禁用户方法
    bannedMethod(data) {
      banned(data).then(response => {
        this.$message({
          message: '操作' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
        const data = {
          loginCode: this.loginCode,
          loginName: this.loginName,
          email: this.email,
          page: this.page,
          pageSize: this.pageSize
        }
        this.fetchData(data)
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

.app-container .query{
  margin-bottom: 12px;
}

.editButton {
  margin-right: 4px;
  margin-left: 4px;
}

.el-pagination{
  margin-top: 20px;
  text-align: center;
}
.custom-link {
  /* 设置链接之间的右侧边距 */
  margin-right: 10px;
  /* 设置链接之间的右侧边距 */
  margin-left: 10px;
}
</style>
