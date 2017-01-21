var  gulp = require('gulp'),
     babel = require('gulp-babel'),//es6转es5
     uglify = require('gulp-uglify'),//js压缩仅支持es5写法
     minifycss = require('gulp-minify-css'),//css压缩
     less = require('gulp-less'),//编译less
     gulpif = require('gulp-if'),
     minimist = require('minimist'),
     minifyhtml = require('gulp-htmlmin'),//压缩html
     concat = require('gulp-concat'),//合并文件 css使用
     autoprefixer = require('gulp-autoprefixer'),//CSS浏览器前缀补全
     cache = require('gulp-cache'),
     changed = require('gulp-changed'),//只通过改变的文件
     rename = require('gulp-rename'),//重命名
     watch = require('gulp-watch'),//监听
     del = require('del'),//删除
     debug = require('gulp-debug'),
     notify = require('gulp-notify'),
     plumber = require('gulp-plumber'),
     jshint=require('gulp-jshint');//语法检查

var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var reload      = browserSync.reload;

var paths={
  base:{
    //(压缩，MD5)
    scripts:{
      src: 'public/base/scripts/**/*.js',
      dist:'build/base/scripts'
    },
    styles:{
      src: 'public/base/styles/**/*.{css,less}',
      dist:'build/base/styles'
    }
  },
  libs:{
    //复制即可(无需压缩，无需MD5)
    scripts:{
      src: 'public/libs/scripts/**/*.js',
      dist:'build/libs/scripts'
    },
    styles:{
      src: 'public/libs/styles/**/*.{css,less}',
      dist:'build/libs/styles'
    }
  },
  module:{
    //模板，不能合并
    tmplSrc: 'public/module/**/**/*.{html,tpl}',
    tmplDist:'build/module',

    jsSrc: 'public/module/**/**/*.js',
    jsDist:'build/module',

    cssSrc: 'public/module/**/**/*.{css,less}',
    cssDist:'build/module'
  },
  example:{
    jsSrc: 'public/example/**/**/*.js',
    jsDist:'build/example',

    cssSrc: 'public/example/**/**/*.{css,less}',
    cssDist:'build/example'
  }

};


 var knownOptions = {
   string: 'env',
   default: { env: process.env.NODE_ENV || 'dev' }
 };

 var options = minimist(process.argv.slice(2), knownOptions);


//lib库复制
gulp.task('copyjslib',function(cb){
  return gulp.src(paths.libs.scripts.src)
        .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe( gulp.dest(paths.libs.scripts.dist));
});

gulp.task('copycsslib',function(cb){
  return gulp.src(paths.libs.styles.src)
        .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe( gulp.dest(paths.libs.styles.dist));
});

//////////////////////////module模块压缩//////////////////////
//css 编译压缩
gulp.task('minifycss', function(cb){
    return gulp.src(paths.module.cssSrc)
    .pipe( debug({title: '编译css:'}))
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( less())
    // .pipe( sourcemaps.write())
    .pipe( autoprefixer('last 2 versions', '> 1%', 'ie 8', 'Android >=4.0') )  //添加浏览器前缀
    .pipe( gulpif(options.env === 'online',minifycss()) )//发布的时候才压缩
    .pipe( gulp.dest(paths.module.cssDist) ) //输出文件夹
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});
gulp.task('minifyexamplecss', function(cb){
    return gulp.src(paths.example.cssSrc)
    .pipe( debug({title: '编译css:'}))
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( less())
    // .pipe( sourcemaps.write())
    .pipe( autoprefixer('last 2 versions', '> 1%', 'ie 8', 'Android >=4.0') )  //添加浏览器前缀
    .pipe( gulpif(options.env === 'online',minifycss()) )//发布的时候才压缩
    .pipe( gulp.dest(paths.example.cssDist) ) //输出文件夹
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});
// html模板
gulp.task('minifyhtml', function(cb) {
  return gulp.src(paths.module.tmplSrc)
    .pipe(minifyhtml({removeComments: true,collapseWhitespace: true}))//删除注释，压缩
    .pipe(gulp.dest(paths.module.tmplDist))
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});

//js 编译压缩
gulp.task('minifyjs', function(cb){
  return gulp.src(paths.module.jsSrc)
      .pipe( changed(paths.module.jsDist))//通过改变的文件
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      // .pipe( jshint.reporter('default'))//默认错误提示(最严格)
      .pipe( gulpif(options.env === 'online', uglify({
           mangle: {except: ['require' ,'exports' ,'module' ,'$']}
          }).on('error',function(e){
           console.error('【minifyjs】错误信息:',e);
         }) ))//发布的时候才压缩
      .pipe( gulp.dest(paths.module.jsDist))  //输出
      .pipe(reload({stream: true})) ;
});
gulp.task('minifyexamplejs', function(cb){
  return gulp.src(paths.example.jsSrc)
      .pipe( changed(paths.example.jsDist))//通过改变的文件
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      // .pipe( jshint.reporter('default'))//默认错误提示(最严格)
      .pipe( gulpif(options.env === 'online', uglify({
           mangle: {except: ['require' ,'exports' ,'module' ,'$']}
          }).on('error',function(e){
           console.error('【minifyjs】错误信息:',e);
         }) ))//发布的时候才压缩
      .pipe( gulp.dest(paths.example.jsDist))  //输出
      .pipe(reload({stream: true})) ;
});
//////////////////////////base模块压缩//////////////////////
//css 编译压缩
gulp.task('minifybasecss', function(cb){
  return gulp.src(paths.base.styles.src)
    .pipe( debug({title: '编译css:'}))
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( less())
    .pipe( autoprefixer('last 2 versions', '> 1%', 'ie 8', 'Android >=4.0') )  //添加浏览器前缀
    .pipe( minifycss() ) //执行压缩
    .pipe( gulp.dest(paths.base.styles.dist) ) //输出文件夹
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});

//js压缩
gulp.task('minifybasejs', function(cb){
  return gulp.src(paths.base.scripts.src)
      .pipe( changed(paths.base.scripts.dist))//通过改变的文件
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      .pipe( gulpif(options.env === 'online', uglify({
           mangle: {except: ['require' ,'exports' ,'module' ,'$']}
          }).on('error',function(e){
           console.error('【minifybasejs】错误信息:',e);
         }) ))//发布的时候才压缩
      .pipe( gulp.dest(paths.base.scripts.dist))  //输出
      .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});

/////////////////////删除掉上一次构建时创建的资源///////////////////////////////////
gulp.task('clean', function(cb) {
    return del(['build/*']);
});
///////////////////////////////移动端开发(生产)(无需文件MD5)////////////////////////////////////////////////////
gulp.task('default', ['copyjslib','copycsslib',
                      'minifybasecss','minifybasejs','minifyexamplejs','minifyexamplecss',
                      'minifycss','minifyjs','minifyhtml'], function() {
  // 将你的默认的任务代码放在这 'sass','minifyjs',

});


// 静态服务器 + 监听 scss/html 文件
gulp.task('server',function(){
  var started = false;
    nodemon({
        ignore:['gulpfile.js','node_modules/'], //忽略不需要监视重启的文件
        script: './bin/www'
    }).on('start',function(){
      if (!started) {
        started = true;
        browserSync.init({
            files: ['./views/**/*.*'],//, './public/**/*.*'
            proxy:'http://localhost:3030', //设置代理运行本地的3000端口
            port:8080, //设置browser-sync的运行端口号
            browser: 'chrome',
            notify: false
        },function(){
            console.log('浏览器已刷新')
        })
      }
    });
    gulp.watch([paths.base.styles.src], ['minifybasecss']);
    gulp.watch([paths.base.scripts.src], ['minifybasejs']);
    //
    gulp.watch([paths.module.cssSrc],  ['minifycss']);
    gulp.watch([paths.example.cssSrc],  ['minifyexamplecss']);

    gulp.watch([paths.module.tmplSrc], ['minifyhtml']);

    gulp.watch([paths.module.jsSrc], ['minifyjs']);
    gulp.watch([paths.example.jsSrc], ['minifyexamplejs']);
})
