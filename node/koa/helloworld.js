var koa = require('koa');
var app = new koa(); 
var route = require('koa-route')();
var cors = require('koa-cors');

app.use(async (ctx,next)=>{
    ctx.body = {key:'value'};
})
app.use(cors);
app.listen(3000);