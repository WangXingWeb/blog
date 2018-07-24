//用户信息及写作时间组件
Vue.component('comment', {
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
    props:['userid','created'],
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
        '<div class="userInfo">'+
            '<div class="headImg-container">'+
                '<img class="head-img" style="" :src="user.attributes.headImg" alt="">'+
            '</div>'+
            '<div class="author-name">{{ user.attributes.username }}</div>'+
            '<div class="created-time">{{ createdTime }}</div>'+
        '</div>',
    methods:{

    }
});
