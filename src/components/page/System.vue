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
                <el-row>
                    <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                    </el-button>
                    <el-button type="success" icon="el-icon-plus" class="handle-del mr10" @click="popAddDialog">添加系统配置
                    </el-button>
                    <el-input v-model="query.systemKey" placeholder="请输入系统配置key"
                              class="handle-input mr10" clearable></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh-right" @click="restoreSearch">重置</el-button>
                    <el-switch
                            style="display: inline;margin-left: 10px"
                            v-model="warnTypeOnOff"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="开启消息通知"
                            inactive-text="关闭消息通知"
                            @change="switchOnOff"
                    >
                    </el-switch>

                    <div class="handle-box" v-show="warnTypeOnOff" style="display: inline;margin-left: 10px">
                        <template>

                            <el-checkbox-group v-model="warnTypeList" style="display: inline" @change="handleCheckBox">
                                <el-checkbox label="1">站内消息</el-checkbox>
                                <el-checkbox label="2">邮件消息</el-checkbox>
                                <el-checkbox label="3" disabled>短信消息</el-checkbox>
                            </el-checkbox-group>

                        </template>
                    </div>
                </el-row>

            </div>

            <el-table
                    :data="systemList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    :highlight-current-row="true"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                    @cell-click="copy">
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
                        :current-page="query.offset"
                        :page-size="query.limit"
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
                        <el-input v-model="updateParam.systemValue" clearable :disabled="disableUpdateFlag"></el-input>
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
                query: {
                    offset: 1,
                    limit: 10
                },
                addParam: {},
                updateParam: {},
                systemList: [],
                multipleSelection: [],
                totalSize: 0,
                addDialogVisible: false,
                updateDialogVisible: false,
                warnTypeOnOff: false,
                warnTypeList: [],
                sckKey: 'sck-expire-remind-type',
                disableUpdateFlag: false
            };
        },
        created() {
            this.getSystemData();
        },
        methods: {
            // 获取库存列表
            getSystemData() {
                getSystemList(this.query).then(response => {
                    console.log(response);
                    this.systemList = response.result.systemList;
                    this.totalSize = response.result.totalSize;

                    //自动展开选项
                    for (let index in this.systemList) {
                        if (this.systemList.hasOwnProperty(index)) {
                            if (this.sckKey === this.systemList[index].systemKey) {
                                let value = this.systemList[index].systemValue;
                                if (value.length !== 0) {
                                    let warnTypeList = value.split(',');
                                    if (warnTypeList.length !== 0) {
                                        this.warnTypeList = warnTypeList;
                                        this.warnTypeOnOff = true;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getSystemData();
            },
            restoreSearch() {
                this.query = {
                    offset: 1,
                    limit: 10
                };

                this.handleSearch();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', { type: 'warning' }).then(() => {

                    let deleteParam = { systemKey: row.systemKey };

                    deleteSystem(deleteParam).then(() => {
                        //表单伪刷新或者重新拉取数据
                        this.systemList.splice(index, 1);

                        this.$set(this, 'totalSize', --this.totalSize);

                        this.$message.success('删除成功');
                    }).catch(() => {
                        this.$message.error('删除失败');
                    });

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
                    let deleteListParam = { systemKeyList: [] };

                    this.multipleSelection.map((item, index) => {
                        deleteListParam.systemKeyList.push(item.systemKey);
                    });

                    deleteSystemList(deleteListParam).then(() => {

                        //删除之后再刷新页面
                        this.$message.success(`删除成功`);

                        this.$set(this.query, 'offset', this.getJumpPage(deleteListParam.systemKeyList.length));

                        this.getSystemData();
                    }).catch(() => {
                        this.$message.error('删除失败');
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
                this.getSystemData();
            },
            //跳转第几页
            getJumpPage(deleteCount) {
                return Math.ceil((this.totalSize - deleteCount) / this.query.limit);
            },
            popAddDialog() {
                this.addParam = {};
                this.addDialogVisible = true;
            },
            saveAddData() {
                addSystem(this.addParam).then(() => {
                    this.$message.success('添加成功');

                    this.$set(this.query, 'offset', 1);

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
                this.updateParam = row;
                this.updateDialogVisible = true;
                this.disableUpdateFlag = this.sckKey === this.updateParam.systemKey;
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
            },
            switchOnOff(flag) {
                if (!flag) {
                    this.warnTypeList = [];
                }

                this.warnTypeOnOff = flag;

                this.updateParam = {
                    systemKey: this.sckKey,
                    systemValue: ''
                };

                updateSystem(this.updateParam).then(() => {
                    this.$message.success('更新成功');

                    this.$set(this.query, 'offset', 1);

                    this.getSystemData();
                }).catch(() => {
                    this.$message.error('更新失败');
                });

            }, handleCheckBox(value) {
                this.warnTypeList = value;

                this.updateParam = {
                    systemKey: this.sckKey,
                    systemValue: this.warnTypeList.join(',')
                };

                updateSystem(this.updateParam).then(() => {
                    this.$message.success('更新成功');

                    this.$set(this.query, 'offset', 1);

                    this.getSystemData();
                }).catch(() => {
                    this.$message.error('更新失败');
                });
            },
            copy(value) {
                let _this = this;

                this.$copyText(value.systemKey).then(function(e) {
                    _this.$message.success('系统配置-key【' + value.systemKey + '】复制成功');
                }, function(e) {
                    _this.$message.error('系统配置-key复制失败');
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