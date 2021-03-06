(function(factory,win,fn){
  fn(factory(),win);
})(function(){
'use strict';
//控制台输入 logPath('123456','searchKeys')查看对应的链接
 return {
   //////////////////lib//////////////////////
   text:        'javascripts/lib/scripts/requireJS/requireJS-text',
   vue:         'javascripts/lib/scripts/vue/vue',
   vueRouter:   'javascripts/lib/scripts/vue/vue-router/vue-router',
   vueResource: 'javascripts/lib/scripts/vue/vue-resource/vue-resource',
   vueLazyload: 'javascripts/lib/scripts/vue/vue-lazyload',
   store: 'javascripts/lib/scripts/store.min',
   //base
   globalUri:   'javascripts/base/globalUri',
   globalUtil:  'javascripts/base/globalUtil',
   //////////////////主入口/////////////////////
   mainIndex:   'javascripts/manager/mainIndex',
   //////////////////组件入口1///////////////////
   home:{
     homeRouter: 'components/manager/home/homeRouter',
     homeModule: 'components/manager/home/homeModule',
     homeTmpl: 'components/manager/home/homeTmpl.html'
   
   }

 };


},window,function(pathMods,win){
  'use strict';
  //pathMods 层级对象抹平，最多支持三级对象属性
  var path={};
  for(let attr in pathMods){
    if(typeof pathMods[attr]==='string'){
      path[attr]=pathMods[attr];
    }else if(typeof pathMods[attr]==='object'){
        for(let att in pathMods[attr]){
            if(typeof pathMods[attr][att]==='object' ){
                  for(let at in pathMods[attr][att]){
                    path[attr+'.'+att+'.'+at]=pathMods[attr][att][at];
                    if(typeof pathMods[attr][att][at]==='object')return alert('警告require配置对象不能有三级对象属性');
                  }
            }else{
              path[attr+'.'+att]=pathMods[attr][att];
            }
        }
    }
  }

  win.requirejs.config({
    baseUrl: '/',
    urlArgs: GLOBAL.version,//文件版本号
    paths: path
  });
  win.require(['text','mainIndex']);

  win.logPath=function(pwd,conf){
      if(pwd!==123456)return;
      for(var ins in path){
        if(conf){
          if(ins.indexOf(conf)>-1)console.log(ins,':',path[ins]);
        }else{
          console.log(ins,':',path[ins]);
        }
      }
    }
});
