//用户信息及写作时间组件
Vue.component('wx-blog', {
    data: function () {
        return {
            img:''
        }
    },
    created:function () {
        this.img=this.getImg(this.blogdata.attributes.content);
    },
    props:['blogdata'],
    template:
    '<li class="self-blog interval" v-on:click="readBlog(blogdata.id)">'+
    '<div class="self-blog-imgContianer" v-if="img" :style="{background: \'url(\'+ img +\')\'}">'+
    '</div>'+
    '<div class="self-blog-info">'+
    '<div class="self-blog-title">{{blogdata.attributes.title}}</div>'+
    '<div class="self-blog-content">{{getContent(blogdata.attributes.content)}}</div>'+
    '<div class="self-blog-time" v-html="resetTime(blogdata.createdAt,\'yyyy.MM.dd hh:mm\')"></div>'+
    '</div>'+
    '</li>',
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

