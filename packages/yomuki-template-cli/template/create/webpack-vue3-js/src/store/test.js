/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-02-09 10:21:44
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-02-09 12:01:49
 */
import { defineStore } from "pinia";
export const useTestStore = defineStore("test", {
	state: () => {
		return {
			name: "Yomuki",
			age: 16,
			items: [],
		};
	},
	getters: {
		doubleAge: (state) => {
			return state.age * 2;
		},
		getAgeTotal: (state) => {
			return (age = 12) => state.age + age;
		},
	},
	actions: {
		increment() {
			this.age++;
		},
		// async setUserInfo() {
		//   try {
		//     const { name, age } = await apiGetUserInfo();
		//     this.name = name;
		//     this.age = age;
		//   } catch (err) {
		//     console.error(err);
		//     return err;
		//   }
		// },
	},
});
