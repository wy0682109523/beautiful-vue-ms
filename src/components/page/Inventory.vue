<template>
    <div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 库存管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">

            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-input v-model="query.goodsId" placeholder="商品ID" class="handle-input mr10"></el-input>
                <el-input v-model="query.goodsQuantity" placeholder="库存数量" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>

            <el-table
                    :data="inventoryList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="goodsQuantity" label="库存数量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" @click="popupUpdateInventoryDialog(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.offset"
                        :page-size="query.limit"
                        :total="totalSize"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>

            <el-dialog title="修改库存" :visible.sync="updateInventoryDialogVisible" width="30%">
                <el-form ref="updateInventoryParam" :model="updateInventoryParam" label-width="90px"
                         label-position="left">
                    <el-form-item label="商品Id" prop="goodsId">
                        <el-input v-model="updateInventoryParam.goodsId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goodsQuantity">
                        <el-input v-model="updateInventoryParam.goodsQuantity" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelInventoryUpdateDialog('updateInventoryParam')">取 消</el-button>
                <el-button type="primary" @click="saveInventoryUpdateData('updateInventoryParam')">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { deleteInventory, deleteInventoryList, getInventoryList, updateInventory } from '../../api/index';

    export default {
        name: 'inventory',
        data() {
            return {
                query: {
                    goodsId: null,
                    goodsQuantity: null,
                    offset: 1,
                    limit: 10
                },
                deleteParam: {
                    goodsId: null
                },
                deleteListParam: {
                    goodsIdList: []
                },
                updateInventoryParam: {},
                inventoryList: [],
                multipleSelection: [],
                totalSize: 0,
                updateInventoryDialogVisible: false
            };
        },
        created() {
            this.getInventoryData();
        },
        methods: {
            // 获取库存列表
            getInventoryData() {
                getInventoryList(this.query).then(response => {
                    this.inventoryList = response.result.inventoryList;
                    this.totalSize = response.result.totalSize;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getInventoryData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteParam.goodsId = row.goodsId;

                        deleteInventory(this.deleteParam);
                        //表单伪刷新或者重新拉取数据
                        this.inventoryList.splice(index, 1);

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

                        deleteInventoryList(this.deleteListParam).then(() => {

                            //删除之后再刷新页面
                            this.$message.success(`删除成功`);

                            this.$set(this.query, 'offset', this.getJumpPage(this.deleteListParam.goodsIdList.length));

                            this.getInventoryData();
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
                this.$set(this.query, 'offset', val);
                this.getInventoryData();
            },
            //跳转第几页
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.query.limit);
            },
            popupUpdateInventoryDialog(index, row) {
                this.updateInventoryParam = row;
                this.updateInventoryDialogVisible = true;
            },
            saveInventoryUpdateData(formName) {
                updateInventory(this.updateInventoryParam).then(() => {
                    this.$message.success('修改成功');
                }).catch(() => {
                    this.$message.error('修改失败');
                });

                this.updateInventoryDialogVisible = false;
            },
            //取消库存表单
            cancelInventoryUpdateDialog(formName) {
                this.updateInventoryDialogVisible = false;
                this.$refs[formName].clearValidate();
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