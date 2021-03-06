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
            commentContent:'',
            actions:[],
            sheetVisible:false
        }
    },
    props:['comment','blogid'],
    created:function () {
        var _this=this;
        //获取评论人的昵称和头像
        var post = _this.comment.get("commenter");
        post.fetch({
            success: function(data) {
                _this.commenter=data;
                _this.isSelf();
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
        mainBmob.equalTo('Comment',{'parrentComment':_this.comment.id,'type':1,'isDel':false}).then(function (data) {
            if(data.code==200){
                _this.replys=data.list;
                _this.replys.reverse();
            }
        });

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
    '<i @click="actionShow" class="icon iconfont icon-gengduo"></i>'+
    '</div>'+
    '<div class="comment-content">{{comment.attributes.content}}</div>'+
    '<div class="comment-footer">'+
    '<div class="commented-time">{{ resetTime(comment.createdAt) }}</div>'+
    '<div class="comment-operation">'+
    '<div class="comment-operation-item" v-bind:class="{ active: isApplaud }" @click="addLike"><span class="like-num">{{comment.attributes.applaudNum}}</span>'+
    '<i class="icon iconfont icon-dianzan1"></i></div>'+
    '<div class="comment-operation-item" @click="showComment"><i class="icon iconfont icon-pinglun"></i></div>'+
    '</div>'+
    '<mt-popup class="comment-popup" position="bottom" v-model="popupVisible" popup-transition="popup-fade">' +
    '<div class="comment-textarea-container"><textarea v-model="commentContent" class="comment-textarea" name="" id="" cols="30" rows="3"></textarea></div>'+
    '<button class="comment-btn" @click="addComment">发表评论</button>'+
    '</mt-popup>'+
    '</div>'+
    '<wx-reply v-for="reply in replys" v-on:del-comment-back="delCommentCall" :reply="reply" :blogid="blogid" v-on:reply-back="replyBack" v-on:comment-back="commentBack"></wx-reply>'+
    '</div>'+
    '<mt-actionsheet :actions="actions" v-model="sheetVisible" cancelText="取消"></mt-actionsheet>'+
    '</div>',
    methods:{
        resetTime:function (time) {
            return dateFormat(time,'yyyy.MM.dd hh:mm');
        },
        showComment:function () {
            this.popupVisible=true;
        },
        replyBack:function (data) {
            this.replys.push(data);
        },
        commentBack:function (data) {
            this.$emit('comment-back', 1);
        },
        delCommentCall:function (data) {
            var _this=this;
            this.$emit('comment-back', -1);
            for(var i=0;i<_this.replys.length;i++){
                if(_this.replys[i].id=data){
                    _this.replys.splice(i,1);
                    break;
                }
            }
        },
        actionShow:function () {
            this.sheetVisible=true;
        },
        isSelf:function () {
            var _this=this;
            if(_this.commenter.id==Bmob.User.current().id){
                _this.actions=[
                    {
                        name:'删除',
                        method:function () {
                            _this.$messagebox.confirm('确定删除这条评论吗?').then(function (action) {
                                if(action=="confirm"){
                                    mainBmob.changeData({'isDel':true},'Comment',_this.comment.id).then(function (data) {
                                        if(data==1){
                                            return mainBmob.AddOne('Blog',_this.blogid,'commentNum',-1*(_this.replys.length+1));
                                        }else{
                                            _this.$toast('删除失败');
                                        }
                                    }).then(function (data) {
                                        if(data==1){
                                            _this.$toast('删除成功');
                                            _this.$emit('del-comment-back',{
                                                id:_this.comment.id,
                                                num:_this.replys.length+1
                                            });
                                        }else{
                                            _this.$toast('删除失败');
                                        }
                                    });
                                }
                            });
                        }
                    }
                ];
            }else{
                _this.actions=[
                    {
                        name:'举报',
                        method:function () {
                            _this.$messagebox.prompt('请输入举报原因').then(function(data){
                                if(data.action=="confirm"){
                                    if(data.value.length<8){
                                        _this.$toast('举报原因太短');
                                    }else{
                                        var Comment = Bmob.Object.extend('Comment');
                                        var thisComment = new Comment();
                                        thisComment.id=_this.comment.id;
                                        var target = new Bmob.User();
                                        target.id=_this.commenter.id;
                                        mainBmob.addData({
                                            'user':Bmob.User.current(),
                                            'type':1,
                                            'comment':thisComment,
                                            'reason':data.value,
                                            'target':target
                                        },'Inform').then(function (data) {
                                            if(data.status){
                                                _this.$toast('举报成功');
                                            }else{
                                                _this.$toast('举报失败');
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                ];
            }
        },
        addComment:function () {
            var _this=this;
            if(_this.commentContent){
                var Comment = Bmob.Object.extend('Comment');
                var thisComment = new Comment();
                thisComment.id=_this.comment.id;

                var myuser = new Bmob.User();
                myuser.id=Bmob.User.current().id;

                var toUser = new Bmob.User();
                toUser.id=_this.commenter.id;

                var newComment={
                    'parrentComment':thisComment,
                    'type':1,
                    'content':_this.commentContent,
                    'commenter':myuser,
                    'applaudNum':0,
                    'toUser':toUser,
                    'isDel':false
                }
                mainBmob.addData(newComment,'Comment').then(function (data) {
                    if(data.status){
                        _this.replys.push(data.object);
                        _this.$toast('回复成功');
                        _this.comment.attributes.commentNum++;
                        _this.popupVisible=false;
                        _this.commentContent='';
                        return mainBmob.AddOne('Blog',_this.blogid,'commentNum',1);
                    }else{
                        _this.$toast('回复失败');
                    }
                }).then(function (data) {
                    if(data==1){
                        _this.$emit('comment-back', 1);
                    }
                });
            }else{
                _this.$toast('请输入评论内容');
            }

        },
        addLike:function () {
            var _this=this;
            if(!_this.isApplaud){
                _this.isApplaud=true;
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
                        _this.applaud.id=data.object.id;
                        return mainBmob.AddOne('Comment',_this.comment.id,'applaudNum',1);
                    }else{
                        _this.isApplaud=false;
                        _this.$toast('赞同失败');
                    }
                }).then(function (data) {
                    if(data==1){
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
