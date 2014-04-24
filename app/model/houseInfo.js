//爬取的house信息,房源列表
Model.houseInfo = function(exports){
    exports.config = {
        fields : [
            { name: 'data', type: 'array'},
            { name: 'count', type: 'number'},
            { name: 'version', type: 'string'},
            { name: 'code', type: 'number'},
            { name: 'totalCount', type: 'number'},
            { name: 'msg', type: 'string'},
            { name: 'secret', type: 'string'},
            { name: 'unReadMsgCount', type: 'number'},
            { name: 'exceptionDetail', type: 'string'},
            { name: 'extData', type: 'string'}
        ]
    }
}
