/**
 * @author 王星 'www.iwangxing.cn'
 * @description js常用的工具类方法集合
 * @version 0.1
 */

/**************************************/

/**
 * @description 日期格式化
 * @param {data} or {string} data 需要格式化的日期或者日期字符串
 * @param {string} format 模板  @example:'yyyy-MM-dd hh:mm'
 * @return {string}
 */
var dateFormat = function(date, format){
    if(String(date).indexOf("-")>=0){
        date=String(date).replace(/-/g, "/");
    }
    if(String(date).indexOf(".")>=0){
        date=date*1000;
    }
    date = new Date(date);
    var map = {
        "M": date.getMonth() + 1,                   //月份
        "d": date.getDate(),                        //日
        "h": date.getHours(),                       //小时
        "m": date.getMinutes(),                     //分
        "s": date.getSeconds(),                     //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
};
/**
 * @description 获取文本中的图片
 * @param {string} html html字符串
 * @param {int} num  提取图片的数量
 * @return {array} imgs 图片地址的数组
 */
var pickupImg=function (html,num) {
    var imgs=[];
    var imgNum=parseInt(num);                 //防止num参数错误
    if(imgNum<1){
        imgNum=1;
    }
    var patt1=/<img\b.*?(?:\>|\/>)/gi;
    var patt2=/src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr=html.match(patt1);
    if(arr){
        for(var i=0;i<arr.length && i<imgNum;i++){
            var src=arr[i].match(patt2);
            if(src[1]){
                imgs.push(src[1]);
            }
        }
    }
    console.log(imgs+"@@@@@@@@@@@2");
    return imgs;

}

/**
 * @description 获取文本中的文字
 * @param {string} strs html字符串
 * @param {string} length 需要截取的文本长度
 * @return {string} result 截取的文字
 */
var pickupText=function (strs,length) {
    //过滤html

    var str=strs.replace(/<code[^>]*>(?:(?!<\/code>)[\s\S])*<\/code>/gi,"");
    str=str.replace(/<[^>]+>/g,"");
    var result=str.substr(0,length);
    console.log(result);
    return result;
}

/**
 * @description 分析url，提取参数
 * @return {object} result 封装好的参数对象
 */
var getParamsFromUrl=function (url) {
    //var thisURL = document.URL;
    //var url="www.iwangxing.cn/blog/viewBlog.html?id=jk01256&title=测试一下";
    var paramsStr =url.split('?')[1];
    var params =paramsStr.split('&');
    var reslut={};
    for(var i=0;i<params.length;i++){
        var paramKey =params[i].split('=')[0];
        var paramValue =params[i].split('=')[1];
        reslut[paramKey]=paramValue;
    }
    return reslut;
}

