(function(global,factory,GLOBAL){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(GLOBAL,global) :
  typeof define === 'function' && define.amd ? define(factory(GLOBAL,global)) :
  (global.requestUrl = factory(GLOBAL,global));
})(window,function(GLOBAL,global){
  'use strict'
/**
 * 仅内部使用（用户登陆后）
 */
 if(typeof GLOBAL !== 'object'){alert('上下文异常!');return;}

 var confRoot=GLOBAL.confRoot|| 'http://xxxx/';



return {
  login:{

  }



  }

},GLOBAL);
