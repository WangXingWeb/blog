//用户信息及写作时间组件
Vue.component('wx-recommend-list', {
    data: function () {
        return {
            openBlogs:[],
            openBlogNum:0,
            allLoaded:false
        }
    },
    created:function () {
        this.getOpenList();
    },
    props:[],
    template:
    '<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">'+
    '<ul class="blogList">'+
    '<wx-recommend-blog v-for="recommend in openBlogs" :recommend="recommend"></wx-recommend-blog>'+
    '</ul>'+
    '<div class="wx-allLoaded" v-if="allLoaded">-- 我是有底线的 --</div>'+
    '</mt-loadmore>',

    methods:{
        getOpenList:function () {
            var _this=this;
            _this.$indicator.open();
            mainBmob.fenye('Blog',{'open':true},_this.openBlogs.length,5,'applaudNum').then(function (data) {
                if(data.code==200){
                    _this.openBlogs = _this.openBlogs.concat(data.list);
                    if(data.isAllLoad){
                        _this.allLoaded = true;// 若数据已全部获取完毕
                    }
                    _this.$indicator.close();
                }else{
                    console.log(data.error.code+data.error.message);
                }
            });
            _this.$indicator.close();
        },
        loadBottom:function() {
            this.getOpenList();
            this.$refs.loadmore.onBottomLoaded();
        }
    }
});

