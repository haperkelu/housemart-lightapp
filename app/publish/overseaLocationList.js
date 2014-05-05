/**
 * Created by user on 14-4-24.
 */
module.exports = function(fw){
    fw.publish('houseInfo','pubAllLocationList',function(cityId, callback){
        var collection = this;
        collection.extfind('pubAllLocationList', cityId, callback);
    });
}