$(function(){
    // 需求: 
    
    // 1. 表单校验:
    //  1.1. 用户名不能为空,长度2-6位  
    //  1.2. 密码不能为空,长度6-12位
    
    // 表单初始化
    $("#form").bootstrapValidator({
        // 图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        
        // 字段列表 (注意: 必须在input中配置name属性)
        fields: {
            // 用户名
            username: {
                // 校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    // 长度
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度为2-6位"
                    }
                }
            },
            // 密码
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度为6-12位"
                    }
                }
            }
        }
    });

    
    // 2. 使用submit按钮, 进行表单校验, 此时表单校验插件会立刻进行校验 (用input type="button"不会校验)
    //  2.1 校验成功, 此时会默认提交, 发生页面跳转, 注册表单校验成功事件, 在事件中阻止默认的跳转提交, 通过ajax提交
    //  2.2 校验失败, 不会提交

    $("#form").on("success.form.bv", function(e){
        // 阻止默认提交
        e.preventDefault();
        // ajax
        $.ajax({
            // 会自动拼接前面的域名端口: http://localhost:3000/employee/employeeLogin
            url: "/employee/employeeLogin",
            type: "post",
            data: $("#form").serialize(),
            dataType: "json",
            success: function(res){
                if (res.error == 1000) {
                    alert("用户名错误");
                }
                if (res.error == 1001) {
                    alert("密码错误");
                }
                if (res.success) {
                    // 登录成功, 跳转首页
                    location.href = "index.html";
                }
            }
        });
    });
});