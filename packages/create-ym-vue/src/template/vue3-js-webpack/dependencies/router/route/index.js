/*
 * @see https://router.vuejs.org/zh/
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
