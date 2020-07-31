<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 敏感字管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="addComment">新增</el-button>
            </div>

            <div>
                <div v-for="(item,index) in tableData" style="display: inline-block;margin: 7px;" >
                    <el-button type="success"
                               round  class="but" title="点击删除"  @click="deleteRow(item.id)" >{{item.str}}</el-button>
                </div>
            </div>
        </div>

        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
            </el-pagination>
        </div>


        <el-dialog title="添加敏感字" :visible.sync="addboolean" width="30%" :close-on-click-modal="closeOnClickModal">
            <el-form  label-width="100px">
                <el-form-item required="" label="敏感字">
                    <el-input  v-model="str"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addboolean = false">取 消</el-button>
                <el-button @click="add"  >保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'banner',
        data() {
            return {
                content:'',
                tableData: [],
                str:'',
                addboolean:false,
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [200,500,1000],
                // 默认每页显示的条数（可修改）
                PageSize: 200,

            };
        },

        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {

                this.$axios
                    .post("/sensitivity/query", {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                    })
                    .then(res => {
                        this.tableData = res.data.list;
                        this.totalCount = res.data.count;
                    });
            },
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize = val
                // 点击每页显示的条数时，显示第一页
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage = 1;
                this.getData();
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData();
            },
            addComment(){
                this.addboolean = true;
                this.str='';
            },
            add() {
                if(this.str==''|| this.str.trim().length<1){
                    this.$message.error("未填写关键字");
                    return;
                }
                this.$axios
                    .post("/sensitivity/add", {str:this.str.trim()})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success("添加成功");
                        this.getData();
                        this.addboolean = false;
                    });
            },

            // 确定删除
            deleteRow(id) {
                this.$axios
                    .post("/sensitivity/delete", {id:id})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success("删除成功");
                        this.getData();
                    });
            },

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }


    .but{
        background-color: rgb(127, 145, 173)
    }
   .but:hover{
       border-color: red;
       color: red;
       background-color:rgb(50, 65, 87)

   }

</style>
