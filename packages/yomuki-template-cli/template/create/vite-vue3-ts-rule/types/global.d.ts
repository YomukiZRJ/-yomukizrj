/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 16:54:16
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-09 15:00:57
 */
declare type Recordable<T = any> = Record<string, T>;
declare interface ViteEnv {
	readonly VITE_API_URL: string;
	readonly VITE_APP_TITLE: string;
	readonly VITE_PUBLIC_PATH: string;
	readonly VITE_PORT: number;
	readonly VITE_OPEN: boolean;
	readonly VITE_REPORT: boolean;
	readonly VITE_LEGACY: boolean;
	readonly VITE_BUILD_GZIP: boolean;
	readonly VITE_DROP_CONSOLE: boolean;
	readonly VITE_OUTPUT_DIR: string;
}
