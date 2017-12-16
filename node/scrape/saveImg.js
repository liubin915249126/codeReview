var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var url = 'http://www.mzitu.com/'

function start(url){
    http.get(url,function(res){
        var html = '';
        res.on('data',function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            var $ = cheerio.load(html);
            saveImg($);
        })
    })
}
function saveImg($){
    var imgs_wrap = $('#pins').find('li a');
    imgs_wrap.each(function(index,item){
        var img_url = $(this).find('img').attr('data-original');
        var name = $(this).find('img').attr('alt');
        console.log(img_url)
        var img_name;
        if(name){
            img_name = name + '.jpg'
        }else{
            img_name = index + '.jpg';
        }
        http.get(img_url,function(res){
            var imgData = '';
            res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
            res.on('data',function(chunk){
                imgData +=chunk;
            })
            res.on('end',function(){
                fs.writeFile('./image/' + img_name, imgData, "binary",function(err){
                    if(err){
                        console.log(err)
                    }else{
                        console.log('ok')
                    }
                })
            })
             
        })
    })
}

start(url)