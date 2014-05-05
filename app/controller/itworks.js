sumeru.router.add(

	{
		pattern: '/itworks',
		action: 'App.itworks'
	}

);


App.itworks = sumeru.controller.create(function(env, session){
    console.log('itworks');
	env.onrender = function(doRender){
		doRender("itworks", ['push','left']);
	};

});
