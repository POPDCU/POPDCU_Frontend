import { createWebHistory, createRouter } from "vue-router";
import PopPage from "@/components/Main.vue";
import SelectCollege from "@/components/Select_college.vue";
import AdminLogin from "@/components/Admin/AdminLogin.vue";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";

const routes = [
    {
        path: "/",
        name: "PopPage",
        component: PopPage,
    },
    {
        path: "/select",
        name: "SelectCollege",
        component: SelectCollege,
    },
    {
        path: "/admin",
        name: "AdminLogin",
        component: AdminLogin,
    },
    {
        path: "/admin/dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/'
    }
];



const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    const userCollege = localStorage.getItem('UserCollege');
    const adminToken = localStorage.getItem('adminToken');
    
    // 관리자 인증이 필요한 라우트 체크
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!adminToken) {
        next('/admin');
      } else {
        next();
      }
    } 
    // UserCollege 값이 없으면 '/'로의 이동을 허용하지 않음
    else if (!userCollege && to.path === '/') {
      next('/select');
    } else {
      next();
    }
  });
export default router;