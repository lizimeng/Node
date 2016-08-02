//首先判断的是注册时候的
//当用户的鼠标离开用户名的时候，我们要发送AJAX请求看看能否注册,同时首先验证是否符合条件
$(".iteme .phoneNumber").blur(function(){
    var value = $(this).val();
    if(!/^1[3|5|8]\d{9}$/.test(value)){
        $(".phoneNumber").siblings("em").attr("class","w");
        $(".phoneNumber").siblings(".explain").css("display","block").html("请输入正确的手机号码");
        $(this).parent().nextAll().children("input").attr("disabled","true")
        return;
    }
    //备份一下this
    var $this = $(this);
    //AjAX请求回来的结果处理
    $.get("/checkuserexist",{"phoneNumber":value},function(data){
        if(data.result==-1){
            $(".phoneNumber").siblings("em").attr("class","w");
            $(".phoneNumber").siblings(".explain").css("display","block").html("请输入正确的手机号码");
            $this.parent().nextAll().children("input").attr("disabled","true")
            return;
        }
        else if(data.result==1){
            $(".phoneNumber").siblings("em").attr("class","r");
            $(".phoneNumber").siblings(".explain").css("display","block").html("恭喜您，用户名可以使用");
            $this.parent().nextAll().children("input").removeAttr("disabled");
        }
        else if(data.result==-2){
            $(".phoneNumber").siblings("em").attr("class","w");
            $(".phoneNumber").siblings(".explain").css("display","block").html("对不起，用户名已经被占用");
            $this.parent().nextAll().children("input").attr("disabled","true")
            return;
        }
    })
})

$("input[type=text],input[type=password]").focus(function(){
    $(this).siblings("em").attr("class","");
    $(this).siblings(".explain").css("display","none").html("");
})
//验证密码
$(".iteme .password").blur(function(){
    var value = $(this).val();
    if(!/\w{6,16}$/.test(value)){
        $(this).siblings("em").attr("class","w");
        $(this).siblings(".explain").css("display","block").html("您的密码长度不够,请重新输入");
        $(this).parent().nextAll().children("input").attr("disabled","true");
        return;
    }
    else{
        $(this).siblings("em").attr("class","r");
        $(this).siblings(".explain").css("display","block").html("密码可以使用");
        $(this).parent().nextAll().children("input").removeAttr("disabled");
    }
})
//再次验证密码
  $(" .iteme .password1").blur(function(){
      var password = $(".password").val();
      if(password.length==$(this).val().length){
          $(this).siblings("em").attr("class","r");
          $(this).siblings(".explain").css("display","block").html("两次密码一致");
          $(this).parent().nextAll().children("input").removeAttr("disabled");
      }
      else{
          $(this).siblings("em").attr("class","w");
          $(this).siblings(".explain").css("display","block").html("两次密码长度不一致");
          $(this).parent().nextAll().children("input").attr("disabled","true");
      }
  })
//当用户点击提交按钮
$(".iteme .logine").click(function(){
    //首先验证一下用户是否把资料填写完整
    if($(" .iteme input").siblings("em").hasClass("w")||$("input").val()==""){
        _.each($(".iteme input"),function(i){
            if($(i).val()==""){
               $(i).siblings("em").attr("class","w");
                $(i).siblings(".explain").css("display","block").html("请不要留空");
                return;
            }
        })
        return;
    }
    //表单序列化，准备提交资料
    var str = $("#form").serialize();
    $.post("/dopost",str,function(data){
         if(data.result==-1){
             $(".phoneNumber").siblings("em").attr("class","w");
             $(".phoneNumber").siblings(".explain").css("display","block").html("对不起，用户名已经被占用");
         }
        else if (data.result ==-2){
             alert("服务器忙，请稍后提交")
         }
        else if(data.result ==1){
             alert("恭喜您注册成功")
             window.location="/login";
         }
    })
})
//提交完后开始检查登录页面了,检查用户输入登录密码后是否正确
$(".items .logine").click(function(){
    var form = $("#forms").serialize();
    $.post("/docheck",form,function(data){
        if(data.result==-1){
            alert("用户名不存在或者密码错误");
        }
        else if(data.result==1){
            window.location="/login";
        }
    })
})