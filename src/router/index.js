import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            name: 'home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            redirect: '/home/appraisal',
            meta: {title: '首页'},
            children: [
                {
                    path: '/home/admin',
                    name: 'admin',
                    component: resolve => require(['../components/page/system/admin.vue'], resolve),
                    meta: {title: '管理员列表', permission: true, index: 'admin'}
                },
                {
                    path: '/home/role',
                    name: 'role',
                    component: resolve => require(['../components/page/system/role.vue'], resolve),
                    meta: {title: '角色列表', permission: true, index: 'role'}
                },
                {
                    path: '/home/user',
                    name: 'user',
                    component: resolve => require(['../components/page/User/UserManage.vue'], resolve),
                    meta: {title: '用户列表', permission: true, index: 'user'} /* 已修改 */
                },
                {
                    path: '/home/param',
                    name: 'param',
                    component: resolve => require(['../components/page/param/param.vue'], resolve),
                    meta: {title: '系统参数', permission: true, index: 'param'}
                },
                {
                    path: '/home/feedBack',
                    name: 'feedBack',
                    component: resolve => require(['../components/page/User/feedBack.vue'], resolve),
                    meta: {title: '意见反馈', permission: true, index: 'feedBack'}
                },

                {
                    path: '/home/talkMessage',
                    name: 'talkMessage',
                    component: resolve => require(['../components/page/User/talkMessage.vue'], resolve),
                    meta: {title: '说说管理', permission: true, index: 'talkMessage'}
                },


                {
                    path: '/home/article',
                    name: 'article',
                    component: resolve => require(['../components/page/article/article.vue'], resolve),
                    meta: {title: '科普案例', permission: true, index: 'article'}
                },

                {
                    path: '/home/doctor',
                    name: 'doctor',
                    component: resolve => require(['../components/page/doctor/doctor.vue'], resolve),
                    meta: {title: '医生管理', permission: true, index: 'doctor'}
                },

                {
                    path: '/home/document',
                    name: 'document',
                    component: resolve => require(['../components/page/system/document.vue'], resolve),
                    meta: {title: '文档配置', permission: true, index: 'document'}
                },

                {
                    path: '/home/banner',
                    name: 'banner',
                    component: resolve => require(['../components/page/banner/banner.vue'], resolve),
                    meta: {title: 'banner配置', permission: true, index: 'banner'}
                },




                {
                    path: '/home/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: {title: '404'}
                },
                {
                    path: '/home/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {title: '403'}
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/home/404'
        }
    ]
})
