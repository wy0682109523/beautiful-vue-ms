<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 搜索部分-->
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-circle-plus" class="handle-del mr10" @click="popupStaffForm">
                    新增
                </el-button>
                <el-input v-model="query.staffNo" placeholder="员工编号" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.staffName" placeholder="姓名" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.phone" placeholder="手机号" class="handle-input mr10" clearable></el-input>
                <el-select v-model="query.adminFlag" placeholder="管理员" class="handle-select mr10" clearable>
                    <el-option key="1" label="管理员" value="1"></el-option>
                    <el-option key="2" label="非管理员" value="0"></el-option>
                </el-select>
                <el-select v-model="query.employStatus" placeholder="在职状态" class="handle-select mr10" clearable>
                    <el-option key="1" label="在职" value="1"></el-option>
                    <el-option key="2" label="离职" value="0"></el-option>
                </el-select>
                <el-select v-model="query.sex" placeholder="性别" class="handle-select mr10" clearable>
                    <el-option key="1" label="女" value="0"></el-option>
                    <el-option key="2" label="男" value="1"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh-right" @click="restoreSearch">重置</el-button>
            </div>
            <!-- 表单部分-->
            <el-table
                    :data="staffList"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="staffNo" label="员工编号" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column label="员工姓名" align="center" sortable>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>编号: {{ scope.row.staffNo }}</p>
                            <p>姓名: {{ scope.row.staffName }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.staffName }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="员工性别" align="center" :formatter="sexFormat"></el-table-column>
                <el-table-column label="员工年龄" align="center" sortable>
                    <template slot-scope="scope">{{scope.row.age}}</template>
                </el-table-column>
                <el-table-column label="员工头像" align="center">
                    <template slot-scope="scope">
                        <el-avatar icon="el-icon-user-solid" :src="scope.row.avatarImg"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="employStatus" label="在职状态" align="center"
                                 :formatter="employStatusFormat"></el-table-column>
                <el-table-column prop="adminFlag" label="管理员标识" align="center"
                                 :formatter="adminFormat"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="createTime" label="注册时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分栏部分-->
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.offset"
                        :page-size="query.limit"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="修改" :visible.sync="dialogUpdateVisible" width="30%">
            <el-form ref="updateParam" :model="updateParam" label-width="70px">
                <el-form-item label="员工姓名">
                    <el-input v-model="updateParam.staffName" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="updateParam.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="员工性别">
                    <template>
                        <el-radio v-model="updateParam.sex" label="1">男</el-radio>
                        <el-radio v-model="updateParam.sex" label="0">女</el-radio>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增员工" :visible.sync="dialogAddVisible" width="30%" center>
            <el-form ref="addParam" :model="addParam" label-width="90px" label-position="left" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addParam.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="员工姓名" prop="staffName">
                    <el-input v-model="addParam.staffName" clearable></el-input>
                </el-form-item>
                <el-form-item label="员工性别">
                    <template>
                        <el-radio v-model="addParam.sex" label="1">男</el-radio>
                        <el-radio v-model="addParam.sex" label="0">女</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addParam.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addParam.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="addParam.address" clearable></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker
                            v-model="addParam.birthday"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <!-- 操作栏-->
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="resetStaffForm('addParam')">重置</el-button>
                <el-button @click="cancelStaffForm('addParam')">取 消</el-button>
                <el-button type="primary" @click="saveStaff('addParam')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { addStaff, deleteStaff, deleteStaffList, exist, getStaffList, updateStaff } from '../../api/StaffApi';

    export default {
        name: 'staff',
        data() {
            let validateUsername = (rule, value, callback) => {
                let existParam = {
                    username: value
                };

                exist(existParam).then((response) => {
                    if (response.result.exist) {
                        callback(new Error('该用户名已存在'));
                    } else {
                        callback();
                    }
                }).catch(() => {
                    callback(new Error('员工查询异常'));
                });
            };

            return {
                query: {
                    offset: 1,
                    limit: 10
                },
                updateParam: {},
                addParam: { sex: '1' },
                staffList: [],
                multipleSelection: [],
                dialogUpdateVisible: false,
                dialogAddVisible: false,
                pageTotal: 0,
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名，且与现有不重复',
                        trigger: 'blur'
                    }, {
                        validator: validateUsername, trigger: 'blur'
                    }
                    ],
                    staffName: [
                        { required: true, message: '请输入员工姓名', trigger: 'blur' },
                        { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: ['change', 'blur'] }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
                        {
                            pattern: /^1[345789][0-9]{9}$/,
                            message: '请输入11位有效手机号码',
                            trigger: ['change', 'blur']
                        }
                    ]
                }
            };
        },
        created() {
            this.getStaffData();
        },
        methods: {
            // 获取员工列表
            getStaffData() {
                getStaffList(this.query).then(res => {
                    this.staffList = res.result.staffList;
                    this.pageTotal = res.result.totalSize;
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getStaffData();
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
                    let deleteParam = { staffId: row.staffId };

                    deleteStaff(deleteParam).then(() => {
                        this.$message.success('删除成功');
                        this.getStaffData();
                    }).catch(() => {
                        this.$message.error('删除失败');
                    });
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                // 二次确认删除
                this.$confirm('确定要全部删除吗？', '提示', { type: 'warning' }).then(() => {
                    let deleteListParam = { staffIdList: [] };

                    this.multipleSelection.map((item, index) => {
                        deleteListParam.staffIdList.push(item.staffId);
                    });

                    deleteStaffList(deleteListParam).then(() => {
                        this.$message.success(`删除成功`);
                        this.getStaffData();
                    }).catch(() => {
                        this.$message.error(`删除成功`);
                    });

                    this.multipleSelection = [];
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.updateParam = row;
                this.dialogUpdateVisible = true;
            },
            // 保存编辑
            saveEdit() {
                updateStaff(this.updateParam).then(() => {
                    this.$message.success(`更新成功`);
                    this.dialogUpdateVisible = false;
                }).catch(() => {
                    this.$message.error(`更新失败`);
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'offset', val);
                this.getStaffData();
            },
            //格式性别
            sexFormat(row, column) {
                if (row.sex === 0) {
                    return '女';
                } else if (row.sex === 1) {
                    return '男';
                } else {
                    return '未知';
                }
            },
            adminFormat(row, column) {
                if (row.adminFlag === 0) {
                    return '否';
                } else if (row.adminFlag === 1) {
                    return '是';
                } else {
                    return '';
                }
            },
            employStatusFormat(row, column) {
                if (row.employStatus === 0) {
                    return '离职';
                } else if (row.employStatus === 1) {
                    return '在职';
                } else {
                    return '';
                }
            },
            //添加员工
            saveStaff(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addStaff(this.addParam).then(() => {
                            this.getStaffData();
                            this.$message.success(`添加成功`);
                            this.dialogAddVisible = false;
                        }).catch(() => {
                            this.$message.error(`添加失败`);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //弹出新增员工表单
            popupStaffForm() {
                //初始化参数
                this.addParam = {};
                this.dialogAddVisible = true;
            },
            //取消员工表单
            cancelStaffForm(formName) {
                this.dialogAddVisible = false;
                this.$refs[formName].clearValidate();
            },
            //重置员工表单
            resetStaffForm(formName) {
                this.$refs[formName].resetFields();
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
