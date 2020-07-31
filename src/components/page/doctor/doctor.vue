<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades">用户列表</i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                手机号：
                <el-input v-model="query.phone" placeholder="手机号" class="handle-input"></el-input>

                账号状态：
                <el-select v-model="query.status" placeholder="诊断状态">
                    <el-option key=""
                               label="全部"
                               value="">
                    </el-option>
                    <el-option
                            key="yes"
                            label="正常"
                            value="yes">
                    </el-option>
                    <el-option
                            key="no"
                            label="封禁"
                            value="no">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search" class="handle-input-search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addDoc" class="handle-input-search">添加</el-button>
            </div>

            <el-table
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column label="ID" width="100" prop="id"></el-table-column>
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <img :src="scope.row.head" alt="" min-width="50" height="50">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="name" align="center"></el-table-column>
                <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
                <el-table-column label="性别" prop="gender" align="center"></el-table-column>
                <el-table-column label="地区" prop="region" align="center"></el-table-column>
                <el-table-column label="生日" prop="birthday" align="center" :formatter="strBirthday"></el-table-column>
                <el-table-column label="医疗机构" prop="organ" align="center"></el-table-column>
                <el-table-column label="注册时间" prop="createTime" align="center" :formatter="dealTime"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status==='yes'" type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('yes', scope.row)">封禁
                        </el-button>
                        <el-button v-else type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('no', scope.row)">解除封禁
                        </el-button>
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
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


        <el-dialog title="添加/编辑" :visible.sync="addStatus">
            <el-form :model="form">
                <el-row :gutter="20">
                    <el-col :span="15">名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input v-model="doc.name"
                                                                                              class="handle-update"/>
                    </el-col>
                    <el-col :span="15">手机号：&nbsp;&nbsp;&nbsp;<el-input v-model="doc.phone" class="handle-update" />
                    </el-col>
                    <el-col :span="15">性别：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-select v-model="doc.gender" placeholder="请选择">
                            <el-option
                                    key="男"
                                    label="男"
                                    value="男">
                            </el-option>
                            <el-option
                                    key="女"
                                    label="女"
                                    value="女">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="15">地区：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input v-model="doc.region"
                                                                                              class="handle-update"/>
                    </el-col>
                    <el-col :span="15">生日：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-date-picker
                                v-model="doc.birthday"
                                type="date"
                                format="yyyy/MM/dd"
                                value-format="yyyy/MM/dd"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="15">医疗机构：
                        <el-input v-model="doc.organ" class="handle-update"/>
                    </el-col>
                    <el-col :span="15">初始密码：
                        <el-input v-model="doc.password" placeholder="123456" class="handle-update" disabled />
                    </el-col>
                    <el-col :span="15">
                        <UpLoad
                                class="upload"
                                idName="dateId"
                                :onUpLoadSuccess="imgsuccess3"
                                :onUpLoadError="onUpLoadError"
                                :multiple="true"
                                :drag="true"
                                :show-file-list="true"
                                accept="image/*"
                                :fileList="datelist"
                                :filesNumber="7">
                        </UpLoad>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addStatus = false">取 消</el-button>
                <el-button type="primary" @click="addDocConfirm">确 定</el-button>
            </div>
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
                datelist: [],
                selectVisible: false,
                friendData: [],
                //user集合
                data: [],
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                addStatus: false,
                //展示的数据
                showData: {},

                // 默认显示第几页
                currentPage1: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount1: 0,
                // 个数选择器（可修改）
                pageSizes1: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize1: 10,

                model: [],
                date: {},
                friend: {},
                car: {},
                form: {},
                showVisible: false,//控制显示查看弹出层
                addVisible: false,//修改弹出框
                dateVisible: false,
                friendVisible: false,
                carVisible: false,
                //查询条件
                query: {
                    phone: '',
                    //用户状态
                    status: '',

                },
                doc: {
                    id: '',
                    name: '',
                    phone: '',
                    gender: '',
                    region: '',
                    birthday: '',
                    organ: '',
                    head: '',
                    status: 'yes',
                    doctor: 'yes',
                }

            };
        },
        created() {
            this.getData();
        },
        filters: {

            arrJoin(arr) {
                if (arr == null) {
                    return "";
                }
                return arr.join(",");
            },

            strBirthday(strBirthday) {
                if (strBirthday != null) {
                    let date1 = new Date(strBirthday);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                } else {
                    return '';
                }
            },

            FormatData: (value) => {
                return value ? value : "无";
            },

            /*根据出生日期算出年龄*/
            jsGetAge(strBirthday) {
                if (!strBirthday) return '无';
                const date = new Date(strBirthday.time),
                    birthYear = date.getFullYear(),
                    birthMonth = date.getMonth() + 1,
                    birthDay = date.getDate();
                let returnAge;

                const d = new Date();
                const nowYear = d.getFullYear();
                const nowMonth = d.getMonth() + 1;
                const nowDay = d.getDate();

                if (nowYear == birthYear) {
                    returnAge = 0;//同年 则为0岁
                } else {
                    const ageDiff = nowYear - birthYear; //年之差
                    if (ageDiff > 0) {
                        if (nowMonth == birthMonth) {
                            const dayDiff = nowDay - birthDay;//日之差
                            if (dayDiff < 0) {
                                returnAge = ageDiff - 1;
                            } else {
                                returnAge = ageDiff;
                            }
                        } else {
                            const monthDiff = nowMonth - birthMonth;//月之差
                            if (monthDiff < 0) {
                                returnAge = ageDiff - 1;
                            } else {
                                returnAge = ageDiff;
                            }
                        }
                    } else {
                        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                    }
                }

                return returnAge;//返回周岁年龄

            }
        },
        methods: {
            dateform(time) {
                var date = new Date(time);
                var YY = date.getFullYear() + '/';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return YY + MM + DD;
            },
            handleEdit(index, row) {
                this.doc.id = row.id;
                this.doc.name = row.name;
                this.doc.phone = row.phone;
                this.doc.gender = row.gender;
                this.doc.region = row.region;
                this.doc.birthday = this.dateform(row.birthday);
                this.doc.organ = row.organ;
                this.doc.head = row.head;
                this.doc.status = row.status;
                this.doc.doctor = row.doctor;
                this.addStatus = true;
            },
            addDocConfirm() {

                if (this.doc.id == '') {
                    this.doc.password = '123456';
                    this.$axios({
                        url: '/user/addDoctor',
                        method: 'POST',
                        data: this.doc,
                    }).then(res => {
                        if (res.code=='00000') {
                            this.$message.success( "成功");
                            this.getData();
                            this.addStatus = false;
                        }
                    })
                } else {
                    delete this.doc.id
                    this.doc.password = '';
                    this.$axios({
                        url: '/user/updateUser',
                        method: 'POST',
                        data: this.doc,
                    }).then(res => {
                        if (res.code=='00000') {
                            console.log(res);
                            this.$message.success( "成功");
                            this.getData();
                            this.addStatus = false;
                        }
                    })
                }
            },
            imgsuccess3(res, file) {
                this.doc.head = res;
            },
            onUpLoadError(err) {
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
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
            addDoc() {
                this.addStatus = true;
            },
            handleSizeChange1(val) {
                // 改变每页显示的条数
                this.PageSize1 = val;
                // 点击每页显示的条数时，显示第一页
                this.currentPage1 = 1;
                this.getFriend();
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
            },
            // 显示第几页
            handleCurrentChange1(val) {
                // 改变默认的页数
                this.currentPage1 = val;
                // 切换页码时，要获取每页显示的条数
                this.getFriend()
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/user/queryDoctor", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    ...this.query,
                    diagnose: this.query.diagnose
                }).then(res => {
                    this.data = res.data.records;
                    this.totalCount = res.data.total;
                });
            },
            //根据条件搜索
            search() {
                this.getData();
            },
            userStatus(row) {
                return row.userStatus == 'yes' ? '是' : '否';
            },
            system(row) {
                return row.robotStatus == 'yes' ? '是' : '否';
            },
            statusForm(row) {
                for (let i = 0; i < this.query.certificationOption.length; i++) {
                    if (this.query.certificationOption[i].value == row.certificationStatus) {
                        return this.query.certificationOption[i].key;
                    }
                }
            },
            getFriend() {
                this.$axios
                    .post("/MatchingFriendEd/getFriendsList", {
                        userId: this.userId,
                        pageNo: this.currentPage1,
                        pageSize: this.PageSize1,
                    })
                    .then(res => {
                        this.friendData = res.data.matchingFriendEdBOS;
                        this.totalCount1 = res.data.count;
                    });
            },
            //拉黑
            handleDelete(status, row) {
                let s = status == 'yes' ? 'no' : 'yes';
                let str = status == 'yes' ? '拉黑' : '取消拉黑';
                if (!row.id) {
                    this.$message.error(str + '失败');
                    return;
                }
                this.$confirm('此操作将' + str + '该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/user/updateUser',
                        method: 'POST',
                        data: {
                            id: row.id,
                            status: s,
                        },
                    }).then(res => {
                        if (res) {
                            this.$message.success(str + "成功");
                            this.getData();
                        }
                    });
                })
            },

            //查看单个用户
            getUserById(index, row) {

                this.showData = row;

                this.showVisible = true;
            },
            /**
             * 格式化生日
             * @param strBirthday
             * @returns {string}
             */
            strBirthday(strBirthday) {
                if (strBirthday != null) {
                    let date1 = new Date(strBirthday.birthday);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                } else {
                    return '';
                }
            },

            /**
             * 格式化状态
             */
            formatState(val) {
                return !!val.state && val.state === "underway" ? '进行中' : '已完成'
            },

            /**
             * 格式化时间
             * @param row
             * @returns {string}
             */
            dealTime(row) {
                if (row.createTime != null) {
                    let date1 = new Date(row.createTime);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            friendForm(row) {
                return row.friendsStatus == 'yes' ? '成为好友' : '已取消好友';
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

    .handle-update {
        width: 250px;
        margin-left: 10px;
        line-height: 50px;
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

    .el-row {
        margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }
    .el-col {
        border-radius: 4px;
    }
</style>

