module.exports = function(fw){
    fw.publish('houseInfo','pubhouseDetail',function(args,callback){
        var collection = this;

        collection.extfind('pubhouseDetail',args,callback);
    });
}
