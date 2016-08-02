//点击注册出现的时间
//最笨的办法给每个li加类，阻止冒泡
$(".session .item li").addClass("btns");
$(".btnL").click(function(event){
    $("header .session .iteme").animate({"top":30},1000,"linear");
    $(".out").css({"display":"block"})
      $(".DL").css({"display":"none"});
})

//当点击其他页面的时候，让列表退出，都是冒泡
$(document).click(function(event){
  //检测冒泡
       if($(event.target).hasClass("btns")){
        return;
       }
     $("header .session .iteme").animate({"top":-800},0,"linear");
     $("header .session .items").animate({"top":-800},0,"linear");
     $(".DL").css({"display":"none"});
    $(".modal-backdrop").css({"display":"none"});
    $("input[type=text],input[type=password]").val("");
})
//点击登录按钮
$(".btnR").click(function(){
    $(".DL").css({
        "display":"block",
        "width":1500,
        "opacity":1
    });
     $("header .session .items").animate({"top":30},1000,"linear",function(){
         $(".out").css({"display":"none"});
     });
})
//让他们互相交换
$(".sess").click(function(){
       $(".DL").css({
        "display":"block",
        "width":1500,
        "opacity":1
    });
       $(".out").css({"display":"none"});
    $("header .session .iteme").animate({"top":-800},0,"linear");
     $("header .session .items").animate({"top":30},800,"linear");

})
$(".boot").click(function(){
      $(".out").css({
        "display":"block",
        "width":1500,
        "opacity":1
    });
       $(".DL").css({"display":"none"});
      $("header .session .iteme").animate({"top":30},800,"linear");
     $("header .session .items").animate({"top":-800},0,"linear");
})
//首屏的动画轮播
//先把一张猫腻的图片藏好
$(".unit ul").append($(".unit li").eq(0).clone());
//得到图片的个数
var lisLength = $(".unit ul li").length;
var $unit=$(".unit")//动画元素
//得到li的宽度
var lisWidth=$(".unit li").width();
//定义一个信号量
var idx=0;
setInterval(function(){
    idx++;
    if(idx>lisLength-1){
        idx=1;
      $unit.css("left",0);
    }
  $unit.animate({"left":-lisWidth*idx},"linear");
  BtnMove();
},2000)
//按钮的移动
function BtnMove(){
    //备份idx
    var IDX=idx;
    if(IDX>3){
        IDX=0;
     //让下面的按钮跟着移动
    }
  //得到btn的宽度
    var BtnWidth = $(".Btn").width();
    var offsetX =BtnWidth/(lisLength-1); 
   
  $(".Btn .slider").animate({"left":IDX*offsetX},"linear");
}
