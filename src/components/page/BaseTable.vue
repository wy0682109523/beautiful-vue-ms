<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-circle-plus" class="handle-del mr10" @click="popupStaffForm">
                    新增
                </el-button>
                <el-select v-model="query.adminFlag" placeholder="管理员" class="handle-select mr10">
                    <el-option key="1" label="管理员" value="1"></el-option>
                    <el-option key="2" label="非管理员" value="0"></el-option>
                </el-select>
                <el-input v-model="query.staffName" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.sex" placeholder="性别" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="staffId" label="员工ID" align="center"></el-table-column>
                <el-table-column label="员工姓名" align="center" sortable>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>员工Id: {{ scope.row.staffId }}</p>
                            <p>员工姓名: {{ scope.row.staffName }}</p>
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
                        <!--                        <el-image-->
                        <!--                                class="table-td-thumb"-->
                        <!--                                :src="scope.row.thumb"-->
                        <!--                                :preview-src-list="[scope.row.thumb]"-->
                        <!--                        ></el-image>-->
                        <el-avatar icon="el-icon-user-solid"
                                   src="http://192.168.31.238:8081/static/img/img.146655c9.jpg"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="adminFlag" label="管理员标识" align="center"></el-table-column>

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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="update" label-width="70px">
                <el-form-item label="员工姓名">
                    <el-input v-model="update.staffName" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="update.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="员工性别">
                    <template>
                        <el-radio v-model="update.sex" label="1">男</el-radio>
                        <el-radio v-model="update.sex" label="0">女</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="员工年龄">
                    <el-input v-model="update.age" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增员工" :visible.sync="dialogAddVisible" width="30%">
            <el-form ref="add" :model="add" label-width="90px" label-position="left" :rules="rules">
                <el-form-item label="员工姓名" prop="staffName">
                    <el-input v-model="add.staffName" clearable></el-input>
                </el-form-item>
                <el-form-item label="员工性别">
                    <template>
                        <el-radio v-model="add.sex" label="1">男</el-radio>
                        <el-radio v-model="add.sex" label="0">女</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="员工年龄" prop="age">
                    <el-input v-model.number="add.age" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="add.phone" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="resetStaffForm('add')">重置</el-button>
                <el-button @click="cancelStaffForm('add')">取 消</el-button>
                <el-button type="primary" @click="saveStaff('add')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {addStaff, deleteStaff, deleteStaffList, getStaffList, updateStaff} from '../../api/index';

    export default {
        name: 'basetable',
        data() {
            return {
                query: {
                    staffName: null,
                    sex: null,
                    adminFlag: null,
                    offset: 0,
                    limit: 5
                },
                update: {},
                add: {},
                delete: {},
                deleteList: {staffIdList: []},
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                dialogAddVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                rules: {
                    staffName: [
                        {required: true, message: '请输入员工姓名', trigger: 'blur'},
                        {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: ['change', 'blur']}
                    ],
                    age: [{required: false, message: '请输入年龄', trigger: 'blur'}, {
                        type: 'number',
                        pattern: '^[0-9]{1,3}$',
                        message: '请输入正确年龄',
                        trigger: ['change', 'blur']
                    }],
                    phone: [
                        {required: false, message: '请输入手机号', trigger: 'blur'},
                        {
                            type: 'number',
                            pattern: '/^1[345789][0-9]{9}$/',
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
                    this.tableData = res.result.staffList;
                    this.pageTotal = res.result.totalSize;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'offset', 1);
                this.getStaffData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');
                        this.delete = row;
                        deleteStaff(this.delete);
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                // const length = this.multipleSelection.length;
                // let str = '';
                // this.delList = this.delList.concat(this.multipleSelection);
                //
                // for (let i = 0; i < length; i++) {
                //     str += this.multipleSelection[i].staffName + ' ';
                // }

                this.multipleSelection.map((item, index) => {
                    this.deleteList.staffIdList.push(item.staffId);
                });
                deleteStaffList(this.deleteList);

                this.multipleSelection = [];
                this.$message.error(`删除成功`);
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.update = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                updateStaff(this.update);
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
            //添加员工
            saveStaff(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogAddVisible = false;
                        addStaff(this.add);
                    } else {
                        return false;
                    }
                });

            },
            //弹出新增员工表单
            popupStaffForm() {
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
