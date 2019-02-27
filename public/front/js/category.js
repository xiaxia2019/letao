$(function(){

    // 一进入页面, 发送ajax, 获取左侧一级分类数据, 并完成渲染
    $.ajax({
        url: "/category/queryTopCategory",
        type: "get",
        dataType: "json",
        success: function(res){
            // console.log(res);
            var htmlStr = template("leftTpl", res);
            $(".lt_category_left ul").html(htmlStr);
            // 默认一进入页面, 渲染第一个一级分类对应的二级分类
            renderById(res.rows[0].id);
        }
    });


    // 左侧菜单切换 (点击a) (事件委托)
    $(".lt_category_left").on("click", "a", function(){
        // 移除所有a的current类
        $(".lt_category_left a").removeClass("current");
        // 给当前a加current类
        $(this).addClass("current");
        // 获取id, 调用renderById()方法, 完成二级分类渲染
        var id = $(this).data("id");
        renderById(id);
    });


    // 根据一级分类的id, 请求二级分类数据, 并完成渲染
    function renderById(id) {
        $.ajax({
            url: "/category/querySecondCategory",
            type: "get",
            data: {
                id: id
            },
            dataType: "json",
            success: function(res){
                var htmlStr = template("rightTpl", res);
                $(".lt_category_right ul").html(htmlStr);
            }
        });
    }

});