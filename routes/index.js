var express = require('express');
var router = express.Router();
var sign = require('./util/sign.js');
var request = require('request');
var formidable = require('formidable');
var util = require('util');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

/* index全局通用的 页面路由*/
router.get('/index/:name', function(req, res, next) {
  var name=req.params.name;

    var url=req.protocol+'://'+req.hostname+req.originalUrl;

    res.render(name, {
       title: name
     });

    // getJsTicket(function(resData){
    //       var jsTicket=resData.jsTicket;
    //
    //       var signatureObj=sign(jsTicket,url);
    //       res.render(name, {
    //          title: name,
    //          noncestr: signatureObj.nonceStr,
    //          timestamp: signatureObj.timestamp,
    //          signature: signatureObj.signature
    //        });
    //
    // },function(error){
    //       res.render(name, {
    //          title: name ,
    //          error: error
    //        });
    // })

});

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
