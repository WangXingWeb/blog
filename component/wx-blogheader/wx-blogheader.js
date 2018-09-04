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
            user:{},
            isAttented:4,
            attentedId:''
        }
    },
    watch:{
        blog:function (val) {
            var _this=this;
            _this.blog=val;
            console.log(_this.blog);
            var postAuthor = _this.blog.get("author");
            postAuthor.fetch({
                success: function(data) {
                    _this.author=data;
                    if(Bmob.User.current()){
                        if(_this.author.id==Bmob.User.current().id){
                            _this.isAttented=2;
                        }else{
                            mainBmob.equalTo('Attention',{'user':_this.user.id,'attented':_this.author.id}).then(function (data) {
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
                    }else{
                        _this.isAttented=1;
                    }
                }
            });
        }
    },
    created:function () {
        var currentUser = Bmob.User.current();
        this.user=currentUser;
    },

    props:['blog'],
    template:
    '<div class="userInfo">'+
    '<div class="headImg-container">'+
    '<img class="headImg" style="" :src="author.attributes.headImg" alt="">'+
    '</div>'+
    '<div class="userInfo-content"><div class="author-name">作者：{{ author.attributes.username }}</div>'+
    '<div class="created-time">发表于：{{ resetTime(blog.createdAt) }}</div></div>'+

    '<mt-button v-if="isAttented==0" @click="Attent(attentedId)" class="attention attention-btn-attented" size="small">已关注</mt-button>'+
    '<mt-button v-else-if="isAttented==1" class="attention" @click="Attent(author.id)" size="small">+ 关注</mt-button>' +
    '<mt-button v-else-if="isAttented==2" @click="router" class="attention attention-btn-attented" size="small">修改</mt-button>'+
    '</div>',
    methods:{
        Attent:function (id) {
            var _this=this;
            if(this.isAttented==0){
                /*取消关注*/
                mainBmob.delData('Attention',_this.attentedId).then(function (data) {
                    console.log(data);
                    if(data==1){
                        _this.isAttented=1;
                    }
                });
            }else{
                /*关注*/
                var myattented = new Bmob.User();
                myattented.id=id;
                mainBmob.addData({'user':Bmob.User.current(),'attented':myattented},'Attention').then(function (data) {
                    if(data.status){
                        _this.isAttented=0;
                        _this.attentedId=data.objectId;
                    }
                });
            }
        },
        router:function (url) {
            window.location.href ='editBlog.html?id='+this.blog.id;
        },
        resetTime:function (time) {
            return dateFormat(time,'yyyy.MM.dd hh:mm');
        }
    }
});