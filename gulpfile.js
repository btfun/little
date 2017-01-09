var  gulp = require('gulp'),
     babel = require('gulp-babel'),//es6转es5
     uglify = require('gulp-uglify'),//js压缩仅支持es5写法
     minifycss = require('gulp-minify-css'),//css压缩
     less = require('gulp-less'),//编译less
     minifyhtml = require('gulp-htmlmin'),//压缩html
     concat = require('gulp-concat'),//合并文件 css使用
     autoprefixer = require('gulp-autoprefixer'),//CSS浏览器前缀补全
     cache = require('gulp-cache'),
     changed = require('gulp-changed'),//只通过改变的文件
     rename = require('gulp-rename'),//重命名
     watch = require('gulp-watch'),//监听
     rev = require('gulp-rev'),//md5
     runSequence= require('run-sequence'),//
     revCollector= require('gulp-rev-collector'),//路径替换
     through2= require('through2'),//路径替换
     del = require('del'),//删除
     clean = require('gulp-clean'),//删除
     reqOptimize = require('gulp-requirejs-optimize'),//- requireJs文件合并所需模块
     notify = require('gulp-notify'),
     plumber = require('gulp-plumber'),
     jshint=require('gulp-jshint');//语法检查

var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var reload      = browserSync.reload;

var paths={
      js:{
        libSrc:'',
        libTo:'',
      },
      tmps:{

      },
      css:{

      }

};

//lib库复制
gulp.task('copyjslib',function(){
  return gulp.src(paths.scripts.libSrc)
        .pipe( gulp.dest(paths.scripts.libTo));
});
gulp.task('copycsslib',function(){
  return gulp.src(paths.styles.libSrc)
        .pipe( gulp.dest(paths.styles.libTo));
});

//css 编译压缩
gulp.task('minifycss', function(){
    return gulp.src(paths.styles.src)
    .pipe( changed(paths.styles.dest,{extension: '.min.css'}))//通过改变的文件
    .pipe( debug({title: '编译css:'}))
    .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe( less())
    .pipe( sourcemaps.write())
    .pipe( autoprefixer('last 2 versions', '> 1%', 'ie 8', 'Android >=4.0') )  //添加浏览器前缀
    .pipe( minifycss() ) //执行压缩
    .pipe( concat('all.css'))
    .pipe( rename({suffix: '.min'}) )   //rename压缩后的文件名
    .pipe( gulp.dest(paths.styles.dest) ) //输出文件夹
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});


//base压缩
gulp.task('minifygolbalbasejs', function(){
  return gulp.src(paths.scripts.golablBaseSrc)
      .pipe( plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe( changed(paths.scripts.golablBaseTo))//通过改变的文件
      .pipe( babel({presets: ['es2015','stage-3']})) //es6转es5
      .pipe( jshint())//语法检查
      .pipe( jshint.reporter('default'))//默认错误提示
      // .pipe( eslint())
      // .pipe( eslint.format())
      // .pipe( eslint.failAfterError())
      // .pipe( uglify( {mangle: {except: ['require' ,'exports' ,'module' ,'$']} } ).on('error',function(e){ console.error('【minifyjs】错误信息:',e); }) )
      .pipe( gulp.dest(paths.scripts.golablBaseTo))  //输出
      .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});

gulp.task('minifyhtml', function() {
  return gulp.src(paths.tmpls.src)
    .pipe(minifyhtml({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.tmpls.dest))
    .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});
//删除掉上一次构建时创建的资源
gulp.task('clean', function() {
  return del(['build/components/*',
              'rev-manifest.json',
              'build/javascripts/base/*',
              'build/javascripts/manager/*',
              'build/stylesheets/manager/*']);
});

/////////////////////////////////////开发////////////////////////////////////////////////////
gulp.task('default', ['clean','copycsslib','copyjslib','server'], function() {
  // 将你的默认的任务代码放在这 'sass','minifyjs',
    gulp.run('minifygolbaljs','minifygolbalbasejs','minifycss','minifyjs','minifyhtml');

    gulp.watch([paths.styles.src],  ['minifycss']);
    gulp.watch([paths.scripts.src], ['minifyjs']);
    gulp.watch([paths.scripts.golablSrc], ['minifygolbaljs']);
    gulp.watch([paths.scripts.golablBaseSrc], ['minifygolbalbasejs']);
    gulp.watch([paths.tmpls.src], ['minifyhtml']);

});

//////////////////////////////生产/////////////////////////////////
//构建总入口
gulp.task('online',['clean','copycsslib','copyjslib',
                    'online_minifycss',
                    'online_minifyhtml',
                    "online_minify_basejs",
                    "online_minify_managerjs",
                    "online_minify_componentsjs" ], function(callback) {

   runSequence(
       "online_replaceSuffix",        //- 替换.js后缀
       "online_replaceRequireConfPath",      //- 路径替换为md5后的路径
       callback);
});


gulp.task('online_clean', function() {
  return del(['rev-manifest.json']);
});

gulp.task('online_md5',function(){
  return gulp.src(['build/**/*.js','!build/javascripts/lib/**/*.js'])
        .pipe( rev())    //- 文件名加MD5后缀
        .pipe( rev.manifest({merge:true}))
        .pipe( gulp.dest(''));          //- 映射文件输出目录
});


function modify(modifier) {
    return through2.obj(function(file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

function replaceSuffix(data) {
    return data.replace(/\.js/gmi, "");
}

gulp.task("online_replaceSuffix",function (cb) {
    gulp.src(['rev-manifest.json'])
        .pipe(modify(replaceSuffix))            //- 去掉.js后缀
        .pipe(gulp.dest(''))
        .on('end', cb);
});
gulp.task("online_replaceRequireConfPath",function (cb) {
    gulp.src(['rev-manifest.json', './build/javascripts/manager/requireConf-*.js'])
        .pipe(revCollector())   //- 替换为MD5后的文件名
        .pipe(rename('requireConf.js')) //每次发布必更新的文件直接使用系统时间
        .pipe(gulp.dest('./build/javascripts/manager/'))
        .on('end', cb);
});




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
