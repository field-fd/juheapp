/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
    owner.formatDate = function(date, format) {
            date = new Date(date); //新建日期对象
            var paddNum = function(num) {
                    num += "";
                    return num.replace(/^(\d)$/, "0$1");
                }
                //指定格式字符
            var cfg = {
                yyyy: date.getFullYear() //年 : 4位
                    ,
                yy: date.getFullYear().toString().substring(2) //年 : 2位
                    ,
                M: date.getMonth() + 1 //月 : 如果1位的时候不补0
                    ,
                MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
                    ,
                d: date.getDate() //日 : 如果1位的时候不补0
                    ,
                dd: paddNum(date.getDate()) //日 : 如果1位的时候补0
                    ,
                hh: date.getHours() //时
                    ,
                mm: date.getMinutes() //分
                    ,
                ss: date.getSeconds() //秒
            }
            format || (format = "yyyy-MM-dd hh:mm:ss");
            return format.replace(/([a-z])(\1)*/ig, function(m) {
                return cfg[m]; });
        }
        /**
         * 判断是否存储了token
         */
    owner.issetToken = function(jumpURL) {
        var token = localStorage.getItem('token');
        var url = jumpURL ? jumpURL : '/login.html';
        if (!token) {
            mui.openWindow({
                url: url,
                id: 'login'
            })
            return false;
        }
        return true;
    }

    owner.hasClass = function(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    owner.addClass = function(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    }

    owner.removeClass = function(obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    owner.toggleClass = function(obj, cls) {
        if (this.hasClass(obj, cls)) {
            removeClass(obj, cls);
        } else {
            addClass(obj, cls);
        }
    }

    /**
     * 获取本地是否安装客户端
     **/
    owner.isInstalled = function(id) {
        if (id === 'qihoo' && mui.os.plus) {
            return true;
        }
        if (mui.os.android) {
            var main = plus.android.runtimeMainActivity();
            var packageManager = main.getPackageManager();
            var PackageManager = plus.android.importClass(packageManager)
            var packageName = {
                "qq": "com.tencent.mobileqq",
                "weixin": "com.tencent.mm",
                "sinaweibo": "com.sina.weibo"
            }
            try {
                return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
            } catch (e) {}
        } else {
            switch (id) {
                case "qq":
                    var TencentOAuth = plus.ios.import("TencentOAuth");
                    return TencentOAuth.iphoneQQInstalled();
                case "weixin":
                    var WXApi = plus.ios.import("WXApi");
                    return WXApi.isWXAppInstalled()
                case "sinaweibo":
                    var SinaAPI = plus.ios.import("WeiboSDK");
                    return SinaAPI.isWeiboAppInstalled()
                default:
                    break;
            }
        }
    }
}(mui, window.app = {}));
