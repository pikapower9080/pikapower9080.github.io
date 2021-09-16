pyro.createStage({
    id: "Splash Chrome",
	viewport: "main",
	camera: "splash",
	enabled: false,
	paused: true,
	alpha: 1,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Splash Chrome");

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1]
			},
			callback: function(stage, events){
                stage.stop();
                pyro.getStage("Title Screen").start();
			}
		});
        
        this.sequences.splash.start();
	},
	onReady: function(){
    	this.alpha = 1;
	},
	onStop: function(){
		this.alpha = 0;
	},
	onPause: function(){
		this.alpha = 0;
	},
	onResume: function(){
		this.alpha = 1;
	},
	onUpdate: function(){
        
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            pyro.getStage("Splash Chrome").stop();
            pyro.getStage("Title Screen").start();
        }
    },
    sequences: {
    	'splash': [
			["actions.wait", [1], 60],
    		["actions.moveOn", [1], 1]
		]
	}
});