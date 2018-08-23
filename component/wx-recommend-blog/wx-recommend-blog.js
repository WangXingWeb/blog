//用户信息及写作时间组件
Vue.component('wx-recommend-blog', {
    data: function () {
        return {
            author:{
                attributes:{
                    username:""
                }
            }

        }
    },
    created:function () {
        var _this=this;
        var postAuthor = _this.recommend.get("author");
        postAuthor.fetch({
            success: function(data) {
                _this.author=data;
            }
        });
    },
    props:['recommend'],
    template:
    '<li class="like-blog interval" @click="readBlog(recommend.id)"> <div class="like-header"> <div class="like-headImg-container">'+
    '<img alt="" :src="author.attributes.headImg" class="like-headImg"></div><div class="like-type-name">'+
    '<div class="like-name">{{author.attributes.username}} </div> </div>'+
    '<div class="like-time">{{ resetTime(recommend.createdAt) }}</div>'+
    '</div><div class="like-content">'+
    '<div class="like-title">{{ recommend.attributes.title }}</div>'+
    '<div class="like-content-main">'+
    '<div class="like-info">{{getContent(recommend.attributes.content)}}</div>'+
    '<div class="like-content-img" v-if="getImg(recommend.attributes.content)" :style="{background: \'url(\'+ getImg(recommend.attributes.content) +\')\'}"></div>'+
    '</div> </div> <div class="like-footer">'+
    '<div class="like-num recommend-num">'+
    '<span>{{ recommend.attributes.applaudNum }}</span>'+
    '<i class="icon iconfont icon-dianzan1"></i>'+
    '</div> <div class="like-num recommend-num">'+
    '<span>{{ recommend.attributes.commentNum }}</span> <i class="icon iconfont icon-pinglun"></i>'+
    '</div><div class="like-num recommend-num">'+
    '<span>{{ recommend.attributes.collectNum }}</span> <i class="icon iconfont icon-shoucang"></i>'+
    '</div> </div> </li>',
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

