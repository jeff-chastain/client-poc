import { createWebHistory, createRouter } from "vue-router";
import { useSecurityStore } from "@/stores/security";
import { watch } from "vue";

const routes =  [
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/System/Login.vue"),
    meta: {
      secure: false
    }
  },

  {
    path: "/",
    name: "dashboard",
    component: () => import("@/components/Dashboard.vue"),
    meta: {
      secure: true
    }
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/components/User/List.vue"),
    meta: {
      secure: true
    }
  },
  {
    path: "/user/:id",
    name: "user-detail",
    component: () => import("@/components/User/Detail.vue"),
    meta: {
      secure: true
    }
  },
  {
    path: "/user/add",
    name: "user-add",
    component: () => import("@/components/User/Add.vue"),
    meta: {
      secure: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(( to, from, next ) => {

  // if the requested route is secure, verify security and redirect to the log in route if necessary
  const securityStore = useSecurityStore()

  // this is ugly, but we have a race condition where the store is not updated prior to the post-login redirection ...
  if ( securityStore.loading ) {

    // wait for the loading flag to go to false before proceeding
    securityStore.$subscribe(( mutation, state ) => {
      console.log( 'state.loading = ' + state.loading )
      if( state.loading === false ){
        if( to.meta.secure && !securityStore.isLoggedIn ){
          return next( '/login' );
        }
        next();
      }
    })

  } else {
    if( to.meta.secure && !securityStore.isLoggedIn ){
      return next( '/login' );
    }
    next();
  }

});

export default router;
