<template>
    <div>
        <!-- 面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 主题内容-->
        <div class="container">
            <el-container>
                <el-aside class="el-aside">
                    <el-menu :default-openeds="['1']" :unique-opened="true" height="100%">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-message"></i>未读</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-menu"></i>已读</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="2-1">选项1</el-menu-item>
                                <el-menu-item index="2-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="2-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="2-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title"><i class="el-icon-setting"></i>回收站</template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="3-1">选项1</el-menu-item>
                                <el-menu-item index="3-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="3-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="3-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </el-aside>

                <el-container>
                    <el-header align="center" height="150px">
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="6">
                                <div style="text-align:center">{{messageInfo.messageTitle}}</div>
                            </el-col>
                        </el-row>
                        <br>
                        <br>
                        <br>
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-col :span="6"><span>时间： {{messageInfo.createTime}}</span></el-col>
                        </el-row>
                        <br>
                        <br>
                        <br>
                    </el-header>
                    <el-main align="center">
                        <div v-html="messageInfo.messageContent" align="center"></div>
                    </el-main>
                    <el-footer style="height: 4px;">
                        <hr>
                    </el-footer>
                </el-container>

            </el-container>
        </div>

    </div>
</template>

<script>
    import { getMessageDetail, getMessageList } from '../../api/MessageApi';

    export default {
        name: 'MessageDetail',
        data() {
            return {
                QueryParam: { messageId: null },
                messageInfo: {},
                messageList: []
            };
        },
        created() {
            this.getMessageDetailData();
            this.getMessageListData();
        }, methods: {
            getMessageDetailData() {

                this.QueryParam.messageId = this.$route.query.messageId;

                console.log(this.QueryParam);
                getMessageDetail(this.QueryParam).then((response) => {
                    if (response.result != null) {
                        this.messageInfo = response.result;
                    }
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            getMessageListData() {
                getMessageList().then(response => {
                    this.messageList = response.result.unreadList;
                    //this.readList = response.result.readList;
                    //this.recycleList = response.result.recycleList;
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            handleClick(row) {
                this.QueryParam.messageId = row.messageId;
                this.getMessageDetailData();
                this.getMessageListData();
            }
        },
        computed: {}
    };
</script>

<style scoped>
    .el-menu {
        border: none;
    }

    .el-footer > hr {
        border: none;
        background-color: #e6e6e6;
        height: 1px;
    }

    .el-aside {
        height: 67em;
        width: 200px;
        border: solid 1px #e6e6e6;
    }
</style>