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
                <el-input v-model="query.goodsNo" placeholder="商品编号" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.goodsName" placeholder="商品名称" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.quantity" placeholder="库存数量" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh-right" @click="restoreSearch">重置</el-button>
            </div>

            <el-table
                    :data="inventoryList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :span-method="mergeRow"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header">
                <el-table-column prop="goodsNo" label="商品编号" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="lotNo" label="批次编号" align="center"></el-table-column>
                <el-table-column prop="quantity" label="库存数量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" @click="popupUpdateInventoryDialog(scope.$index, scope.row)">修改
                        </el-button>
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
                    <el-form-item label="商品编号" prop="goodsNo">
                        <el-input v-model="updateInventoryParam.goodsNo" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="批次编号" prop="lotNo">
                        <el-input v-model="updateInventoryParam.lotNo" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="quantity">
                        <el-input v-model="updateInventoryParam.quantity" clearable></el-input>
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
    import { getInventoryList, updateInventory } from '../../api/InventoryApi';

    export default {
        name: 'inventory',
        data() {
            return {
                query: {
                    offset: 1,
                    limit: 10
                },
                updateInventoryParam: {},
                inventoryList: [],
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
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getInventoryData();
            },
            restoreSearch() {
                this.query = {
                    offset: 1,
                    limit: 10
                };

                this.handleSearch();
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
            },
            mergeRow({ row, column, rowIndex, columnIndex }) {
                if (false) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
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