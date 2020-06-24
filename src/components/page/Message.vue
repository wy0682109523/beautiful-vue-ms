<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">

            <el-tabs v-model="message">

                <el-tab-pane :label="`未读消息(${unreadList.length})`" name="first">
                    <el-table :data="unreadList" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="jumpDetail(scope.$index, scope.row)">{{scope.row.messageTitle}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead">全部标为已读</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="`已读消息(${readList.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="readList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.messageTitle}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleAllDelete">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>

                <el-tab-pane :label="`回收站(${recycleList.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycleList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.messageTitle}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleAllRemove">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>

            </el-tabs>

        </div>
    </div>
</template>

<script>

    import { deleteMessageList, getMessageList, updateMessage, updateMessageList } from '../../api/MessageApi';

    export default {
        name: 'message',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unreadList: [],
                readList: [],
                recycleList: [],
                params: {},
                messageStatus: {
                    unread: 1,
                    read: 2,
                    recycle: 3
                }
            };
        },
        //初始化
        created() {
            this.getMessageData();
        },
        methods: {
            // 获取库存列表
            getMessageData() {
                getMessageList().then(response => {
                    this.unreadList = response.result.unreadList;
                    this.readList = response.result.readList;
                    this.recycleList = response.result.recycleList;
                }).catch(() => {
                    this.$message.error('查询失败');
                });
            },
            handleRead(index) {
                let item = this.unreadList[index];

                this.params = {
                    messageId: item.messageId,
                    messageStatus: this.messageStatus.read
                };

                updateMessage(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleAllRead() {
                let messageList = [];

                for (let index in this.unreadList) {

                    let message = {
                        messageId: this.unreadList[index].messageId,
                        messageStatus: this.messageStatus.read
                    };

                    messageList.push(message);
                }

                this.params = { messageList: messageList };

                updateMessageList(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleDelete(index) {
                let item = this.readList[index];

                this.params = {
                    messageId: item.messageId,
                    messageStatus: this.messageStatus.recycle
                };

                updateMessage(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleAllDelete() {
                let messageList = [];

                for (let index in this.readList) {

                    let message = {
                        messageId: this.readList[index].messageId,
                        messageStatus: this.messageStatus.recycle
                    };

                    messageList.push(message);
                }

                this.params = { messageList: messageList };

                updateMessageList(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleRestore(index) {
                let item = this.recycleList[index];

                this.params = {
                    messageId: item.messageId,
                    messageStatus: this.messageStatus.unread
                };

                updateMessage(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            },
            handleAllRemove() {
                let messageIdList = [];

                for (let index in this.recycleList) {

                    messageIdList.push(this.recycleList[index].messageId);
                }

                this.params = { messageIdList: messageIdList };

                deleteMessageList(this.params).then(() => {
                    this.getMessageData();
                }).catch(() => {
                    this.$message.error('操作失败');
                });
            }, jumpDetail(index, row) {
                this.$router.push({
                    path: '/detail',//这个path就是你在router/index.js里边配置的路径
                    query: {
                        messageId: row.messageId
                    }
                });
            }
        },
        computed: {
            unreadNum() {
                return this.unreadList.length;
            }
        }
    };

</script>

<style>
    .message-title {
        cursor: pointer;
    }

    .handle-row {
        margin-top: 30px;
    }
</style>