'use strict';

define(function (require) {
  'use strict';

  return { path: '/',
    component: function component(resolve) {
      return require(['home.homeModule'], resolve);
    },
    children: [{
      path: 'one',
      component: function component(resolve) {
        return require(['home.oneModule'], resolve);
      }
    }, {
      path: 'two',
      component: function component(resolve) {
        return require(['home.twoModule'], resolve);
      }
    }]
  };
});