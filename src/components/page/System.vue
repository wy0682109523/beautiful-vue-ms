<template>
    <div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 系统配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">

            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="success" icon="el-icon-plus" class="handle-del mr10" @click="popAddDialog">添加系统配置
                </el-button>
                <el-input v-model="queryParam.systemKey" placeholder="请输入系统配置key" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>

            <el-table
                    :data="systemList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="systemKey" label="系统配置-key" align="center"></el-table-column>
                <el-table-column prop="systemValue" label="系统配置-value" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" @click="popUpdateDialog(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="queryParam.offset"
                        :page-size="queryParam.limit"
                        :total="totalSize"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>

            <el-dialog title="添加系统配置" :visible.sync="addDialogVisible" width="30%" center>

                <el-form ref="addParam" :model="addParam" label-width="125px" label-position="left">
                    <el-form-item label="系统配置-key：" prop="systemKey">
                        <el-input v-model="addParam.systemKey" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="系统配置-value：" prop="systemValue">
                        <el-input v-model="addParam.systemValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="addParam.remark" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddDialog('addParam')">取 消</el-button>
                <el-button type="primary" @click="saveAddData">确 定</el-button>
            </span>

            </el-dialog>

            <el-dialog title="修改系统配置" :visible.sync="updateDialogVisible" width="30%" center>

                <el-form ref="updateParam" :model="updateParam" label-width="110px" label-position="left">
                    <el-form-item label="系统配置-key" prop="systemKey">
                        <el-input v-model="updateParam.systemKey" clearable :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="系统配置-value" prop="systemValue">
                        <el-input v-model="updateParam.systemValue" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="updateParam.remark" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdateDialog('updateParam')">取 消</el-button>
                <el-button type="primary" @click="saveUpdateData">确 定</el-button>
            </span>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { addSystem, deleteSystem, deleteSystemList, getSystemList, updateSystem } from '../../api/SystemApi';

    export default {
        name: 'system',
        data() {
            return {
                queryParam: {
                    systemKey: null,
                    offset: 1,
                    limit: 10
                },
                deleteParam: {
                    systemKey: null
                },
                deleteListParam: {
                    systemKeyList: []
                },
                addParam: {},
                updateParam: {},
                systemList: [],
                multipleSelection: [],
                totalSize: 0,
                addDialogVisible: false,
                updateDialogVisible: false
            };
        },
        created() {
            this.getSystemData();
        },
        methods: {
            // 获取库存列表
            getSystemData() {
                getSystemList(this.queryParam).then(response => {
                    this.systemList = response.result.systemList;
                    this.totalSize = response.result.totalSize;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.queryParam, 'offset', 1);
                this.getSystemData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteParam.goodsId = row.goodsId;

                        deleteSystem(this.deleteParam);
                        //表单伪刷新或者重新拉取数据
                        this.systemList.splice(index, 1);

                        this.$set(this, 'totalSize', --this.totalSize);

                        this.$message.success('删除成功');
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {

                // 二次确认删除
                this.$confirm('确定要全部删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {

                        //清空删除参数
                        this.deleteListParam.goodsIdList = [];

                        this.multipleSelection.map((item, index) => {
                            this.deleteListParam.goodsIdList.push(item.goodsId);
                        });

                        deleteSystemList(this.deleteListParam).then(() => {

                            //删除之后再刷新页面
                            this.$message.success(`删除成功`);

                            this.$set(this.queryParam, 'offset', this.getJumpPage(this.deleteListParam.goodsIdList.length));

                            this.getSystemData();
                        });

                        //清空选择项
                        this.multipleSelection = [];
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.queryParam, 'offset', val);
                this.getSystemData();
            },
            //跳转第几页
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.queryParam.limit);
            },
            popAddDialog() {
                this.addParam = {};
                this.addDialogVisible = true;
            },
            saveAddData() {
                addSystem(this.addParam).then(() => {
                    this.$message.success('添加成功');

                    this.$set(this.queryParam, 'offset', 1);

                    this.getSystemData();

                }).catch(() => {
                    this.$message.error('添加失败');
                });

                this.addDialogVisible = false;
            },
            cancelAddDialog(formName) {
                this.addDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            popUpdateDialog(index, row) {
                console.log(row);
                this.updateParam = row;
                this.updateDialogVisible = true;
            },
            cancelUpdateDialog(formName) {
                this.updateDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            saveUpdateData() {
                updateSystem(this.updateParam).then(() => {
                    this.$message.success('更新成功');
                }).catch(() => {
                    this.$message.error('更新失败');
                });

                this.updateDialogVisible = false;
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
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>