//留言回复组件
Vue.component('wx-comment', {
    data: function () {
        return {
            commenter:{
                attributes:{
                    headImg:'',
                    username:''
                }

            },
            replys:[],
            isApplaud:false,
            applaud:{
                id:''
            },
            popupVisible:false,
            commentContent:''
        }
    },
    props:['comment','blogid'],
    created:function () {
        var _this=this;
        //获取评论人的昵称和头像
        var post = _this.comment.get("commenter");
        console.log(post);
        post.fetch({
            success: function(data) {
                console.log(data);
                _this.commenter=data;
            }
        });
        //user是否赞同过这条评论
        mainBmob.equalTo('Message',{'user':Bmob.User.current().id,'comment':_this.comment.id,'type':0}).then(function (data) {
            if(data.code==200){
                if(data.list.length>0){
                    _this.isApplaud=true;
                    _this.applaud=data.list[0];
                }
            }
        });
        //获取这条评论的回复


    },
    template:
    '<div class="comment">'+
    '<div class="headImg-box">'+
    '<div class="headImg-container">'+
    '<img class="headImg" style="" :src="commenter.attributes.headImg" alt="">'+
    '</div>'+
    '</div>'+
    '<div class="comment-info">'+
    '<div class="comment-header">'+
    '<div class="commenter-name">{{ commenter.attributes.username }}</div>'+
    '<i class="icon iconfont icon-gengduo"></i>'+
    '</div>'+
    '<div class="comment-content">{{comment.attributes.content}}</div>'+
    '<div class="comment-footer">'+
    '<div class="commented-time">{{ resetTime(comment.createdAt) }}</div>'+
    '<div class="comment-operation">'+
    '<div class="comment-operation-item" v-bind:class="{ active: isApplaud }" @click="addLike"><span class="like-num">{{comment.attributes.applaudNum}}</span>'+
    '<i class="icon iconfont icon-dianzan1"></i></div>'+
    '<div class="comment-operation-item" @click="addComment"><i class="icon iconfont icon-pinglun"></i></div>'+
    '</div>'+
    '<mt-popup class="comment-popup" position="bottom" v-model="popupVisible" popup-transition="popup-fade">' +
    '<div class="comment-textarea-container"><textarea v-model="commentContent" class="comment-textarea" name="" id="" cols="30" rows="3"></textarea></div>'+
    '<button class="comment-btn" @click="comment">发表评论</button>'+
    '</mt-popup>'+
    '</div>'+
    '<wx-reply v-for="reply in replys" :reply="reply"></wx-reply>'+
    '</div>'+
    '</div>',
    methods:{
        resetTime:function (time) {
            return dateFormat(time,'yyyy.MM.dd hh:mm');
        },
        addComment:function () {
            var _this=this;
            var Comment = Bmob.Object.extend('Comment');
            var thisComment = new Comment();
            thisComment.id=_this.comment.id;

            var myuser = new Bmob.User();
            myuser.id=Bmob.User.current().id;

            var newComment={
                'parrentComment':thisComment,
                'type':1,
                'content':_this.commentContent,
                'commenter':myuser,
                'applaudNum':0
            }
            mainBmob.addData(newComment,'Comment').then(function (data) {
                if(data.status){
                    _this.reply.push({
                        id:data.objectId,
                        attributes:newComment,
                        createdAt:new Date()
                    });
                    _this.$toast('回复成功');
                    _this.comment.attributes.applaudNum++;
                    return mainBmob.AddOne('Blog',_this.blogid,'commentNum',1);
                }else{
                    _this.$toast('赞同失败');
                }
            }).then(function (data) {
                if(data==1){

                }
            });
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
                thisComment.id=_this.comment.id;
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
                        _this.applaud.id=data.objectId;
                        return mainBmob.AddOne('Comment',_this.comment.id,'applaudNum',1);
                    }else{
                        _this.$toast('赞同失败');
                    }
                }).then(function (data) {
                    if(data==1){
                        _this.isApplaud=true;
                        _this.$toast('已赞同');
                        _this.comment.attributes.applaudNum++;
                    }
                });
            }else{
                mainBmob.delData('Message',_this.applaud.id).then(function (data) {
                    if(data==1){
                        _this.isApplaud=false;
                        _this.$toast('已取消赞同');
                        _this.comment.attributes.applaudNum--;
                        return mainBmob.AddOne('Comment',_this.comment.id,'applaudNum',-1);
                    }else{
                        _this.$toast('取消赞同失败');
                    }
                }).then(function (data) {

                });
            }
        }
    }
});
