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
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">
                    批量删除
                </el-button>
                <el-button type="success"
                           icon="el-icon-plus"
                           class="handle-del mr10"
                           @click="popGoodsAddDialog('addParam')">添加商品
                </el-button>
                <el-input v-model="queryParam.goodsId" placeholder="请输入商品ID"
                          class="handle-input mr10"></el-input>
                <el-input v-model="queryParam.goodsName" placeholder="请输入商品名称"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-left: 10px">
                    查询
                </el-button>
                &nbsp
                <el-popover
                        placement="top-start"
                        width="250"
                        trigger="hover">
                    <el-table :data="cartList" :show-header="false">
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-image
                                        style="width: 50px; height: 50px"
                                        :src="scope.row.imgUrl" fit="fill">
                                    <div slot="error" class="image-slot"
                                         style="margin-top: 45px;width: 100px;height: 100px;">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column property="goodsName"></el-table-column>
                        <el-table-column align="center">
                            <template slot-scope="scope">
                                <span> {{scope.row.unitPrice}}元 x {{scope.row.quantity}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <el-row type="flex" justify="center" :gutter="2">
                        <el-col>
                            <div>
                                <div>共 {{totalCount}} 件商品</div>
                                <div style="color:#FF6700">{{totalAmount}}元</div>
                            </div>
                        </el-col>
                        <el-col>
                            <router-link to="/cart">
                                <el-button style="background-color:#FF6700;color: white">去购物车结算</el-button>
                            </router-link>
                        </el-col>
                    </el-row>
                    <el-button slot="reference" icon="el-icon-shopping-cart-full"
                               style="background-color:#FF6700;color: white">购物车（{{totalCount}}）
                    </el-button>
                </el-popover>

            </div>

            <!--列表部分-->
            <el-table
                    :data="goodsList"
                    border
                    stripe
                    tooltip-effect="light"
                    class="table"
                    ref="multipleTable"
                    :row-key="getRowKeys"
                    :expand-row-keys="expandList"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                    @row-click="handleRowClick">
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <!-- 批次信息-->
                <el-table-column label="批次信息" align="center" type="expand" width="100">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.lotList" border stripe :show-header="true">
                            <el-table-column prop="lotNo" label="批次编号" align="center"></el-table-column>
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
                            <el-table-column prop="remindFlag" label="过期提醒" align="center"
                                             :formatter="formatRemindFlag"></el-table-column>
                            <el-table-column prop="expireStatus" label="过期状态" align="center"
                                             :formatter="formatExpireStatus"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                            <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                            <el-table-column label="操作" width="240" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="popLotUpdateDialog(scope.$index, scope.row)">
                                        修改
                                    </el-button>
                                    <el-button type="success" @click="addCart(scope.$index, scope.row)">
                                        添加到购物车
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column prop="goodsNo" label="商品编号" align="center"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="scope.row.imgUrl" fit="fill">
                            <div slot="error" class="image-slot" style="margin-top: 45px;width: 100px;height: 100px;">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
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
                    <el-form-item label="商品编号" prop="goodsNo">
                        <el-input v-model="updateGoodsParam.goodsNo" :disabled="true"></el-input>
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
                    <el-form-item label="商品图片" prop="goodsImg">
                        <el-upload
                                class="upload-demo"
                                list-type="picture-card"
                                drag
                                accept="image/*"
                                action="v1/file/upload/goods"
                                :show-file-list="true"
                                :multiple="false"
                                :limit="1"
                                :on-preview="handlePictureCardPreview"
                                :on-change="handleChange"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :class="{hide:hideUpload}"
                                :auto-upload="true">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <el-dialog :visible.sync="imgDialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="quantity">
                        <el-input v-model="addParam.quantity" clearable></el-input>
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
                    <el-form-item label="过期提醒" prop="remindFlag">
                        <el-switch
                                style="display: block"
                                v-model="addParam.remindFlag"
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
                    <el-form-item label="商品编号" prop="goodsNo">
                        <el-input v-model="addLotParam.goodsNo" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="addLotParam.goodsName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="quantity">
                        <el-input v-model="addLotParam.quantity" clearable></el-input>
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
                    <el-form-item label="过期提醒" prop="remindFlag">
                        <el-switch
                                style="display: block"
                                v-model="addLotParam.remindFlag"
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
                    <el-form-item label="商品编号" prop="goodsNo">
                        <el-input v-model="updateLotParam.goodsNo" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="批次编号" prop="lotNo">
                        <el-input v-model="updateLotParam.lotNo" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="商品单价" prop="unitPrice">
                        <el-input v-model="updateLotParam.unitPrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="采购价" prop="purchasePrice">
                        <el-input v-model="updateLotParam.purchasePrice" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="过期提醒" prop="remindFlag">
                        <el-switch
                                style="display: block"
                                v-model="updateLotParam.remindFlag"
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
    import { addCart, getCartList } from '../../api/CartApi';

    export default {
        name: 'goods',
        data() {
            return {
                getRowKeys(row) {
                    return row.goodsId;
                },
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
                expandList: [],
                updateGoodsParam: {},
                updateLotParam: {},
                addLotParam: {},
                goodsList: [],
                cartList: [],
                staffId: null,
                multipleSelection: [],
                totalSize: 0,
                totalAmount: 0,
                totalCount: 0,
                updateGoodsDialogVisible: false,
                addGoodsDialogVisible: false,
                addLotDialogVisible: false,
                updateLotDialogVisible: false,
                imgDialogVisible: false,
                dialogImageUrl: '',
                hideUpload: false,
                imgUrl: null,
                //日期选择器
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
            this.staffId = localStorage.getItem('ms_staffId');
            this.getGoodsData();
            this.getCartDate();
        },
        methods: {
            //获取购物车列表
            getCartDate() {
                let query = {
                    staffId: this.staffId
                };

                getCartList(query).then(response => {
                    this.cartList = response.result.cartList;

                    this.calculateTotalCount();
                    this.calculateTotalAmount();

                }).catch(() => {
                    this.$message.error('购物车查询失败');
                });
            },
            // 获取库存列表
            getGoodsData() {
                getGoodsList(this.queryParam).then(response => {
                    console.log(response);
                    this.goodsList = response.result.goodsList;
                    this.totalSize = response.result.totalSize;
                }).catch(() => {
                    this.$message.error('商品查询失败');
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
            handleRowClick(row, column, cell, event) {
                //1.如果存在一个且key相同，则说明点击同一行，意为关闭
                if (this.expandList.length === 1 && this.expandList[0] === row.goodsId) {
                    this.expandList.shift();
                    return;
                }

                //2.如果不存在或者key不同，则添加key
                this.expandList.push(row.goodsId);

                //3.移除第一个key
                if (this.expandList.length !== 1) {
                    this.expandList.shift();
                }
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
                if (row.expireStatus === 1) {
                    return '未过期';
                } else if (row.expireStatus === 2) {
                    return '将过期';
                } else if (row.expireStatus === 3) {
                    return '已过期';
                } else {
                    return '';
                }
            },
            //格式化过期警告
            formatRemindFlag: function(row, column) {
                return row.remindFlag === 1 ? '开启' : row.remindFlag === 0 ? '关闭' : '';
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
                this.addParam['imgUrl'] = this.imgUrl;

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
                console.log(row);
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
            },
            //添加购物车
            addCart(index, row) {

                let addCartParam = {
                    staffId: this.staffId,
                    goodsId: row.goodsId,
                    lotId: row.lotId,
                    quantity: 1
                };

                addCart(addCartParam).then(() => {
                    this.$message.success('添加成功');
                    this.getCartDate();
                }).catch(() => {
                    this.$message.error('添加失败');
                });
            },
            calculateTotalCount() {
                this.totalCount = 0;

                for (let index in this.cartList) {
                    if (this.cartList.hasOwnProperty(index)) {
                        this.totalCount += this.cartList[index].quantity;
                    }
                }
            },
            calculateTotalAmount() {
                this.totalAmount = 0;

                for (let index in this.cartList) {
                    if (this.cartList.hasOwnProperty(index)) {
                        this.totalAmount += this.multiply(this.cartList[index].unitPrice, this.cartList[index].quantity);
                    }
                }
            },
            multiply(num1, num2) {
                let m = 0, s1 = num1.toString(), s2 = num2.toString();

                try {
                    m += s1.split('.')[1].length;
                } catch (e) {
                }

                try {
                    m += s2.split('.')[1].length;
                } catch (e) {
                }

                return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.imgDialogVisible = true;
            },
            handleChange(file, fileList) {
                this.hideUpload = fileList.length === 1;
                console.log(this.hideUpload);
            },
            handleRemove(file, fileList) {
                this.hideUpload = fileList.length === 1;
                console.log(this.hideUpload);
            },
            handleSuccess(response, file, fileList) {
                this.imgUrl = response.result.imgUrl;
            }
        }
    };
</script>

<style>
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

    .hide .el-upload--picture-card {
        display: none;
    }

    .el-upload--picture-card {
        width: 148px;
        height: 148px;
    }

    .el-upload-dragger {
        width: 148px;
        height: 148px;
    }
</style>