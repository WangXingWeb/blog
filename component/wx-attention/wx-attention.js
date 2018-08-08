//关注组件
Vue.component('wx-attention', {
    data: function () {
        return {
            member:{
                attributes:{
                    username:'',
                    headImg:''
                }
            },
            isAttented:true
        }
    },
    created:function () {
        var _this=this;
        var post = _this.attention.get("attented");
        console.log(post);
        post.fetch({
            success: function(data) {
                console.log(data);
                _this.member=data;
            }
        });

    },
    props:['attention'],
    template:
    '<div class="attention" >'+
    '<div class="attention-headImg-container">'+
    '<img :src="member.attributes.headImg" class="attention-headImg" alt="">'+
    '</div>'+
    '<div class="attention-name">{{member.attributes.username}}</div>'+
    '<mt-button v-if="isAttented" class="attention-btn attention-btn-attented" @click="attent(attention.id)" size="small">已关注</mt-button>'+
    '<mt-button v-else class="attention-btn" @click="attent(member.id)" size="small">+ 关注</mt-button>'+
    '</div>',
    methods:{
        //查看个人信息
        viewMember:function (id) {
            window.location.href = 'viewBlog.html?id='+id;
        },
        //取消关注，关注
        attent:function (id) {
            var _this=this;
            if(_this.isAttented){                //取消关注
                mainBmob.delData('Attention',id).then(function (data) {
                   if(data==1){
                       _this.$toast('已取消关注');
                       _this.isAttented=! _this.isAttented;
                   }else{
                       _this.$toast('获取数据错误', '请确认您的网络是否通畅');
                   }
                });
            }else{                         //关注
                var myuser = new Bmob.User();
                myuser.id=Bmob.User.current().id;
                var myattented = new Bmob.User();
                myattented.id=id;
                mainBmob.addData({
                    user:myuser,
                    attented:myattented
                },'Attention').then(function (data) {
                    if(data.status){
                        _this.$toast('已关注');
                        _this.isAttented=! _this.isAttented;
                    }else{
                        _this.$toast('关注失败');
                    }
                });
            }

        }
    }
});

