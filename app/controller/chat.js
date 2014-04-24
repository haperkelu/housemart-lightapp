sumeru.router.add({
    pattern: '/chat',
    action: 'App.chat',
});

App.chat = sumeru.controller.create(function(env, session, param) {
    var host = sumeru.config.get("dataServerHost"); //host地址
    var appCode = 'baiduClient';
    
    var view = 'chat';
    var houseId = param['houseId'];
    var brokerId = param['brokerId'];
    var brokerName = param['brokerName'];//经理名称
    var type = (param['saleRent']=='sale')?1:2;
    var messageCount = 0;//记录message条数，为了不重复加载
    var _markerTemplate = null;
    var hasToast = false;


    env.onrender = function(doRender) {
        doRender(view, ['none', 'z']);
    };

    env.onready = function() {
        var clientUId = Library.utils.getClientId();

        //初始化toast
        Library.utils.toastrInit();

        $('#chat .header').append(brokerName);
        
        var createMessage = function(args) { //创建对话,args[0]~useType, args[1]~time,args[2]~brokerPicURL,args[3]~content,args[4]~flag用来判断消息的下一条和自己是否一边
            if (args[0] == 1) {//nomal
                if (args[4]){
                    _messageTemplate = _.template(
                        "<div class='message normal'>" +
                        "<%- content %>" +
                        "</div>"
                    );  
                }else{
                    _messageTemplate = _.template(
                        "<div class='message-time'><%- time %></div>" +
                        "<div class='message normal'>" +
                        "<%- content %>" +
                        "</div>"
                    );  
                }
            }else{
                if (args[4]){
                    _messageTemplate = _.template(//经纪人
                        "<div class='message agent'>" +
                        "<img src='<%- brokerPicURL %>'/>" +
                        "<%- content %>" +
                        "</div>"

                    );
                }else{
                    _messageTemplate = _.template(//经纪人
                        "<div class='message-time'><%- time %></div>" +
                        "<div class='message agent'>" +
                        "<img src='<%- brokerPicURL %>'/>" +
                        "<%- content %>" +
                        "</div>"

                    );
                }
            }   

            return _messageTemplate({
                time: args[1],
                brokerPicURL: args[2],
                content: args[3]
            }); 
        };

        var getMessages = function(){
            var url = host + "/server/house/chat/list.controller?appCode="+ appCode + "&clientUId=" + clientUId + "&houseId=" + houseId +"&brokerId=" +brokerId +"&type=" + type +"&messageId=-1&page=0"; 
            var getCallback = function(data){
                var resolved = JSON.parse(data)['data'];
                var length =resolved.length;
                hasToast = Library.utils.toast(JSON.parse(data)['code'], JSON.parse(data)['msg'], hasToast);
                var args = [];
                if (length > messageCount){//有新的消息
                    for (var i=messageCount; i<length; i++){
                        if (i>0 && resolved[i].useType == resolved[i-1].useType){//和上一条比
                            args[4] = true;//表示这条和上条消息是同一边所发，没有时间显示
                        }else{
                            args[4] = false;
                        }
                        args[0] = resolved[i].useType;
                        args[1] = resolved[i].time;
                        args[2] = resolved[i].brokerPicURL;
                        args[3] = resolved[i].content;
                        var message = createMessage(args);
                        $('#chat .messages').append(message);
                    }
                    messageCount = length;
                    //修改一些状态
                    $('#send-message-button').text('发送');
                    $('#send-message-button').removeAttr('disabled');
                    $('#chat .messages').height(document.body.clientHeight - 95);
                    $('#chat .messages').scrollTop($('#chat .messages')[0].scrollHeight);
                }else{
                }
            };
            sumeru.external.get(url,getCallback);
        }
        getMessages();
        var timeID = setInterval(getMessages, 3000);
        window.onresize = function(){
            $('#chat .messages').height(document.body.clientHeight - 95);
            $('#chat .messages').scrollTop($('#chat .messages')[0].scrollHeight);
        };

        $('#send-message-button').click(function() {

            var messageContent = $('#chat-input').val().trim();
            if (messageContent == '') {
                //输入消息为空什么都不做。
            } else {
                $('#send-message-button').text('正在发送');
                $('#send-message-button').attr("disabled","disabled");
                var url = host + '/server/house/chat/send.controller?appCode=' + appCode + '&clientUId=' + clientUId + '&houseId=' + houseId + '&brokerId=' + brokerId + '&content=' + messageContent + '&type=' + type;
                var getCallback = function(data){
                    //做点什么吧
                    $('#chat-input').val('');
                    $('#chat-input').focus();
                    hasToast = Library.utils.toast(JSON.parse(data)['code'], JSON.parse(data)['msg'], hasToast);
                }
                sumeru.external.get(url,getCallback);
            }
        });

        session.eventMap('#chat-input', {
            'keydown': function(e) {
                if (e.keyCode == 13) {
                    var messageContent = $('#chat-input').val().trim();
                    if (messageContent == ''){
                        //输入信息为空的时候什么都不做
                    }else{
                        $('#send-message-button').text('正在发送');
                        $('#send-message-button').attr("disabled","disabled");
                        var url = host + '/server/house/chat/send.controller?appCode='+ appCode + '&clientUId=' + clientUId + '&houseId=' + houseId + '&brokerId=' + brokerId + '&content=' + messageContent + '&type=' + type;
                        var getCallback = function(data){
                             //做点什么吧
                           
                            $('#chat-input').val('');
                            $('#chat-input').focus();
                            hasToast = Library.utils.toast(JSON.parse(data)['code'], JSON.parse(data)['msg'], hasToast);
                        }
                        sumeru.external.get(url,getCallback);
                    }   
                }   
            },   
            'blur':function(){
                window.scrollTo(0,0);
            }
        });

        $("#chat .back").click(function() {
            $(this).find('img').attr('src', '../assets/img/reback_icon_selected.png');
            setTimeout("$('#chat .back img').attr('src', '../assets/img/reback_icon.png')", 500);
            clearInterval(timeID);
            if (history.length > 1){
                history.back();
            }else{
                env.redirect('/mapSell',{},false);
            }
        });
        
    };

});
