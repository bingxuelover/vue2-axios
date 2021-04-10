'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var qs = require('qs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

/**
 * 返回结果格式
{
  `data` 由服务器提供的响应
  data: {},
  `status` 来自服务器响应的 HTTP 状态码
  status: 200,
  `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  `headers` 服务器响应的头
  headers: {},
  `config` 是为请求提供的配置信息
  config: {}
}
*/

var defaultConfig = Object.assign({
  routerChange: function routerChange() {},
  tipMessage: function tipMessage(msg) {
    alert(msg);
  },
  timeout: 1000 * 300,
  hasToken: false,
  tokenError: 1010,
  baseURL: ""
}, axios__default['default'].defaults); // 创建axios实例

var instance = axios__default['default'].create(defaultConfig);
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(config => {
  if (defaultConfig.hasToken) {
    const token = sessionStorage.getItem("token");
    token && (config.headers.Authorization = token);
  }

  return config;
}, error => Promise.error(error)); // 响应拦截器

instance.interceptors.response.use( // 请求成功
res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res), // 请求失败
error => {
  const {
    response
  } = error;

  if (response) {
    // 请求已发出，但是不在2xx的范围
    errorHandle(response.status, response.data.message);
    return Promise.reject(response);
  } else {
    return Promise.reject(error);
  }
}); // get

function getRequest(path, data) {
  const token = sessionStorage.getItem("token");

  if (defaultConfig.hasToken && !token) {
    changePage();
  }

  const tokenData = defaultConfig.hasToken ? {
    token
  } : {};
  let postData = qs__default['default'].stringify(Object.assign({}, tokenData, data));
  const postPath = defaultConfig.baseURL + path;
  return new Promise((resolve, reject) => {
    instance.get(postPath + "?" + postData).then(res => {
      const datas = res.data;

      if (datas.code == defaultConfig.tokenError) {
        //token 失效
        tip(datas.desc);
        sessionStorage.clear();
        localStorage.clear();
        changePage();
      } else {
        resolve(datas);
      }
    }).catch(err => {
      reject(err.data);
    });
  });
}

function postRequest(path, data) {
  const token = sessionStorage.getItem("token");

  if (defaultConfig.hasToken && !token) {
    changePage();
  }

  const tokenData = defaultConfig.hasToken ? {
    token
  } : {};
  let postData = qs__default['default'].stringify(Object.assign({}, tokenData, data));
  const postPath = defaultConfig.baseURL + path;
  return new Promise((resolve, reject) => {
    instance.post(postPath, postData).then(res => {
      // console.log('axios response', res.data);
      const datas = res.data;

      if (datas.code == defaultConfig.tokenError) {
        //token 失效
        tip(datas.desc);
        sessionStorage.clear();
        localStorage.clear();
        changePage();
      } else {
        resolve(datas);
      }
    }).catch(err => {
      reject(err.data);
    });
  });
}
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */


const tip = msg => {
  defaultConfig.tipMessage(msg);
};
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */


const changePage = () => {
  defaultConfig.routerChange();
};
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */


const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      changePage();
      break;
    // defaultConfig.tokenError token过期
    // 清除token并跳转登录页

    case defaultConfig.tokenError:
      tip("登录信息已过期，请重新登录！");
      sessionStorage.removeItem("token");
      setTimeout(() => {
        changePage();
      }, 1000);
      break;
    // 404请求不存在

    case 404:
      tip("请求的资源不存在");
      break;

    case 500:
      tip("服务器出错");
      break;

    default:
      console.log(other);
  }
}; //Vue 的实例方法


let MyPlugin = {};

MyPlugin.install = function (Vue) {
  Vue.prototype.$post = postRequest;
  Vue.prototype.$get = getRequest;
};

MyPlugin.defaultConfig = defaultConfig;

exports.default = MyPlugin;
