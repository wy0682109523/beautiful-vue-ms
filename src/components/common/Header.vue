<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>

        <div class="logo">比优得芙 后台管理系统</div>

        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip
                            effect="dark"
                            :content="unreadList.length?`有${unreadList.length}条未读消息`:`消息中心`"
                            placement="bottom"
                    >
                        <!-- 点击跳转 -->
                        <router-link to="/message">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                </div>

                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="staffInfo.avatarImg"/>
                </div>

                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{staffInfo.staffName}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <span @click="popChangePasswordDialog">修改用户密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="popChangeStaffInfoDialog">修改个人信息</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <!-- 密码弹出框 -->
                <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" width="30%" center>
                    <el-form ref="changePasswordParam" :model="changePasswordParam" label-width="110px"
                             label-position="left" :rules="rules">
                        <el-form-item label="输入旧密码：" prop="oldPassword">
                            <el-input type="password" v-model="changePasswordParam.oldPassword" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="输入新密码：" prop="newPassword">
                            <el-input type="password" v-model="changePasswordParam.newPassword" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码：" prop="confirmPassword">
                            <el-input type="password" v-model="changePasswordParam.confirmPassword"
                                      clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- 操作栏-->
                    <span slot="footer" class="dialog-footer">
                <el-button @click="cancelChangePasswordDialog('changePasswordParam')">取 消</el-button>
                <el-button type="primary" @click="changePassword('changePasswordParam')">确 定</el-button>
            </span>
                </el-dialog>

                <!-- 个人信息弹出框 -->
                <el-dialog title="修改个人信息" :visible.sync="dialogStaffInfoVisible" width="30%" center>
                    <el-form ref="staffInfo" :model="staffInfo" label-width="110px" label-position="left"
                             :rules="rules">
                        <el-form-item label="员工编号：" prop="staffNo">
                            <el-input v-model="staffInfo.staffNo" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="员工姓名：" prop="staffName">
                            <el-input v-model="staffInfo.staffName" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="员工性别：">
                            <el-radio-group v-model="staffInfo.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手机号码：" prop="phone">
                            <el-input v-model="staffInfo.phone" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱账号：" prop="email">
                            <el-input v-model="staffInfo.email" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="联系地址：" prop="address">
                            <el-input v-model="staffInfo.address" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- 操作栏-->
                    <span slot="footer" class="dialog-footer">
                <el-button @click="cancelStaffInfoDialog">取 消</el-button>
                <el-button type="primary" @click="saveStaffInfo('staffInfo')">确 定</el-button>
            </span>
                </el-dialog>
            </div>
        </div>

    </div>
</template>
<script>
    import bus from '../common/bus';
    import { getMessageList } from '../../api/MessageApi';
    import { changePassword, getStaffDetail, updateStaff } from '../../api/StaffApi';

    export default {
        data() {
            let validatePassword = (rule, value, callback) => {
                if (this.changePasswordParam.newPassword !== this.changePasswordParam.confirmPassword) {
                    callback(new Error('两次密码输入不一致，请重新输入'));
                } else {
                    callback();
                }
            };

            return {
                collapse: false,
                fullscreen: false,
                dialogPasswordVisible: false,
                dialogStaffInfoVisible: false,
                staffInfo: {},
                changePasswordParam: {},
                unreadList: [],
                rules: {
                    oldPassword: [
                        { required: true, message: '请输旧密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输新密码', trigger: 'blur' },
                        { min: 6, max: 32, message: '新密码长度在 6 到 32 个字符', trigger: ['change', 'blur'] }
                    ],
                    confirmPassword: [
                        { required: true, message: '请确认新密码', trigger: 'blur' },
                        { validator: validatePassword, trigger: ['change', 'blur'] }
                    ],
                    email: [{
                        pattern: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                        message: '请输入正确邮箱地址',
                        trigger: ['change', 'blur']
                    }], phone: [{
                        pattern: /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})$/,
                        message: '请输入正确手机号码',
                        trigger: ['change', 'blur']
                    }]
                }
            };
        },
        //初始化
        created() {
            this.getStaffData();
            this.getMessageData();
        },
        methods: {
            getMessageData() {
                getMessageList().then(response => {
                    this.unreadList = response.result.unreadList;
                });
            },
            getStaffData() {
                let query = {
                    username: localStorage.getItem('ms_username')
                };

                getStaffDetail(query).then(response => {
                    this.staffInfo = response.result;
                });
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command === 'loginout') {
                    localStorage.removeItem('ms_username');
                    this.$router.push('/login');
                }
            },
            cancelChangePasswordDialog() {
                this.dialogPasswordVisible = false;
            },
            popChangePasswordDialog() {
                this.dialogPasswordVisible = true;
                this.changePasswordParam = {};
            },
            changePassword() {
                this.changePasswordParam['username'] = this.staffInfo.username;

                changePassword(this.changePasswordParam).then((response) => {
                    if (response.status === 200) {
                        this.$message.success('修改成功');
                        this.dialogPasswordVisible = false;
                    } else {
                        this.$message.error('修改失败，' + response.message);
                    }
                }).catch(() => {
                    this.$message.error('修改失败');
                });
            },
            popChangeStaffInfoDialog() {
                this.dialogStaffInfoVisible = true;
            },
            cancelStaffInfoDialog() {
                this.getStaffData();
                this.dialogStaffInfoVisible = false;
            },
            saveStaffInfo(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        updateStaff(this.staffInfo).then(() => {
                            this.$message.success('修改成功');
                            this.dialogStaffInfoVisible = false;
                            this.getStaffData();
                        }).catch(() => {
                            this.$message.error('修改失败');
                            this.getStaffData();
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        }
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
