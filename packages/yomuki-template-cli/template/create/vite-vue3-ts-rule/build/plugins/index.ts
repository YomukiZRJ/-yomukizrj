/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 17:25:19
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-09 15:37:31
 */
import createBase from "./base";
import createBuild from "./build";
export default function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
	if (isBuild) {
		return [...createBase(viteEnv), ...createBuild(viteEnv)];
	}
	return [...createBase(viteEnv)];
}
