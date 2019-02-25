$(function(){

    var currentPage = 1;  // 当前页
    var pageSize = 5;     // 每页条数

    // 1. 进入页面, 发送ajax, 获取数据, 动态渲染
    render();

    function render() {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,  // 请求页码
                pageSize: pageSize  // 每页条数
            },
            success: function(res){
                // console.log(res);
                var htmlStr = template("secondTpl", res);
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


    // 2. 点击添加分类按钮, 显示模态框 + 渲染分类菜单
    $("#addBtn").on("click", function(){
        $("#addModal").modal("show");
        // 发送ajax请求, 获取一级分类数据
        // 根据已有接口, 模拟获取全部数据的接口, page:1, pageSize:100
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function(res){
                // console.log(res);
                var htmlStr = template("dropdowTpl", res);
                $(".dropdown-menu").html(htmlStr);
            }
        });
    });


    // 3. 给下拉菜单添加可选功能
    $(".dropdown-menu").on("click", "a", function(){
        var txt = $(this).text();
        $("#dropdownTxt").text(txt);
        // 获取id, 设置给隐藏域
        var id = $(this).data("id");
        $("[name='categoryId']").val(id);
        // 只要给隐藏域赋值, 此时校验状态应更新为成功
        $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });



    // 4. 文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        // 文件上传完成时的回调函数
        done: function (e, data) {
            //e：事件对象
            //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
            // console.log(data);
            var picUrl = data.result.picAddr;
            $("#imgBox img").attr("src", picUrl);
            // 路径赋值给隐藏域
            $("[name='brandLogo']").val(picUrl);
            // 只要给隐藏域赋值, 此时校验状态应更新为成功
            $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });


    // 5. 表单校验
    $("#form").bootstrapValidator({
        // 配置 excluded排除项, 将默认项重置, 让隐藏域的校验规则显示
        excluded: [],

        // 图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 配置需要校验的字段列表
        fields: {
            // 选择一级分类
            categoryId: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            // 输入二级分类名称
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类明细"
                    }
                }
            },
            // 二级分类图片
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            }
        }
    });


    // 6. 注册表单校验成功事件, 阻止默认提交, 通过ajax提交
    $("#form").on("success.form.bv", function(e){
        // 阻止默认提交
        e.preventDefault();
        // 通过ajax提交
        $.ajax({
            url: "/category/addSecondCategory",
            type: "post",
            // 图片文件在上面已经单独上传, 这里只需上传文件地址, 所以可以用.serialize()
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
                    // button 和 img 不是表单元素, 需手动重置
                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").attr("src", "images/none.png");
                }
            }
        });
    });

});