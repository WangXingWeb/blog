/*
* author:wangxing
* date:2017/11/08
* */
var mainBmob={
    /*注册bomb*/
    init:function(){
        Bmob.initialize("4efc0353163bed25dfd3d9f07ee6a94d", "b501324629bdfcd57347654b581eba47");
    },
    /*添加数据*/
    addData:function(option,objName){
        var Obj = Bmob.Object.extend(objName);
        var obj = new Obj();
        for(var key in option){
            obj.set(key,option[key]);
        }

        function saveData(resolve, reject) {
            obj.save(null, {
                success: function (object) {
                    resolve({
                        status:true,
                        objectId:object.id
                    });
                },
                error: function (model, error) {
                    console.log(error);
                    resolve({
                        status:false,
                        objError:error
                    });
                }
            });
        }
        var promise = new Promise(saveData);
        return promise;
    },
    /*创建查询*/
    createQuery:function(objName){
        var Query = Bmob.Object.extend(objName);
        var objQuery = new Bmob.Query(Query);
        return objQuery;
    },
    // 查询数据
    queryData:function (objName) {
        var query=this.createQuery(objName);
        query.descending("createdAt");                   //根据创建时间倒序，最新的在最前面
        function queryAllData(resolve, reject) {
            query.find({
                success: function(results) {
                    resolve({
                        list:results,
                        code:200
                    });
                },
                error: function(error) {
                    reject({
                        code:300,
                        error:error
                    });
                }
            });
        }
        var promise = new Promise(queryAllData);
        return promise;
    },
    // 复合分页查询
    queryMultipleData:function (objName,field,list,skipNum,pageNum) {
        var query=this.createQuery(objName);
        query.containedIn(field,list);
        if(!pageNum){
            pageNum=5;
        }
        query.limit(skipNum);
        query.skip(pageNum);
        query.descending("createdAt");                   //根据创建时间倒序，最新的在最前面
        function queryAllData(resolve, reject) {
            query.find({
                success: function(results) {
                    console.log(results);
                    resolve({
                        list:results,
                        code:200
                    });
                },
                error: function(error) {
                    reject({
                        code:300,
                        error:error
                    });
                }
            });
        }
        var promise = new Promise(queryAllData);
        return promise;
    },
    /*获取一条数据*/
    getSingleData:function (objName,id) {
        var query=this.createQuery(objName);
        function getOneData(resolve, reject){
            query.get(id, {
                success: function(object) {
                   resolve({
                       result:object,
                       code:200
                   });
                },
                error: function(object, error) {
                    reject({
                        code:300,
                        error:error,
                        result:object
                    });
                }
            });
        }
        var promise = new Promise(getOneData);
        return promise;
    },
    /*查询某一个或多个属性等于value*/
    equalTo:function (objName,option) {
        var query=this.createQuery(objName);
        for(var key in option){
            query.equalTo(key, option[key]);
        }
        query.descending("createdAt");
        function queryData(resolve, reject) {
            query.find({
                success: function(results) {
                    resolve({
                        list:results,
                        code:200
                    });
                },
                error: function(error) {
                    reject({
                        code:300,
                        error:error
                    });
                }
            });
        }
        var promise = new Promise(queryData);
        return promise;
    },
    /*分页查询*/
    fenye:function (objName,option,skipNum,pageNum) {
        var query=this.createQuery(objName);
        for(var key in option){
            query.equalTo(key, option[key]);
        }
        if(!pageNum){
            pageNum=5
        }
        query.limit(pageNum);
        query.skip(skipNum);
        function queryData(resolve, reject) {
            query.find({
                success: function(results) {
                    if(results.length<pageNum){
                        var isAllLoad=true;
                    }else{
                        isAllLoad=false;
                    }
                    resolve({
                        list:results,
                        code:200,
                        isAllLoad:isAllLoad
                    });
                },
                error: function(error) {
                    reject({
                        code:300,
                        error:error
                    });
                }
            });
        }
        var promise = new Promise(queryData);
        return promise;
    },
    /*删除数据*/
    delData:function (objName,id) {
        var query=this.createQuery(objName);
        function destroryData(resolve, reject){
            query.get(id, {
                success: function(object) {
                    // The object was retrieved successfully.
                    object.destroy({
                        success: function(deleteObject) {
                            resolve(1);
                        },
                        error: function(GameScoretest, error) {
                            resolve(2);
                        }
                    });
                },
                error: function(object, error) {
                    resolve(3);
                }
            });
        }
        var promise = new Promise(destroryData);
        return promise;
    },
    /*改变值*/
    changeData:function(option,objName,id){
        var query=this.createQuery(objName);
        function change(resolve, reject){
            query.get(id, {
                success: function(object){
                    for(var key in option){
                        object.set(key,option[key]);
                    }
                    object.save(null, {
                        success: function(objectUpdate) {
                            resolve(1);
                            //alert("create object success, object score:"+objectUpdate.get("score"));
                        },
                        error: function(model, error) {
                            resolve(2);
                            //alert("create object fail");
                        }
                    });
                },
                error: function(object, error) {
                    resolve(3);
                }
            });
        }
        var promise = new Promise(change);
        return promise;
    },
    /*改变值*/
    AddOne:function(objName,id,item,num){
        var query=this.createQuery(objName);
        function change(resolve, reject){
            query.get(id, {
                success: function(object){
                    var newVal=object.get(item)+parseInt(num);
                    object.set(item,newVal);
                    object.save(null, {
                        success: function(objectUpdate) {
                            resolve(1);
                            //alert("create object success, object score:"+objectUpdate.get("score"));
                        },
                        error: function(model, error) {
                            resolve(2);
                            //alert("create object fail");
                        }
                    });
                },
                error: function(object, error) {
                    resolve(3);
                }
            });
        }
        var promise = new Promise(change);
        return promise;
    },
    /*上传文件*/
    loadFile:function(fileName,file){
        //文件名必须带后缀
        var objFile = new Bmob.File(fileName,file);
        function fun_change(resolve, reject){
            objFile.save().then(function(obj) {
                resolve({
                    status:true,
                    url:obj.url()
                });
            }, function(error) {
                resolve({
                    status:false,
                    error:error
                });
            });
        }
        var promise = new Promise(fun_change);
        return promise;
    },
    //调用云逻辑方法
    cloudFun : function (funName,option) {
        function runFun(resolve, reject) {
            Bmob.Cloud.run(funName, option, {
                success: function(result) {
                    resolve(result);
                },
                error: function(error) {
                    resolve(error);
                }
            });
        }
        var promise = new Promise(runFun);
        return promise;
    }
}

