//这里是天下通webview公共js调native的js
;(function(window,undefined){
    window.App = {};
    /**
     * 常量定义
     */
    var ua = navigator.userAgent.toUpperCase(),callindex=0;
    // 当前环境是否为Android平台
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // 当前环境是否为IOS平台
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1;

    /**
     * 调用一个Native方法
     * @param {String} name 方法名称
     */
    App.call = function(name) {
        // 获取传递给Native方法的参数
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = '', item = null;

        // 遍历参数
        for(var i = 0, len = args.length; i < len; i++) {
            item = args[i];
            if(item === "undefined") {
                item = '';
            }

            // 如果参数是一个Function类型, 则将Function存储到window对象, 并将函数名传递给Native
            if(typeof (item) == 'function') {
                callback = name + 'Callback' + i;
                window[callback] = item;
                item = callback;
            }
            args[i] = item;
        }
        if(App.IS_ANDROID) {// Android平台
//            if(name=="setTitle"){
//                return;
//            }
            try {
                for(var i = 0, len = args.length; i < len; i++) {
                    // args[i] = '"' + args[i] + '"';
                    args[i] = '\'' + args[i] + '\'';
                }
                eval('window.android.' + name + '(' + args.join(',') + ')');
            } catch(e) {
                console.log(e)
            }
        } else if(App.IS_IOS) {// IOS平台
            if(args.length) {
                args = '|' + args.join('|');
            }
            // IOS通过location.href调用Native方法, _call变量存储一个随机数确保每次调用时URL不一致
            callindex++;
            location.href = '#ios:' + name + args + '|' + callindex;

            /*var iframe = document.createElement("iframe");
            iframe.src = '#ios:' + name + args + '|' + callindex;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe= null;*/
        }
    }

}(window));