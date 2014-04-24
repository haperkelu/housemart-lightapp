sumeru.router.add({
pattern: '/houseAddress',
action: 'App.houseAddress'
});

App.houseAddress = sumeru.controller.create(function(env, session, param){
		var view = 'houseAddress';
		var lng = param['lng'];
		var lat = param['lat'];

        env.onrender = function(doRender){
            doRender(view, ['none','z']);
        };

        env.onready = function(){
			var mapOb, centerPosition, marker;
			centerPosition = new AMap.LngLat(lng,lat);//创建中心坐标
			mapObj = new AMap.Map("house-address-map", {center:centerPosition,level:17});
			marker = new AMap.Marker({
				icon:"http://webapi.amap.com/images/marker_sprite.png",  
				position:new AMap.LngLat(lng,lat)
			});
			marker.setMap(mapObj);

			//$("#house-address .back").click(function() {
            touch.on($('#house-address .back'), 'tap', function(){
                $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
                setTimeout("$('#house-address .back img').attr('src', '../assets/img/reback_icon.png')", 500);
                if (history.length > 1){
                    history.back();
                }else{
                    env.redirect('/mapSell',{},false);
                }
			});
        };
});
