var url = require("url");
var user = require("../contorle/user.js")
//得到formidable来调教post请求
var formidable = require("formidable");
//引用加密模块，用来判断登录密码是否正确
var crypto = require("crypto");
//引用事件模块
var df = require("date-format");
//得到fs
var fs = require("fs");
//引用gm画图模块
var gm = require("gm");
//显示主页面
exports.showIndex=function(req,res,next){
    var login = req.session.login== 1 ? true : false
    var name = login ? req.session.name : "";
    var titlePics = "";
    if (login) {
        user.getK(name,"titlePic",function(err,titlePic){
            if(titlePic){
                titlePics = titlePic;
            }
            res.render("index",{
                "login":login,
                "name":name,
                "titlePic":titlePics
            });

        })
    }
   else {
        res.render("index",{
            "login":login,
            "name":"",
            "titlePic":""
        });
    }


}
//检测用户名是否被占用
exports.checkuserexist=function(req,res,next){
    //得到用户名
    var queryObj = url.parse(req.url,true).query;
    //前台虽然已经判断过来，为了保险，再次判断;
    if(!queryObj){
        res.json({"result":-1});
        return;
    }
    //console.log(queryObj.phoneNumber)
    //下面就是有的情况下，我们要去验证是否注册，当然执行是在contorler里面
    user.findUserByName(queryObj.phoneNumber,function(err,doc){
         if(doc){
            //表示存在
            res.json({"result":-2});
            return;
        }else {
            res.json({"result":1});
        }
    })

}
//提交用户输入的信息
exports.dopost=function(req,res,next){
    //formidable的固定写法
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        console.log()
        var phoneNumber = fields.phoneNumber;
        var password = fields.password;
        //在提交的时候再次验证一下，避免有人提前提交了
        user.findUserByName(phoneNumber,function(err,doc){
            if(doc){
                res.json({"result":-1});
                return;
            }
        })
        //开始往数据库插入
        user.adduser(phoneNumber,password,function(err,doc){
              if(doc){
                  //到这一步就是注册成功了
                  req.session.login=1;
                  req.session.name=phoneNumber;
                  res.json({"result":1});
              }
            else if(err){
                  res.json({"result":-2});
                  return;
              }
        })
        })
    }
exports.docheck=function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var phoneNumber = fields.phoneNumber;
        var password = fields.password;
        //验证用户名是否存在
        user.findUserByName(phoneNumber,function(err,doc){
           //这里用！因为是验证存在而不是不存在；
            if(!doc){
                res.json({"result":-1});
                return;
            }
            if(crypto.createHmac("sha256",password).digest("hex")==doc.password){
                req.session.login=1;
                req.session.name=phoneNumber;
                res.json({"result":1});
            }
            else{
                res.json({"result":-1});
            }
        })

})
}
//用户登陆成功后的界面
exports.useradmin=function(req,res,next){
    if(!req.session.login){
        return;
    }
    var login = req.session.login==1?true:false
    var name = login ? req.session.name : "";
    var titlePics= null;
   user.getK(name,"titlePic",function(err,titlePic){
       if(titlePic){
           titlePics = titlePic;
       }
       res.render("login",{
           "login":login,
           "name":name,
           "titlePic":titlePics
       });
       console.log(name,titlePics)
   })


}
exports.upload=function(req,res,next){

    var name = req.session.name;
    //继续使用formidable
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //改名，并且存入数据库
        var newname = df('yyyyMMddhhmmssSSS', new Date());
        fs.rename(files.titlePic.path , "./public/images/" + newname + ".jpg",function(err){
            if(err){
                res.end("error");
                return;
            }

            user.addShuxing(name, "titlePic" ,newname, function(err,result){
                req.session.touxiang = newname;
                //重定向回去
                res.redirect("/login");
            });
        });
    });
}
exports.cut=function(req,res,next){
    var queryobj = url.parse(req.url,true).query;
     var titlePic = req.session.touxiang;
    console.log(queryobj)
    gm('./public/images/'+titlePic+'.jpg').crop(queryobj.w,queryobj.h,queryobj.x,queryobj.y).write('./public/images/'+titlePic+'.jpg', function (err) {
        if (err){
            console.log('err');
            return;
        }
        console.log("ok");
    });

}
exports.exit=function(req,res,next){
      req.session.name="";
      req.session.login=false;
    res.render("index",{
        "login":false
    });
}