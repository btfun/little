"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,o,t){t(e(),o)}(function(){return{text:"javascripts/lib/requireJS/requireJS-text",vue:"javascripts/lib/vue/vue",vueRouter:"javascripts/lib/vue/vue-router/vue-router",vueResource:"javascripts/lib/vue/vue-resource/vue-resource",vuex:"javascripts/lib/vue/vuex/vuex",logger:"javascripts/lib/vue/vuex/logger",globalUri:"javascripts/base/globalUri",globalUtil:"javascripts/base/globalUtil",mainIndex:"javascripts/manager/mainIndex",mainElectron:"javascripts/manager/mainElectron",home:{homeRouter:"components/manager/home/homeRouter",homeModule:"components/manager/home/homeModule",module:"components/manager/home/hStore/module",store:"components/manager/home/hStore/store",getters:"components/manager/home/hStore/getters",mutations:"components/manager/home/hStore/mutations",actions:"components/manager/home/hStore/actions",oneModule:"components/manager/home/children/one/oneModule",twoModule:"components/manager/home/children/two/twoModule"},busi:{busiRouter:"components/manager/busi/busiRouter",busiModule:"components/manager/busi/busiModule",module:"components/manager/busi/bStore/module",store:"components/manager/busi/bStore/store",getters:"components/manager/busi/bStore/getters",mutations:"components/manager/busi/bStore/mutations",actions:"components/manager/busi/bStore/actions"},custom:{customRouter:"components/manager/custom/customRouter",customModule:"components/manager/custom/customModule",module:"components/manager/custom/cStore/module",store:"components/manager/custom/cStore/store",getters:"components/manager/custom/cStore/getters",mutations:"components/manager/custom/cStore/mutations",actions:"components/manager/custom/cStore/actions"}}},window,function(e,o){var t={};for(var n in e)if("string"==typeof e[n])t[n]=e[n];else if("object"===_typeof(e[n]))for(var r in e[n])if("object"===_typeof(e[n][r])){for(var s in e[n][r])if(t[n+"."+r+"."+s]=e[n][r][s],"object"===_typeof(e[n][r][s]))return alert("警告require配置对象不能有三级对象属性")}else t[n+"."+r]=e[n][r];o.requirejs.config({baseUrl:"/",paths:t}),o.require(["text","mainIndex"]),o.logPath=function(e,o){if(123456===e)for(var n in t)o?n.indexOf(o)>-1&&console.log(n,":",t[n]):console.log(n,":",t[n])}});