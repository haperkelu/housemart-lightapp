/**
 * Created by user on 14-4-30.
 */
sumeru.router.add(
    {
        pattern: '/overseaCitySelection',
        action: 'App.overseaCitySelection'
    }
);

var cityId = 2;
var viewBizData = {};

App.overseaCitySelection = sumeru.controller.create(function(env, session){

    (function(){
        if(session.get('cityId') != null){
            cityId = parseInt(session.get('cityId'));
        }
    })();
    env.onload = function() {
        return [function() {
            viewBizData.cityId = cityId;
            session.bind('overseaCityContainer',viewBizData);
        }];
    };

    env.onrender = function(doRender){
        doRender('overseaCitySelection',['none', 'z']);
    };

    env.onready = function() {
        var dataIDAttrName = 'data-id';
        $(document).on('click', '.cityArea', function(){
            var selectedDataId = $(this).attr(dataIDAttrName);
            if(selectedDataId != cityId){
                window.location.href = '/overseaResidenceList?cityId=' + selectedDataId;
            }
        });
        $(document).on('click', '.back', function() {
            console.log('back');
            if (history.length > 1){
                history.back();
            }else{
                window.location.href = '/overseaResidenceList?cityId=2';
            }
        });
    };

});