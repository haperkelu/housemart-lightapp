sumeru.router.add({
    pattern: '/residenceSearch',
    action: 'App.residenceSearch'
});
//rSearch_keyword表示关键字
App.residenceSearch = sumeru.controller.create(function(env, session, param) {
    var view = 'residenceSearch';
    var host = sumeru.config.get("dataServerHost");
    var keyword = ''; //输入内容
    var saleRent = param['saleRent'];
    var hasToast = false;
    var clientUId = '';

    var getDetails = function() {
        clientUId = Library.utils.getClientId();
        if (sessionStorage.getItem('rSearch_keyword')){//--------------记录数据关键字
            keyword = sessionStorage.getItem('rSearch_keyword');
        }

        if (keyword != ''){
            args = [];
            args[0] = session.get('keyword');
            args[1] = session.get('type');
            env.subscribe('pubresidenceSearch', args, function(residenceSearchCollection) {
                hasToast = Library.utils.toast(residenceSearchCollection.find()[0]['code'], residenceSearchCollection.find()[0]['msg'], hasToast);
                session.bind('list', {
                    data: residenceSearchCollection.find()[0]['data'],
                    saleRent: saleRent
                });
            });
        }
    };

    env.onload = function() {
        return [getDetails];
    };

    env.onrender = function(doRender) {
        doRender("residenceSearch", ['none', 'z']);
    };

    var $root;

    env.onready = function() {
         //初始化toast
        Library.utils.toastrInit();

        if (!$root) {
            $root = $("#residenceSearch");
        }
        //---------------记录数据关键字
        if (sessionStorage.getItem('rSearch_keyword')){
            $('#searchResidenceInput').val(sessionStorage.getItem('rSearch_keyword'));
        }

        $root.on('click', '.residence-wrap', function() {
            if(saleRent == 'sale'){
                env.redirect('/houseList', {
                    'residenceId': $(this).attr('data-id'),
                    'saleRent': saleRent,
                    'residenceName': $(this).attr('data-name'),
                    'saleCount': $(this).attr('data-sale'),
                }, true);
            }else{
                env.redirect('/houseList', {
                    'residenceId': $(this).attr('data-id'),
                    'saleRent': saleRent,
                    'residenceName': $(this).attr('data-name'),
                    'rentCount': $(this).attr('data-rent')
                }, true);
            }
        });

        session.eventMap('#cancel', {
            'click': function(e) {
                env.redirect("/mapSell",false);
            }
        });
        session.eventMap('#searchResidenceInput', {
            'keydown': function(e) {
                if (e.keyCode == 13) {
                    keyword = $('#searchResidenceInput').val().trim();
                    if (keyword == ''){
                        //输入信息为空的时候什么都不做
                    }else{
                        sessionStorage.setItem('rSearch_keyword', keyword);
                        session.set('keyword', keyword);
                        session.set('type', ((saleRent=='sale')?1:2));
                        session.commit();
                        getDetails();
                        $('.loadingDiv').css('display','block');
                    }
                }
            }
        });

    };
});
