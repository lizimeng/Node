/**
 * Created by thinkpad on 2016/6/10 2:27.
 */
//查找有没有注册的用户名
var mongoose = require("mongoose");
//引用加密模块
var crypto = require("crypto");
//定义用户传入数据库的格式，也就是以前的字段
var userSchema = mongoose.Schema({
    "phoneNumber":Number,
    "password":String,
    "titlePic": String
})

//定义用户的model
var user = mongoose.model("user",userSchema);

//通过传进来的名字取数据查看
exports.findUserByName=function(name,callback){
    //将找到的结果返回
    user.findOne({"phoneNumber":name},function(err,doc){
          callback(err,doc);
    })
}
exports.adduser=function(phoneNumber,password,callback){
         //哈希表加密密码
        var jiami = crypto.createHmac('sha256',password).digest('hex');
    //向数据库保存
    user.create({"phoneNumber":phoneNumber,"password":jiami},function(err,doc){
        callback(err,doc);
    })
}
//将数据库中添加头像属性
exports.addShuxing=function(name,k,v,callback){
    user.findOne({"phoneNumber":name},function(err,doc){
        if(err){
            return;
        }
        doc[k]=v;
        //将doc对象保存到数据库中，后面是回调函数
        doc.save(callback)
    })
}
//查询用户当前有没有头像，有就返回
exports.getK=function(name,val,callback){
    user.findOne({"phoneNumber":name},function(err,doc){
        callback(err,doc[val]);
    })
}
