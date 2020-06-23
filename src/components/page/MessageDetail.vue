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
                <el-aside width="200px">Aside</el-aside>
                <el-header>Header</el-header>
                <el-main>Main</el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'MessageDetail',
        data() {
            return {
                messageId: null
            };
        },
        created() {
            this.getDetailData();
        }, methods: {
            getDetailData() {
                this.messageId = this.$route.params.messageId;
                console.log(this.messageId);
            }
        },
        computed: {}
    };
</script>

<style scoped>

</style>