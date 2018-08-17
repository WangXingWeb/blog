//用户信息及写作时间组件
Vue.component('wx-blogheader', {
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
            isAttented:4,
            attentedId:'',
            blogId:''
        }
    },
    created:function () {
        var currentUser = Bmob.User.current();
        this.user=currentUser;
    },

    props:['userid','created','blogid'],
    watch:{
        userid:function (val) {
            var _this=this;
            if(val==_this.user.id){
                _this.isAttented=2;
                _this.author=_this.user;
            }else{
                //获取作者信息
                mainBmob.getSingleData('_User',val).then(function (data) {
                    if(data.code==200){
                        _this.author=data.result;
                        if(_this.user){
                            return mainBmob.equalTo('Attention',{'user':_this.user.id,'attented':val});
                        }
                    }else{
                        _this.$messagebox('获取数据错误', '请确认您的网络是否通畅');
                    }
                }).then(function (data) {
                    console.log(data);
                    if(data.code==200){
                        if(data.list.length>0){
                            _this.isAttented=0;
                            _this.attentedId=data.list[0].id;
                        }else{
                            _this.isAttented=1;
                        }
                        _this.$indicator.close();
                    }else{
                        console.log(data.error.code+data.error.message);
                    }
                });
            }
        },
        created:function (val) {
            this.createdTime=dateFormat(val,'yyyy.MM.dd hh:mm');
        },
        blogid:function (val) {
            this.blogId=val;
        }
    },
    template:
    '<div class="userInfo">'+
    '<div class="headImg-container">'+
    '<img class="headImg" style="" :src="author.attributes.headImg" alt="">'+
    '</div>'+
    '<div class="userInfo-content"><div class="author-name">作者：{{ author.attributes.username }}</div>'+
    '<div class="created-time">发表于：{{ createdTime }}</div></div>'+

    '<mt-button v-if="isAttented==0" @click="Attent(author.id)" class="attention attention-btn-attented" size="small">已关注</mt-button>'+
    '<mt-button v-else-if="isAttented==1" class="attention" @click="Attent(author.id)" size="small">+ 关注</mt-button>' +
    '<mt-button v-else-if="isAttented==2" @click="router" class="attention attention-btn-attented" size="small">修改</mt-button>'+
    '</div>',
    methods:{
        Attent:function (id) {
            var _this=this;
            if(this.isAttented==0){
                console.log(_this.attentedId);
                /*取消关注*/
                mainBmob.delData('Attention',_this.attentedId).then(function (data) {
                    console.log(data);
                    if(data==1){
                        _this.isAttented=1;
                    }
                });
            }else{
                /*关注*/
                var myuser = new Bmob.User();
                myuser.id=_this.user.id;
                var myattented = new Bmob.User();
                myattented.id=id;
                mainBmob.addData({'user':myuser,'attented':myattented},'Attention').then(function (data) {
                    if(data.status){
                        _this.isAttented=0;
                        _this.attentedId=data.objectId;
                    }
                });
            }
        },
        router:function (url) {
            window.location.href ='editBlog.html?id='+this.blogId;
        }
    }
});
