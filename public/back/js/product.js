$(function(){

    var currentPage = 1;  // 当前页
    var pageSize = 3;     // 每页条数
    var picArr = [];      // 存储返回的图片对象

    // 1. 进入页面, 发送ajax, 获取数据, 动态渲染
    render();

    function render() {
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,  // 请求页码
                pageSize: pageSize  // 每页条数
            },
            success: function(res){
                // console.log(res);
                var htmlStr = template("productTpl", res);
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
            url: "/category/querySecondCategoryPaging",
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


    // 3. 给下拉菜单添加可选功能 (即给下面的a添加点击事件, 事件委托)
    $(".dropdown-menu").on("click", "a", function(){
        var txt = $(this).text();
        $("#dropdownTxt").text(txt);
        // 获取id, 设置给隐藏域
        var id = $(this).data("id");
        $("[name='brandId']").val(id);
        // 只要给隐藏域赋值, 此时校验状态应更新为成功
        $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    });


    // 4. 文件上传初始化 (多文件上传: 一般会实现成多次的单文件上传)
    $("#fileupload").fileupload({
        dataType: "json",
        // 文件上传完成时的回调函数
        done: function (e, data) {
            // 获取返回的图片对象
            var picObj = data.result;
            // 获取图片路径
            var picUrl = picObj.picAddr;
            // 将后台返回的图片对象添加到数组的最前面
            picArr.unshift(picObj);
            // 追加图片到imgBox最前面
            $("#imgBox").prepend('<img src=" ' + picUrl + ' " height="100">');
            if (picArr.length > 3) {
                // 删除数组最后一项
                picArr.pop();
                // 图片结构的最后一项也要移除
                $("#imgBox img:last-of-type").remove();
            }
            if (picArr.length == 3) {
                // 图片校验状态更新为成功
                $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
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
            brandId: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    // 正则校验, 非零开头的数字
                    regexp: {
                        regexp: /^[1-9]\d+$/,
                        message: "商品库存必须是非零开头的数字"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    // xx-xx格式
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "尺码格式, 必须是xx-xx格式, xx是两位数字"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传三张图片"
                    }
                }
            },
        }
    });


    // 6. 注册表单校验成功事件, 阻止默认提交, 通过ajax提交
    $("#form").on("success.form.bv", function(e){
        // 阻止默认提交
        e.preventDefault();
        // 基础表单数据
        var paramsStr = $("#form").serialize();
        // 拼接图片数据
        paramsStr += "&picArr=" + JSON.stringify(picArr);
        // 通过ajax提交
        $.ajax({
            url: "/product/addProduct",
            type: "post",
            // 图片文件在上面已经单独上传, 这里只需上传文件地址, 所以可以用.serialize()
            data: paramsStr,
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
                    $("#dropdownText").text("请选择二级分类");
                    $("#imgBox img").remove();
                    picArr = [];
                }
            }
        });
    });

});