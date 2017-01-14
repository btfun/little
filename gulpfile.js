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
     debug = require('gulp-debug'),
     clean = require('gulp-clean'),//删除
     reqOptimize = require('gulp-requirejs-optimize'),//- requireJs文件合并所需模块
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
    tmplSrc: 'public/module/**/*.{html,tpl}',
    tmplDist:'build/module',

    jsSrc: 'public/module/**/*.js',
    jsDist:'build/module',

    cssSrc: 'public/module/**/*.{css,less}',
    cssDist:'build/module'
  }

};

//lib库复制
gulp.task('copyjslib',function(cb){
  return gulp.src(paths.libs.scripts.src)
        .pipe( gulp.dest(paths.libs.scripts.dist));
});

gulp.task('copycsslib',function(cb){
  return gulp.src(paths.libs.styles.src)
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
    .pipe( minifycss() ) //执行压缩
    .pipe( gulp.dest(paths.module.cssDist) ) //输出文件夹
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
      .pipe( jshint.reporter('default'))//默认错误提示
      .pipe( uglify( {mangle: {except: ['require' ,'exports' ,'module' ,'$']} } ).on('error',function(e){ console.error('【minifyjs】错误信息:',e); }) )
      .pipe( gulp.dest(paths.module.jsDist))  //输出
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
      .pipe( jshint.reporter('default'))//默认错误提示
      .pipe( uglify( {mangle: {except: ['require' ,'exports' ,'module' ,'$']} } ).on('error',function(e){ console.error('【minifyjs】错误信息:',e); }) )
      .pipe( gulp.dest(paths.base.scripts.dist))  //输出
      .pipe(reload({stream: true})); //编译后注入到浏览器里实现更新
});

/////////////////////删除掉上一次构建时创建的资源///////////////////////////////////
gulp.task('clean', function(cb) {
  return gulp.src(['build/module/*', 'build/base/*', 'build/libs/*'])
            .pipe(clean());
});
///////////////////////////////移动端开发(生产)(无需文件MD5)////////////////////////////////////////////////////
gulp.task('default', ['clean','copyjslib','copycsslib',
                      'minifybasecss','minifybasejs',
                      'minifycss','minifyjs','minifyhtml'], function() {
    gulp.run('nodemon');
  // 将你的默认的任务代码放在这 'sass','minifyjs',

    gulp.watch([paths.base.styles.src], ['minifybasecss']);
    gulp.watch([paths.base.scripts.src], ['minifybasejs']);

    gulp.watch([paths.module.cssSrc],  ['minifycss']);
    gulp.watch([paths.module.tmplSrc], ['minifyhtml']);
    gulp.watch([paths.module.src], ['minifyjs']);

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
gulp.task('nodemon',function(){
    nodemon({
        ignore:['gulpfile.js','node_modules/'], //忽略不需要监视重启的文件
        script: './bin/www',
        ext:'js html'
    }).on('start',function(){
        browserSync.init({
            files: ['./views/**/*.*'],//, './public/**/*.*'
            proxy:'http://localhost:3030', //设置代理运行本地的3000端口
            port:8080, //设置browser-sync的运行端口号
            browser: 'chrome',
            notify: false
        },function(){
            console.log('浏览器已刷新')
        })
    })
})
