stage_title = pyro.createStage({
	id: "Title Screen",
	viewport: "main",
	camera: "titleScreen",
	enabled: false,
	paused: true,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Title Screen");

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1]
			},
            gamepad: {
                firstDown: [0,1,2,3,4,5,6,7,8,9,10,11]  
            },
			callback: function(stage, events){
                stage.callAction("moveOn");
			}
		});
        
        this.player = this.layers[this.layers.length - 1].getObjectsByClass("Prim")[0];
        this.player.bodies[0].b2Body.SetFixedRotation(true);
        pyro.getCamera("titleScreen").follow(this.player);
        pyro.getCamera("titleScreen").zoom = 0.8;
         //pyro.getCamera("titleScreen").followType = "Static";
       },
	onReady: function(){
    	this.alpha = 1;
        stage_transition.sequences.FadeOut.start();
    	this.sequences.Present.start();
        if(pyro.getStage("Title Screen Overlay")) pyro.getStage("Title Screen Overlay").start();
        pyro.getStage("Stage Select").backgroundMusic = pyro.getStage("Stage Select").audio.cacheAudio({url: "audio/music/title.ogg", isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: true});
        pyro.getStage("Title Screen Overlay").layers[7].getObjectsByClass("Version")[0].text = "v " + pyro.gameVersion;
	},
	onStop: function(){
    	this.alpha = 0;
        if(pyro.getStage("Title Screen Overlay")) pyro.getStage("Title Screen Overlay").stop();
	},
	onPause: function(){
		this.alpha = 0;
        if(pyro.getStage("Title Screen Overlay")) pyro.getStage("Title Screen Overlay").pause();
	},
	onResume: function(){
		this.alpha = 1;
        if(pyro.getStage("Title Screen Overlay")) pyro.getStage("Title Screen Overlay").resume();
	},
	onUpdate: function(){
		this.player.callAction("walk", 1);
        
		//DEBUG
        //this.stop();
		//pyro.getStage("Stage Select").start();
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stage_title.stop();
                pyro.getStage("Stage Select").start();
            });
        },
        setOverlaySpeed: function(val){
            pyro.getStage("Title Screen Overlay").speed = val;
        }
    },
    sequences: {
        'Present': [
            ["actions.setOverlaySpeed", [0], 0],
            ["actions.wait", null, 30],
            ["actions.setOverlaySpeed", [1], 30]
        ]
	}
});