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
                    },
                    // callback : 专门用于配置回调提示消息
                    callback: {
                        message: "用户名不存在"
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
                    },
                    callback: {
                        message: "密码错误"
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
                    // alert("用户名错误");
                    // 调用插件实例方法, 更新username字段状态为失败状态
                    // updataStatus(field, status, validator);
                    // 参数1 : 需要更新的字段名称
                    // 参数2 : 需要更新的状态 (成功:VALID ; 失败:INVALID)
                    // 参数3 : 配置校验规则, 用配置的规则的message来提示
                    $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if (res.error == 1001) {
                    // alert("密码错误");
                    $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
                if (res.success) {
                    // 登录成功, 跳转首页
                    location.href = "index.html";
                }
            }
        });
    });


    // 3. 表单重置
    // reset按钮, 本身可以重置内容, 但是不重置状态
    // resetForm(false) : 重置状态
    // resetForm(true)  : 重置状态和内容
    $("[type='reset']").on("click", function(){
        // 重置状态即可, 因为reset按钮本身可重置内容
        $("#form").data("bootstrapValidator").resetForm();
    });


    
});