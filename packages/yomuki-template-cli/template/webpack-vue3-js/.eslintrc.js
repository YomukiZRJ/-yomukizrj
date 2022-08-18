/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-07-21 15:05:40
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-07-22 17:59:35
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-unused-vars": "warn", // 没有使用过的参数
    "vue/multi-word-component-names": [
      // 大驼峰命名
      "error",
      {
        ignores: ["index"], //需要忽略的组件名
      },
    ],
    "vue/no-unused-components": "warn", // 没有使用过的组件
    "vue/no-unused-vars": [
      "warn",
      {
        ignorePattern: "^_",
      },
    ],
    "vue/no-v-html": "warn",
    "vue/block-tag-newline": "error",
    "vue/component-api-style": "warn",
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        registeredComponentsOnly: true,
        ignores: ["/^el-/"],
      },
    ],
    "vue/custom-event-name-casing": [
      "error",
      "kebab-case",
      {
        ignores: [],
      },
    ],
    "vue/define-macros-order": [
      "error",
      {
        order: ["defineProps", "defineEmits"],
      },
    ],
    "vue/new-line-between-multi-line-property": [
      "error",
      {
        minLineOfMultilineProperty: 2,
      },
    ],
    "vue/no-boolean-default": ["error", "default-false"],
    "vue/no-static-inline-styles": "warn",
    "vue/no-template-target-blank": "error",
    "vue/no-this-in-before-route-enter": "error",
    "vue/no-undef-properties": "error",
    "vue/no-unused-properties": "warn",
    "vue/no-unused-refs": "warn",
    "vue/no-useless-v-bind": "error",
    "vue/padding-line-between-blocks": "error",
    "vue/prefer-separate-static-class": "error",
    "vue/require-emit-validator": "warn",
    "vue/require-name-property": "warn",
    "vue/array-bracket-spacing": "error",
    "vue/arrow-spacing": "error",
  },
};
