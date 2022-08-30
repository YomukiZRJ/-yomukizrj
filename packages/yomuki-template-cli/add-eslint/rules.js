/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-23 14:08:02
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-23 14:17:10
 */
export const eslintRules = {
  "no-unused-vars": "warn", // 没有使用过的参数
};
export const vueRules = {
  "vue/multi-word-component-names": [
    // 大驼峰命名
    "error",
    {
      ignores: ["index"], //需要忽略的组件名
    },
  ],
  "vue/no-unused-vars": [
    "warn",
    {
      ignorePattern: "^_",
    },
  ],
  "vue/no-v-html": "warn",
  "vue/max-attributes-per-line": [
    2,
    {
      singleline: 20,
      multiline: 1,
    },
  ],
  // 'vue/require-default-prop': 0,
};
