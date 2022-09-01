<!--
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-09-01 15:15:40
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-09-01 15:48:17
-->

# create-ym-husky

为项目一键添加 husky。  
在 pre-commit 中使用

- [lint-staged](https://www.npmjs.com/package/lint-staged)
  在 commit-msg 中使用
- [@commitlint/cli @commitlint/config-conventional](https://commitlint.js.org/#/)
- [commitizen](https://www.npmjs.com/package/commitizen)
- [cz-git](https://cz-git.qbb.sh/zh/guide/)

## use

```
npm init ym-husky
```

## scripts

将会新增以下 scripts

- commit 提交

```js
  "scripts": {
    "prepare": "husky install",
    "lint:lint-staged": "lint-staged",
    "commit": "git add . && git-cz"
  },
```

## tip

谨慎使用，目前只试过 pnpm💦💦💦
