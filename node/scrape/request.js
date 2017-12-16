var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
i = 0;

function start(url){
    http.get(url,function(res){
        var html = '';        //用来存储请求网页的整个html内容
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data',function(chunk){
            html += chunk;
            });
        //监听end事件,获取完整的网页    
        res.on('end',function(){
            //console.log(html);
            var $ = cheerio.load(html);
            var time = $('.article-info a:first-child').next().text().trim();
            var news_item = {
                //获取文章的标题
                title: $('div.article-title a').text().trim(),
                //获取文章发布的时间
                Time: time,
                //获取当前文章的url
                link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                //获取供稿单位
                author: $('[title=供稿]').text().trim(),
                //i是用来判断获取了多少篇文章
                i: i = i + 1
            };
            // console.log(news_item);

            var news_title = $('div.article-title a').text().trim();

            savedContent($, news_title);  //存储每篇文章的内容及文章标题

            // savedImg($, news_title);    //存储每篇文章的图片及图片标题
            
            var str= $('li.next a').attr('href').split('-')[0];
            var next_url = "http://www.ss.pku.edu.cn" + str;
            if(i<500){
                start(encodeURI(next_url));
            }
        })    
    })
}
//保存内容
function savedContent($,title){
    $('.article-content p').each(function(index,item){
        var text = $(this).text();
        var indent = text.substring(0,2).trim();
        if (indent==''){
            text+='\n';
        }
        fs.appendFile('./data/' + title + ".txt", text,'utf-8',function(err){
           if(err){
            //    throw err;
               console.log(err);
           }
        })
    })
}
function savedImg($,title){
    $('.article-content img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if (img_title.length > 35 || img_title == "") {
            img_title = "Null";
        }
        var img_filename = title + '.jpg';
        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url
        //采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if (err) {
                console.log(err);
            }
        });
        //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
        request(img_src).pipe(fs.createWriteStream('./image/' +title + '---' + img_filename));     
    })
}
start(url);