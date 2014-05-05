module.exports = runnable;

function runnable() {
    var config = {};
    var host = sumeru.config.get("dataServerHost"); //host地址
    var appCode = 'baiduClient';
    
	config['pubhouseDetail'] = {
		fetchUrl : function(args){
			return host + '/server/house/detailNew.controller?appCode=' + appCode + '&houseId=' + args[0] + '&clientUId=' + args[1];
		},
    resolve: function(originData){
        var j = JSON.parse(originData);
        var resolved = j;
        
        return resolved;
    },
		buffer : false
	}
    
	config['pubresidenceSearch'] = {
    fetchUrl: function(args){
        var url =  host + '/server/house/searchKeyword.controller?appCode=' + appCode + '&cityId=1&keyword=' + args[0] + '&type=' + args[1];
        return encodeURI(url);
    },
		resolve : function(originData){
			var j =JSON.parse(originData);
			var resolved = j;
            
			return resolved;
		},
		buffer :false
	}
    
	config['pubresidenceDetail'] = {
		fetchUrl : function(args){
			return host + '/server/residence/detailNew.controller?appCode=' + appCode + '&residenceId='+ args[0] +'&clientUId=' + args[1];
		},
		resolve : function(originData){
			var j =JSON.parse(originData);
			var resolved = j;
			
			return resolved;
		},
    buffer:false
	}
    
    config['pubhouseInfo'] = {//args[5]表示方式sale，rent，sold
        fetchUrl : function(args){
            if (args[5] == 'Sold'){
                return host + '/server/residenceSold/houseListNew.controller?appCode=' + appCode + '&residenceId=' + args[0] + '&orderType=' + args[1] + '&pageIndex=' + args[2] + '&pageSize=' + args[3] + '&clientUId=' + args[4];
            }else{
                return host + '/server/residence'+ args[5] + '/houseListNew.controller?appCode=' + appCode + '&residenceId=' + args[0] + '&orderType=' + args[1] + '&pageIndex=' + args[2] + '&pageSize=' + args[3] + '&clientUId=' + args[4];
            }
        },
        resolve : function(originData){
            var j =JSON.parse(originData);
            var resolved = j;
            
            return resolved;
        },
    buffer: false
    }

    config['pubOverseaResidenceList'] = {
        
        fetchUrl: function(cityId, regionId, plateId, pageNo, pageSize) {
            return host + '/server/house/residenceSale/searchNew.controller?appCode=' + appCode +
            '&cityId=' + cityId + '&regionId=' + regionId + "&plateId=" + plateId + '&pageIndex=' + pageNo + '&pageSize=' + pageSize;
        },
        resolve: function(originData) {
            return JSON.parse(originData);
        },
        buffer: false
    }
    
    config['pubAllLocationList'] = {
        fetchUrl: function(cityId) {
            return host + '/server/locationAllList.controller?cityId=' + cityId;
        },
        resolve: function(originData) {
            return JSON.parse(originData);
        },
        buffer: false
     }
    
    return {
        type: 'external',
        config: config
    }
    
}

module.exports = runnable;

