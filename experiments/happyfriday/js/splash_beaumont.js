stage_beaumont = pyro.createStage({
    id: "Splash Beaumont",
    viewport: "main",
	camera: "splash",
	enabled: false,
	paused: false,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Splash Beaumont");

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1]
			},
			callback: function(stage, events){
                if(this.alpha == 1){
                    //stage.sequences.FadeOut.start();
                }
			}
		});
	},
	onReady: function(){
        stage_transition.sequences.FadeOut.start();
        this.sequences.splash.start();
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
                stage_beaumont.stop();
                stage_title.start();
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