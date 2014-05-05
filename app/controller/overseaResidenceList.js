sumeru.router.add(
	{
		pattern: '/overseaResidenceList',
		action: 'App.overseaFetch'
	}
);
//sumeru.router.setDefault('App.overseaFetch');

//global variable and initialize
var host = sumeru.config.get("dataServerHost");
var appCode = 'baiduClient';
var cityId = 2;
var regionId = 619;
var plateId = 656;
var pageNo = 1;
var pageSize = 35;
var count = 0;
var viewBizData = {};

App.overseaFetch = sumeru.controller.create(function(env, session){

    (function(){
        if(session.get('cityId') != null){
            cityId = parseInt(session.get('cityId'));
            if(cityId == 3){
                regionId = 621;
                plateId = 639;
            }
        }
        if(session.get('regionId') != null){
            regionId = parseInt(session.get('regionId'));
        }
        if(session.get('plateId') != null){
            plateId = parseInt(session.get('plateId'));
        }
    })();

    var loadPublishedData = function() {
        env.subscribe("pubOverseaResidenceList", cityId, regionId, plateId, pageNo, pageSize, function(list){

            viewBizData.data = list.find()[0]['data'];
            viewBizData.count = count;

        });

        env.subscribe("pubAllLocationList", 2, function(list) {
            var resolved = list.find()[0]['data'];
            for(var index in resolved){
                if(resolved[index].regionId == 615) {
                    viewBizData.southCA = resolved;
                }
            }
        });
        env.subscribe("pubAllLocationList", 3, function(list) {
            var resolved = list.find()[0]['data'];
            for(var index in resolved){
                if(resolved[index].regionId == 621) {
                    viewBizData.northCA = resolved;
                }
            }
        });
        env.subscribe("pubAllLocationList", cityId, function(list){
            var locationSet = list.find()[0]['data'];

            viewBizData.locationSet = locationSet;
            for(var regionKey in locationSet){
                var tempLocation = locationSet[regionKey];
                if(tempLocation.regionId == regionId){
                    viewBizData.regionName = tempLocation.regionName;
                    for(plateKey in tempLocation.plateList){
                        if(tempLocation.plateList[plateKey].id == plateId){
                            viewBizData.plateName = tempLocation.plateList[plateKey].name;
                            break;
                        }
                    }
                    break;
                }
            }
            viewBizData.cityId = cityId;
            viewBizData.cityName = (cityId == 2) ? '南加州': '北加州';

            session.bind('overSeaResidenceContainer', viewBizData);
        });
    }

    env.onload = function() {
        return [loadPublishedData];
    }

	env.onrender = function(doRender){
        doRender('overseaResidenceList',['none', 'z']);
	};

    env.onready = function() {

        var selectionFunctionSet = {
            toggleCityElement: function(el, isShow) {
                if(isShow){
                    console.log('city show');
                    el.addClass('highlight');
                    el.css('display', '');
                }else{
                    console.log('city hide');
                    el.removeClass('highlight');
                    el.css('display', 'none');
                }
            },
            regionAndPlateTemplateFunction: function (parentId, currentId, tag) {
                var blockId = (tag == 'region') ? '#regionList div' : '#plateList div';
                var selected = false;

                $(blockId).each(function () {
                    var parentDataId = $(this).attr('parent-data-id');
                    var currentDataId = $(this).attr('data-id');
                    //console.log(parentDataId + ',' + currentDataId + ',' + tag);
                    if(typeof currentDataId == 'undefined') {
                        $(this).css('display', (parentDataId != parentId.toString()) ? 'none' : '');
                        return;
                    }
                    //console.log(parentDataId + "," + currentDataId + ',' +tag);
                    if ((currentId == null || currentDataId == currentId.toString())
                        && selected == false
                        && $(this).parent().attr('parent-data-id') == parentId.toString()){

                        $(this).addClass('highlight');
                        selected = true;
                        if(tag == 'region') {
                            regionId = parseInt(currentDataId);
                        } else {
                            plateId = parseInt(currentDataId);
                        }
                    } else {
                        $(this).removeClass('highlight');
                    }
                });
            },
            cityIdChanged: function(cityId, regionId, plateId) {
                $('#cityList .click').each(function() {
                    //console.log('foreach city:' + ($(this).attr('data-id') == cityId.toString()));
                    selectionFunctionSet.toggleCityElement($(this), ($(this).attr('data-id') == cityId.toString()) ? true: false);
                });

                selectionFunctionSet.regionAndPlateTemplateFunction(cityId, regionId, 'region');
                selectionFunctionSet.regionAndPlateTemplateFunction(regionId, plateId, 'plate');
            },
            toggleRegionAndOption: function(tag) {
                $('#positionPanel').css('display', (tag == 1)? '': 'none');
                $('#optionPanel').css('display', (tag == 1)? 'none': '');
            }
        };

        $(document).on('click', '#regionList .click', function(){
            regionId = $(this).attr('data-id');
            selectionFunctionSet.regionAndPlateTemplateFunction(cityId, regionId, 'region');
            selectionFunctionSet.regionAndPlateTemplateFunction(regionId, null, 'plate');
        });

        $(document).on('click', '#plateList .click', function() {
            plateId = $(this).attr('data-id');
            selectionFunctionSet.regionAndPlateTemplateFunction(regionId, plateId, 'plate');
        });

        $(document).on('click', '#confirm', function(){
            //console.log('confirm');
            window.location.href = '/overseaResidenceList?cityId=' + cityId + '&regionId=' + regionId
                + '&plateId=' + plateId;
        });

        $(document).on('click', '#cancel', function() {
            selectionFunctionSet.toggleRegionAndOption(2);
        });

        $(document).on('click', '#positionSelection', function(e) {
            selectionFunctionSet.toggleRegionAndOption(1);
        });

        $(document).on('click', '#area a', function(e) {
            e.preventDefault();
            window.location.href = '/overseaCitySelection?cityId='
                + $(this).attr('data-id') + '&timeStamp=' + new Date().getTime().toString();
        });
        /**
        setTimeout(function() {
            console.log('wait timeout......');
            selectionFunctionSet.cityIdChanged(cityId, regionId, plateId);
        }, 1000);
        **/

        setInterval(function() {
            //console.log('wait timeout......');
            if(!$('#cityList div:first-child').hasClass('highlight') && !$('#cityList div:last-child').hasClass('highlight')){
                selectionFunctionSet.cityIdChanged(cityId, regionId, plateId);
            }
        }, 100);


    }


});
