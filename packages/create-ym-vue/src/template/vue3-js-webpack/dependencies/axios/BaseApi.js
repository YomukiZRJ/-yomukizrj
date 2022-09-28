/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-02-14 09:02:22
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-05-12 10:35:22
 */
import axios from "axios";
class BaseApi {
	baseService;
	constructor({ baseURL, timeout = 60000 }) {
		const baseServiceConfig = {
			baseURL,
			timeout,
		};
		this.baseService = axios.create(baseServiceConfig);
		this._setInterceptorsRequest();
		this._setInterceptorsResponse();
	}
	get(url, params = {}) {
		return this.request(url, "get", params, {});
	}
	post(url, data = {}) {
		return this.request(url, "post", {}, data);
	}
	postFormData(url, data = {}) {
		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}
		return this.request(url, "post", {}, formData, "multipart/form-data");
	}
	request(url, method, params, data, contentType = "application/json") {
		// console.log(data);
		const headers = {
			"Content-Type": contentType,
		};
		return this.baseService({
			method,
			url: url,
			params: params,
			data: data,
			headers,
			responseType: "json",
			// 允许为上传处理进度事件
			onUploadProgress: function (progressEvent) {
				// console.log("progressEvent", progressEvent);
			},
			// 允许为下载处理进度事件
			onDownloadProgress: function (progressEvent) {
				// console.log("progressEvent", progressEvent);
			},
		});
	}
	// 请求拦截器
	_setInterceptorsRequest() {
		this.baseService.interceptors.request.use(
			(config) => {
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	}
	// 响应拦截器
	_setInterceptorsResponse() {
		this.baseService.interceptors.response.use(
			function (response) {
				if (response.status >= 200 && response.status <= 299) {
					switch (response.data.res) {
						case 200:
							return Promise.resolve(response.data);
						case 500:
							return Promise.reject("服务器异常");
						case 400:
							return Promise.reject(response.data.res.message);
						default:
							return Promise.resolve(response.data);
					}
				}
				return Promise.reject("error");
			},
			function (error) {
				if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
					return Promise.reject("请求超时");
				}
				return Promise.reject(error);
			}
		);
	}
}
export default new BaseApi({ baseURL: "" });
