sumeru.router.add({
	pattern: '/houseDetail',
	action: 'App.houseDetail'
});

//sumeru.router.setDefault('App.itworks');

App.houseDetail = sumeru.controller.create(function(env, session, param) {
	var view = 'houseDetail';
	var houseId = param['houseId'];
    var saleRent = param['saleRent'];
    var hasToast = false;
    var clientUId = '';
    var cityId = 0;

	var getDetails = function() {
        clientUId = Library.utils.getClientId();
        //初始化toast
        Library.utils.toastrInit();
        var args = [];
        args[0] = houseId;
        args[1] = clientUId;

		session.houseDetailCollection = env.subscribe('pubhouseDetail', args, function(houseDetailCollection) {
			var data = houseDetailCollection.find()[0]['data'];
            cityId = data.cityId;
            hasToast = Library.utils.toast(houseDetailCollection.find()[0]['code'], houseDetailCollection.find()[0]['msg'], hasToast);  
    
            var picStr = JSON.stringify(data['picURLWithSize']);
            sessionStorage.setItem('picStr', picStr);
			data.picURLWithSize = _.map(data.picURLWithSize, function(item, index) {
				return {
					url: item,
					first: index == 0,
					index: index
				};
			});
			session.bind('house-detail', {
				data: data,
                saleRent: saleRent
			});
		});
	};

	env.onload = function() {
		return [getDetails];
	};

	env.onrender = function(doRender) {
		doRender(view, ['none', 'z']);
	};

	env.onready = function() {
        window.onresize = function(){
            $('#houseDetail #content').height(document.body.clientHeight - 50);
        };
		session.event('house-detail', function() {
            $('#houseDetail #content').height(document.body.clientHeight - 50);
			var $slides = $("#house-detail-images");
			if ($slides.find(".item").length !== 0) {
				$slides.carousel({
					interval: 0
				});

				touch.on($slides[0], 'drag', function(e) {
					if (e.direction === 'left') {
						$slides.carousel('next');
					} else if (e.direction === 'right') {
						$slides.carousel('prev');
					}
				});
                touch.on($slides[0], 'tap', function(e) {
                    var activeUrl = $('#house-detail-images .active img').attr('src');
                    sessionStorage.setItem('activeUrl', activeUrl);
                    env.redirect('/picShow',{},true);
                }); 
			}

            //$(".back").click(function() {
            touch.on($('.back'), 'tap', function(){
                $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
                setTimeout("$('.back img').attr('src', '../assets/img/reback_icon.png')", 500);
                if (history.length > 1){
                    history.back();
                }else if(cityId == 2 || cityId ==3){
                    env.redirect('/overseaResidenceList',{},false);
                } else {
                    env.redirect('/mapSell',{},false);
                }
			});

			$('#house-address').click(function() {
				var lng = $(this).attr('lng');
				var lat = $(this).attr('lat');
				env.redirect('/houseAddress', {
					'lng': lng,
					'lat': lat
				},true);
			});
			$('#house-residence').click(function() {
				var residenceId = $(this).attr('data-id');
				env.redirect('/residenceDetail', {
					'residenceId': residenceId
				}, true);
			});
		});
		$('#askButton').click(function() {
            var brokerName = session.houseDetailCollection[0]['data']['brokerName'];
            var brokerId = session.houseDetailCollection[0]['data']['brokerId'];
            $(this).css('background-image','url(../assets/img/bt_selected.png)');
            setTimeout("$('#askButton').css('background-image', 'none')", 500);
			env.redirect('/chat', {
                'houseId': houseId,
                'brokerId' : brokerId,
                'brokerName': brokerName,
                'saleRent': saleRent
            },true);
            
		});
	};

});
