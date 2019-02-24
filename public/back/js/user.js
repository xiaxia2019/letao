$(function(){

    var currentPage = 1;  // 当前页
    var pageSize = 5;     // 每页条数
    var currentId;  // 当前id
    var isDelete;   // 标记修改用户成何状态
    
    // 1. 进入页面, 发送ajax, 获取数据, 动态渲染
    // template(模板id, 数据对象), 返回一个htmlstr
    render();

    function render() {
        $.ajax({
            url: "/user/queryUser",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,  // 请求页码
                pageSize: pageSize  // 每页条数
            },
            success: function(res){
                // console.log(res);

                var htmlStr = template("tpl", res);
                $("tbody").html(htmlStr);
    
                // 根据请求返回的数据, 完成分页初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total / res.size),
                    // 页面点击
                    onPageClicked: function(a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                });
            }
        });
    }

    // 分页初始化测试
    // $("#paginator").bootstrapPaginator({
    //     // 配置版本号 (默认是2, 如果是bootstrap3版本, 这个参数必填)
    //     bootstrapMajorVersion: 3,
    //     // 当前页
    //     currentPage: 1,
    //     // 总页数
    //     totalPages: 3,
    //     //设置控件的大小: mini / small / normal / large
    //     size: "small", 
    //     //为按钮绑定点击事件 (page: 当前点击的按钮值)
    //     onPageClicked: function(event, originalEvent, type, page){
    //         // 前面三个参数基本不用
    //     }
    // });



    // 2. 禁用按钮模态框
    // 需要注册委托事件
    // 委托事件作用: 给动态元素绑定事件; 批量绑定事件(效率高)
    $("tbody").on("click", ".btn", function(){
        $("#userModal").modal("show");
        // 获取当前id
        currentId = $(this).parent().data("id");
        console.log(currentId);
        // 获取启用/禁用状态
        // btn-danger类 -> 禁用按钮
        // 禁用按钮 ? 改成禁用状态 0 : 改成启用状态 1
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
        console.log(isDelete);
    });


    // 3. 给模态框的确认按钮添加点击事件
    $("#confirmBtn").on("click", function(){
        $.ajax({
            url: "/user/updateUser",
            type: "post",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function(res){
                if (res.success) {
                    // 关闭模态框
                    $("#userModal").modal("hide");
                    // 重新渲染
                    render();
                }
            }
        });
    });

});