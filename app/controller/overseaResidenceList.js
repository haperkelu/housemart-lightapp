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
var defaultMap = {
    2:{name: '南加州',enName:'southCA',cityId:2,regionId:619,plateId:656},
    3:{name: '北加州', enName:'northCA',cityId:3,regionId:624,plateId:653}
};
var cityId = 2;
var regionId = defaultMap[cityId].regionId;
var plateId = defaultMap[cityId].plateId;;
var pageNo = 1;
var pageSize = 35;
var count = 0;
var viewHeaderData = {};
var viewBizData = {};

App.overseaFetch = sumeru.controller.create(function(env, session){

    (function(){
        if(session.get('cityId') != null){
            cityId = parseInt(session.get('cityId'));
            regionId = defaultMap[cityId].regionId;
            plateId = defaultMap[cityId].plateId;
        }
        if(session.get('regionId') != null){
            regionId = parseInt(session.get('regionId'));
        }
        if(session.get('plateId') != null){
            plateId = parseInt(session.get('plateId'));
        }
    })();

    var loadPublishedData = function() {

        var theOtherCity = (cityId == 2? defaultMap[3]: defaultMap[2]);
        var currentRegionSetOnce = false;
        var currentHeaderSetOnce = false;
        var theOtherRegionSetOnce = false;

        viewHeaderData.cityId = cityId;
        viewHeaderData.cityName = defaultMap[cityId]['name'];
        viewHeaderData.regionId = regionId;
        viewHeaderData.plateId = plateId;
        viewHeaderData.pageTitle = '美国房产';
        session.bind('titleHeader', viewHeaderData);
        session.bind('overSeaResidenceHeader', viewHeaderData);

        env.subscribe("pubAllLocationList", cityId, function(list){

            var locationSet = list.find()[0]['data'];

            for(var regionKey in locationSet){

                var tempLocation = locationSet[regionKey];
                if(!currentRegionSetOnce && tempLocation.regionId == defaultMap[cityId]['regionId']){
                    viewBizData[defaultMap[cityId]['enName']] = locationSet;
                    currentRegionSetOnce = !currentRegionSetOnce;
                }

                if(!currentHeaderSetOnce && tempLocation.regionId == regionId){
                    viewHeaderData.regionName = tempLocation.regionName;
                    for(var plateKey in tempLocation.plateList){
                        if(tempLocation.plateList[plateKey].id == plateId){
                            viewHeaderData.plateName = tempLocation.plateList[plateKey].name;
                            break;
                        }
                    }
                    currentHeaderSetOnce = !currentHeaderSetOnce;
                    break;
                }
            }
            session.bind('overSeaResidenceSubHeader', viewHeaderData);
        });

        env.subscribe("pubOverseaResidenceList", cityId, regionId, plateId, pageNo, pageSize, function(list){
            viewBizData.data = list.find()[0]['data'];
            viewBizData.count = list.find()[0].length;
        });

        env.subscribe("pubAllLocationList", theOtherCity.cityId, function(list) {

            var locationSet = list.find()[0]['data'];
            for(var regionKey in locationSet) {
                var tempLocation = locationSet[regionKey];
                if(!theOtherRegionSetOnce && tempLocation.regionId == theOtherCity['regionId']){
                    viewBizData[theOtherCity['enName']] = locationSet;
                    theOtherRegionSetOnce = !theOtherRegionSetOnce;
                    break;
                }
            }
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

        var selectedRegionEl;
        var selectedPlateEl;

        var selectionFunctionSet = {
            /**
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
            **/
            regionAndPlateTemplateFunction: function (parentId, currentId, tag) {
                var blockId = (tag == 'region') ? '#regionList div' : '#plateList div';
                var selected = false;

                $(blockId).each(function () {
                    var parentDataId = $(this).attr('parent-data-id');
                    var currentDataId = $(this).attr('data-id');
                    //console.log(parentDataId + ',' + currentDataId + ',' + tag);

                    //hide other region list
                    if(typeof currentDataId == 'undefined') {
                        $(this).css('display', (parentDataId != parentId.toString()) ? 'none' : '');
                        return;
                    }
                    //console.log(parentDataId + "," + currentDataId + ',' +tag);
                    var isValidOfSelectedNode = function(el) {
                        if(selected) return false;
                        if(el.parent().attr('parent-data-id') != parentId.toString()){
                            return false;
                        }
                        if(currentId == null || typeof  currentId == 'undefined'){
                            return true;
                        }
                        if(currentDataId == currentId.toString()){
                            return true;
                        }
                    }
                    var el = $(this);
                    if (isValidOfSelectedNode(el)){

                        el.addClass('highlight');
                        selected = true;
                        if(tag == 'region') {
                            regionId = parseInt(currentDataId);
                            selectedRegionEl = el;
                        } else {
                            plateId = parseInt(currentDataId);
                            selectedPlateEl = el;
                        }

                    } else {
                        $(this).removeClass('highlight');
                    }
                });
            }
            /**
            ,
            cityIdChanged: function(cityId, regionId, plateId) {
                $('#cityList .click').each(function() {
                    //console.log('foreach city:' + ($(this).attr('data-id') == cityId.toString()));
                    selectionFunctionSet.toggleCityElement($(this), ($(this).attr('data-id') == cityId.toString()) ? true: false);
                });

                selectionFunctionSet.regionAndPlateTemplateFunction(cityId, regionId, 'region');
                selectionFunctionSet.regionAndPlateTemplateFunction(regionId, plateId, 'plate');
            }             **/
            ,
            toggleRegionAndOption: function(tag) {
                $('#positionPanel').css('display', (tag == 1)? '': 'none');
                $('#cancelPanel').css('display', (tag == 1)? '': 'none');
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
            selectedPlateEl.removeClass('highlight');
            $(this).addClass('highlight');
            window.location.href = '/overseaResidenceList?cityId=' + cityId + '&regionId=' + regionId
                + '&plateId=' + plateId;
            //selectionFunctionSet.regionAndPlateTemplateFunction(regionId, plateId, 'plate');
        });

        $(document).on('click', '#area a', function(e) {
            e.preventDefault();
            window.location.href = '/overseaCitySelection?cityId='
                + $(this).attr('data-id') + '&timeStamp=' + new Date().getTime().toString();
        });

        $(document).on('click', '#cancelPanel', function(){
            selectionFunctionSet.toggleRegionAndOption(2);
        });

        $(document).on('click', '#positionSelection', function(e) {
            selectionFunctionSet.toggleRegionAndOption(1);
        });

        //$('#mainContentOverseaResidence loadingDiv').css('display','block');
        setInterval(function() {
            //console.log('wait timeout......');

            if(typeof cityId != 'undefined' && typeof regionId != 'undefined' && typeof plateId != 'undefined'){
                selectionFunctionSet.regionAndPlateTemplateFunction(cityId, regionId, 'region');
                selectionFunctionSet.regionAndPlateTemplateFunction(regionId, plateId, 'plate');
            }

            //console.log('height:' + document.getElementById('mainContentOverseaResidence').style.height);
            //console.log(document.getElementById('mainContentOverseaResidence').style.height == '');
            //console.log($('#mainContentOverseaResidence'));

            if(document.getElementById('mainContentOverseaResidence').style.height == ''){
                document.getElementById('mainContentOverseaResidence').style.height = (document.body.clientHeight - 70).toString() + 'px';
                //console.log(document.getElementById('mainContentOverseaResidence').style.height);
            }

            /**
            if(document.getElementById('optionPanel') != null){
                document.getElementById('loadingDiv').style.display = 'none';
            }
            **/

            $(document).on('click', '.residence-wrap', function() {
                //console.log('click residence');
                var url = '/houseList?residenceId=' + $(this).attr('data-id') + '&saleRent=sale&residenceName=' + $(this).attr('data-name')
                    + '&saleCount=' + $(this).attr('data-sale');
                window.location.href = url;
            });
        }, 100);


        /**
        setTimeout(function() {
            console.log('wait timeout......');
            selectionFunctionSet.cityIdChanged(cityId, regionId, plateId);
        }, 1000);


        setInterval(function() {
            //console.log('wait timeout......');
            if(!$('#cityList div:first-child').hasClass('highlight') && !$('#cityList div:last-child').hasClass('highlight')){
                selectionFunctionSet.cityIdChanged(cityId, regionId, plateId);
            }
        }, 100);

         $(document).on('click', '#confirm', function(){
            //console.log('confirm');
            window.location.href = '/overseaResidenceList?cityId=' + cityId + '&regionId=' + regionId
                + '&plateId=' + plateId;
        });
        **/


    }


});
