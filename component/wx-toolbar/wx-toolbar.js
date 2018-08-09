//关注组件
Vue.component('wx-toolbar', {
    data: function () {
        return {
            isCollected:false,
            isApplaud:false,
            shareUrl:'',
            collect:{},
            applaud:{}
        }
    },
    created:function () {
    },
    props:['blog'],
    watch:{
        blog:function (newVal) {
            var _this=this;
            _this.shareUrl='www.iwangxing.cn/blog/viewBlog.html?id='+_this.blog.id;  //分享路径
            var user=Bmob.User.current();
            mainBmob.equalTo('Dynamic',{'user':user.id,'blog':_this.blog.id}).then(function (data) {
                if(data.code==200){
                    for(var i=0;i<data.list.length;i++){
                        if(data.list[i].attributes.type==0){
                            _this.isApplaud=true;
                            _this.applaud=data.list[i];
                        }else if(data.list[i].attributes.type==2){
                            _this.isCollected=true;
                            _this.collect=data.list[i];
                        }
                    }
                }
            });
        }
    },
    template:
    '<div class="toolBar-container">'+
    '<div class="toolBar">'+
    '<div v-if="isApplaud" class="toolBar-item active" @click="delApplaud">'+
    '<i class="icon iconfont icon-dianzan"></i>'+
    '<span>赞同 {{blog.attributes.applaudNum}}</span>'+
    '</div>'+
    '<div v-else class="toolBar-item" @click="addApplaud">'+
    '<i class="icon iconfont icon-dianzan1"></i>'+
    '<span>赞同 {{blog.attributes.applaudNum}}</span>'+
    '</div>'+
    '<div class="toolBar-item" @click="addComment">'+
    '<i class="icon iconfont icon-pinglun"></i>'+
    '<span>评论 {{blog.attributes.commentNum}}</span>'+
    '</div>'+
    '<div v-if="isCollected" class="toolBar-item active" @click="delCollected">'+
    '<i class="icon iconfont icon-star"></i>'+
    '<span>收藏 {{blog.attributes.collectNum}}</span>'+
    '</div>'+
    '<div v-else class="toolBar-item" @click="addCollected">'+
    '<i class="icon iconfont icon-shoucang"></i>'+
    '<span>收藏 {{blog.attributes.collectNum}}</span>'+
    '</div>'+
    '<div class="toolBar-item" id="copy" @click="copyUrl" :data-clipboard-text="shareUrl">'+
    '<i class="icon iconfont icon-fenxiang"></i>'+
    '<span>分享</span>'+
    '</div>'+
    '</div>'+
    '</div>',
    methods:{
        copyUrl:function () {
            this.$toast('已复制地址，请去第三方工具粘贴');
        },
        delApplaud:function () {
            var _this=this;
            mainBmob.delData('Dynamic',_this.applaud.id).then(function (data) {
                if(data==1){
                    _this.isApplaud=false;
                    _this.$toast('已取消赞同');
                    _this.blog.attributes.applaudNum--;
                    return mainBmob.AddOne('Blog',_this.blog.id,'applaudNum',-1);
                }else{
                    _this.$toast('取消赞同失败');
                }
            }).then(function (data) {

            });
        },
        addApplaud:function () {
            var _this=this;
            mainBmob.addData({user:Bmob.User.current().id,'type':0,'blog':_this.blog.id},'Dynamic').then(function (data) {
                if(data.status){
                    _this.isApplaud=true;
                    _this.$toast('已赞同');
                    _this.applaud.id=data.objectId;
                    _this.blog.attributes.applaudNum++;
                    return mainBmob.AddOne('Blog',_this.blog.id,'applaudNum',1);
                }else{
                    _this.$toast('赞同失败');
                }
            }).then(function (data) {
                if(data==1){

                }
            });
        },
        addComment:function () {
            
        },
        delCollected:function () {
            var _this=this;
            mainBmob.delData('Dynamic',_this.collect.id).then(function (data) {
                if(data==1){
                    _this.isCollected=false;
                    _this.$toast('已取消收藏');
                    _this.blog.attributes.collectNum--;
                    return mainBmob.AddOne('Blog',_this.blog.id,'collectNum',-1);
                }else{
                    _this.$toast('取消收藏失败');
                }
            }).then(function (data) {
                
            });
        },
        addCollected:function () {
            var _this=this;
            mainBmob.addData({user:Bmob.User.current().id,'type':2,'blog':_this.blog.id},'Dynamic').then(function (data) {
                if(data.status){
                    _this.isCollected=true;
                    _this.$toast('已收藏');
                    _this.collect.id=data.objectId;
                    _this.blog.attributes.collectNum++;
                    return mainBmob.AddOne('Blog',_this.blog.id,'collectNum',1);
                }else{
                    _this.$toast('收藏失败');
                }
            }).then(function (data) {
                
            });
        }
        
        


    }
});


