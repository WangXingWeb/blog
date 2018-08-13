//留言回复组件
Vue.component('wx-reply', {
    data: function () {
        return {
            commenter: {
                attributes:{
                    username:"",
                    headImg:''
                }
            },
            toUser:{
                attributes:{
                    username:"",
                }
            },
            popupVisible:false,
            isApplaud:false,
            applaud:{},
            commentContent:''
        }
    },
    props:['reply','blogid'],
    created:function () {
        var _this=this;
        //获取评论人的昵称和头像
        var post1 = _this.reply.get("commenter");
        post1.fetch({
            success: function(data) {
                _this.commenter=data;
            }
        });
        var post2 = _this.reply.get("toUser");
        post2.fetch({
            success: function(data) {
                _this.toUser=data;
            }
        });

        //user是否赞同过这条评论
        mainBmob.equalTo('Message',{'user':Bmob.User.current().id,'comment':_this.reply.id,'type':0}).then(function (data) {
            if(data.code==200){
                if(data.list.length>0){
                    _this.isApplaud=true;
                    _this.applaud=data.list[0];
                }
            }
        });
    },
    template:
    '<div class="reply">'+
    '<div class="headImg-box">'+
    '<div class="headImg-container">'+
    '<img class="headImg" style="" :src="commenter.attributes.headImg" alt="">'+
    '</div>'+
    '</div>'+
    '<div class="comment-info">'+
    '<div class="comment-header">'+
    '<div class="commenter-name">'+
    '<div class="replyer">{{commenter.attributes.username}}</div>'+
    '<i class="icon iconfont icon-msnui-triangle-right"></i>'+
    '<div class="replyer-to">{{toUser.attributes.username}}</div>'+
    '</div>'+
    '<i class="icon iconfont icon-gengduo"></i>'+
    '</div>'+
    '<div class="comment-content">{{reply.attributes.content}}</div>'+
    '<div class="comment-footer">'+
    '<div class="commented-time">{{ resetTime(reply.createdAt) }}</div>'+
    '<div class="comment-operation">'+
    '<div class="comment-operation-item" v-bind:class="{ active: isApplaud }" @click="addLike"><span class="like-num">{{reply.attributes.applaudNum}}</span>'+
    '<i class="icon iconfont icon-dianzan1"></i></div>'+
    '<div class="comment-operation-item" @click="showComment"><i class="icon iconfont icon-pinglun"></i></div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '<mt-popup class="comment-popup" position="bottom" v-model="popupVisible" popup-transition="popup-fade">' +
    '<div class="comment-textarea-container"><textarea v-model="commentContent" class="comment-textarea" name="" id="" cols="30" rows="3"></textarea></div>'+
    '<button class="comment-btn" @click="addComment">发表评论</button>'+
    '</mt-popup>'+
    '</div>',
    methods:{
        resetTime:function (time) {
            return dateFormat(time,'yyyy.MM.dd hh:mm');
        },
        addLike:function () {
            var _this=this;
            if(!_this.isApplaud){
                var myuser = new Bmob.User();
                myuser.id=Bmob.User.current().id;
                var thisCommenter = new Bmob.User();
                thisCommenter.id=_this.commenter.id;
                var Comment = Bmob.Object.extend('Comment');
                var thisComment = new Comment();
                thisComment.id=_this.reply.id;
                var Blog = Bmob.Object.extend('Blog');
                var thisBlog = new Blog();
                thisBlog.id=_this.blogid;
                mainBmob.addData({
                    'user':myuser,
                    'type':0,
                    'toUser':thisCommenter,
                    'comment':thisComment,
                    'blog':thisBlog
                },'Message').then(function (data) {
                    if(data.status){
                        _this.applaud.id=data.object.id;
                        return mainBmob.AddOne('Comment',_this.reply.id,'applaudNum',1);
                    }else{
                        _this.$toast('赞同失败');
                    }
                }).then(function (data) {
                    if(data==1){
                        _this.isApplaud=true;
                        _this.$toast('已赞同');
                        _this.reply.attributes.applaudNum++;
                    }
                });
            }else{
                mainBmob.delData('Message',_this.applaud.id).then(function (data) {
                    if(data==1){
                        _this.isApplaud=false;
                        _this.$toast('已取消赞同');
                        _this.reply.attributes.applaudNum--;
                        return mainBmob.AddOne('Comment',_this.reply.id,'applaudNum',-1);
                    }else{
                        _this.$toast('取消赞同失败');
                    }
                }).then(function (data) {

                });
            }
        },
        showComment:function () {
            this.popupVisible=true;
        },
        addComment:function () {
            var _this=this;
            if(_this.commentContent){
                var myuser = new Bmob.User();
                myuser.id=Bmob.User.current().id;

                var toUser = new Bmob.User();
                toUser.id=_this.commenter.id;

                var newComment={
                    'parrentComment':_this.reply.attributes.parrentComment,
                    'type':1,
                    'content':_this.commentContent,
                    'commenter':myuser,
                    'applaudNum':0,
                    'toUser':toUser
                }
                mainBmob.addData(newComment,'Comment').then(function (data) {
                    if(data.status){
                        _this.$emit('reply-back', data.object);
                        _this.$toast('回复成功');
                        _this.reply.attributes.commentNum++;
                        _this.popupVisible=false;
                        _this.commentContent='';
                        return mainBmob.AddOne('Comment',_this.reply.id,'commentNum',1);
                    }else{
                        _this.$toast('回复失败');
                    }
                }).then(function (data) {
                    if(data==1){

                    }
                });
            }else{
                _this.$toast('请输入评论内容');
            }

        },

    }
});
