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

                    <el-menu :default-active="defaultActiveIndex" :default-openeds="status" :unique-opened="true"
                             height="100%"
                             @select="handleSelect">

                        <el-submenu index="first">
                            <template slot="title"><i class="el-icon-message"></i>未读消息</template>

                            <el-menu-item-group>
                                <el-menu-item :index="item.messageId" v-for="(item,index) in unreadList" :key="index">
                                    {{index+1}}. {{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>

                        </el-submenu>

                        <el-submenu index="second">
                            <template slot="title"><i class="el-icon-menu"></i>已读消息</template>
                            <el-menu-item-group>
                                <el-menu-item :index="item.messageId" v-for="(item,index) in readList" :key="index">
                                    {{index+1}}. {{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                        <el-submenu index="third">
                            <template slot="title"><i class="el-icon-delete"></i>回收站消息</template>
                            <el-menu-item-group>
                                <el-menu-item :index="item.messageId" v-for="(item,index) in recycleList" :key="index">
                                    {{index+1}}. {{item.messageTitle}}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                    </el-menu>

                </el-aside>

                <el-container>
                    <el-header align="center" height="150px">
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="20">
                                <div style="text-align:center">{{messageInfo.messageTitle}}</div>
                            </el-col>
                        </el-row>
                        <br>
                        <hr style="border: none;background-color: #e6e6e6;height: 1px;">
                        <br>
                        <br>
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-col :span="6">
                                <el-button-group>
                                    <el-button size="small"
                                               :type="messageInfo.messageStatus===1?'primary':messageInfo.messageStatus===2?'warning':'success'"
                                               @click="handleButton(messageInfo)"
                                               :icon="messageInfo.messageStatus===1?'el-icon-check':messageInfo.messageStatus===2?'el-icon-warning-outline':'el-icon-refresh-left'">
                                        {{messageInfo.messageStatus===1?'标为已读':messageInfo.messageStatus===2?'放入回收站':'还原未读'}}
                                    </el-button>
                                    <el-button size="small"
                                               type="danger"
                                               icon="el-icon-delete-solid"
                                               @click="handleDelete(messageInfo)">直接删除
                                    </el-button>
                                </el-button-group>

                            </el-col>
                        </el-row>
                    </el-header>
                    <hr style="border: none;background-color: #e6e6e6;height: 1px;">
                    <el-main align="center">
                        <div v-html="messageInfo.messageContent" align="center"></div>
                    </el-main>
                    <el-footer style="height: 4px;">
                        <hr>
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-col :span="20"><span>消息来源： {{messageInfo.messageSource===1?'系统消息':'其他消息'}}</span>
                            </el-col>
                            <el-col :span="16"><span>时间： {{messageInfo.createTime}}</span></el-col>
                        </el-row>
                    </el-footer>
                </el-container>

            </el-container>
        </div>

    </div>
</template>

<script>
    import { deleteMessageList, getMessageDetail, getMessageList, updateMessage } from '../../api/MessageApi';

    export default {
        name: 'MessageDetail',
        data() {
            return {
                QueryParam: { messageId: null },
                messageInfo: {},
                unreadList: [],
                readList: [],
                recycleList: [],
                status: ['first'],
                defaultActiveIndex: 0
            };
        },
        created() {
            this.getMessageListData();
            this.getMessageDetailData();
        }, methods: {
            getMessageDetailData(messageId, status, flag) {
                //遗留问题：删除之后，默认选中行，为第二列，有待解决，临时解决办法：删除不显示默认选中行
                if (messageId != null) {
                    this.QueryParam.messageId = messageId;
                } else {
                    this.QueryParam.messageId = this.$route.query.messageId;
                    //第一次进来，默认选中当前查询页
                    this.defaultActiveIndex = this.QueryParam.messageId;
                }

                if (flag) {
                    this.defaultActiveIndex = messageId;
                    //处理当前选中行时，不需要设置默认选中；删除和更新之后，需要设置默认选中行为传进来的行
                    console.log('默认选中行：messageId=', this.defaultActiveIndex);
                }

                if (status != null) {
                    this.status = [status];
                } else {
                    this.status = [this.$route.query.status];
                }

                getMessageDetail(this.QueryParam).then((response) => {
                    if (response.result != null) {
                        this.messageInfo = response.result;
                        if (this.messageInfo.messageSource === 1) {
                            this.messageSource = '系统消息';
                        }
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
                this.getMessageListData();
                this.getMessageDetailData();
            },
            handleSelect(index, indexPath) {
                this.getMessageListData();
                this.getMessageDetailData(index, indexPath[0]);
            },
            handleButton(messageInfo) {

                //修改状态后，默认跳转到已修改的状态列表
                let status = '';
                let msgStatus = 'first';

                if (messageInfo.messageStatus === 1) {
                    status = 2;
                    msgStatus = 'second';
                } else if (messageInfo.messageStatus === 2) {
                    status = 3;
                    msgStatus = 'third';
                } else if (messageInfo.messageStatus === 3) {
                    status = 1;
                    msgStatus = 'first';
                }

                let params = {
                    messageId: messageInfo.messageId,
                    messageStatus: status
                };

                updateMessage(params).then(() => {
                    this.getMessageListData();
                    this.getMessageDetailData(messageInfo.messageId, msgStatus, true);
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleDelete(messageInfo) {
                this.defaultActiveIndex = null;
                //删除后默认选中当前列表的第一行数据
                let msgStatus;
                let messageId;

                if (messageInfo.messageStatus === 1) {
                    msgStatus = 'first';

                    this.unreadList.splice(this.unreadList.findIndex((msg) => {
                        return msg.messageId === messageInfo.messageId;
                    }), 1);

                    if (this.unreadList.length !== 0) {
                        messageId = this.unreadList[0].messageId;
                    }

                } else if (messageInfo.messageStatus === 2) {
                    msgStatus = 'second';

                    this.readList.splice(this.readList.findIndex((msg) => {
                        return msg.messageId === messageInfo.messageId;
                    }), 1);

                    if (this.readList.length !== 0) {
                        messageId = this.readList[0].messageId;
                    }

                } else if (messageInfo.messageStatus === 3) {
                    msgStatus = 'third';


                    this.recycleList.splice(this.recycleList.findIndex((msg) => {
                        return msg.messageId === messageInfo.messageId;
                    }), 1);

                    if (this.recycleList.length !== 0) {
                        messageId = this.recycleList[0].messageId;
                    }
                }

                let params = { messageIdList: [messageInfo.messageId] };

                deleteMessageList(params).then(() => {
                    console.log('删除成功回调方法：', messageId);
                    this.getMessageListData();
                    this.getMessageDetailData(messageId, msgStatus);
                }).catch(() => {
                    this.$message.error('操作失败');
                });
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