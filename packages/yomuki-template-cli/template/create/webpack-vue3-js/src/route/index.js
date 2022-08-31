/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-02-09 13:49:51
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-07-07 10:55:28
 */
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: () => import("@/pages/home"),
		},
	],
});
export default router;
