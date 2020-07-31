<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">意见反馈</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                状态: <el-select v-model="search.status"  placeholder="状态"  style="margin-right:10px;width:100px;">
                <el-option value="" >全部</el-option>
                <el-option
                        v-for="item in statusOption"
                        :key="item.key"
                        :label="item.key"
                        :value="item.value"
                ></el-option>
            </el-select>
                <el-button type="primary" icon="search" @click="_search">搜索</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column
                        prop="createTime"
                        label="提交时间"
                        width="200px"
                        :formatter="dealTimeend"
                >
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true"
                                 prop="content"
                                 label="内容"
                                 >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="userId"
                                 label="用户ID">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="phone"
                                 label="手机号">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="status"
                                 :formatter="statusForm"
                                 label="状态">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="adminName"
                                 label="操作员">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="updateTime"
                                 label="修改时间"
                                 :formatter="updTimeend">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick('yes', scope.row)" type="text" v-if="scope.row.status != 'yes'">已读</el-button>
                        <el-button @click="handleClick('no', scope.row)" type="text" v-if="scope.row.status != 'no'" class="redClass">未读</el-button>
                    </template>
                </el-table-column>
            </el-table>
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

    </div>
    </div>
</template>

<script>
    export default {
        name: 'banner',
        data() {
            return {
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                tableData:[],
                search:{
                    status:'',
                },
                statusOption:[{key:'已读',value:'yes'},{key:'未读',value:'no'}],
                editVisible: false,

                idx: -1
            };
        },
        created() {
            this.getData();

        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        methods: {
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
            updTimeend(row) {
                if (row.updateTime != null) {
                    return this.returnTime(row.updateTime.time);
                } else {
                    return '';
                }
            },
            dealTimeend(row) {
                if (row.createTime != null) {
                    return this.returnTime(row.createTime.time);
                } else {
                    return '';
                }
            },
            returnTime(time) {
                var date1 = new Date(time);
                return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/feedback/getFeedbackListCount", {
                        status: this.search.status ,
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                    })
                    .then(res => {
                        this.tableData = res.data.feedBackResultBOList;
                        this.totalCount=res.data.count;
                    });
            },
            _search() {
                this.getData();
            },
            statusForm(row){
              return row.status=='yes'?"已读":"未读";
            },
            // 更改已读未读
            handleClick(status,row) {
                let str=status=='yes'?'已读':'未读';
                this.$confirm('此操作将标记为 ' + str +' 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .post("/feedback/updFeedback", { id: row.id ,status:status})
                        .then(res => {
                            if (!res.success) {
                                this.$message.success(res.errMsg);
                                return;
                            }
                            this.getData();
                            this.$message.success("修改成功");
                        });
                    }).then(res => {
                        if (res) {
                            this.$message.success(str + "成功");
                            this.getData();
                        }
                    });
            },

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 100px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .mr10 {
        margin-right: 10px;
    }

    .redClass{
     color: red;
    }
</style>
