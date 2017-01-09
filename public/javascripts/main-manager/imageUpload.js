$(function(){
  $('body').on('click','a[data-img="true"]',function(){
    $(this).remove();
  });

  $('#upload').on('change',function(){
       if(FileReader){
         console.log(this.files.length)

         var $viewImg=$('#viewImg');
         var canvas=$('<canvas>')[0];
         var cxt=canvas.getContext('2d');

            $(this.files).each(function(){
              var file=$(this);
              console.log(file,file[0].size,file[0].type);

              var reader=  new FileReader();
              reader.readAsDataURL(file[0]);
              reader.onload=function(e){
                var img=new Image();
                    img.src=e.target.result;
                    var width = img.width;
                    var height = img.height;
                    dic = height / width;
                    var wh=width||200,hh=height||200;

                    // canvas.width = wh;  //图片压缩的标准，这里是按照定款200px计算
                    // canvas.height = hh * dic;
                    // cxt.clearRect(0,0,wh,hh*dic);
                    // cxt.drawImage(img,0,0,wh,hh*dic);
                    canvas.width = wh;  //图片压缩的标准，这里是按照定款200px计算
                    canvas.height = hh ;
                    cxt.clearRect(0,0,wh,hh);
                    cxt.drawImage(img,0,0,wh,hh);

                    var finalURL = canvas.toDataURL('image/jpeg',0.5);


                // console.log('finalURL==',finalURL)
                // console.log('result==',e.target.result)
                // $viewImg.append('<img src="'+finalURL+'">')
                $viewImg.append('<a data-img="true"><img src="'+e.target.result+'" style="width:200px;height:200px;"  ></a>')

              }

            })
       }
  });


  //批量上传图片
  // 				var xhrList=[];
  // $('#fileupload').fileupload({
  //         url:'/upload/',
  //         type: 'post',
  //         formData:{},
  //         sequentialUploads:true,//排队发送请求
	// 			  dataType: 'json',
	// 			  acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
	// 			  maxFileSize : 3145728,// 3M
  //         add: function (e, data) {
  //                var uploadFile = data.files[0];
	// 		           var  reader = new FileReader();
  //                reader.readAsDataURL(uploadFile);
  //
  //                reader.onload = function(e) {
  //     			             if (uploadFile.size < 1048576) {
  //             			  			   var xhr=data.submit();
  //             			         			xhrList.push(xhr);
  //
  //     			             }else{
  //                          alert('上传文件超过1MB！请重新上传')
  //
  //     			             }
  // 			           };
  //
  //                 // data.context = $('<p/>').text('Uploading...').appendTo(document.body);
  //                 // data.submit();
  //         },
  //         dataType: 'json',
  //         progressall: function (e, data) {
  //             var progress = parseInt(data.loaded / data.total * 100, 10);
  //             $('#progress .bar').css(
  //                 'width',
  //                 progress + '%'
  //             );
  //         },
  //         done: function (e, data) {
  //             $.each(data.result.files, function (index, file) {
  //                 $('<p/>').text(file.name).appendTo(document.body);
  //             });
  //         }
  //     });




  document.querySelector('#fileupload').addEventListener('change', function () {
      lrz(this.files[0]).then(function (rst) {
              // 处理成功会执行
              console.log(rst);
              // 把处理的好的图片给用户看看呗

           var img = new Image();
           img.src = rst.base64;

           img.onload = function () {
              //  document.body.appendChild(img);
               $('#viewImg2').append(img)
           };

           return rst;
          })
          .then(function (rst) {
            // 这里该上传给后端啦

            /* ==================================================== */
            // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
            // 其他框架，例如jQuery处理formData略有不同，请自行google，baidu。
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:5000/');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    // 上传成功
                } else {
                    // 处理其他情况
                }
            };

            xhr.onerror = function () {
                // 处理错误
            };

            xhr.upload.onprogress = function (e) {
                // 上传进度
                var percentComplete = ((e.loaded / e.total) || 0) * 100;
            };

            // 添加参数
            rst.formData.append('fileLen', rst.fileLen);
            rst.formData.append('xxx', '我是其他参数');

            // 触发上传
            xhr.send(rst.formData);
            /* ==================================================== */

            return rst;
        })
          .catch(function (err) {
              // 处理失败会执行
          })
          .always(function () {
              // 不管是成功失败，都会执行
          });
  });










})
