module.exports = function(fw){
    fw.publish('houseInfo','pubresidenceSearch',function(args,callback){
        var collection = this;

        collection.extfind('pubresidenceSearch',args,callback);
    });
}
