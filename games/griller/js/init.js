try{
    pyro.init({
    	gameTitle: "Griller",
    	targetFrameRate: 30,
    	onReady: function(){
    		//Fetch cache
    		pyro.network.fetchCache();
    		
            //pyro.setGraphicsScale(2);
        
    		//Create the camera(s)
    		pyro.createCamera({id: "main"}).parallaxOffset = false;
    		pyro.createCamera({id: "ui"}).parallaxOffset = false;;
    		pyro.createCamera({id: "titleScreen"});//.parallaxOffset = false;
    
    		//Create the viewport(s)
    		pyro.createViewport({
    			id: "main",
    			divElement: "gameViewport",
    			camera: "main"
    		}); 
    		
    		//Themes
        	pyro.themeManager.addTheme("Main", [
                [115,115,115], //Dark Grey
            	[174,174,174], //Med grey
        		[235,235,235], //Light grey
    			[87,193,217], //Blue
    			[242,80,80], //Red
        		[116,196,108], //Green //160,196,108 --Android Green
            	[252,173,76] //Orange
    		]);
            
            
    		pyro.themeManager.setTheme("Main");
    		
    		//pyro.themeManager.colors[0]
    		//pyro.themeManager.getTheme("Orange").addColor(255,210,116);
    		_gaq.push(['_trackEvent', 'Griller', 'Launched']);
    	},
    	onUpdate: function(dt){
    		//console.log('GAME!');
    	}
    });
}catch(e){
    alert(e.message);
}