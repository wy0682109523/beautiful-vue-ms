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
                <el-aside style="width: 25rem;">

                    <el-menu :default-active="this.$route.path" :default-openeds="status" :unique-opened="true"
                             height="100%" :router="true">

                        <el-submenu index="first">
                            <template slot="title"><i class="el-icon-message"></i>未读消息</template>

                            <el-menu-item-group title="分组1">
                                <el-menu-item :index="'detail?messageId='+item.messageId"
                                              v-for="(item,index) in unreadList" :key="index">
                                    {{index+1}}、{{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>

                        </el-submenu>

                        <el-submenu index="second">
                            <template slot="title"><i class="el-icon-menu"></i>已读消息</template>
                            <el-menu-item-group title="分组2">
                                <el-menu-item :index="'detail?messageId='+item.messageId"
                                              v-for="(item,index) in readList" :key="index">
                                    {{index+1}}、{{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                        <el-submenu index="third">
                            <template slot="title"><i class="el-icon-delete"></i>回收站消息</template>
                            <el-menu-item-group title="分组3">
                                <el-menu-item :index="'detail?messageId='+item.messageId"
                                              v-for="(item,index) in recycleList" :key="index">
                                    {{index+1}}、{{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>
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
                unreadList: [],
                readList: [],
                recycleList: [],
                status: []
            };
        },
        created() {
            this.getMessageDetailData();
            this.getMessageListData();
        }, methods: {
            getMessageDetailData() {

                this.QueryParam.messageId = this.$route.query.messageId;

                this.status = [this.$route.query.status];

                console.log(this.status);

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
                    this.unreadList = response.result.unreadList;
                    this.readList = response.result.readList;
                    this.recycleList = response.result.recycleList;
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
        border: solid 1px #e6e6e6;
    }
</style>