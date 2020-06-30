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
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>

                <el-input v-model="query.orderId" placeholder="订单ID" class="handle-input mr10" clearable></el-input>
                <el-select v-model="query.paymentMethod" placeholder="请选择支付方式" clearable>
                    <el-option
                            v-for="item in paymentMethodList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-left: 10px">查询
                </el-button>
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
                <el-table-column label="商品信息" align="center">
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.orderGoodsList" :key="index">{{item.goodsName}} x
                            {{item.goodsQuantity}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单金额" align="center">
                    <template slot-scope="scope">￥ {{scope.row.orderAmount}}</template>
                </el-table-column>
                <el-table-column label="优惠金额" align="center">
                    <template slot-scope="scope">￥ {{scope.row.discountAmount}}</template>
                </el-table-column>
                <el-table-column label="应付金额" align="center">
                    <template slot-scope="scope">￥ {{scope.row.cashAmount}}</template>
                </el-table-column>
                <el-table-column label="实付金额" align="center">
                    <template slot-scope="scope">￥ {{scope.row.actualAmount}}</template>
                </el-table-column>

                <el-table-column prop="paymentMethod" label="支付方式" align="center"
                                 :formatter="formatPaymentMethod"></el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" align="center"
                                 :formatter="formatOrderStatus"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="orderTime" label="下单时间" align="center"></el-table-column>
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
    import { deleteOrder, deleteOrderList, getOrderList } from '../../api/OrderApi';

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
                orderList: [],
                multipleSelection: [],
                totalSize: 0,
                paymentMethodList: [
                    {
                        value: 1,
                        label: '现金'
                    }, {
                        value: 2,
                        label: '微信'
                    }, {
                        value: 3,
                        label: '支付宝'
                    }],
                orderStatusList: [
                    {
                        value: 1,
                        label: '待支付'
                    }, {
                        value: 2,
                        label: '支付中'
                    }, {
                        value: 3,
                        label: '已支付'
                    }, {
                        value: 4,
                        label: '待发货'
                    }, {
                        value: 5,
                        label: '待收货'
                    }, {
                        value: 6,
                        label: '已拒收'
                    }, {
                        value: 7,
                        label: '已取消'
                    }, {
                        value: 8,
                        label: '已完成'
                    }]
            };
        },
        created() {
            this.getOrderData();
        },
        methods: {
            // 获取订单列表
            getOrderData() {
                getOrderList(this.query).then(response => {
                    this.orderList = response.result.orderList;
                    this.totalSize = response.result.totalSize;
                    console.log(response);
                }).catch(() => {
                    this.$message.error('查询失败');
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
                this.$confirm('确定要删除吗？', '提示', { type: 'warning' }).then(() => {
                    let deleteParam = { orderId: row.orderId };

                    deleteOrder(deleteParam).then(() => {
                        this.$message.success('删除成功');
                    }).catch(() => {
                        this.$message.error('删除成功');
                    });

                    //表单伪刷新或者重新拉取数据
                    this.orderList.splice(index, 1);

                    this.$set(this, 'totalSize', --this.totalSize);


                }).catch(() => {
                    this.$message({ showClose: true, message: '删除失败', type: 'error' });
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                // 二次确认删除
                this.$confirm('确定要全部删除吗？', '提示', { type: 'warning' }).then(() => {
                    //清空删除参数
                    let deleteListParam = { orderIdList: [] };

                    this.multipleSelection.map((item, index) => {
                        deleteListParam.orderIdList.push(item.orderId);
                    });

                    deleteOrderList(deleteListParam).then(() => {
                        //删除之后再刷新页面
                        this.$message.success(`删除成功`);

                        this.$set(this.query, 'offset', this.getJumpPage(deleteListParam.orderIdList.length));

                        this.getOrderData();
                    });

                    //清空选择项
                    this.multipleSelection = [];
                }).catch(() => {
                    this.$message({ showClose: true, message: '删除失败', type: 'error' });
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
            },
            formatPaymentMethod(row, column) {
                for (let element of this.paymentMethodList) {
                    if (row.paymentMethod === element.value) {
                        return element.label;
                    }
                }
            },
            formatOrderStatus(row, column) {
                for (let element of this.orderStatusList) {
                    if (row.orderStatus === element.value) {
                        return element.label;
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