$(function(){

    var currentPage = 1;  // 当前页
    var pageSize = 5;     // 每页条数

    // 1. 进入页面, 发送ajax, 获取数据, 动态渲染
    render();

    function render() {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,  // 请求页码
                pageSize: pageSize  // 每页条数
            },
            success: function(res){
                console.log(res);
                var htmlStr = template("firstTpl", res);
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


    // 2. 点击添加分类按钮
    $("#addBtn").on("click", function(){
        $("#addModal").modal("show");
    });


    // 3. 添加校验
    $("#form").bootstrapValidator({
        // 图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 配置需要校验的字段
        fields: {
            categoryName: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });


    // 4. 注册表单校验成功事件, 阻止默认提交, 通过ajax提交
    $("#form").on("success.form.bv", function(e){
        // 阻止默认提交
        e.preventDefault();
        // 通过ajax提交
        $.ajax({
            url: "/category/addTopCategory",
            type: "post",
            data: $("#form").serialize(),
            dataType: "json",
            success: function(res){
                // 添加成功
                if (res.success) {
                    // 关闭模态框
                    $("#addModal").modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();
                    // 表单内容和状态重置
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        });
    });
});