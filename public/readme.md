此项目专为微信H5相关开发搭建

lib库介绍：
vue(主库),vue-router(路由),vue-resource (请求数据),vue-lazyload (懒加载)
store(localstorage库，缓存数据，例如微信用户token)


base 存放自定义公共文件（css，js）
libs 存放三方库文件（css，js）
module 功能模块 ：
内建各个模块所需要的组件（css，js，html）

如果功能模块内功能复杂可将html模板文件提出来
建议将模板文件直接写入到对应的HTML页面中

gulp 构建文件的时候不要打开build输出文件夹（程序占用会出现不必要的BUG）
