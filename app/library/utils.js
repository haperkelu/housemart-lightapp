Library.utils = sumeru.Library.create(function(exports){

    exports.getClientId = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (localStorage.getItem('clientId')){
            return localStorage.getItem('clientId');
        }else{
            if (ua.match(/MicroMessenger/i)=='micromessenger'){
                var timestamp = Date.parse(new Date());
                localStorage.setItem('clientId', timestamp);
                return timestamp;
            }else{
                localStorage.setItem('clientId',sumeru.clientId);
                return sumeru.clientId;
            }
        }
    }

    exports.addElement = function(contentArray,content){
        var length = contentArray.length;
        var flag = false;//判断是否有相同的元素

        var contentObj = JSON.parse(content);
        var residenceId = contentObj['residenceId'];

        for(var i=0; i<length; i++){
            var tempObj = JSON.parse(contentArray[i]);
            var tempId = tempObj['residenceId'];
            if(residenceId == tempId){
                flag = true;
                break;
            }else{
                ;   
            }   
        }   
        if(flag==false){
            contentArray.push(content);
            return true;//说明加进去了
        }else{
            return false;
        } 
        return true;  
    }; 

    exports.changeElClass = function(obj){
        obj.css('display','none');
            return '';
    };

	exports.getresidenceSimple = function(residenceContents, position){
		var length = residenceContents.length;
		var lng = position['lng'];
		var lat = position['lat'];
		var simple = new Array(7);

		for(var i=0;i<length;i++){
			var residence = JSON.parse(residenceContents[i]);
			var tempLng = residence['position']['lng'];
			var tempLat = residence['position']['lat'];
			var position = new AMap.LngLat(tempLng,tempLat);
			tempLng = position['lng'];
			tempLat = position['lat'];
			
			if(lng == tempLng){
				simple[0]=residence['residenceName']; 
				simple[1]=residence['priceRange'];
				simple[2]=residence['onSaleCount'];
				simple[3]=residence['picURLWithSize'][0];
				simple[4]=residence['residenceId'];
                simple[5]=residence['rentRange'];
                simple[6]=residence['onRentCount'];
				break;
			}
		}

		return simple;
	};

    exports.toastrInit = function(){//生成toast
        toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-full-width",
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "2000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
        }
    };
    
    exports.clearBaiduIcon = function(){
        $('a[href="http://tongji.baidu.com/hm-web/welcome/ico?s=8219f44b51d2c77305d20385ea4962ba"]').css('display', 'none'); 
    };

    exports.toast = function(code, msg, hasToast){
        if (!typeof(code)=='undefined' && !typeof(msg)=='undefined'){
            if (!hasToast){
                var defaultStr = "网路连接错误";
                if (code == '100'){
                    return false;
                    //正确的，什么都不做
                }else if (code == '200'){//房源已下架
                    toastr.info('房源已下架');
                }else if (code == '201'){
                    toastr.info('房源不存在');
                }else{//其他情况
                    if (msg != ''&& msg != null && msg!='null'){
                        toastr.info(msg);
                    }else{//msg为空
                        toastr.error(defaultStr);
                    }
                }
                return true;
            }else{
                return true;
            }
        }
    };

    exports.createLineChart = function(monthTrend){//生成折线图
        var months = [];
        var prices = [];
        var length = monthTrend.length;
        for (var i= 0; i<length; i++){
            months[length-1-i] = parseInt(monthTrend[i]['month'].slice(-2)) + '月';
            prices[length-1-i] = monthTrend[i]['price1'];
        }
        Highcharts.setOptions({
            colors: ['#ff9110']
        });
        $('#line-chart').highcharts({
            chart: {
                renderTo: 'line-chart',
                defaultSeriesType: 'line',
                height: '150'
            }, 
            title: {
                text: ''
            }, 
            legend: {
                enabled: false
            },  
            credits: {
                enabled: false
            },  
            exporting: {
                enabled: false
            },  
            xAxis: {
                categories: months
            }, 
            yAxis: {
                title:{text: ''},
                min:'0',
                labels: {
                    formatter: function(){
                        return this.value + '元';
                    }
                }               
            }, 
            tooltip: {
                enabled: false
            },  
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },  
                    enableMouseTracking: false
                }   
            },  
            series: [{
                data: prices
            }]
        });
        return '';
    };
});
