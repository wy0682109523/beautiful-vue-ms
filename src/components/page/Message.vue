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
                                <span class="message-title">{{scope.row.messageContent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary">全部标为已读</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="`已读消息(${readList.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="readList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.messageContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>

                <el-tab-pane :label="`回收站(${recycleList.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycleList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.messageContent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>

            </el-tabs>

        </div>
    </div>
</template>

<script>

    import { getMessageList } from '../../api/index';

    export default {
        name: 'message',
        data() {
            return {
                message: 'first',
                showHeader: false,
                unreadList: [],
                readList: [],
                recycleList: []
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
                    console.log(response);
                    this.unreadList = response.result.unreadList;
                    this.readList = response.result.readList;
                    this.recycleList = response.result.recycleList;
                });
            },
            handleRead(index) {
                const item = this.unread.splice(index, 1);
                console.log(item);
                this.read = item.concat(this.read);
            },
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            }
        },
        computed: {
            unreadNum() {
                return this.unread.length;
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

