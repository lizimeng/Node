//得到mongoose就可以省略mongodb了,连接数据库
var mongoose = require("mongoose");
//var mongoose = require('mongoose');
//
mongoose.connect("mongodb://localhost/azwy")
var session = require("express-session");
var express= require("express");
var app = express();
//跨域
var router = require("./router");
//使用session中间件
app.use(session({
    cookie: {maxAge:600000},
    secret: 'keyboard cat',//密文
    resave: false,
    saveUninitialized: true
}))
//设置ejs路径
app.set("view engine","ejs");
//静态化出来一个页面
app.use(express.static("public"));
//当访问到主页面的时候
app.get("/",router.showIndex);
//离开用户名的时候AJAX验证
app.get("/checkuserexist",router.checkuserexist);
//点击提交的验证
app.post("/dopost",router.dopost);
//点击登录的时候验证
app.post("/docheck",router.docheck);
//登录成功后跳转页面
app.get("/login",router.useradmin)
//当用户填写好自己的信息以后，上传自己的头像
app.post("/upload",router.upload);
app.get("/cut",router.cut);
app.get("/out",router.exit);
app.listen(3000)