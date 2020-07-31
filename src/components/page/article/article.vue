<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">科普案例</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addButton" class="handle-input-search">添加</el-button>
            </div>

            <div class="container">
                <el-table
                        v-loading="$store.state.requestLoading"
                        :data="dataTable"
                        border
                        class="table"
                        ref="multipleTable"
                >
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column label="封面图">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="" min-width="120" height="70">
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" :show-overflow-tooltip="true"
                                     :formatter="formatType"></el-table-column>
                    <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="digest" label="摘要" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="name" label="作者" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="status" label="状态" :show-overflow-tooltip="true"
                                     :formatter="formatStatus"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"
                                     :formatter="formmatTime"></el-table-column>
                    <el-table-column prop="content" label="内容" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    @click="handleEdit( scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    type="text"
                                    class="red"
                                    @click="handleDel( scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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

            <!-- 添加文本哦！ -->
            <el-dialog title="添加/编辑文本" :visible.sync="articleVisible" width="70%"
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="form" label-width="100px">

                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="类型">
                                <el-select v-model="form.type" placeholder="请选择">
                                    <el-option
                                            v-for="item in Typeoptions"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标题">
                                <el-input v-model="form.title" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="摘要">
                                <el-input v-model="form.digest" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="作者">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="form.status" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="30">
                            <el-form-item label="封面">
                                <upLoad idName="fm"
                                        class="upload"
                                        :fileList="fileList"
                                        :onUpLoadSuccess="onUpLoadSuccess"
                                        :onUpLoadError="onUpLoadError"
                                        :filesNumber="1"
                                        accept="image/*"
                                        :show-file-list="true"></upLoad>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="40">
                            <el-form-item required="" label="内容">
                                <quill-editor ref="newEditor" v-model="form.content" class="container"></quill-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="articleVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
             </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import upLoad from '../../common/Upload'

    export default {
        name: 'param2',
        data() {
            return {
                // 默认显示第几页
                fileList: [],
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                PageSize: 10,
                // 默认每页显示的条数（可修改）
                dataTable: [],
                articleVisible: false,
                form: {
                    id: '',
                    type: '',
                    img: '',
                    title: '',
                    digest: '',
                    status: '',
                    name: '',
                    createTime: '',
                    content: ''
                },
                options: [{
                    value: 'yes',
                    label: '正常'
                }, {
                    value: 'no',
                    label: '禁用'
                }],
                Typeoptions: [{
                    value: 'article',
                    label: '科普'
                }, {
                    value: 'case',
                    label: '案例'
                }]
            };
        },
        created() {
            this.getData();
        },
        components: {
            quillEditor,
            upLoad
        },
        methods: {

            handleDel(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/artic/delArtic', {
                        id: row.id
                    }).then(res => {
                        if(res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                });

            },
            getData() {
                this.$axios.post("/artic/queryArtic", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                }).then(res => {
                    this.dataTable = res.data.records;
                    this.totalCount = res.data.total;
                });
            },
            saveEdit() {
                delete this.form.createTime;
                if (this.form.id == '') {
                    this.$axios.post("/artic/addArtic", this.form
                    ).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.articleVisible = false;
                    });
                } else {
                    this.$axios.post("/artic/updArtic", this.form
                    ).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.articleVisible = false;
                    });
                }

            },
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
            formatType(row) {
                return row.type == 'article' ? '科普' : '案例';
            },
            formatStatus(row) {
                return row.status == 'yes' ? '正常' : '禁用';
            },
            formmatTime(row) {
                if (row.createTime != null) {
                    let date1 = new Date(row.createTime);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            handleEdit(row) {
                this.form = row;
                console.log(row)
                this.articleVisible = true;

            },
            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(urlArr) {
                console.log(urlArr)
                this.form.img = urlArr;
            },

            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                this.$message.error(`上传失败`);
            },
            addButton() {
                this.form = {
                    id: '',
                    type: '',
                    img: '',
                    title: '',
                    digest: '',
                    status: '',
                    name: '',
                    createTime: '',
                    content: ''
                };
                this.articleVisible = true;
            },
        }
    };
</script>

<style>
    .table {
        width: 100%;
        font-size: 14px;

    }

    .container {
        margin-top: 10px;
    }
</style>
