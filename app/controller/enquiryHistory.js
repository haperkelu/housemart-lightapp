sumeru.router.add(
{   
    pattern: '/enquiryHistory',
    action: 'App.enquiryHistory'
}   
);

App.enquiryHistory = sumeru.controller.create(function(env, session, param){
    var view = 'enquiryHistory';
    var host = sumeru.config.get("dataServerHost"); //host地址
    var appCode = 'baiduClient';
    var _contentTemplate = null;
    var hasToast = false;
    

    env.onrender = function(doRender){
        doRender("enquiryHistory", ['none','z']);
    }; 

    env.onready = function(){
        
        var clientUId = Library.utils.getClientId();
        //初始化toast
        Library.utils.toastrInit();
        var getCount = function(){
            var url = host + '/server/house/chatSummary.controller?appCode=' + appCode + '&clientUId=' + clientUId +'&totalOnly=0&showAll=0';
            var getCallback = function(oriData){
                var resolved = JSON.parse(oriData)['data'];
                var length = resolved.length;
                hasToast = Library.utils.toast(JSON.parse(oriData)['code'], JSON.parse(oriData)['msg'], hasToast);
                $('#enquiry-history .messages .residence-wrap .count').css('display','none');
                if (length != 0){
                    for (var i=0; i<length; i++){
                        var count = resolved[i]['count'];
                        var houseId = resolved[i]['houseId'];
                        var str = "#enquiry-history div[data-id='" + houseId + "']";
                        $(str).html(count);
                        $(str).css('display','block');
                    }
                }else{
                    ;
                }
            }
            sumeru.external.get(url, getCallback);
        };

        var timeID = setInterval(getCount, 5000);

        $("#enquiry-history .back").click(function() {
            $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
            setTimeout("$('#enquiry-history .back img').attr('src', '../assets/img/reback_icon.png')", 500);
            clearInterval(timeID);
            if (history.length > 1){
                history.back();
            }else{
                env.redirect('/mapSell',{},false);
            }

        });

        var createContent = function(args) { // 创建信息模板
            _contentTemplate = _.template(
                "<div class='residence-wrap' data-type='<%- type %>' data-houseid='<%- houseId %>' data-brokerid='<%- brokerId %>' data-brokername='<%- brokerName %>'>" +
                    "<div class='residence'>" +
                        "<img src='<%- housePic %>'/>" +
                        "<div class='info'>" +
                            "<div class='price'>" +
                                "<span class='highlight'><%- price %></span>" +
                            "</div>" +
                            "<div class='time'>" +
                                "<%- lastUpdateTime %>" +
                            "</div>" +
                            "<div class='details'>" +
                                "<span class='highlight'><%- residenceName %></span>" +
                            "</div>" +
                            "<div class='details' style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap'>" +
                                "<%- content %>" +
                            "</div>" +
                        "</div>" + 
                    "</div>" +
                    "<div data-id='<%- houseId %>' class='count badge' style='display:none'>" +
                    "</div>" +
                "</div>"
            );  

            var el =  _contentTemplate({
                type: args[0],
                houseId: args[1],
                brokerId: args[2],
                brokerName: args[3],
                housePic: args[4],
                price: args[5],
                lastUpdateTime: args[6],
                residenceName: args[7],
                content: args[8]
            }); 

            var $el = $(el).click(function() {
                clearInterval(timeID);
                env.redirect('/chat', {
                     'houseId': args[1],
                     'brokerId' : args[2],
                     'brokerName': args[3],
                     'saleRent': (args[0] == 1)?'sale':'rent'
                },true);                
            });

            return $el[0]; 
        };

        function sortTime(a,b){
            var time1 = new Date(Date.parse(b['lastUpdateTime'].replace(/-/g,"/")));
            var time2 = new Date(Date.parse(a['lastUpdateTime'].replace(/-/g,"/")))
            return time1>time2;
        }

        var getAllDatas = function(){//获取所有数据
            var url = host + '/server/house/chatSummary.controller?appCode=' + appCode + '&clientUId=' + clientUId + '&totalOnly=0&showAll=1&withPic=1';
            var getCallback =  function(oriData){
                var resolved = JSON.parse(oriData)['data'];
                var length = resolved.length;
                resolved = resolved.sort(sortTime);

                hasToast = Library.utils.toast(JSON.parse(oriData)['code'], JSON.parse(oriData)['msg'], hasToast);
                if (length > 0){
                    for (var i=0; i<length; i++){
                        var args = [];
                        args[0] = resolved[i]['type'];
                        args[1] = resolved[i]['houseId'];
                        args[2] = resolved[i]['brokerId'];
                        args[3] = resolved[i]['brokerName'];
                        args[4] = resolved[i]['housePicURL'];
                        args[5] = resolved[i]['title'];
                        args[6] = resolved[i]['lastUpdateTime'];
                        args[7] = resolved[i]['residenceName'];
                        args[8] = resolved[i]['lastContent'];

                        var content = createContent(args);
                        $('#enquiry-history .messages').append(content);
                    }
                }else{
                    $('#enquiry-history .messages').append("<p class='empty'>没有问询记录</p>");
                }
                getCount();
            };
            sumeru.external.get(url,getCallback);
        }
        
        getAllDatas();//获取所有数据

    };

});
