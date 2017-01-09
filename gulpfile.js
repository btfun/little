var  gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var reload      = browserSync.reload;


// 静态服务器 + 监听 scss/html 文件
gulp.task('server', ['nodemon'], function() {

  browserSync.init({
    proxy: 'http://127.0.0.1:3000',
    files: ['./views/**/*.*', './public/**/*.*'],
    browser: 'chrome',
    notify: false,
    port: 8080
  });

});

gulp.task('nodemon', function (cb) {

  var called = false;
  return nodemon({
      script: './bin/www'
    }).on('start', function () {
      if (!called) {cb();  called = true; }
    });
});


gulp.task('default', ['server'], function() {
  // 将你的默认的任务代码放在这
});
