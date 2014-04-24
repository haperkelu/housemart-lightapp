
module.exports = function(fw){
    fw.publish('houseInfo','pubhouseInfo',function(args,callback){
        var collection = this;
   
        collection.extfind('pubhouseInfo',args,callback);
    });
}
