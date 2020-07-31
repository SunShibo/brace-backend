<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 字典设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            分类：
            <el-select v-model="kid" style="margin-right:10px;width:100px;" placeholder="全部">
                <el-option value="">全部</el-option>
                <el-option
                        v-for="item in keys"
                        :key="item.id"
                        :label="item.key"
                        :value="item.id"
                ></el-option>
            </el-select>
                <el-button type="primary" icon="add" @click="query">查询</el-button>
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="key" label="分类"></el-table-column>
                <el-table-column prop="value" label="值"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="30%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="分类" prop="kid"  :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
                    <el-select v-model="form.kid" >
                        <el-option
                                v-for="item in keys"
                                :key="item.id"
                                :label="item.key"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="值"  prop="value" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
                    <el-input v-model="form.value"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit('form')">确 定</el-button>
             </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {

        name: 'dictionary',
        data() {
            return {
                tableData: [],
                keys: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    kid:'',
                    key: "",
                    value:'',
                },
                idx: -1,
                kid:'',
            };
        },
        created() {
            this.getData();

        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/Dictionary/getDictionaryBOs").then(res => {
                    this.keys = res.data;
                });
                this.$axios.post("/Dictionary/getDic",{
                    kid:this.kid,
                }).then(res => {
                    this.tableData = res.data;
                });
            },
            query(){
              this.getData();
            },
            add() {
                //添加
                this.editVisible = true;
                this.form = {
                    id: '',
                    kid:'',
                    key: "",
                    value:'',
                };
            },
            handleEdit(index, row) {
                this.form = {
                    id: row.id,
                    kid:row.kid,
                    key:row.key,
                    value:row.value,
                };
                this.editVisible = true;
            },

            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fd = JSON.parse(JSON.stringify(this.form));
                        if (this.form.id == "") {
                            delete fd.id;
                            delete fd.key;
                            this.$axios.post("/Dictionary/addDic", fd).then(res => {
                               if (!res.success) {
                                    this.$message.error(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        } else {
                            //编辑
                            this.$axios.post("/Dictionary/updDic", fd).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/Dictionary/delDic", {DcId: '['+this.form.id+']'})
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.tableData.splice(this.idx, 1);
                        this.$message.success("删除成功");
                        this.delVisible = false;
                    });
            },

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }
</style>
