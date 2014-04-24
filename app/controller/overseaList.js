sumeru.router.add(
	{
		pattern: '/oversea_list',
		action: 'App.overseaFetch'
	}
);
//sumeru.router.setDefault('App.overseaFetch');

//global variable
var host = sumeru.config.get("dataServerHost");
var appCode = 'app_test_code';
var cityId = 2;
var cityName = '';
var regionId = 619;
var regionName = '';
var plateId = 656;
var pageNo = 1;
var pageSize = 20;
var viewName = 'oversearList';

App.overseaFetch = sumeru.controller.create(function(env, session){

    (function(){
        if(session.get('cityId') != null){
            cityId = parseInt(session.get('cityId'));
        }
        if(session.get('regionId') != null){
            regionId = parseInt(session.get('regionId'));
        }
        if(session.get('plateId') != null){
            plateId = parseInt(session.get('plateId'));
        }
    })();

    env.onload = function() {
        return [function() {
            env.subscribe("pubOverseaList", regionId, plateId, pageNo, pageSize, function(list){
                session.bind('residenceList', {data: list.find()});
            });
            env.subscribe("allLocationList", cityId, function(list){
                session.bind('locationSet', {data: list.find()});
                list.find({regionId:regionId}, function(error, items) {
                    var targetRegion = items[0];
                    session.bind('currentRegion', {regionName: targetRegion.regionName});
                    for(key in targetRegion.plateList){
                        if(targetRegion.plateList[key].id == plateId) {
                            session.bind('currentPlate', {plateName: targetRegion.plateList[key].name});
                            break;
                        }
                    }
                });
            });

            if(cityId == 2) {
                cityName = '南加州';
            } else if(cityId == 3) {
                cityName = '北加州';
            }
            session.bind('currentCity', {cityName: cityName});
        }]
    }

	env.onrender = function(doRender){
        doRender(viewName,['push', 'left']);
	};

    env.onready = function() {
        session.event("residenceList",function(){

        });
    }


});
