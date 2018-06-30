/**
 * @author 王星 'www.iwangxing.cn'
 * @description 基于vue和ydui封装的提示类方法
 * @dependency YDUI 依赖
 */



/**
 * @description toast提示框
 * @param {string} 提示信息
 * @param {int} 类型 0：成功 1：错误
 * @dependency YDUI 依赖
 */
function toastX(msg,code) {
    if(code==0){
        this.$dialog.toast({
            mes: msg,
            timeout: 1500,
            icon: 'success'
        });
    }else if(code==1){
        this.$dialog.toast({
            mes: msg,
            timeout: 1500,
            icon: 'error'
        });
    }
}

/**
 * @description loading提示框
 * @param {string} 提示信息
 * @dependency YDUI 依赖
 */
function loadingX(msg) {
    this.$dialog.loading.open(msg);
}
/**
 * @description 关闭loading提示框
 * @dependency YDUI 依赖
 */
function closeLoadingX() {
    this.$dialog.loading.close();
}





