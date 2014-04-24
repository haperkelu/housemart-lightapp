sumeru.router.add({
    pattern: '/residenceDetail',
    action: 'App.residenceDetail'
});

App.residenceDetail = sumeru.controller.create(function(env, session, param) {
    var view = 'residenceDetail';
    var residenceId = param['residenceId'];
    var monthTrend = [];
    var hasToast = false;
    var clientUId = '';
    
    var getDetails = function() {
        clientUId = Library.utils.getClientId();
        //初始化toast
        Library.utils.toastrInit();
        var args = [];
        args[0] = residenceId;
        args[1] = clientUId;

        session.residenceDetailCollection = env.subscribe('pubresidenceDetail', args, function(residenceDetailCollection) {
            var data = residenceDetailCollection.find()[0]['data'];
            hasToast = Library.utils.toast(residenceDetailCollection.find()[0]['code'], residenceDetailCollection.find()[0]['msg'], hasToast);
            monthTrend = data['monthTrend'];
            data.picURLWithSize = _.map(data.picURLWithSize, function(item, index) {
                return {
                    url: item,
                    first: index == 0,
                    index: index
                };
            });
            session.bind('residence-onsell-detail', {
                data: data,
            });
        });
    };

    env.onload = function() {
        return [getDetails];
    };

    env.onrender = function(doRender) {
        doRender("residenceDetail", ['none', 'z']);
    };

    env.onready = function() {
        session.event('residence-onsell-detail', function() {
            if (monthTrend !== null){
                Library.utils.createLineChart(monthTrend);
            }
            var $focuses = $("#residence-detail-images");
            if ($focuses.find(".item").length !== 0) {
                $focuses.carousel({
                    interval: false
                });

                touch.on($focuses[0], "drag", function(e) {
                    if (e.direction === 'left') {
                        $focuses.carousel("next");
                    } else if (e.direction === 'right') {
                        $focuses.carousel('prev');
                    }
                });
                touch.on($focuses[0], 'tap', function(e) {
                    var picStr = JSON.stringify(session.residenceDetailCollection[0]['data']['picURL']);
                    var activeUrl = $('#residence-detail-images .active img').attr('src');
                    sessionStorage.setItem('picStr', picStr);
                    sessionStorage.setItem('activeUrl', activeUrl);
                    env.redirect('/picShow',{},true);
                }); 
            }

            //$("#residence-onsell-detail .back").click(function() {
            touch.on($('#residence-onsell-detail .back'), 'tap', function(){
                $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
                setTimeout("$('#residence-onsell-detail .back img').attr('src', '../assets/img/reback_icon.png')", 500);
                if (history.length > 1){
                    history.back();
                }else{
                    env.redirect('/mapSell',{},false);
                }
            });
        });
    };
});
