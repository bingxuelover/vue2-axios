import e from"axios";import t from"qs";var o=Object.assign({routerChange:function(){},tipMessage:function(e){alert(e)},timeout:3e5,hasToken:!1,tokenError:1010,baseURL:""},e.defaults),s=e.create(o);function r(e,r){const n=sessionStorage.getItem("token");o.hasToken&&!n&&c();const i=o.hasToken?{token:n}:{};let g=t.stringify(Object.assign({},i,r));const u=o.baseURL+e;return new Promise(((e,t)=>{s.get(u+"?"+g).then((t=>{const s=t.data;s.code==o.tokenError?(a(s.desc),sessionStorage.clear(),localStorage.clear(),c()):e(s)})).catch((e=>{t(e.data)}))}))}function n(e,r){const n=sessionStorage.getItem("token");o.hasToken&&!n&&c();const i=o.hasToken?{token:n}:{};let g=t.stringify(Object.assign({},i,r));const u=o.baseURL+e;return new Promise(((e,t)=>{s.post(u,g).then((t=>{const s=t.data;s.code==o.tokenError?(a(s.desc),sessionStorage.clear(),localStorage.clear(),c()):e(s)})).catch((e=>{t(e.data)}))}))}s.interceptors.request.use((e=>{if(o.hasToken){const t=sessionStorage.getItem("token");t&&(e.headers.Authorization=t)}return e}),(e=>Promise.error(e))),s.interceptors.response.use((e=>200===e.status?Promise.resolve(e):Promise.reject(e)),(e=>{const{response:t}=e;return t?(i(t.status,t.data.message),Promise.reject(t)):Promise.reject(e)}));const a=e=>{o.tipMessage(e)},c=()=>{o.routerChange()},i=(e,t)=>{switch(e){case 401:c();break;case o.tokenError:a("登录信息已过期，请重新登录！"),sessionStorage.removeItem("token"),setTimeout((()=>{c()}),1e3);break;case 404:a("请求的资源不存在");break;case 500:a("服务器出错");break;default:console.log(t)}};let g={install:function(e){e.prototype.$post=n,e.prototype.$get=r}};g.defaultConfig=o;export default g;