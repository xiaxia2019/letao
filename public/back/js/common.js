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
    }, 1000)
});
