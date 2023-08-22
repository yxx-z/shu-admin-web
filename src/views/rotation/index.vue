<template>
  <div class="app-container">

    <div class="query">
      <el-form ref="queryForm" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="轮播图ID">
          <el-input v-model="formInline.id" placeholder="轮播图ID" />
        </el-form-item>

        <el-form-item label="文件名">
          <el-input v-model="formInline.fileName" placeholder="文件名" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.fileStatus" placeholder="状态" @change="statusChanged">
            <el-option label="上线" value="true" />
            <el-option label="下线" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button :round="true" type="primary" @click="onSubmit">查询</el-button>
          <el-button :round="true" type="info" @click="resetForm">重置</el-button>

          <el-button :round="true" type="danger" @click="dialogFormVisible = true">新增</el-button>
          <el-dialog title="新增轮播图" :visible.sync="dialogFormVisible" class="custom-dialog">
            <el-form ref="dialogForm" :model="form">
              <el-form-item label="排序" style="margin-bottom: 15px;">
                <el-input v-model="form.sort" autocomplete="off" style="margin-left: 10px;width: 310px;" />
              </el-form-item>
              <br>
              <el-form-item label="时间" style="margin-bottom: 15px;">
                <el-date-picker v-model="form.validTime" type="datetime" placeholder="选择过期时间" style="margin-left: 10px;width: 310px;" />
              </el-form-item>
              <el-upload
                class="upload"
                drag
                action="http://127.0.0.1:6059/file/upload"
                :headers="header"
                multiple
                :on-success="handleSuccess"
                :on-change="handleChange"
                :show-file-list="show"
                :file-list="fileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件, 且不超过10MB</div>
              </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="clearForm">取 消</el-button>
              <el-button type="primary" @click="sendDataToBackend">确 定</el-button>
            </div>
          </el-dialog>

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

      <el-table-column label="轮播图ID" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="文件" width="400" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" style="max-height: 180px; width: auto;" />
        </template>
      </el-table-column>

      <el-table-column label="文件名称" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="排序" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="过期时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.validTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="140">
        <!-- <template slot-scope="scope">
          <span v-if=" scope.row.onLine">上线</span>
          <span v-else>下线</span>
        </template> -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.onLine"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上线"
            inactive-text="下线"
            @change="changeFileStatus(scope.row.id)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editRowData(scope.row.id)">编辑</el-button>
          <el-dialog title="编辑轮播图" :visible.sync="editFormVisible" class="custom-dialog">
            <el-form ref="editForm" :model="editForm">
              <el-form-item label="排序" style="margin-bottom: 15px;">
                <el-input v-model="editForm.sort" autocomplete="off" style="margin-left: 10px;width: 310px;" />
              </el-form-item>
              <br>
              <el-form-item label="时间" style="margin-bottom: 15px;">
                <el-date-picker v-model="editForm.validTime" type="datetime" placeholder="选择过期时间" style="margin-left: 10px;width: 310px;" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="clearEditForm">取 消</el-button>
              <el-button type="primary" @click="saveEditForm">确 定</el-button>
            </div>
          </el-dialog>

          <el-popconfirm class="editButton" icon="el-icon-warning" title="确定删除该图片吗？" @confirm="handleBanned(scope.row.id)">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :pager-count="5" :page-count="pages" :total="pageTotal" @current-change="handlePageChange" @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { rotationPage, fileDel, onLine, saveRotation, editRotation } from '@/api/file'

export default {
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
        onLine: null,
        id: null,
        fileName: null
      },
      fileList: [],
      show: true,
      header: {
        Authorization: getToken()
      },
      dialogFormVisible: false,
      editFormVisible: false,
      editForm: {
        sort: null,
        validTime: null
      },
      form: {
        sort: null,
        validTime: null,
        fileId: null
      },
      id: null
    }
  },
  // 进入页面后调用该方法
  created() {
    const data = {
      page: this.page,
      pageSize: this.pageSize
    }
    this.fetchData(data)
  },
  methods: {
    // 图片上传成功后调用的方法
    handleSuccess(response, file, fileList) {
      // 在上传成功时调用的回调函数
      // response 是服务器响应
      // file 是当前上传的文件对象
      // fileList 是上传文件列表
      // 处理上传成功后的逻辑，例如更新界面或保存文件信息
      if (response.code !== 200) {
        this.fileList = []
        this.$message.error(response.message)
      } else {
        this.form.fileId = response.data[0].id
        this.$message({
          message: '上传' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },

    // 多次上传 取最后上传的文件数据
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },

    editRowData(data) {
      this.editFormVisible = true
      this.id = data
    },

    // 编辑保存
    saveEditForm() {
      const data = {
        id: this.id,
        sort: this.editForm.sort,
        validTime: this.editForm.validTime
      }
      this.editRotation(data)
      this.editFormVisible = false
    },

    // 新增唤起的弹窗 保存按钮事件
    sendDataToBackend() {
      if (this.form.fileId === null) {
        this.$message.error('请先上传图片')
      } else {
        const data = {
          fileId: this.form.fileId,
          sort: this.form.sort,
          validTime: this.form.validTime
        }
        this.saveRotationMethod(data)
        this.dialogFormVisible = false
      }
    },

    // 保存轮播图
    saveRotationMethod(data) {
      this.listLoading = true
      saveRotation(data).then(response => {
        this.$message({
          message: '保存' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
      })
      // 刷新页面
      const req = {
        page: this.page,
        pageSize: this.pageSize
      }
      this.fetchData(req)
      this.clearForm()
    },

    // 编辑轮播图
    editRotation(data) {
      this.listLoading = true
      editRotation(data).then(response => {
        if (response.code !== 200) {
          this.$message.error(response.message)
        } else {
          this.$message({
            message: '编辑' + response.message,
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
      // 刷新页面
      const req = {
        page: this.page,
        pageSize: this.pageSize
      }
      this.fetchData(req)
      this.clearEditForm()
    },

    // 清空表单数据
    clearForm() {
      // 清空上传列表
      this.fileList = []
      this.form.sort = null
      this.form.validTime = null
      this.form.fileId = null
      this.dialogFormVisible = false
    },

    // 清空编辑表单数据
    clearEditForm() {
      this.editForm.sort = null
      this.editForm.validTime = null
      this.editFormVisible = false
    },

    // 分页查询
    fetchData(data) {
      this.listLoading = true
      rotationPage(data).then(response => {
        this.list = response.data.records
        this.pages = response.data.pages
        this.pageTotal = response.data.total
        this.listLoading = false
      })
    },

    // 分页 页面大小改变后调用该方法
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize
      const data = {
        onLine: this.formInline.onLine,
        id: this.formInline.id,
        fileName: this.formInline.fileName,
        page: this.page,
        pageSize: newPageSize
      }
      // 发送网络请求给后端接口，将新的页码传递过去
      this.fetchData(data)
    },

    // 分页 页码改变后调用该方法
    handlePageChange(newPage) {
      // 当页码改变时，触发该方法
      this.page = newPage
      const data = {
        onLine: this.formInline.onLine,
        id: this.formInline.id,
        fileName: this.formInline.fileName,
        page: this.page,
        pageSize: this.pageSize
      }
      // 发送网络请求给后端接口，将新的页码传递过去
      this.fetchData(data)
    },

    // 当状态发生变化时，newValue 将包含用户选择的状态值
    statusChanged(newValue) {
      this.formInline.onLine = newValue
    },

    // 条件搜索
    onSubmit() {
      const data = {
        onLine: this.formInline.onLine,
        id: this.formInline.id,
        fileName: this.formInline.fileName,
        page: this.page,
        pageSize: this.pageSize
      }
      this.fetchData(data)
    },

    // 重置
    resetForm() {
      this.formInline.onLine = null
      this.formInline.id = null
      this.formInline.fileName = null
      this.formInline.fileStatus = null
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        onLine: this.formInline.onLine,
        id: this.formInline.id,
        fileName: this.formInline.fileName
      }
      this.fetchData(data)
    },

    // 点击删除按钮调用的事件
    handleBanned(id) {
      const data = {
        id
      }
      // 删除文件方法
      this.fileDelMethod(data)
    },

    // 删除文件方法
    fileDelMethod(data) {
      this.listLoading = true
      fileDel(data).then(response => {
        this.$message({
          message: '删除' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          onLine: this.formInline.onLine,
          id: this.formInline.id,
          fileName: this.formInline.fileName
        }
        this.fetchData(data)
      })
    },

    // 改变文件上下线状态时调用的事件
    changeFileStatus(id) {
      // 调用改变状态方法
      const data = {
        id: id
      }
      this.onLineMethod(data)
    },

    // 调用改变状态方法
    onLineMethod(data) {
      this.listLoading = true
      onLine(data).then(response => {
        this.$message({
          message: '操作' + response.message,
          type: 'success',
          duration: 5 * 1000
        })
        const data = {
          page: this.page,
          pageSize: this.pageSize,
          onLine: this.formInline.onLine,
          id: this.formInline.id,
          fileName: this.formInline.fileName
        }
        this.fetchData(data)
      })
    }

  }
}
</script>

<style>
  .app-container {
    text-align: center;
    padding: 20px;
  }

  .query{
    margin-bottom: 12px;
  }

  .editButton {
    margin-right: 7px;
    margin-left: 7px;
  }

  .custom-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* 让外部最大弹窗占据整个可见窗口的高度 */
    overflow: auto; /* 如果内容过多，允许滚动 */
  }

  /* 自定义弹窗的标题样式 */
  .custom-dialog .el-dialog__header {
    background-color: #409EFF; /* 设置标题栏背景颜色 */
    color: #fff; /* 设置标题栏文字颜色 */
  }

  /* 自定义弹窗的内容样式 */
  .custom-dialog .el-dialog__body {
    padding: 20px; /* 设置内容区域内边距 */
  }

  /* 自定义底部按钮样式 */
  .custom-dialog .el-dialog__footer {
    text-align: center; /* 设置按钮居中对齐 */
  }

</style>

