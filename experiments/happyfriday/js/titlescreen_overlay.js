pyro.createStage({
    id: "Title Screen Overlay",
	viewport: "main",
	camera: "ui",
	enabled: false,
	paused: true,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Title Screen Overlay");
        
        this.bouncyTexts = this.layers[this.layers.length - 1].getObjectsByClass("Bouncy Text");
        
        //this.sequences.animateText.start(true);
        
        this.textTweenDuration = 15;
        this.textTweenTime = 0;
        this.textTweenScale = new pyro.Vector(1,1);
        
        for(var i = 0; i < this.bouncyTexts.length; i++){
            this.bouncyTexts[i].scale = this.textTweenScale;
    	}
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
	onUpdate: function(dt){
        if(dt <= 0) return;
        this.textTweenTime += dt;
        this.textTweenTime = this.textTweenTime % this.textTweenDuration;
        
        if(this.textTweenTime == 0) this.textTweenUp = !this.textTweenUp;
        
        
        if(this.textTweenUp){
            this.textTweenScale.set(1,1);
            pyro.tween(this.textTweenScale, new pyro.Vector(0.2, 0.2), this.textTweenTime, this.textTweenDuration)
        }else{
            this.textTweenScale.set(1.2,1.2);
            pyro.tween(this.textTweenScale, new pyro.Vector(-0.2, -0.2), this.textTweenTime, this.textTweenDuration)
        }
        
		//DEBUG
        //this.stop();
	},
    actions: {
        rescaleText: function(scale){
            var stage = pyro.getStage("Title Screen Overlay");
    		//Reset values
        	for(var i = 0; i < stage.bouncyTexts.length; i++){
                stage.bouncyTexts[i].scale.matrix[0] = scale;
                stage.bouncyTexts[i].scale.matrix[1] = scale;
    		}
        }
    },
    sequences: {
		'animateText': [
			["actions.rescaleText", [1], 1],
			["actions.rescaleText", [1.1], 1],
			["actions.rescaleText", [1.15], 1],
    		["actions.rescaleText", [1.2], 1],
    		["actions.rescaleText", [1.15], 1],
    		["actions.rescaleText", [1.1], 1],
    		["actions.rescaleText", [1], 1]
		]
	}
});