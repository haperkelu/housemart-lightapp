sumeru.router.add({
	pattern: '/houseList',
	action: 'App.houseList'
});

//hl_type~~~~在售房屋，成交历史~~~~sale,sold
//hl_pageSize 
//hl_orderType
App.houseList = sumeru.controller.create(function(env, session, param) {
	var view = 'houseList';
	var residenceId = param['residenceId']; //小区id
	var orderType = 1; //默认1
	var pageSize = 35;
	var pageIndex = 1;
	var clientUId = '';
    var saleRent = param['saleRent'];
    var residenceName = param['residenceName'];
    var saleCount = param['saleCount'];
    var rentCount = param['rentCount'];
    var soldHistory = false;
    var scrollOffset = 0;
    var hasToast = false;

    var subWay = function(way){
        function isEmpty(obj) {
            for (var name in obj){
                return false;
            }
            return true;
        }
        var args = new Array();
        var count = (saleRent == 'sale')?saleCount:rentCount;
		args[0] = residenceId;
		args[1] = session.get('orderType');
		args[2] = pageIndex;
		args[3] = pageSize;
		args[4] = clientUId;
        args[5] = session.get('typeNew');
        session.houseListCollection = env.subscribe('pubhouseInfo', args, function(houseListCollection) {
            hasToast = Library.utils.toast(houseListCollection.find()[0]['code'], houseListCollection.find()[0]['msg'], hasToast);
            var array = [];
            if (!soldHistory){
                if (!isEmpty(houseListCollection.find()[0]['extData'])){
                    var data = houseListCollection.find()[0]['extData']['residencePicURLWithSize'];
                    var picStr = JSON.stringify(data);
                    sessionStorage.setItem('picStr', picStr);

                    for (var i = 0; i < data.length; i++) {
                        array[i] = {
                            first: i == 0,
                            index: i,
                            url: data[i]
                        };
                    }
                }
            }

            session.bind('residence-container', {
                picURLs : array,
                houseList: houseListCollection.find()[0]['data'],
                saleRentType: saleRent,
                count : count,
                residenceName :residenceName,
                soldHistory: soldHistory,
                totalCount: houseListCollection.find()[0]['totalCount']
            });
        });
    };


	var getDetails = function() {
        clientUId = Library.utils.getClientId();

        //初始化toast
        Library.utils.toastrInit();

        //-----------------记录数据
        if (sessionStorage.getItem('hl_type') == 'sold'){
            soldHistory = true;
        }
        if (sessionStorage.getItem('hl_pageSize')){
            pageSize = sessionStorage.getItem('hl_pageSize');
        }
        if(sessionStorage.getItem('hl_orderType')){
            orderType = sessionStorage.getItem('hl_orderType');
        }
		session.set('orderType', orderType);
        session.set('typeNew', (saleRent == 'sale')?'Sale':'Rent');
        subWay(saleRent);
	};


	env.onload = function() {
		return [getDetails];
	};

	env.onrender = function(doRender) {
        doRender("houseList", ['none', 'z']);
	};

	env.onready = function() {
        if (saleRent == 'rent'){
            $('#sale_sold_bg').css('display','none');
        }

		var $root = $("#residenceOnSell");
        var addLoading = function(obj){
            obj.css('display','block');
        }

        window.onresize = function(){
            $('#residenceOnSell #onsell-content').height(document.body.clientHeight - 70);
            $('#residenceOnSell #onsell-content').scrollTop(scrollOffset);
        };

        if (sessionStorage.getItem('hl_type') == 'sale'){//--------------------记录数据
            sessionStorage.setItem('hl_type', 'sale');
            $('#sale_sold_bg').css('left','-38px');
            $('#sale_sold li.active').removeClass("active");
            $('#sale').parent().addClass("active");
            addLoading($('#residenceOnSell .loadingDiv')); 
            soldHistory = false;
            scrollOffset = 0;
            session.set('typeNew','Sale');
            subWay();
        }else if (sessionStorage.getItem('hl_type') == 'sold'){
            $('#sale_sold_bg').css('left','38px');
            $('#sale_sold li.active').removeClass("active");
            $('#sold').parent().addClass("active");
            addLoading($('#residenceOnSell .loadingDiv'));
            soldHistory = true;
            scrollOffset = 0;
            session.set('typeNew','Sold');
            subWay();
        }else{
        }
		session.event('residence-container', function() {
            
            if (sessionStorage.getItem('hl_type') == 'sale'){//--------------------记录数据
                sessionStorage.setItem('hl_type', 'sale');
                $('#sale_sold_bg').css('left','-38px');
                $('#sale_sold li.active').removeClass("active");
                $('#sale').parent().addClass("active");
            }else if (sessionStorage.getItem('hl_type') == 'sold'){
                $('#sale_sold_bg').css('left','38px');
                $('#sale_sold li.active').removeClass("active");
                $('#sold').parent().addClass("active");
            }else{
            }

            $('#residenceOnSell #sold').click(function(){
                sessionStorage.setItem('hl_type', 'sold');
                addLoading($('#residenceOnSell .loadingDiv'));
                soldHistory = true;
                scrollOffset = 0;
                session.set('typeNew','Sold');
                subWay();
                $('#sale_sold_bg').animate({left:'38px'},'fast',function(){
                    $('#sale_sold li.active').removeClass("active");
                    $('#sold').parent().addClass("active");
                });
            });
            $('#residenceOnSell #sale').click(function(){
                sessionStorage.setItem('hl_type', 'sale');
                $('#sale_sold_bg').animate({left:'-38px'},'fast',function(){
                    $('#sale_sold li.active').removeClass("active");
                    $('#sale').parent().addClass("active");
                });
                addLoading($('#residenceOnSell .loadingDiv')); 
                soldHistory = false;
                scrollOffset = 0;
                session.set('typeNew','Sale');
                subWay();
            });

			//$('.back').click(function() {
            touch.on($('.back'), 'tap', function(){
                $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
                setTimeout("$('.back img').attr('src', '../assets/img/reback_icon.png')", 500);
                if (history.length > 1){
                    history.back();
                }else{
                    env.redirect('/mapSell',{},false);
                }
			});
            $('#house-detail-icon').click(function() {
                $(this).find('img').attr('src', '../assets/img/house_detail_icon_selected.png');
                setTimeout("$('#house-detail-icon img').attr('src', '../assets/img/house_detail_icon.png')", 500);
                env.redirect('/residenceDetail', {
                    'residenceId': residenceId
                }, true);
            });

            //加载更多的滚动条处理
            $('#residenceOnSell #onsell-content').height(document.body.clientHeight - 70);
            $('#residenceOnSell #onsell-content').scrollTop(scrollOffset);


            var sort = function(){
                if(!soldHistory){
                    subWay(saleRent);
                }else{
                    subWay('sold');
                }
            }
            //图片切换
			var $focuses = $("#residence-onsell-houses");
			if ($focuses.find(".item").length !== 0) {
				$focuses.carousel({
					interval: false
				});
				touch.on($focuses[0], 'drag', function(e) {
					if (e.direction === 'left') {
						$focuses.carousel("next");
					} else {
						$focuses.carousel("prev");
					}
				});
                touch.on($focuses[0], 'tap', function(e) {
                    var activeUrl = $('#residence-onsell-houses .active img').attr('src');
                    sessionStorage.setItem('activeUrl', activeUrl);
                    env.redirect('/picShow',{}, true);
                });
			}

            if(!soldHistory){
			    $root.on('click', '.residence-wrap', function() {
				    env.redirect('/houseDetail', {
					    'houseId': $(this).attr("data-id"),
                        'saleRent': saleRent
				    }, true);
			    });
            }else{//成交历史情况下取消绑定事件
                $root.off('click');
            }
            //加载更多
            $('#residenceOnSell #load-more').click(function() {
                pageSize = pageSize + pageSize;
                sessionStorage.setItem('hl_pageSize', pageSize);
                $(this).text('加载中...');
                scrollOffset = $('#residenceOnSell #onsell-content').scrollTop();
                sort();
            });
            //排序功能
			$("#residenceOnSell .sortbar").click(function() {
                $(this).css('background-image','url(../assets/img/bt_selected.png)');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
                setTimeout("$('#residenceOnSell .sortbar').css('background-image','none');", 500);
			});

			$('#sort-cancel').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
			});

			$('#sort-total').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
				orderType = 2;
				session.set('orderType', orderType);
                sessionStorage.setItem('hl_orderType', orderType);
				//session.commit();
                sort();
			});

			$('#sort-per').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
				orderType = 3;
				session.set('orderType', orderType);
                sessionStorage.setItem('hl_orderType', orderType);
                sort();
			});

			$('#sort-area').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
				orderType = (saleRent == 'sale')?4:3;
				session.set('orderType', orderType);
                sessionStorage.setItem('hl_orderType', orderType);
				sort();
			});

			$('#sort-time').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
				orderType = '1';
				session.set('orderType', orderType);
                sessionStorage.setItem('hl_orderType', orderType);
				sort();
			});

			$('#sort-rent').click(function() {
                $(this).css('background-color', '#f47c00');
				$('#allsorts').slideToggle();
				$(".modal-backdrop").toggle();
				orderType = '2';
				session.set('orderType', orderType);
                sessionStorage.setItem('hl_orderType', orderType);
				sort();
			});
		});
	};
});
