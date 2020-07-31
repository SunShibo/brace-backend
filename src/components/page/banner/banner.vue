<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-upload" @click="addBanner" class="handle-input-search">
                    添加Banner
                </el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column type="index" label="序号" align="center" sortable width="50"></el-table-column>
                <el-table-column label="Banner">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
                            <a :href="scope.row.img" target="_blank" title="查看最大化图片">
                                <img :src="scope.row.img" style="min-width: 300px;">
                            </a>
                            <img slot="reference" :src="scope.row.img" style="min-width: 120px;height: 70px; cursor:pointer">
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>

                        <el-popconfirm
                                title="这是一段内容确定删除吗？"
                                @onConfirm="handleDelete(scope.$index, scope.row)"
                        >
                            <el-button slot="reference"
                                       type="text"
                                       icon="el-icon-delete"
                                       style="color: #ff4d51">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog :title="id ? '编辑': '添加'" :visible.sync="dialogFormVisible" :before-close="beforeClose">
            <el-form>
                <el-form-item label="跳转文章ID">
                    <el-input v-model="tid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <upLoad idName="banner"
                            :fileList="fileList"
                            :onUpLoadSuccess="onUpLoadSuccess"
                            :onUpLoadError="onUpLoadError"
                            :filesNumber="1"
                            :showFileList="false"></upLoad>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="loadData">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import upLoad from '../../common/Upload'

    export default {
        name: "banner",

        components: {upLoad},

        data() {
            return {
                tableData: [],
                multipleSelection: '',
                dialogFormVisible: false,

                tid: 0,
                id: 0,
                uploadUrl: '',

                fileList: [],
            }
        },
        methods: {


            loadData() {
                if (this.uploadUrl && this.id) {//修改
                    this.$axios.post(
                        '/banner/updBan',
                        {id: this.id, tId: this.tid, img: this.uploadUrl}
                    ).then(res => {
                        if (res.success) {
                            this.$message.success('修改成功');
                            this.fileList = [];
                            this.getData()
                        }
                    })
                } else {//添加
                    this.$axios.post(
                        '/banner/addBan',
                        {tId: this.tid, img: this.uploadUrl}
                    ).then(res => {
                        if (res.success) {
                            this.$message.success('上传成功');
                            this.fileList = []
                            this.getData()
                        }
                    })
                }
            },

            /**
             * 上传成功后的回调
             */
            onUpLoadSuccess(uploadUrl) {
                console.log(uploadUrl)
                this.uploadUrl = uploadUrl;
            },

            /**
             * 上传失败后的回调
             */
            onUpLoadError(err) {
                console.log(err)
                this.$message.error('上传失败')
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            /**
             * 添加banner
             */
            addBanner() {
                this.dialogFormVisible = true
            },
            /**
             * 编辑
             * @param index
             * @param row
             */
            handleEdit(index, row) {
                this.id = row.id, this.tid = row.tid, this.uploadUrl = row.img;
                this.dialogFormVisible = true
            },

            /**
             * 删除
             * @param index
             * @param row
             */
            handleDelete(index, row) {
                this.$axios.post(
                    '/banner/delBan',
                    {id: row.id}
                ).then(res =>{
                    if(res.success) {
                        this.$message.success('删除成功')
                        this.getData();
                    }
                })
            },

            //关闭dialog前事件
            beforeClose(done) {
                this.tid = '';
                this.id = 0;
                this.uploadUrl = ''
                done();
            },

            getData() {
                this.$axios.post('/banner/queryBan').then(res => {
                    this.tableData = res.data
                })
            },

        },

        created() {
            this.getData()


        }
    }
</script>

<style scoped>

</style>
