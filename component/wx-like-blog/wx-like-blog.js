//用户信息及写作时间组件
Vue.component('wx-like-blog', {
    data: function () {
        return {
            user: {
                attributes:{
                    username:"",
                    headImg:''
                }
            },
            blog:{
                attributes:{
                    title:"",
                    content:''
                }
            },
            author:{
                attributes:{
                    username:""
                }
            }
        }
    },
    created:function () {
        var _this=this;
        var postUser = _this.dynamic.get("user");
        postUser.fetch({
            success: function(data) {
                _this.user=data;
            }
        });
        var postBlog = _this.dynamic.get("blog");
        postBlog.fetch({
            success: function(data) {
                _this.blog=data;
                var postAuthor = _this.blog.get("author");
                postAuthor.fetch({
                    success: function(data) {
                        _this.author=data;
                    }
                });
            }
        });
    },
    props:['dynamic'],
    template:
    '<li class="like-blog interval" @click="readBlog(blog.id)"><div class="like-header"><div class="like-headImg-container">'+
    '<img class="like-headImg" :src="user.attributes.headImg" alt="">'+
    '</div><div class="like-type-name">'+
    '<div class="like-name">{{user.attributes.username}} </div>'+
    '<div class="like-type" v-if="dynamic.attributes.type==0">赞了</div>' +
    '<div class="like-type" v-else-if="dynamic.attributes.type==1">发布了</div>' +
    '<div class="like-type" v-else>收藏了</div> 文章 </div>'+
    '<div class="like-time" v-html="resetTime(dynamic.createdAt)"></div> </div>'+
    '<div class="like-content">'+
    '<div class="like-title">{{ blog.attributes.title }}</div>'+
    '<div class="like-content-main">'+
    '<div class="like-info">{{getContent(blog.attributes.content)}}</div>'+
    '<div class="like-content-img" v-if="getImg(blog.attributes.content)" :style="{background: \'url(\'+ getImg(blog.attributes.content) +\')\'}"></div>'+
    '</div> </div> <div class="like-footer">'+
    '<div class="like-footer-left">'+
    '<div class="like-author-name">{{ author.attributes.username }}</div>'+
    '<div class="like-num">'+
    '<span>{{ blog.attributes.applaudNum }}</span>'+
    '<i class="icon iconfont icon-dianzan1"></i> </div>'+
    '<div class="like-num">'+
    '<span >{{ blog.attributes.commentNum }}</span> <i class="icon iconfont icon-pinglun"></i>'+
    '</div><div class="like-num">'+
    '<span >{{ blog.attributes.collectNum }}</span> <i class="icon iconfont icon-pinglun"></i>'+
    '</div></div>'+
    '</div> </li>',
    methods:{
        getContent:function (str) {
            return pickupText(str,100);
        },
        getImg:function (str) {
            var imgs=pickupImg(str,1);
            if(imgs.length==0){
                return false;
            }
            return imgs[0];
        },
        resetTime:function (time) {
            return dateFormat(time,'yyyy.MM.dd hh:mm');
        },
        readBlog:function (id) {
            window.location.href = 'viewBlog.html?id='+id;
        }
    }
});

