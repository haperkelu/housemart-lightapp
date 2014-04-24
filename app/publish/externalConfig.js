function runnable() {
    var config = {};
    var host = sumeru.config.get("dataServerHost"); //host地址
    var appCode = 'app_test_code';
    var chatClientUId = '';
    var chatHouseId = '';
    var chatBrokerId = '';
    var clientUId; 
    

    config['pubunreadMessage'] = {
        fetchUrl: function(clientUId) {
            return host + '/server/house/chatSummary.controller?appCode=' + appCode + '&clientUId=' + clientUId + '&totalOnly=0&groupBy=0&showAll=1';
        },
        resolve: function(originData) {
            var j = JSON.parse(originData);
            var resolved = j['data'];//需要其他信息，不只是data

            return resolved;
        },
        buffer: false
    };

    config['pubunreadCounts'] = {
        fetchUrl: function(clientUId) {
            clientUId = clientUId;
            return host + '/server/house/chatSummary.controller?appCode=' + appCode + '&clientUId=' + clientUId + '&totalOnly=1';
        },
        resolve: function(originData) {
            var j = JSON.parse(originData);
            var resolved = j['data'];

            return resolved;
        },
        fetchInterval: 60 * 1000,
        buffer: false
    };

    config['pubOverseaList'] = {

        fetchUrl: function(regionId, plateId, pageNo, pageSize) {
            return host + '/server/house/residenceSale/searchNew.controller?appCode=' + appCode +
            '&cityId=2' + '&regionId=' + regionId + "&plateId=" + plateId + '&pageIndex=' + pageNo + '&pageSize=' + pageSize;
        },
        resolve: function(originData) {
            var j = JSON.parse(originData);
            var resolved = j['data'];
            return resolved;
        },
        buffer: false
    }

    config['allLocationList'] = {
        fetchUrl: function(cityId) {
            return host + 'server/locationAllList.controller?cityId=' + cityId;
        },
        resolve: function(originData) {
            var j = JSON.parse(originData);
            var resolved = j['data'];
            return resolved;
        },
        buffer: false
    }


    return {
        type: 'external',
        config: config
    }



};

module.exports = runnable;
