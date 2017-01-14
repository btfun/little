var express = require('express');
var router = express.Router();
var sign = require('./util/sign.js');
var request = require('request');
var formidable = require('formidable');
var util = require('util');
var dateV=new Date();

var timeStamp= '?v='+dateV.getFullYear()+(dateV.getMonth()+1)+dateV.getDate()+dateV.getHours()+dateV.getMinutes();

/*应用主页 */
router.get('/', function(req, res, next) {

  res.render('index',   {
    version: timeStamp
   });
});

/*示例页面 */
router.get('/demo', function(req, res, next) {
  res.render('demo', { version: timeStamp });
});

/* index全局通用的 页面路由*/
//示例： index?route={ldx}&view={index}
router.get('/index', function(req, res, next) {

  var destination=req.query.route.replace('-','/').replace('-','/'),
      view=req.query.view,
      routeModel='module/'+destination+'/'+view;

    /*系统时间*/
    var timer=new Date();
    res.render(routeModel, {
       version: timeStamp,
       root:  req.protocol+'://'+req.hostname+req.originalUrl,
       sysTime :  (timer.format("yyyy-MM-dd hh:mm:ss")),
       sysTime1 : (timer.format("yyyy/MM/dd hh:mm:ss"))
     });

});


Function.prototype.method=function(name,fn){
    if(!this.prototype[name]){
        this.prototype[name]=fn;
        return this;
    }
};


if(!Date.prototype.format){
    Date.prototype.format =function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    };
}




router.post('/upload', function(req, res, next) {

  //创建表单上传
   var form = new formidable.IncomingForm();
   //设置编辑
   form.encoding = 'utf-8';
   //设置文件存储路径
   form.uploadDir = "uploads/images/";
   //保留后缀
   form.keepExtensions = true;
   //设置单文件大小限制
   form.maxFieldsSize = 2 * 1024 * 1024;

   form.parse(req, function(err, fields, files) {
        // res.render('index', { title: 'index' });

        res.writeHead(200, {'content-type': 'text/plain'});
        res.end(util.inspect({fields: fields, files: files}));
      });


});

router.get('/jsTicket', function(req, res, next) {
  getJsTicket(function(res){
        res.send(res);
  },function(error){
        res.send(error);
  })

});


function getJsTicket(fn,errFn){
  // 服务器端发送REST请求
  var sendUrl='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}';
        sendUrl=sendUrl.replace('{APPID}','')
        sendUrl=sendUrl.replace('{APPSECRET}','')
  var sendPath='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={ACCESS_TOKEN}&type=jsapi';

  request(sendUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var accessToken=JSON.parse(body).access_token;
          sendPath=sendPath.replace('{ACCESS_TOKEN}',accessToken);
          request(sendPath, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  var jsTicket=JSON.parse(body).ticket;
                    fn && fn({ status: 200 , jsTicket: jsTicket});
                }else{
                  errFn && errFn({ status: 400, error:error })
                }
              });
        }else{
            errFn && errFn({ status: 400, error:error })
        }
      });

}


module.exports = router;
