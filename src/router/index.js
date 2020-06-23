import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/staff',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Staff.vue'),
                    meta: { title: '员工管理' }
                },
                {
                    path: '/inventory',
                    component: () => import(/* webpackChunkName: "inventory" */ '../components/page/Inventory.vue'),
                    meta: { title: '库存管理' }
                },
                {
                    path: '/goods',
                    component: () => import(/* webpackChunkName: "goods" */ '../components/page/Goods.vue'),
                    meta: { title: '商品管理' }
                },
                {
                    path: '/order',
                    component: () => import(/* webpackChunkName: "order" */ '../components/page/Order.vue'),
                    meta: { title: '订单管理' },
                    children: [
                        {
                            name: 'order-detail',
                            path: '/detail',
                            component: () => import('../components/page/OrderDetail.vue'),
                            meta: { title: '订单详情' }
                        }
                    ]
                },
                {
                    path: '/message',
                    component: () => import(/* webpackChunkName: "message" */ '../components/page/Message.vue'),
                    meta: { title: '消息管理' },
                    children: [
                        {
                            name: 'message-detail',
                            path: '/detail',
                            component: () => import('../components/page/MessageDetail.vue'),
                            meta: { title: '消息详情' }
                        }
                    ]
                },
                {
                    path: '/system',
                    component: () => import(/* webpackChunkName: "system" */ '../components/page/System.vue'),
                    meta: { title: '系统设置' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
