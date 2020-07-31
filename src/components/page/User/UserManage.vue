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

                诊断状态：
                <el-select v-model="query.state" placeholder="诊断状态">
                    <el-option key=""
                               label="全部"
                               value="">
                    </el-option>
                    <el-option
                            key="underway"
                            label="进行中"
                            value="underway">
                    </el-option>
                    <el-option
                            key="accomplish"
                            label="已完成"
                            value="accomplish">
                    </el-option>
                </el-select>

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
                诊断：
                <el-select v-model="query.diagnose" multiple>
                    <el-option
                            key="需拔牙"
                            label="需拔牙"
                            value="需拔牙">
                    </el-option>
                    <el-option
                            key="需磨牙"
                            label="需磨牙"
                            value="需磨牙">
                    </el-option>
                    <el-option
                            key="需去釉"
                            label="需去釉"
                            value="需去釉">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search" class="handle-input-search">搜索</el-button>
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
                <el-table-column label="生日" prop="birthday" align="center" :formatter="dealTime"></el-table-column>
                <el-table-column label="医疗机构" prop="organ" align="center"></el-table-column>
                <el-table-column label="诊断" prop="diagnose" align="center"></el-table-column>
                <el-table-column label="诊断状态" prop="state" align="center" :formatter="formatState"></el-table-column>
                <el-table-column label="注册时间" prop="createTime" align="center" :formatter="dealTime"></el-table-column>

                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="queryProject(scope.$index, scope.row)">
                            查看方案
                        </el-button>
                        <el-button type="text" icon="el-icon-view" @click="queryCase(scope.$index, scope.row)">
                            动态案例
                        </el-button>
                        <el-button type="text" icon="el-icon-view" @click="queryInfo(scope.$index, scope.row)">
                            查看牙套信息
                        </el-button>
                        <el-button v-if="scope.row.status==='yes'" type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('yes', scope.row)">封禁
                        </el-button>
                        <el-button v-else type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('no', scope.row)">解除封禁
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
                :title="`查看${this.form.name}的牙套信息`"
                :visible.sync="showInfoVisible"
                width="70%">
            <el-table :data="infoData">
                <el-table-column property="name" label="名称"></el-table-column>
                <el-table-column property="createTime" label="创建日期" :formatter="dealTime"></el-table-column>
                <el-table-column property="affirmTime" label="确认日期" :formatter="dealTime"></el-table-column>
                <el-table-column property="startTime" label="开始时间" :formatter="dealTime"></el-table-column>
                <el-table-column property="endTime" label="结束时间" :formatter="dealTime"></el-table-column>
                <el-table-column property="num" label="天数"></el-table-column>
                <el-table-column property="status" label="修改日期" :formatter="infoStatus"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="updateInfo(scope.$index, scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="showInfoVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="编辑"
                :visible.sync="updateInfoVisible"
                width="30%"
                :before-close="beforeInfoClose">
            <el-form>
                <el-form-item label="名称">
                    <el-input v-model="infoForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="天数">
                    <el-input v-model="infoForm.num" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="infoForm.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="subInfoFormData">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :title="`查看${this.form.name}的动态案例`"
                :visible.sync="showCaseVisible"
                width="50%">
            <el-table :data="caseData">
                <el-table-column property="createTime" label="上传日期" :formatter="dealTime"></el-table-column>
                <el-table-column property="type" label="类型" :formatter="formatType"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="scope.row.img" target="_blank" title="查看最大化图片">
                                <img :src="scope.row.img" style="width: 300px;height: 300px">
                            </a>
                            <img slot="reference" :src="scope.row.img" style="width: 50px;height: 50px; cursor:pointer">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popconfirm
                                title="确定删除该案例吗？"
                                @onConfirm="delCase(scope.$index, scope.row)">
                            <el-button type="danger" slot="reference">删除案例</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showCaseVisible = false">取 消</el-button>
                <el-button type="success" @click="uploadCaseVisible = true">案例上传</el-button>
                <el-button type="primary" @click="showCaseVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="上传案例"
                :visible.sync="uploadCaseVisible"
                width="30%"
                :before-close="beforeCaseClose">
            <el-form :model="form">
                <el-form-item label="类型">
                    <el-select v-model="caseType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <upLoad idName="uploadCase"
                            :fileList="caseFileList"
                            :onUpLoadSuccess="onCaseUploadSuccess"
                            :onUpLoadError="onCaseUploadError"
                            :filesNumber="1"
                            :showFileList="false"></upLoad>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadCaseVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadCaseVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :title="`查看${this.form.name}的方案`"
                :visible.sync="showQueryVisible"
                width="50%">
            <el-table :data="projectData">
                <el-table-column property="createTime" label="上传日期" :formatter="dealTime"></el-table-column>
                <el-table-column label="方案">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="scope.row.img" target="_blank" title="查看最大化图片">
                                <img :src="scope.row.img" style="width: 300px;height: 300px">
                            </a>
                            <img slot="reference" :src="scope.row.img" style="width: 50px;height: 50px; cursor:pointer">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popconfirm
                                title="确定删除该方案吗？"
                                @onConfirm="delProject(scope.$index, scope.row)">
                            <el-button type="danger" slot="reference">删除方案</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showQueryVisible = false">取 消</el-button>
                <el-button type="success" @click="showVisible = true">方案上传</el-button>
                <el-button type="primary" @click="showQueryVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="上传方案"
                :visible.sync="showVisible"
                width="30%"
                :before-close="beforeClose">
            <el-form :model="form">
                <el-form-item label="图片">
                    <upLoad idName="uploadProject"
                            :fileList="fileList"
                            :onUpLoadSuccess="onUpLoadSuccess"
                            :onUpLoadError="onUpLoadError"
                            :filesNumber="1"
                            :showFileList="false"></upLoad>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showVisible = false">取 消</el-button>
                <el-button type="primary" @click="showVisible = false">确 定</el-button>
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

                //方案
                form: {},
                //方案图片
                fileList: [],
                //案例图片
                caseFileList: [],
                //当前点击查看用户的方案
                projectData: [],
                //动态案例
                caseData: [],
                //牙套信息
                infoData: [],
                //某一条牙套信息
                infoForm: {},

                //案例类型
                options: [{
                    value: 'front',
                    label: '正面图'
                }, {
                    value: 'left',
                    label: '左面图'
                }, {
                    value: 'right',
                    label: '右面图'
                }, {
                    value: 'above',
                    label: '上面图'
                }, {
                    value: 'below',
                    label: '下面图'
                }],

                //日期时间选择器配置参数
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },

                caseType: '',

                showVisible: false,//控制显示查看弹出层
                showQueryVisible: false,
                showCaseVisible: false,
                uploadCaseVisible: false,
                showInfoVisible: false,
                updateInfoVisible: false,
                //查询条件
                query: {
                    phone: '',
                    //诊断状态
                    state: '',
                    //用户状态
                    status: '',
                    //诊断
                    diagnose: ''
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

            // 获取数据
            getData() {
                this.$axios.post("/user/queryUser", {
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

            //封禁与解除封禁
            handleDelete(status, row) {

                let str = status == 'yes' ? '封禁' : '解除封禁';
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
                        url: '/user/updUserStatus',
                        method: 'POST',
                        data: {
                            userId: row.id,
                            status: status,
                        },
                    }).then(res => {
                        if (res) {
                            this.$message.success(str + "成功");
                            this.getData();
                        }
                    });
                })
            },


            //查看方案
            queryProject(index, row) {
                this.form = row;
                this.fondProjectOnceData()
                this.showQueryVisible = true;
            },

            //删除方案
            delProject(index, row) {
                this.$axios.post(
                    '/scheme/delScheme',
                    {id: row.id}
                ).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.fondProjectOnceData();
                    }
                })
            },

            //查看某一个人的方案信息
            fondProjectOnceData() {
                this.$axios.post(
                    '/scheme/queryScheme',
                    {userId: this.form.id}
                ).then(res => {
                    this.projectData = res.data;
                });
            },

            //上传方案成功回调
            onUpLoadSuccess(uploadUrl) {
                if (uploadUrl) {
                    this.$axios.post(
                        '/scheme/addScheme',
                        {userId: this.form.id, img: uploadUrl}
                    ).then(res => {
                        if (res.success) {
                            this.fileList = [];
                            this.fondProjectOnceData()
                            this.$message.success('上传成功');
                        }
                    })
                } else {
                    this.$message.error('上传失败，请刷新后重试');
                }
            },

            //失败回调
            onUpLoadError() {
                this.fileList = [];
                this.$message.error('上传失败，请重新上传');
            },

            //上传动态案例成功回调
            onCaseUploadSuccess(uploadUrl) {
                if (uploadUrl) {
                    if (!this.caseType) {
                        this.$message.error('请选择案例类型');
                        return
                    }
                    this.$axios.post(
                        '/dynamic/addDynamic',
                        {
                            userId: this.form.id,
                            type: this.caseType,
                            img: uploadUrl
                        }
                    ).then(res => {
                        console.log(res)
                        if (res.success) {
                            this.$message.success('上传成功');
                            //清空数据
                            this.caseFileList = [];
                            this.caseType = '';
                            //更新数据
                            this.fondCaseOnceData();
                        }
                    })
                }
            },

            //上传动态案例失败回调
            onCaseUploadError(err) {
                this.caseFileList = [];
                this.$message.error('上传失败，请重新上传');
            },

            /**
             * 关闭页面时 清空数据
             */
            beforeClose(done) {
                this.fileList = [];
                done();
            },

            beforeCaseClose(done) {
                this.caseFileList = [];
                this.caseType = '';
                done();
            },

            beforeInfoClose(done) {

                done();
            },

            /**
             * 动态案例
             */
            queryCase(index, row) {
                this.form = row;

                this.fondCaseOnceData()

                this.showCaseVisible = true;
            },

            //查询某个人的动态案例
            fondCaseOnceData() {
                this.$axios.post(
                    '/dynamic/queryDynamic',
                    {userId: this.form.id}
                ).then(res => {
                    this.caseData = res.data;
                });
            },

            delCase(index, row) {
                this.$axios.post(
                    '/dynamic/delDynamic',
                    {id: row.id}
                ).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功')
                        this.fondCaseOnceData();
                    }
                })
            },

            //点击查询牙套信息
            queryInfo(index, row) {
                this.form = row;
                this.queryInfoOnceData()

                this.showInfoVisible = true;
            },

            //查询某个人的牙套信息
            queryInfoOnceData() {
                this.$axios.post(
                    '/brace/queryBrace',
                    {userId: this.form.id}
                ).then(res => {
                    console.log(res);
                    this.infoData = res.data;
                })
            },

            //点击编辑某一条牙套信息
            updateInfo(index, row) {
                this.infoForm = row;
                this.$set(this.infoForm, 'startTime', new Date(row.startTime))
                this.updateInfoVisible = true;
            },

            //提交编辑
            subInfoFormData() {
                console.log(this.infoForm)
                let date = new Date(this.infoForm.startTime);
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
                let startTime =  y + '/' + m + '/' + d+' '+h+':'+minute+':'+second;
                this.$axios.post(
                    '/brace/updBrace',
                    {
                        id: this.infoForm.id,
                        name: this.infoForm.name,
                        num: this.infoForm.num,
                        startTime: startTime
                    }
                ).then(res=>{
                    console.log(res)
                    if(res.success) {
                        this.$message.success('编辑成功')
                        this.queryInfoOnceData()
                    }
                })
            },

            /**
             * 格式化状态
             */
            formatState(val) {
                return !!val.state && val.state === "underway" ? '进行中' : '已完成'
            },

            //格式化类型
            formatType(val) {
                switch (val.type) {
                    case 'front':
                        return '正面图';
                    case 'left':
                        return '左面图';
                    case 'right':
                        return '右面图';
                    case 'above':
                        return '上面图';
                    case 'below':
                        return '下面图';
                }
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
                    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
                } else {
                    return '';
                }
            },

            //格式化倒计时信息状态
            infoStatus(row) {
                return row.status === 'yes' ? '已确定' : '未确定';
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 150px;
        margin-left: 10px;
        display: inline-block;
    }

    .handle-input-search {
        margin-left: 10px;
    }


    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .el-button + .el-button {
        margin-left: 0;
    }

    .dialog-footer > .el-button + .el-button {
        margin-left: 10px;
    }
</style>

