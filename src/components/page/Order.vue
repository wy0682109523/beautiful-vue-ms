<template>
    <div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">

            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>

                <el-input v-model="query.orderId" placeholder="订单ID" class="handle-input mr10"></el-input>
                <el-input v-model="query.paymentMethod" placeholder="支付方式" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                    :data="orderList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="orderId" label="订单ID" align="center"></el-table-column>
                <el-table-column prop="orderTime" label="下单时间" align="center"></el-table-column>
                <el-table-column label="订单金额" align="center" sortable>
                    <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
                </el-table-column>

                <el-table-column prop="paymentMethod" label="支付方式" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
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

        </div>
    </div>
</template>

<script>
    import { deleteOrder, deleteOrderList, getOrderList } from '../../api/index';

    export default {
        name: 'order',
        data() {
            return {
                query: {
                    orderId: null,
                    paymentMethod: null,
                    offset: 1,
                    limit: 10
                },
                deleteParam: {
                    orderId: null
                },
                deleteListParam: {
                    orderIdList: []
                },
                orderList: [],
                multipleSelection: [],
                totalSize: 0
            };
        },
        created() {
            this.getOrderData();
        },
        methods: {
            // 获取员工列表
            getOrderData() {
                getOrderList(this.query).then(res => {
                    this.orderList = res.result.orderList;
                    this.totalSize = res.result.totalSize;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getOrderData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteParam.orderId = row.orderId;

                        deleteOrder(this.deleteParam);
                        //表单伪刷新或者重新拉取数据
                        this.orderList.splice(index, 1);

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
                        this.deleteListParam.orderIdList = [];

                        this.multipleSelection.map((item, index) => {
                            this.deleteListParam.orderIdList.push(item.orderId);
                        });

                        deleteOrderList(this.deleteListParam).then(() => {

                            //删除之后再刷新页面
                            this.$message.success(`删除成功`);

                            this.$set(this.query, 'offset', this.getJumpPage(this.deleteListParam.orderIdList.length));

                            this.getOrderData();
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
                this.getOrderData();
            },
            //跳转第几页
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.query.limit);
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

<style>
    .el-table__body tr.current-row > td {
        color: #fff;
        background: #2d8cf0 !important;
    }
</style>