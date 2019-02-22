// 进度条功能

// ajax全局事件
// .ajaxComplete(fn) : 每个ajax完成时, 会调用fn回调函数 (完成不代表请求成功)
// .ajaxSuccess(fn)  : 每个ajax只要成功, 会调用fn
// .ajaxError(fn)    : 每个ajax只要失败, 会调用fn
// .ajaxSend(fn)     : 每个ajax发送前, 会调用fn

// .ajaxStart(fn) : 第一个ajax开始发送时, 调用fn
// .ajaxStop(fn)  : 全部ajax完成时, 调用fn (不管请求成功/失败)


// 在发送第一个ajax请求时, 开启进度条
$(document).ajaxStart(function(){
    // 开启进度条
    NProgress.start();
});

// 在全部ajax完成时, 关闭进度条
$(document).ajaxStop(function(){
    // 关闭进度条
    setTimeout(function(){
        NProgress.done();
    }, 1000);
});



// 入口函数: 等待dom结构加载完后执行
$(function(){
    // 1. 左侧二级菜单切换
    $(".lt_aside .category").on("click", function(){
        $(this).next().stop().slideToggle();
    });

    // 2. 左侧整体菜单隐藏/显示切换 (改左侧菜单left值)
    $(".lt_topbar .icon_menu").on("click", function(){
        $(".lt_aside").toggleClass("hidemenu");
        $(".lt_main").toggleClass("hidemenu");
        $(".lt_topbar").toggleClass("hidemenu");
    });

    // 3. 退出功能 (点击菜单退出按钮, 显示模态框)
    $(".lt_topbar .icon_out").on("click", function(){
        $("#logoutModal").modal("show");
    });
    // 点击模态框退出按钮, 确认退出
    // 发送ajax请求, 让服务器端销毁用户登录状态
    $("#logoutBtn").on("click", function(){
        $.ajax({
            url: "/employee/employeeLogout",
            type: "get",
            dataType: "json",
            success: function(res){
                if (res.success) {
                    // 退出成功
                    location.href = "login.html";
                }
            }
        });
    });
});