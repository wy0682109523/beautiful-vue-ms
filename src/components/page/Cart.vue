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

            <el-row>
                <div class="handle-box">
                    <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">
                        清空购物车
                    </el-button>
                </div>
            </el-row>

            <el-row>
                <el-table
                        :data="cartList"
                        border
                        stripe
                        class="table"
                        ref="multipleTable"
                        :highlight-current-row="true"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange">

                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="goodsNo" label="商品编号" align="center"></el-table-column>
                    <el-table-column prop="lotNo" label="批次编号" align="center"></el-table-column>
                    <el-table-column label="商品图片" align="center">
                        <template slot-scope="scope">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.imgUrl" fit="fill">
                                <div slot="error" class="image-slot"
                                     style="margin-top: 45px;width: 100px;height: 100px;">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="商品单价" align="center"></el-table-column>
                    <el-table-column label="数量" align="center">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.quantity"
                                             @change="handleChange(scope.$index, scope.row)"
                                             :min="1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="小计" align="center">
                        <template slot-scope="scope">
                            <span>￥ {{multiply(scope.row.unitPrice,scope.row.quantity)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-row>

            <br>

            <el-row type="flex" class="row-bg" justify="center" align="middle">
                <el-col :span="2" :offset="1">
                    <router-link to="/goods">
                        <i class="el-icon-goods" style="color:dodgerblue"> 继续购物</i>
                    </router-link>
                </el-col>
                <el-col :span="10">
                    <span>共 <span style="color: red">{{cartList.length}}</span> 件商品，已选择 <span style="color: red">{{multipleSelection.length}}</span> 件</span>
                </el-col>
                <el-col :span="2" :offset="12" again="center"><span class="grid-content bg-purple"
                                                                    style="color: red">合计：{{totalAmount}} 元</span>
                </el-col>
                <el-col :span="2">
                    <el-button type="success" @click="PopCreateOrderDialog">去结算</el-button>
                </el-col>
            </el-row>

            <!--确认订单-->
            <el-dialog title="确认订单" :visible.sync="confirmPayDialogVisible" width="30%" center>

                <el-table
                        :data="multipleSelection"
                        boder
                        class="table"
                        ref="multipleTable"
                        :highlight-current-row="true"
                        :show-header="true"
                        @selection-change="handleSelectionChange">

                    <el-table-column prop="goodsNo" label="商品编号" align="center"></el-table-column>
                    <el-table-column prop="lotNo" label="批次编号" align="center"></el-table-column>
                    <el-table-column label="商品图片" align="center">
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
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="单价 x 数量" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.unitPrice}} 元<span> x {{scope.row.quantity}}</span></span>
                        </template>
                    </el-table-column>

                    <el-table-column label="小计" align="center">
                        <template slot-scope="scope">
                            <span>￥ {{multiply(scope.row.unitPrice,scope.row.quantity)}}</span>
                        </template>
                    </el-table-column>

                </el-table>
                <br>
                <diV>商品件数：<span style="color: red">{{this.totalCount}}</span> 件</diV>
                <br>
                <diV>商品总价：<span style="color: red">{{this.totalAmount}}</span> 元</diV>
                <br>
                <el-form ref="createOrderParam" :model="createOrderParam" label-width="100px" label-position="left"
                         :rules="rules">
                    <el-form-item label="优惠金额：" prop="discountAmount">
                        <el-input v-model="createOrderParam.discountAmount" @change="calculateCashAmount"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="应付金额：" prop="cashAmount">
                        <el-input v-model="createOrderParam.cashAmount" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="实付金额：" prop="actualAmount">
                        <el-input v-model="createOrderParam.actualAmount" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="paymentMethod">
                        <el-select v-model="createOrderParam.paymentMethod" placeholder="请选择支付方式" clearable>
                            <el-option
                                    v-for="item in selectOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" v-model="createOrderParam.remark" clearable></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreateOrderDialog">取 消</el-button>
                <el-button type="primary" @click="saveCreateOrderData('createOrderParam')">提交订单</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { deleteCart, deleteCartList, getCartList, updateCart } from '../../api/CartApi';
    import { createOrder } from '../../api/OrderApi';

    export default {
        name: 'cart',
        data() {

            let validateActualAmount = (rule, value, callback) => {
                const regExp = /^(([\d]{1,8})|([\d]{1,8}\.[\d]{1,2}))$/;

                if (!regExp.test(value)) {
                    callback(new Error('请输入正确金额'));
                } else {
                    callback();
                }
            };

            let validateDiscountAmount = (rule, value, callback) => {
                if (value > this.totalAmount) {
                    callback(new Error('优惠金额不能大于总金额'));
                } else {
                    callback();
                }
            };

            return {
                query: {
                    staffId: '1'
                },
                username: null,
                createOrderParam: { discountAmount: 0, cashAmount: 0 },
                cartList: [],
                multipleSelection: [],
                totalAmount: 0,
                totalCount: 0,
                confirmPayDialogVisible: false,
                selectOptions: [
                    {
                        value: '1',
                        label: '现金'
                    }, {
                        value: '2',
                        label: '微信'
                    }, {
                        value: '3',
                        label: '支付宝'
                    }],
                rules: {
                    discountAmount: [{ validator: validateDiscountAmount, trigger: ['change', 'blur'] }],
                    actualAmount: [
                        { required: true, message: '请手动输入实付金额', trigger: 'blur' },
                        { validator: validateActualAmount, trigger: ['change', 'blur'] }
                    ],
                    paymentMethod: [
                        { required: true, message: '请选择支付方式', trigger: ['change', 'blur'] }
                    ],
                    remark: [
                        { required: false, message: '请输入备注', trigger: 'change' },
                        { min: 0, max: 255, message: '长度在 0 到 255 个数字', trigger: 'blur' }
                    ]
                }
            };
        },
        created() {
            this.username = localStorage.getItem('ms_username');
            this.getCartData();
        },
        methods: {
            // 获取购物车列表
            getCartData() {
                getCartList(this.query).then(response => {
                    this.cartList = response.result.cartList;
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let deleteParam = { cartId: row.cartId };

                        deleteCart(deleteParam);

                        //表单伪刷新或者重新拉取数据
                        this.cartList.splice(index, 1);

                        this.$message.success('删除成功');

                        this.calculateTotalAmount();
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    });
            },
            // 多选操作，每次选择商品，计算合计
            handleSelectionChange(val) {
                this.multipleSelection = val;

                this.calculateTotalAmount();
            },
            delAllSelection() {
                if (this.multipleSelection.length === 0) {
                    this.$message.error('您还没有选择商品哦，请选择后重试');
                    return;
                }

                // 二次确认删除
                this.$confirm('确定要全部删除吗？', '提示', { type: 'warning' }).then(() => {

                    let deleteListParam = { cartIdList: [] };

                    this.multipleSelection.map((item, index) => {
                        deleteListParam.cartIdList.push(item.cartId);
                    });

                    deleteCartList(deleteListParam).then(() => {

                        //删除之后再刷新页面
                        this.$message.success(`删除成功`);

                        this.getCartData();
                    });

                    //清空选择项
                    this.multipleSelection = [];

                    this.calculateTotalAmount();
                }).catch(() => {
                    this.$message({ showClose: true, message: '删除失败', type: 'error' });
                });
            },
            handleChange(index, row) {

                this.$message.success('更新成功');

                let updateCartParam = {
                    cartId: row.cartId,
                    quantity: row.quantity
                };

                updateCart(updateCartParam).then(() => {
                    this.calculateTotalAmount();
                }).catch(() => {
                    this.$message.error('更新失败');
                });
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
            //每次选择商品、更新商品，删除商品，清空商品，都要重新计算合计
            calculateTotalAmount() {
                this.totalAmount = 0;

                for (let index in this.multipleSelection) {
                    if (this.multipleSelection.hasOwnProperty(index)) {
                        this.totalAmount += this.multiply(this.multipleSelection[index].unitPrice, this.multipleSelection[index].quantity);
                    }
                }
            },
            calculateTotalCount() {
                this.totalCount = 0;

                for (let index in this.multipleSelection) {
                    if (this.multipleSelection.hasOwnProperty(index)) {
                        this.totalCount += this.multipleSelection[index].quantity;
                    }
                }
            },
            calculateCashAmount(discountAmount) {
                this.createOrderParam.cashAmount = 0;

                this.createOrderParam.cashAmount = (this.totalAmount - discountAmount) >= 0 ? (this.totalAmount - discountAmount) : 0;
            },
            PopCreateOrderDialog() {
                if (this.multipleSelection.length === 0) {
                    this.$message.error('您还没有选择商品哦，请选择后重试');
                    return;
                }

                this.confirmPayDialogVisible = true;

                //初始化结算金额
                this.createOrderParam.cashAmount = this.totalAmount;

                //每次弹出结算页面，重新计算商品件数
                this.calculateTotalCount();
            },
            cancelCreateOrderDialog() {
                this.confirmPayDialogVisible = false;
            },
            saveCreateOrderData(formName) {

                let orderGoodsList = [];
                this.createOrderParam['orderAmount'] = this.totalAmount;
                this.createOrderParam['username'] = this.username;

                for (let element of this.multipleSelection) {

                    let index = orderGoodsList.findIndex((orderGoods) => {
                        return orderGoods.goodsId === element.goodsId;
                    });

                    if (index !== -1) {
                        orderGoodsList[index].goodsLotList.push({
                            lotId: element.lotId,
                            goodsQuantity: element.quantity
                        });
                    } else {
                        orderGoodsList.push({
                            goodsId: element.goodsId,
                            goodsLotList: [{ lotId: element.lotId, goodsQuantity: element.quantity }]
                        });
                    }
                }

                this.createOrderParam['orderGoodsList'] = orderGoodsList;

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        createOrder(this.createOrderParam).then((response) => {
                            console.log(response);
                            if (response.status === 200) {
                                this.$message.success('下单成功');
                                //移除购物车
                                let deleteListParam = { cartIdList: [] };

                                this.multipleSelection.map((item, index) => {
                                    deleteListParam.cartIdList.push(item.cartId);
                                });

                                deleteCartList(deleteListParam).then(() => {
                                    this.getCartData();
                                });

                                //清空选择项
                                this.multipleSelection = [];

                                this.calculateTotalAmount();

                                this.cancelCreateOrderDialog();
                            } else {
                                this.$message.error('下单失败，' + response.message);
                            }

                        }).catch(() => {
                            this.$message.error('下单失败');
                        });
                    } else {
                        return false;
                    }
                });
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