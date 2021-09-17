pyro.createStage({
	id: "Gameplay UI",
	viewport: "main",
	camera: "ui",
	enabled: false,
	paused: true,
	alpha: 0,
	onCreate: function(){
		this.loadMap("ui_gameplay");
		
		this.physicsEnabled = false;
		
		this.memory = new pyro.Memory("GameUI", {
			RAM: {
				donutsText: this.layers[0].getObjectsByClass("DonutCount")[0],
				livesText: this.layers[0].getObjectsByClass("LifeCount")[0],
				scoreText: this.layers[0].getObjectsByClass("Score")[0],
				goldDonuts: this.layers[0].getObjectsByClass("Gold Donut"),
				debugText: this.layers[0].getObjectsByClass("Debug")[0],
				displayDebugText: false
			}
		});
		
	},
	onReady: function(){
        //this.sequences.FadeIn.start();
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
        //this.sequences.FadeIn.start();
	},
	onUpdate: function(){
		var gameplayStage = pyro.getStage("Gameplay");
		
		this.memory.RAM.debugText.text = "Current State: " + gameplayStage.player.logic.memory.RAM.state + "|" + gameplayStage.player.logic.memory.RAM.substate + " | FPS: " + pyro.stats.framesPerSecond + " | CPS: " + pyro.stats.cyclesPerSecond;
		this.memory.RAM.debugText.alpha = (this.memory.RAM.displayDebugText)?1:0;
		
		this.memory.RAM.donutsText.text = gameplayStage.player.logic.memory.RAM.donuts;
		this.memory.RAM.livesText.text = gameplayStage.memory.HDD.livesLeft;
		this.memory.RAM.scoreText.text = zeroify(gameplayStage.memory.HDD.totalScore,10);
        
		for(var i = 0; i < 3; i++){
			if(!gameplayStage.memory.RAM.goldenDonutsCollected[i]){
				this.memory.RAM.goldDonuts[i].effects.HSL = [0,-100,10];
				this.memory.RAM.goldDonuts[i].alpha = 0.2;
			}else{
				this.memory.RAM.goldDonuts[i].effects.HSL = false;
				this.memory.RAM.goldDonuts[i].alpha = 1;
			}
		}
	},
	actions: {
		resizeDonuts: function(size){
			var stage = pyro.getStage("Gameplay UI");
			//Reset values
			stage.memory.RAM.donutsText.size = size;
		},
		resizeLives: function(size){
			var stage = pyro.getStage("Gameplay UI");
			//Reset values
			stage.memory.RAM.livesText.size = size;
		},
		dialog: function(text, position){
			gameplayStage = pyro.getStage("Gameplay");
			uiStage = pyro.getStage("Gameplay UI");
			//stage.layers[stage.memory.spawnPoint.layer].addText(text, position, {font: "Cookies", size: 20});
			console.log(text);

			uiStage.dialog.position.set(position);
		},
		endDialog: function(){

		},
        setAlpha: function(val){
            pyro.getStage("Gameplay UI").alpha = val;
        }
	},
	sequences: {
		'AnimateDonuts': [
			["actions.resizeDonuts", [24], 1],
			["actions.resizeDonuts", [26], 1],
			["actions.resizeDonuts", [22], 1]
		],
		'AnimateLives': [
			["actions.resizeLives", [24], 1],
			["actions.resizeLives", [26], 1],
			["actions.resizeLives", [22], 1]
		]
	}
});

zeroify = function(num, count){
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}
