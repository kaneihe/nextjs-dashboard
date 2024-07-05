import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;
          const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
          if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // 将未经身份验证的用户重定向到登录页面
          } else if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', nextUrl));
          }
          return true;
        },
      },
      providers: [], // 目前使用空数组添加提供商
} satisfies NextAuthConfig;


