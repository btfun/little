"use strict";define(function(require){var e=require("vue"),o=require("vuex"),u=require("logger"),t=require("vueRouter"),r=require("vueResource");require("mainElectron");e.use(o),e.use(t),e.use(r);var n=new o.Store({modules:{home:require("home.module"),custom:require("custom.module"),busi:require("busi.module")},plugins:[u()]}),s=new t({routes:[require("home.homeRouter"),require("busi.busiRouter"),require("custom.customRouter")]});s.beforeEach(function(e,o,u){console.log("当前路径：",e.path),u()}),e.http.interceptors.push(function(e,o){console.log("request",e),o(function(e){return e.ok||alert("请求异常"),e})}),e.config.errorHandler=function(e,o){};new e({router:s,store:n}).$mount("#app")});