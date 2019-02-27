$(function(){
    // 使用localStorage完成历史记录功能(本地存储)
    // 使用数组存储 (有序)
    // localStorage(key, val) 约定键名为 search_list

    /* 假数据:
    var arr = ["耐克", "阿迪", "新百伦", "匡威"];
    var jsonStr = JSON.stringify(arr);
    localStorage.setItem("search_list", jsonStr);
    */

    // 获取历史记录封装
    function getHistory(){
        // 获取本地历史
        var jsonStr = localStorage.getItem("search_list");
        // 获取得到的jsonStr, 转成数组
        // 注意: 全部清空时, arr=null, 需要用或语法添加一个默认值
        var arr = JSON.parse(jsonStr) || [];
        return arr;
    }

    // 渲染封装
    function render(){
        var arr = getHistory();
        // 模板引擎渲染
        var htmlStr = template("searchTpl", {arr: arr});
        $(".lt_history").html(htmlStr);
    }


    // 1. 渲染历史记录
    render();


    // 2. 清空历史记录 (事件委托)
    // 注意: 用localStorage.removeItem(key), 不用localStorage.clear()
    // 因为localStorage.clear()会把其他页面的本地存储全部清空
    $(".lt_history").on("click", ".btn-empty", function(){
        // 调用mui消息框组件的方法, 完成弹出层
        // mui.confirm(mes, title, btnArr, callback);
        var message = "你确认要清空历史记录吗?";
        var title = "温馨提示";
        var btnArr = ["取消", "确认"];
        mui.confirm(message, title, btnArr, function(e){
            // 用户点击的按钮在数组中的下标
            if (e.index == 1) {
                localStorage.removeItem("search_list");
                render();
            }
        });
    });


    // 3. 删除单个历史记录 (事件委托)
    $(".lt_history").on("click", ".btn-del", function(){
        // 获取本地数组
        var arr = getHistory();
        // 获取index, 根据index在数组中删除对应项
        var index = $(this).data("index");
        arr.splice(index, 1);
        // 修改后的数组转为jsonStr, 并存回本地
        localStorage.setItem("search_list", JSON.stringify(arr));
        render();
    });


    // 4. 添加单个历史记录 (搜索按钮点击事件)
    $(".search_btn").on("click", function(){
        // 搜索关键字
        var val = $(".search_input").val().trim();
        if (val.length == 0) {
            // mui提示框
            mui.toast("请输入搜索关键字");
            return;
        }
        // 清空搜索框
        $(".search_input").val("");

        // 获取数组
        var arr = getHistory();

        // 判断是否有重复项
        var index = arr.indexOf(val);
        if (index != -1) {
            // 删除重复项中旧的记录
            arr.splice(index, 1);
        }

        // 长度超过10, 删除最早搜索的, 即数组最后一项
        if (arr.length >= 10) {
            arr.pop();
        }

        // 新数据添加到最前
        arr.unshift(val);
        // 存到本地
        localStorage.setItem("search_list", JSON.stringify(arr));
        // 重新渲染
        render();
    });

});