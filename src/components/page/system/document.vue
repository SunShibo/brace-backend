<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">文档配置</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addarticle()" class="handle-input-search">添加文本
                </el-button>
                <el-button type="primary" icon="search" @click="addText()" class="handle-input-search">添加文章</el-button>
            </div>
            <div class="container">
                <el-table
                        v-loading="$store.state.requestLoading"
                        :data="tableData"
                        border
                        class="table"
                        ref="multipleTable"
                >
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="type" label="类型" :formatter="typeForm"
                                     :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="content" label="解答" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="aid" label="跳转id" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    @click="handleEdit(scope.$index, scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    type="danger"
                                    @click="delleEdit(scope.$index, scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 编辑弹出框 -->
            <el-dialog title="添加跳转文章" :visible.sync="editVisible" width="45%" :close-on-click-modal="closeOnClickModal">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item required="" label="标题">
                        <el-input v-model="form.title" ></el-input>
                    </el-form-item>
                    <el-form-item required="" label="跳转id">
                        <el-input v-model="form.aId" type="number"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveText">确 定</el-button>
             </span>
            </el-dialog>

            <!-- 添加文本哦！ -->
            <el-dialog title="添加/编辑文本" :visible.sync="articleVisible" width="70%"
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="form" label-width="100px">
                    <el-form-item required="" label="标题">
                        <el-input v-model="form.title"></el-input>
                        <quill-editor ref="newEditor" v-model="form.content" class="container"></quill-editor>
                    </el-form-item>
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

    export default {
        name: 'param2',
        data() {
            return {
                datelist: [],
                article: [],
                imgVisible: false,
                articleVisible: false,
                textVisible: false,
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    type: '',
                    title: '',
                    content: '',
                    aId: '',
                },
                idx: -1
            };
        },
        created() {
            this.getData();

        },
        components: {
            quillEditor,
        },
        methods: {
            getData() {
                this.$axios.post("/doc/queryDoc").then(res => {
                    this.tableData = res.data;
                });
            },

            handleEdit(index, row) {
                this.form=row;
                if(row.type=='text'){
                    this.articleVisible=true;
                }else{
                    this.editVisible=true;
                }
            },
            // 保存编辑
            saveEdit() {
                this.form.type = 'text';
                if(this.form.id==null || this.form.id==''){
                    this.$axios.post("/doc/addDoc", this.form
                    ).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.articleVisible = false;
                    });
                }else {
                    this.$axios.post("/doc/updDoc", this.form
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
            saveText() {
                this.form.type = 'article';
                if(this.form.id==null || this.form.id==''){
                    this.$axios.post("/doc/addDoc", this.form
                    ).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.articleVisible = false;
                    });
                }else {
                    this.$axios.post("/doc/updDoc", this.form
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

                this.editVisible=false;
            },

            imgsuccess3(res, file) {
                this.form.values = res;
            },
            imgRemove3(file, fileList) {
            },
            onUpLoadError(err) {
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            typeForm(row) {
                console.log(row.type)
                return row.type == 'text' ? '文本' : '文章';
            }
            ,
            addarticle() {
               this.form = {
                    id: '',
                    type: '',
                    title: '',
                    content: '',
                    aId: '',
                };
                this.articleVisible = true;
            },addText(){
                this.form = {
                    id: '',
                    type: '',
                    title: '',
                    content: '',
                    aId: '',
                };
                this.editVisible=true;
            }
            , delleEdit(index, row) {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/doc/delDoc',
                        method: 'POST',
                        data: {
                            id: row.id
                        },
                    }).then(res => {
                        console.log("sadfhjnlsdhfgjklsdjfjkh")
                        this.$message.success( "成功");
                        this.getData();
                    });

                });
            }
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
