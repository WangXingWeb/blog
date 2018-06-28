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
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
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
 * @return {array} imgs 图片地址的数组
 */
var pickupImg=function (html) {
    var imgs=[];
    html.replace(/<img\ssrc=[\'"](.+?)[\'"]\>/gi, function (match, capture) {
        imgs.push(capture);                                                                        // match 匹配的img标签
    });                                                                                            // capture img中的src
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
    var str=strs.replace(/<[^>]+>/g,"");
    var result=str.substr(0,length);
    console.log(result);
    return result;
}