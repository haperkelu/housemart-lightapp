module.exports = function(fw){
    fw.publish('houseInfo','pubOverseaResidenceList',function(cityId, regionId, plateId, pageNo, pageSize, callback){
        var collection = this;
        collection.extfind('pubOverseaResidenceList', cityId, regionId, plateId, pageNo, pageSize, callback);
    });
}