//留言回复组件
Vue.component('wx-reply', {
    data: function () {
        return {
            user: {
                attributes:{
                    username:"",
                    headImg:''
                }
            },
            createdTime:''
        }
    },
    props:[],
    watch:{
        userid:function (newVal,oldVal) {
            var _this=this;
            mainBmob.getSingleData('_User',newVal).then(function (data) {
                console.log(data);
                if(data.code==200){
                    _this.user=data.result;
                }else{
                    _this.$messagebox('获取数据错误', '请确认您的网络是否通畅');
                }
            });
        },
        created:function (newVal,oldVal) {
            this.createdTime=dateFormat(newVal,'yyyy.MM.dd hh:mm');
        }
    },
    template:
    '<div class="reply">'+
    '<div class="headImg-box">'+
    '<div class="headImg-container">'+
    '<img class="headImg" style="" src="https://avatars1.githubusercontent.com/u/22054263?s=460&v=4" alt="">'+
    '</div>'+
    '</div>'+
    '<div class="comment-info">'+
    '<div class="comment-header">'+
    '<div class="commenter-name">'+
    '<div class="replyer">王星</div>'+
    '<i class="icon iconfont icon-msnui-triangle-right"></i>'+
    '<div class="replyer-to">闪闪</div>'+
    '</div>'+
    '<i class="icon iconfont icon-gengduo"></i>'+
    '</div>'+
    '<div class="comment-content">湖人总冠军</div>'+
    '<div class="comment-footer">'+
    '<div class="commented-time">2018.7.24 15:32</div>'+
    '<div class="comment-operation">'+
    '<span class="like-num">25 </span>'+
    '<i class="icon iconfont icon-dianzan1"></i>'+
    '<i class="icon iconfont icon-pinglun"></i>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>',
    methods:{

    }
});
