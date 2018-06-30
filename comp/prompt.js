/**
 * @author 王星 'www.iwangxing.cn'
 * @description 基于vue和ydui封装的提示类方法
 * @dependency YDUI 依赖
 */



/**
 * @description toast提示框
 * @dependency YDUI 依赖
 */
function toastX(msg,code) {
    if(code==0){
        this.$dialog.toast({
            mes: msg,
            timeout: 1500,
            icon: 'success'
        });
    }else{
        this.$dialog.toast({
            mes: msg,
            timeout: 1500,
            icon: 'error'
        });
    }
}







