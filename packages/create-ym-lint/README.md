# create-ym-lint
为vue项目添加eslint,prettier./stylelint
## 基础使用
```
npm init ym-lint
npx create-ym-lint
```
## 基础依赖
| 依赖                     | 说明                                                |
| ------------------------ | --------------------------------------------------- |
| eslint@^8.21.0           | 基础                                                |
| eslint-plugin-prettier@4 | 将 Prettier 的 rules 以插件的形式加入到 ESLint 里面 |
| eslint-config-prettier@8 | 关掉所有和 Prettier 冲突的 ESLint 的配置            |
| prettier@8               | 格式化                                              |
## vue相关依赖
| 依赖                                                                   | 说明                                                                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@9 | .vue 文件自定义解析器 **Node.js ^14.17.0, 16.0.0 or later.**                                          |
| [eslint-plugin-vue](https://eslint.vuejs.org/)@9                       | vue 相关。这个插件允许我们使用 ESLint 检查.vue 文件的 template 和 script，以及.js 文件中的 vue 代码。 |
## ts相关依赖
| 依赖                               | 说明     |
| ---------------------------------- | -------- |
| @typescript-eslint/eslint-plugin@5 | ts插件   |
| @typescript-eslint/parser@5        | ts解析器 |
## 规范依赖
| 依赖                                                                              | 说明                            |
| --------------------------------------------------------------------------------- | ------------------------------- |
| [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard)@17 | eslint standard 规范            |
| eslint-plugin-import@2                                                            | eslint-config-standard 必要依赖 |
| eslint-plugin-n@15                                                                | eslint-config-standard 必要依赖 |
| eslint-plugin-promise@6                                                           | eslint-config-standard 必要依赖 |
## stylelint相关依赖
| 依赖                             | 说明                                                 |
| -------------------------------- | ---------------------------------------------------- |
| stylelint@14                     | 样式 lint                                            |
| stylelint-config-standard @28    | stylelint 标准规范                                   |
| postcss-html@1                   | 被捆绑的必须依赖                                     |
| stylelint-config-prettier@9      | 配置 stylelint 和 prettier 兼容                      |
| stylelint-config-html@1          | stylelint-config-html/vue vue 中 template 样式格式化 |
| stylelint-scss@4                 | stylelint 的 scss 插件                               |
| stylelint-config-standard-scss@5 | stylelint scss 标准规范                              |
## 添加的Scripts
| Scripts         | Scripts                                         | 说明                                 |
| --------------- | ----------------------------------------------- | ------------------------------------ |
| lint            | eslint --fix --ext .js,.vue ./                  | eslint自动修复 目录为根目录          |
| lint:check      | eslint --ext .js,.vue ./                        | eslint检查，不执行修复，目录为根目录 |
| prettier        | prettier --write --ignore-path .eslintignore ./ | prettier修复                         |
| prettier:check  | prettier --check --ignore-path .eslintignore ./ | prettier检查                         |
| stylelint       | stylelint --fix **/*.{css,scss}                 | stylelint修复                        |
| stylelint:check | stylelint **/*.{css,scss}                       | stylelint检查                        |
## vscode配置
extensions.json
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint"
  ]
}
```
settings.json
```json
{
  "[vue]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
  "[css]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
  "stylelint.validate": ["css", "less", "postcss", "scss", "sass", "vue"],
  "editor.codeActionsOnSave": {
    "source.fixAll": true, // 开启自动修复
    "source.fixAll.stylelint": true // 开启stylelint自动修复
  }
}

```