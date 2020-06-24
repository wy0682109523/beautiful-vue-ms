<template>
    <div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 搜索部分 -->
        <div class="container">

            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="success"
                           icon="el-icon-plus"
                           class="handle-del mr10"
                           @click="popGoodsAddDialog('addParam')">添加商品
                </el-button>
                <el-input v-model="queryParam.goodsId" placeholder="请输入商品ID" class="handle-input mr10"></el-input>
                <el-input v-model="queryParam.goodsName" placeholder="请输入商品名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-left: 10px">查询
                </el-button>
            </div>

            <!--列表部分-->
            <el-table
                    :data="goodsList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">

                <!-- 批次信息-->
                <el-table-column label="批次信息" align="center" type="expand" width="100">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.lotList" border stripe :show-header="true">
                            <el-table-column prop="lotId" label="批次ID" align="center"></el-table-column>
                            <el-table-column prop="unitPrice" label="商品单价" align="center">
                                <template slot-scope="scope">￥ {{scope.row.unitPrice}}</template>
                            </el-table-column>
                            <el-table-column label="采购价" align="center">
                                <template slot-scope="scope">￥ {{scope.row.purchasePrice}}</template>
                            </el-table-column>
                            <el-table-column prop="productionDate" label="生产日期" align="center"></el-table-column>
                            <el-table-column prop="expiryDate" label="过期日期" align="center"></el-table-column>
                            <el-table-column prop="expireTime" label="保质期（天）" align="center"></el-table-column>
                            <el-table-column prop="remainTime" label="剩余时间（天）" align="center"></el-table-column>
                            <el-table-column prop="expireWarnFlag" label="过期提醒" align="center"
                                             :formatter="formatExpireWarnFlag"></el-table-column>
                            <el-table-column prop="expireStatus" label="过期状态" align="center"
                                             :formatter="formatExpireStatus"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                            <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                            <el-table-column label="操作" width="240" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="popLotUpdateDialog(scope.$index, scope.row)">
                                        修改
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>


                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <!-- 操作栏-->
                <el-table-column label="操作" width="240" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="success" @click="popLotAddDialog(scope.$index, scope.row)">添加批次
                        </el-button>
                        <el-button type="primary" @click="popGoodsUpdateDialog(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页栏-->
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

            <!--修改商品-->
            <el-dialog title="修改商品" :visible.sync="updateGoodsDialogVisible" width="30%" center>
                <el-form ref="updateGoodsParam" :model="updateGoodsParam" label-width="90px"
                         label-position="left">
                    <el-form-item label="商品Id" prop="goodsId">
                        <el-input v-model="updateGoodsParam.goodsId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="updateGoodsParam.goodsName" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelGoodsUpdateDialog('updateGoodsParam')">取 消</el-button>
                <el-button type="primary" @click="saveGoodsUpdateData('updateGoodsParam')">确 定</el-button>
            </span>
            </el-dialog>

            <!--添加商品-->
            <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" width="25%" center>
                <el-form ref="addParam" :model="addParam" label-width="110px"
                         label-position="left">
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="addParam.goodsName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="goodsQuantity">
                        <el-input v-model="addParam.goodsQuantity" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价" prop="unitPrice">
                        <el-input v-model="addParam.unitPrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="采购价" prop="purchasePrice">
                        <el-input v-model="addParam.purchasePrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="生产日期" prop="productionDate">
                        <el-date-picker
                                v-model="addParam.productionDate"
                                align="right"
                                type="date"
                                placeholder="选择生产日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="保质期（天）" prop="expiryTime">
                        <el-input v-model="addParam.expireTime" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="过期提醒" prop="expireWarnFlag">
                        <el-switch
                                style="display: block"
                                v-model="addParam.expireWarnFlag"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelGoodsAddDialog('addParam')">取 消</el-button>
                <el-button type="primary" @click="saveGoodsAddData('addParam')">确 定</el-button>
            </span>
            </el-dialog>

            <!--添加批次-->
            <el-dialog title="添加批次" :visible.sync="addLotDialogVisible" width="25%" center>
                <el-form ref="addLotParam" :model="addLotParam" label-width="110px" label-position="left">
                    <el-form-item label="商品Id" prop="goodsId">
                        <el-input v-model="addLotParam.goodsId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="addLotParam.goodsName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="goodsQuantity">
                        <el-input v-model="addLotParam.goodsQuantity" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价" prop="unitPrice">
                        <el-input v-model="addLotParam.unitPrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="采购价" prop="purchasePrice">
                        <el-input v-model="addLotParam.purchasePrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="生产日期" prop="productionDate">
                        <el-date-picker
                                v-model="addLotParam.productionDate"
                                align="right"
                                type="date"
                                placeholder="选择生产日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="保质期（天）" prop="expiryTime">
                        <el-input v-model="addLotParam.expireTime" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="过期提醒" prop="expireWarnFlag">
                        <el-switch
                                style="display: block"
                                v-model="addLotParam.expireWarnFlag"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelLotAddDialog('addLotParam')">取 消</el-button>
                <el-button type="primary" @click="saveLotAddData('addLotParam')">确 定</el-button>
            </span>
            </el-dialog>

            <!--修改批次-->
            <el-dialog title="修改批次" :visible.sync="updateLotDialogVisible" width="30%" center>
                <el-form ref="updateLotParam" :model="updateLotParam" label-width="90px"
                         label-position="left">
                    <el-form-item label="商品Id" prop="goodsId">
                        <el-input v-model="updateLotParam.goodsId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="批次Id" prop="lotId">
                        <el-input v-model="updateLotParam.lotId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价" prop="unitPrice">
                        <el-input v-model="updateLotParam.unitPrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="采购价" prop="purchasePrice">
                        <el-input v-model="updateLotParam.purchasePrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="过期提醒" prop="expireWarnFlag">
                        <el-switch
                                style="display: block"
                                v-model="updateLotParam.expireWarnFlag"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                active-value="1"
                                inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelLotUpdateDialog('updateLotParam')">取 消</el-button>
                <el-button type="primary" @click="saveLotUpdateData('updateLotParam')">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { addGoods, deleteGoods, deleteGoodsList, getGoodsList, updateGoods } from '../../api/GoodsApi';
    import { addLot, updateLot } from '../../api/LotApi';

    export default {
        name: 'goods',
        data() {
            return {
                queryParam: {
                    offset: 1,
                    limit: 10
                },
                addParam: {},
                deleteParam: {
                    goodsId: null
                },
                deleteListParam: {
                    goodsIdList: []
                },
                updateGoodsParam: {},
                updateLotParam: {},
                addLotParam: {},
                goodsList: [],
                multipleSelection: [],
                totalSize: 0,
                updateGoodsDialogVisible: false,
                addGoodsDialogVisible: false,
                addLotDialogVisible: false,
                updateLotDialogVisible: false,
                //日期选择
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            };
        },
        //初始化
        created() {
            this.getGoodsData();
        },
        methods: {
            // 获取库存列表
            getGoodsData() {
                getGoodsList(this.queryParam).then(response => {
                    this.goodsList = response.result.goodsList;
                    this.totalSize = response.result.totalSize;
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            //搜索按钮
            handleSearch() {
                this.$set(this.queryParam, 'offset', 1);
                this.getGoodsData();
            },
            //删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', { type: 'warning' }).then(() => {
                    this.deleteParam.goodsId = row.goodsId;

                    deleteGoods(this.deleteParam);
                    //表单伪刷新或者重新拉取数据
                    this.goodsList.splice(index, 1);

                    this.$set(this, 'totalSize', --this.totalSize);

                    this.$message.success('删除成功');

                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },
            //多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //删除所有已选择项
            delAllSelection() {
                // 二次确认删除
                this.$confirm('确定要删除全部所选商品吗？', '提示', { type: 'warning' }).then(() => {
                    //清空删除参数
                    this.deleteListParam.goodsIdList = [];

                    this.multipleSelection.map((item, index) => {
                        this.deleteListParam.goodsIdList.push(item.goodsId);
                    });

                    deleteGoodsList(this.deleteListParam).then(() => {
                        //删除之后再刷新页面
                        this.$message.success(`删除成功`);

                        this.$set(this.queryParam, 'offset', this.getJumpPage(this.deleteListParam.goodsIdList.length));

                        this.getGoodsData();
                    });
                    //清空选择项
                    this.multipleSelection = [];

                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },
            //分页导航
            handlePageChange(val) {
                this.$set(this.queryParam, 'offset', val);
                this.getGoodsData();
            },
            //跳转页数
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.queryParam.limit);
            },
            //格式化过期状态
            formatExpireStatus: function(row, column) {
                return row.expireStatus === 1 ? '已过期' : row.expireStatus === 0 ? '未过期' : '';
            },
            //格式化过期警告
            formatExpireWarnFlag: function(row, column) {
                return row.expireWarnFlag === 1 ? '开启' : row.expireWarnFlag === 0 ? '关闭' : '';
            },
            popGoodsAddDialog(formName) {
                this.addParam = {};
                this.addGoodsDialogVisible = true;
            },
            cancelGoodsAddDialog(formName) {
                this.addGoodsDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            saveGoodsAddData(formName) {
                addGoods(this.addParam).then(() => {
                    this.$message.success('添加成功');
                    //注意：解决列表偶尔不刷新问题：将刷新操作放到响应函数中。原因：刷新操作比插入操作快，还没插入就查出数据了，导致列表不刷新
                    this.$set(this.queryParam, 'offset', 1);

                    this.getGoodsData();
                }).catch(() => {
                    this.$message.error('添加失败');
                });

                this.addGoodsDialogVisible = false;
            },
            popGoodsUpdateDialog(index, row) {
                this.updateGoodsParam = row;
                this.updateGoodsDialogVisible = true;
            },
            cancelGoodsUpdateDialog(formName) {
                this.updateGoodsDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            saveGoodsUpdateData(formName) {
                updateGoods(this.updateGoodsParam).then(() => {
                    this.$message.success('修改成功');
                }).catch(() => {
                    this.$message.error('修改失败');
                });

                this.updateGoodsDialogVisible = false;
            },
            popLotAddDialog(index, row) {
                this.addLotParam = row;
                this.addLotDialogVisible = true;
            },
            cancelLotAddDialog(formName) {
                this.addLotDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            saveLotAddData(formName) {
                addLot(this.addLotParam).then(() => {
                    this.$message.success('添加成功');

                    this.$set(this.queryParam, 'offset', 1);

                    this.getGoodsData();

                }).catch(() => {
                    this.$message.error('添加失败');
                });

                this.addLotDialogVisible = false;

            },
            popLotUpdateDialog(index, row) {
                this.updateLotParam = row;
                this.updateLotDialogVisible = true;
            },
            cancelLotUpdateDialog(formName) {
                this.updateLotDialogVisible = false;
                this.$refs[formName].clearValidate();
            },
            saveLotUpdateData(formName) {
                updateLot(this.updateLotParam).then(() => {
                    this.$message.success('修改成功');

                    this.$set(this.queryParam, 'offset', 1);

                    this.getGoodsData();

                }).catch(() => {
                    this.$message.error('修改失败');
                });

                this.updateLotDialogVisible = false;
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