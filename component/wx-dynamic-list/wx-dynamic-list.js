//用户信息及写作时间组件
Vue.component('wx-dynamic-list', {
    data: function () {
        return {
            dynamicBlogs:[],
            attentions:[],
            dynamicBlogsNum:0,
            allLoaded:false
        }
    },
    created:function () {
        var _this=this;
        mainBmob.equalTo('Attention',{'user':Bmob.User.current().id}).then(function (data) {
            if(data.code==200){
                var list=data.list;
                var arr=[];
                for(var i=0;i<list.length;i++){
                    arr.push(list[i].attributes.attented.id);
                }
                _this.attentions=arr;
                _this.getDynamic();
            }else{
                console.log(data.error.code+data.error.message);
                _this.$messagebox('获取数据错误', '请确认您的网络是否通畅');
            }
        });
    },
    props:[],
    template:
    '<div class="nodata" v-if="dynamicBlogs.length==0">暂无动态，快去关注好友吧 </div>'+
    '<mt-loadmore v-else :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">'+
    '<ul class="blogList">'+
    '<wx-like-blog v-for="dynamic in dynamicBlogs" :dynamic="dynamic"></wx-like-blog>'+
    '</ul>'+
    '<div class="wx-allLoaded" v-if="allLoaded">-- 我是有底线的 --</div>'+
    '</mt-loadmore>',

    methods:{
        getDynamic:function () {
            var _this=this;
            mainBmob.queryMultipleData('Dynamic','user',_this.attentions,5,_this.dynamicBlogs.length).then(function (data) {
                if(data.code==200){
                    for(var i=0;i<data.list.length;i++){
                        (function (i) {
                            var dyn=data.list[i];
                            var postBlog = dyn.get("blog");
                            postBlog.fetch({
                                success: function(data) {
                                    var dynBlog=data;
                                    if(!dynBlog.attributes.isDel){
                                        _this.dynamicBlogs.push(dyn);
                                    }
                                }
                            });
                        })(i);
                    }
                    if(data.isAllLoad){
                        _this.allLoaded = true;// 若数据已全部获取完毕
                    }
                    _this.$indicator.close();
                }else{
                    console.log(data.error.code+data.error.message);
                }
            });
        },
        loadBottom:function() {
            this.getDynamic();
            this.$refs.loadmore.onBottomLoaded();
        }
    }
});

