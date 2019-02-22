// 前端需要发送ajax给后台, 检查用户的登录状态
$.ajax({
    url: "/employee/checkRootLogin",
    type: "get",
    dataType: "json",
    success: function(res) {
        if (res.error == 400) {
            // 用户未登录, 拦截到登录页
            location.href = "login.html";
        }
    }
});

