//让相框的四周运动,自己调用自己，省略了定时器
function borderMove(){
    $(".pic .top").animate({"left":-300},1500,"linear",function(){
        $(this).css("left",0);
        borderMove();
    })
    $(".pic .right").animate({"top":-300},1500,"linear",function(){
        $(this).css("top",0);
        borderMove();
    })
    $(".pic .bottom").animate({"right":-300},1500,"linear",function(){
        $(this).css("right",0);
        borderMove();
    })
    $(".pic .left").animate({"bottom":-300},1500,"linear",function(){
        $(this).css("bottom",0);
        borderMove();
    })
}
//调用函数
borderMove()
//给盒子增加拖拽和缩放的功能
$(".pic .c").draggable({
    aspectRatio: 1 / 1,
    containment:'.pic',
    drag:function(event,ui){
       $(this).css("background-position",-ui.position.left+"px "+-ui.position.top+"px");
    }
}).resizable({
    aspectRatio: 1 / 1,
    containment:"parent"
})
//当点击的时候触发事件
$("#cut").click(function(){
    var template = $("#template").html();
    var compile = _.template(template);

    $.get("/cut",{
        x:parseInt($(".c").css("left")),
        y:parseInt($(".c").css("top")),
        w:parseInt($(".c").css("width")),
        h:parseInt($(".c").css("height"))
    },function(data){
        $(".user").children(".titlePic").remove();
            var str = compile(data);
          $(".user").prepend($(str));
    });
})