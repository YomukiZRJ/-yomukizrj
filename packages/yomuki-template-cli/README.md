<!--
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-19 10:17:41
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 15:37:29
-->

# 自用模板脚手架

## 安装

- npm install yomuki-template-cli -g

## cli

### ymcli create [projectName] [templateName]

创建项目模板

- projectName 项目名称
- templateName 模板名称

现有模板：

- webpack-vue3-js

  - webpack5 + vue3 + less + eslint + prettier + jsx + vueuse + axios + lodash + pinia + vue-router 日常项目用

- vite-vue3-ts-rule
  - vite + vue3 + ts + commitlint + eslint + husky + stylelint + prettier + commitizen + jsx 规则贼多的，学习 vite 搭建时候的产物，应该没机会用正式项目中

### ymcli ls

查询模板列表

### ymcli add

为项目添加拓展，需在项目根目录运行。

#### eslint

为项目添加 eslint 验证。会在 scripts 中添加如下命令

```js
{
    "lint": "eslint ./", // eslint校验
    "lint:fix": "eslint --fix ./", // eslint自动修复
    "prettier": "prettier --check --ignore-path .eslintignore ./", // 代码格式化检查
    "prettier:fix": "prettier --write --ignore-path .eslintignore ./",// 代码格式化修复
}
```
