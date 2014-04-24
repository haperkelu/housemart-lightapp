/**
 * Created by user on 14-4-24.
 */
module.exports = function(fw){
    fw.publish('region','pubAllLocationList',function(cityId, callback){
        var collection = this;
        collection.extfind('allLocationList', cityId, callback);
    });
}

