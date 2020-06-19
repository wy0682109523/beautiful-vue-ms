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
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-input v-model="query.goodsId" placeholder="商品ID" class="handle-input mr10"></el-input>
                <el-input v-model="query.goodsName" placeholder="商品名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>

            <el-table
                    :data="goodsList"
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
                <el-table-column prop="goodsName" label="商品数量" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="商品单价" align="center">
                    <template slot-scope="scope">￥ {{scope.row.unitPrice}}</template>
                </el-table-column>
                <el-table-column label="采购价" align="center">
                    <template slot-scope="scope">￥ {{scope.row.purchasePrice}}</template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" @click="popupUpdateGoodsDialog(scope.$index, scope.row)">修改
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

            <el-dialog title="修改库存" :visible.sync="updateGoodsDialogVisible" width="30%">
                <el-form ref="updateGoodsParam" :model="updateGoodsParam" label-width="90px"
                         label-position="left">
                    <el-form-item label="商品Id" prop="goodsId">
                        <el-input v-model="updateGoodsParam.goodsId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="updateGoodsParam.goodsName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价" prop="unitPrice">
                        <el-input v-model="updateGoodsParam.unitPrice" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelGoodsUpdateDialog('updateGoodsParam')">取 消</el-button>
                <el-button type="primary" @click="saveGoodsUpdateData('updateGoodsParam')">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { deleteGoods, deleteGoodsList, getGoodsList, updateGoods } from '../../api/index';

    export default {
        name: 'goods',
        data() {
            return {
                query: {
                    goodsId: null,
                    goodsName: null,
                    offset: 1,
                    limit: 10
                },
                deleteParam: {
                    goodsId: null
                },
                deleteListParam: {
                    goodsIdList: []
                },
                updateGoodsParam: {},
                goodsList: [],
                multipleSelection: [],
                totalSize: 0,
                updateGoodsDialogVisible: false
            };
        },
        created() {
            this.getGoodsData();
        },
        methods: {
            // 获取库存列表
            getGoodsData() {
                getGoodsList(this.query).then(response => {
                    this.goodsList = response.result.goodsList;
                    this.totalSize = response.result.totalSize;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getGoodsData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteParam.goodsId = row.goodsId;

                        deleteGoods(this.deleteParam);
                        //表单伪刷新或者重新拉取数据
                        this.goodsList.splice(index, 1);

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

                        deleteGoodsList(this.deleteListParam).then(() => {

                            //删除之后再刷新页面
                            this.$message.success(`删除成功`);

                            this.$set(this.query, 'offset', this.getJumpPage(this.deleteListParam.goodsIdList.length));

                            this.getGoodsData();
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
                this.getGoodsData();
            },
            //跳转第几页
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.query.limit);
            },
            popupUpdateGoodsDialog(index, row) {
                this.updateGoodsParam = row;
                this.updateGoodsDialogVisible = true;
            },
            saveGoodsUpdateData(formName) {
                updateGoods(this.updateGoodsParam).then(() => {
                    this.$message.success('修改成功');
                }).catch(() => {
                    this.$message.error('修改失败');
                });

                this.updateGoodsDialogVisible = false;
            },
            //取消库存表单
            cancelGoodsUpdateDialog(formName) {
                this.updateGoodsDialogVisible = false;
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

<!-- 选中行颜色 -->
<style>
    .el-table__body tr.current-row > td {
        color: #fff;
        background: #2d8cf0 !important;
    }
</style>