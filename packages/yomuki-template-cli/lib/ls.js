#!/usr/bin/env node
import { TEMPLATES } from "../template/index.js";
export default () => {
  TEMPLATES.forEach((item) => {
    console.log(item);
  });
};
