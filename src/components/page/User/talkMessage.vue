<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades">说说管理</i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

            </div>

            <el-table
                    :data="talkData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column label="ID" width="100" prop="id"></el-table-column>
                <el-table-column label="用户头像">
                    <template slot-scope="scope">
                        <img :src="scope.row.userHead" alt="" min-width="50" height="50">
                    </template>
                </el-table-column>
                <el-table-column label="用户名" prop="userName" align="center"></el-table-column>
                <el-table-column label="内容" prop="content" align="center"></el-table-column>
                <el-table-column label="发布时间" prop="createTime" align="center" :formatter="dealTime"></el-table-column>

                <el-table-column label="发布图片">
                    <template slot-scope="scope">
                        <el-popover v-for="item in scope.row.imgs" :key="item.id" placement="top-start" trigger="click">
                            <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="item.img" target="_blank" title="查看最大化图片">
                                <el-image :src="item.img" style="width: 300px"/>
                            </a>
                            <el-image slot="reference" :src="item.img"
                                      style="min-width: 80px;height: 80px; cursor:pointer"/>
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-search"
                                   @click="handleFindOnceData(scope.row)">查看评论
                        </el-button>
                        <el-button v-if="scope.row.status==='yes'" type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.row)">封禁
                        </el-button>

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

        <el-dialog
                title="说说评论"
                :visible.sync="showVisible"
                width="70%">
            <el-table :data="infoData">
                <el-table-column property="userName" label="评论人名称"></el-table-column>
                <el-table-column label="评论人头像">
                    <template slot-scope="scope">
                        <img :src="scope.row.userHead" alt="" min-width="50" height="50">
                    </template>
                </el-table-column>
                <el-table-column property="content" label="内容"></el-table-column>
                <el-table-column property="createTime" label="评论时间" :formatter="dealTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" class="red" @click="delInfoData(scope.$index, scope.row)">
                            封禁
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="showInfoVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

    import UpLoad from '../../common/Upload.vue';

    export default {
        name: 'UserManage',
        components: {UpLoad},
        data() {
            return {
                selectVisible: false,
                friendData: [],
                //说说数据
                talkData: [],
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,

                //某一条说说信息
                talkOnceData: {},

                //评论数据
                infoData: [],

                showVisible: false,//控制显示查看弹出层

            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize = val;
                // 点击每页显示的条数时，显示第一页
                this.currentPage = 1;
                this.getData();
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData()
            },

            // 获取说说数据
            getData() {
                this.$axios.post("/talk/queryTalk", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize
                }).then(res => {
                    this.talkData = res.data.records;
                    this.totalCount = res.data.total;
                });
            },
            //封禁
            handleDelete(row) {

                if (!row.id) {
                    this.$message.error('封禁失败');
                    return;
                }
                this.$confirm('此操作不可逆，将封禁该条说说, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/talk/delTalk',
                        method: 'POST',
                        data: {
                            talkId: row.id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("封禁成功");
                            this.getData();
                        }
                    });
                })
            },

            //点击查看评论
            handleFindOnceData(row) {
                this.talkOnceData = row;

                this.findTalkOnceData();

                this.showVisible = true;
            },

            //评论封禁
            delInfoData(index, row) {
                if (!row.id) {
                    this.$message.error('封禁失败');
                    return;
                }
                this.$confirm('此操作不可逆，将封禁该条评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/talk/delTalkCmt',
                        method: 'POST',
                        data: {
                            commentId: row.id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("封禁成功");
                            this.findTalkOnceData();
                        }
                    });
                })
            },

            //查询
            findTalkOnceData() {
                this.$axios.post(
                    '/talk/queryTalkCmt',
                    {talkId: this.talkOnceData.id, pageNo: 1, pageSize: 9999}
                ).then(res => {
                    this.infoData = res.data.records;
                })
            },


            /**
             * 格式化时间
             * @param row
             * @returns {string}
             */
            dealTime(row, column) {
                if (row[column.property] != null) {
                    let date = new Date(row[column.property]);
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();
                    h = h < 10 ? ('0' + h) : h;
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    minute = minute < 10 ? ('0' + minute) : minute;
                    second = second < 10 ? ('0' + second) : second;
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                } else {
                    return '';
                }
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 150px;
        margin-left: 10px;
        display: inline-block;
    }

    .handle-input-search {
        margin-left: 10px;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .divs {
        display: flex;
        justify-content: space-between;
    }

    .text {
        text-align: right;
    }

    .imgs {
        width: 100px;
        height: 80px;
    }

    .interse {
        line-height: 30px;
    }

    .row {
        padding: 5px 0;
    }
</style>

