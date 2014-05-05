/**
 * Created by user on 14-4-30.
 */
sumeru.router.add(
    {
        pattern: '/overseaRegionSelection',
        action: 'App.overseaRegionSelection'
    }
);

var host = sumeru.config.get("dataServerHost"); //host地址
var viewBizData = {};

App.overseaRegionSelection = sumeru.controller.create(function(env, session){

    env.onload = function() {

        env.subscribe("pubAllLocationList", 2, function(list) {
            var resolved = list.find()[0]['data'];
            for(var index in resolved){
                if(resolved[index].regionId == 615) {
                    session.bind('region_south', {southCA: resolved});
                    session.bind('plate_south', {southCA: resolved});
                }
            }
        });
        env.subscribe("pubAllLocationList", 3, function(list) {
            var resolved = list.find()[0]['data'];
            for(var index in resolved){
                if(resolved[index].regionId == 621) {
                    session.bind('region_north', {northCA: resolved});
                    session.bind('plate_north', {northCA: resolved});
                }
            }
        });
        return [function() {

        }];
    };

    env.onrender = function(doRender){
        doRender('overseaRegionSelection',['none', 'z']);
    };

    env.onready = function() {

            var selectedRegionId = '619';
            var selectedPlateId = '656';

            var cityIdChanged = function(cityId) {
                $('#cityList .click').each(function() {
                    if($(this).attr('data-id') == selectedCityId){
                        $(this).addClass('highlight');
                    } else {
                        $(this).removeClass('highlight');
                    }
                });

                regionAndPlateTemplateFunction(selectedCityId, null, 'region');
                regionAndPlateTemplateFunction(selectedRegionId, null, 'plate');
            }

            var regionAndPlateTemplateFunction = function (parentId, currentId, tag) {
                var blockId = (tag == 'region') ? '#regionList div' : '#plateList div';
                var selected = false;

                $(blockId).each(function () {
                    var parentDataId = $(this).attr('parent-data-id');
                    var currentDataId = $(this).attr('data-id');
                    console.log(parentDataId);
                    console.log(currentDataId);
                    if(typeof currentDataId == 'undefined') {
                        $(this).css('display', (parentDataId != parentId) ? 'none' : '');
                        return;
                    }

                    if ((currentId == null || currentDataId == currentId)
                        && selected == false
                        && $(this).parent().attr('parent-data-id') == parentId){
                        $(this).addClass('highlight');
                        selected = true;
                        if(tag == 'region') {
                            selectedRegionId = currentDataId;
                        } else {
                            selectedPlateId = currentDataId;
                        }
                    } else {
                        $(this).removeClass('highlight');
                    }


                });
            };

            cityIdChanged('2');

            $('#cityList').on('click', '.click', function(){
                cityIdChanged((selectedCityId = $(this).attr('data-id')));
            });

            $('#regionList').on('click', '.click', function(){
                selectedRegionId = $(this).attr('data-id');
                regionAndPlateTemplateFunction(selectedCityId, selectedRegionId, 'region');
                regionAndPlateTemplateFunction(selectedRegionId, null, 'plate');
            });

            $('#plateList').on('click', '.click', function() {
                regionAndPlateTemplateFunction(selectedRegionId, (selectedPlateId = $(this).attr('data-id')), 'plate');
            });

            $('#mainContent').on('click', '#confirm', function(){
                window.location.href = '/overseaResidenceList?cityId=' + cityId.toString() + '&regionId=' + selectedRegionId
                    + '&plateId=' + selectedPlateId;
            });



    };

});