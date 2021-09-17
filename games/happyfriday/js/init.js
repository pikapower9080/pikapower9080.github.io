if(!window.chrome){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-40610196-1x']);
    _gaq.push(['_trackPageview']);
    
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}else{
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-40610196-1']);
    _gaq.push(['_trackPageview']);
}

pyro.init({
	gameTitle: "Happy Friday!",
    gameVersion: "1.0.30.4",
	targetFrameRate: 30,
	onReady: function(){
		//Fetch cache
		pyro.network.fetchCache();
		
		//Create the camera(s)
		pyro.createCamera({id: "main"});
		pyro.createCamera({id: "ui"});

		//Create the viewport(s)
		pyro.createViewport({
			id: "main",
			divElement: "gameViewport",
			camera: "main"
		}); 
		
		//Themes
		pyro.themeManager.addTheme("Orange", [
			[255,210,116],
			new pyro.Color(255,210,116).adjustHSL(0,0,-20),
			[255,233,116],
			[113,90,175],
			[88,111,172]
		]);

		pyro.themeManager.addTheme("Red", [
			[240,66,66],
			new pyro.Color(240,66,66).adjustHSL(0,0,-20),
			[240,145,66],
			[40,144,144],
			[53,192,53]
		]);

		pyro.themeManager.addTheme("Green", [
			[199,249,72],
			new pyro.Color(199,249,72).adjustHSL(0,0,-20),
			[103,238,68],
			[251,71,92],
			[229,65,176]
		]);
		
		pyro.themeManager.addTheme("Blue", [
			[48,208,244],
			new pyro.Color(48,208,244).adjustHSL(0,0,-20),
			[66,105,246],
			[255,191,44],
			[255,149,44]
		]);

		pyro.themeManager.setTheme("Blue");
		
		//pyro.themeManager.colors[0]
		//pyro.themeManager.getTheme("Orange").addColor(255,210,116);
		_gaq.push(['_trackEvent', pyro.gameTitle, 'Launched', pyro.gameVersion]);
	},
	onUpdate: function(dt){
		//console.log('GAME!');
	}
});