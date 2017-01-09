define(function(require){
'use strict'
 
  return { path: '/',
            component: resolve => require(['home.homeModule'],resolve),
            children: [
              {
                path: 'one',
                component: resolve => require(['home.oneModule'],resolve)
              },
              {
                path: 'two',
                component: resolve => require(['home.twoModule'],resolve)
              }
            ]
          }

});
