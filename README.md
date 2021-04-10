# vue2-axios

## 环境

"vue"
"axios",
"qs",

## 配置

- 初始化 axios 的配置

axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000;

## main.js 引用

### 引入

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from "./config/post";
import './utils/element-ui'

### 注册

Vue.use(http)

### 设置

- 设置出错时的路由跳转

  http.defaultConfig.routerChange = function () {
  router.replace({
  path: "/nopage",
  });
  };

- 设置错误提示的弹出方式

  http.defaultConfig.tipMessage = function(msg) {
  slert(msg);
  };

- 设置是否判断 token，token 的错误码

  http.defaultConfig.hasToken = true;//默认不判断

  http.defaultConfig.tokenError = 1122;

## Vue 页面使用

this.$get("getPath", {}).then(res => { if (res.code == 200) { } });

this.$post("postPath", {}).then(res => { if (res.code == 200) { } });
