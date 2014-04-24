module.exports = function(fw){
    fw.publish('residence','pubOverseaList',function(regionId, plateId, pageNo, pageSize, callback){
        var collection = this;
        collection.extfind('pubOverseaList', regionId, plateId, pageNo, pageSize, callback);
    });
}
