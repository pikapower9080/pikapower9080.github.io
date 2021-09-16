stage_smashplug = pyro.createStage({
    id: "Splash Smashplug",
	viewport: "main",
	camera: "splash",
	enabled: true,
	paused: false,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Splash Smashplug");

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1]
			},
			callback: function(stage, events){
                if(this.alpha == 1){
                    stage_transition.sequences.FadeIn.start();
                }
			}
		});
	},
	onReady: function(){
		var params = {};

		if (location.search) {
		    var parts = location.search.substring(1).split('&');
		
		    for (var i = 0; i < parts.length; i++) {
		        var nv = parts[i].split('=');
		        if (!nv[0]) continue;
		        params[nv[0]] = nv[1].replace('%20', " ") || true;
		    }
		}
		
		if(params.level){
    		this.stop();
            stage_beaumont.stop();
			pyro.getStage("Stage Select").memory.RAM.selectedStage = params.level;
			pyro.getStage("Gameplay").callAction("startLevel", false, false, true);
			pyro.getStage("Gameplay").start();
		}else{
            this.sequences.splash.start();   
		}
	},
	onStop: function(){
        this.alpha = 0;
	},
	onPause: function(){
        
	},
	onResume: function(){
        
	},
	onUpdate: function(){
        
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stage_smashplug.stop();
                stage_beaumont.start();
            });
        }
    },
    sequences: {
		'splash': [
			["actions.wait", [1], 60],
            ["actions.moveOn", [1], 1]
		]
	}
});