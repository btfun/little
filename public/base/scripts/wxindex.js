
define(function(require){
'use strict'
var wx=require('');
var $=require('');

  wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: GLOBAL.appId, // 必填，公众号的唯一标识
      timestamp: GLOBAL.timestamp, // 必填，生成签名的时间戳
      nonceStr: GLOBAL.nonceStr, // 必填，生成签名的随机串
      signature: GLOBAL.signature,// 必填，签名，见附录1
      jsApiList: ['scanQRCode','openLocation','getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });


  wx.ready(function(){

    //使用微信内置地图查看位置接口
    var latitude = ''; // 纬度，浮点数，范围为90 ~ -90
    var longitude = ''; // 经度，浮点数，范围为180 ~ -180。
    var speed = ''; // 速度，以米/每秒计
    var accuracy = ''; // 位置精度

$(function(){

  $('#goHere').on('click',function(){
      wx.openLocation({
          latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
          name: '天上的星星参北斗啊', // 位置名
          address: '地址：大河向东流', // 地址详情说明
          scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
      });

  });

  $('#goHere2').on('click',function(){

      wx.openLocation({
          latitude: 22.54574, // 纬度，浮点数，范围为90 ~ -90
          longitude: 113.9459, // 经度，浮点数，范围为180 ~ -180。
          name: '天上的星星参北斗啊', // 位置名
          address: '地址：大河向东流', // 地址详情说明
          scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
      });
  });

  $('#saosao').on('click',function(){
      wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          $('#scanQRCode').html('扫码结果:'+result)
        }
      });
  });

})


    //获取地理位置接口
      wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
               latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
               longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
               speed = res.speed; // 速度，以米/每秒计
               accuracy = res.accuracy; // 位置精度

              $('#wxInfo').html('gps坐标:<br>latitude='+latitude+'<br>longitude='+longitude+'<br>speed='+speed+'<br>accuracy='+accuracy);

          }
      });


  });

});
