/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 16:42:04
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-08 17:08:21
 */

/**
 * @description: 将所有环境变量配置文件读取到process.env
 * @param {Recordable} envConf
 * @return {ViteEnv}
 */
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {};

	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, "\n");
		realName = realName === "true" ? true : realName === "false" ? false : realName;

		if (envName === "VITE_PORT") {
			realName = Number(realName);
		}
		if (envName === "VITE_PROXY") {
			try {
				realName = JSON.parse(realName);
			} catch (error) {}
		}
		ret[envName] = realName;
		process.env[envName] = realName;
	}
	return ret;
}
