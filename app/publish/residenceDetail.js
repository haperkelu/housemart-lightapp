module.exports = function(fw){
	fw.publish('houseInfo','pubresidenceDetail',function(args,callback){
		var collection = this;

		collection.extfind('pubresidenceDetail',args,callback);
	});
}
