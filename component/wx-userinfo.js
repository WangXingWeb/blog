//用户信息及写作时间组件
Vue.component('wx-userinfo', {
    data: function () {
        return {
            author: {
                attributes:{
                    username:"",
                    headImg:''
                }
            },
            user:{

            },
            createdTime:'',
            isAttented:false
        }
    },
    created:function () {
        var currentUser = Bmob.User.current();
        this.user=currentUser;
        console.log(this.user);
    },
    props:['userid','created'],
    watch:{
        userid:function (newVal,oldVal) {
            var _this=this;
            //获取作者信息
            console.log(newVal);
            mainBmob.getSingleData('_User',newVal).then(function (data) {
                console.log(data);
                if(data.code==200){
                    _this.author=data.result;
                    return mainBmob.equalTo('Attention',{'user':_this.user.id,'attented':newVal});
                }else{
                    _this.$messagebox('获取数据错误', '请确认您的网络是否通畅');
                }
            }).then(function (data) {
                console.log(data);
                if(data.code==200){
                    if(data.list.length>0){
                        _this.isAttented=true;
                    }else{
                        _this.isAttented=false;
                    }
                    _this.$indicator.close();
                }else{
                    console.log(data.error.code+data.error.message);
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
    '<img class="headImg" style="" :src="author.attributes.headImg" alt="">'+
    '</div>'+
    '<div class="userInfo-content"><div class="author-name">作者：{{ author.attributes.username }}</div>'+
    '<div class="created-time">发表于：{{ createdTime }}</div></div>'+
    '<mt-button v-if="isAttented" @click="Attent" class="attention " size="small">已关注</mt-button>'+
    '<mt-button v-else class="attention" @click="Attent" size="small">+ 关注</mt-button></div>',
    methods:{
        Attent:function () {
            /*if(this.isAttented){
                this.isAttented=false;
            }else{
                this.isAttented=true;
            }*/
            this.isAttented=!this.isAttented;
        }
    }
});
