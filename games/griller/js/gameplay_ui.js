stage_gameplayUI = pyro.createStage({
	id: "Gameplay UI",
	viewport: "main",
	camera: "ui",
	enabled: false,
	paused: true,
	alpha: 0,
	onCreate: function(){
		this.loadMap("Stage UI");
		
		this.physicsEnabled = false;
    	
		this.speechBubbleTile = this.layers[0].addTile(new pyro.Tile());
		this.speechBubbleOpen = false;
    	
		this.achvBubbleTile = this.layers[0].addTile(new pyro.Tile());
		this.achvBubbleTileOpen = false;
		
		this.memory = new pyro.Memory("GameUI", {
			RAM: {
				//donutsText: this.layers[0].getObjectsByClass("DonutCount")[0],
				//livesText: this.layers[0].getObjectsByClass("LifeCount")[0],
				scoreText: this.layers[0].getObjectsByClass("Score")[0],
    			topScoreText: this.layers[0].getObjectsByClass("Top Score")[0],
    			baddyText: this.layers[0].getObjectsByClass("Baddies")[0],
    			comboText: this.layers[0].getObjectsByClass("Combo")[0],
        		timeText: this.layers[0].getObjectsByClass("Time")[0],
				//goldDonuts: this.layers[0].getObjectsByClass("Gold Donut"),
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
    	this.memory.RAM.topScoreText.text = zeroify(stage_gameplay.memory.HDD.highScore,10);
        this.memory.RAM.comboText.text = zeroify(stage_gameplay.memory.RAM.currentCombo + 1,3);
        this.memory.RAM.baddyText.text = zeroify(stage_gameplay.memory.RAM.baddiesDefeated,6);
        this.memory.RAM.timeText.text = moment(stage_gameplay.memory.RAM.timePlayed * 30).format("m:ss.SS");//zeroify(stage_gameplay.memory.RAM.timePlayed,3);
        
        //Inflate score
        if(this.memory.RAM.scoreText.text * 1 < stage_gameplay.memory.RAM.totalScore){
            var newScore = this.memory.RAM.scoreText.text * 1;
            
            newScore += (stage_gameplay.memory.RAM.totalScore - newScore) * 0.25;
            
            this.memory.RAM.scoreText.text = zeroify(Math.ceil(newScore),10);
        }else{
            this.memory.RAM.scoreText.text = zeroify(stage_gameplay.memory.RAM.totalScore,10);
        }
        
        return;
		var gameplayStage = pyro.getStage("Gameplay");
		
		this.memory.RAM.debugText.text = "Current State: " + gameplayStage.player.logic.memory.RAM.state + "|" + gameplayStage.player.logic.memory.RAM.substate + " | FPS: " + pyro.stats.framesPerSecond + " | CPS: " + pyro.stats.cyclesPerSecond;
		this.memory.RAM.debugText.alpha = (this.memory.RAM.displayDebugText)?1:0;
		
		this.memory.RAM.donutsText.text = gameplayStage.player.logic.memory.RAM.donuts;
		this.memory.RAM.livesText.text = gameplayStage.memory.HDD.livesLeft;
		this.memory.RAM.scoreText.text = zeroify(gameplayStage.memory.HDD.highScore,10);
        
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
    	wait: function(){
            
		},
		resizeScore: function(scale){
			//Reset values
			stage_gameplayUI.memory.RAM.scoreText.scale.set(scale, scale);
		},
		resizeLives: function(size){
			var stage = pyro.getStage("Gameplay UI");
			//Reset values
			stage.memory.RAM.livesText.size = size;
		},
    	resizeAchv: function(percent){
            scale = 0 + (1-0)*(1-Math.pow(1-percent,2));
			stage_gameplayUI.achvBubbleTile.setScale(new pyro.Vector(scale, scale));
			stage_gameplayUI.achvBubbleTile.alpha = scale;
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
    	openAchv: function(text, autoClose, help){
			if(stage_gameplayUI.achvBubbleTileOpen) return;
			stage_gameplayUI.achvBubbleTileOpen = true;
						
			newText = new pyro.Text(text, [0,0], "#FFF", null, "Droid Serif Bold", 24);
			newText.textBaseline = "middle";
			newText.getBoxPixel();
			
			this.achvBubbleTile.texts = [];
			this.achvBubbleTile.texts.push(newText);
			
			var padding = 24;
			var notchSize = 15;
			newPolygon = new pyro.Polygon();
			newPolygon.fill = (!help)?"#57C1D9":"#FCAD4C";
			newPolygon.stroke = "#FFF";
			newPolygon.lineWidth = 4;
			newPolygon.addRectangle([0,0], newText.box.getWidth() + padding + 18, newText.box.getHeight() + padding, 8);
			/*newPolygon.addMove([newText.box.getCenter().matrix[0] - notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2)]);
			newPolygon.addLine([newText.box.getCenter().matrix[0], newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2) + notchSize]);
			newPolygon.addLine([newText.box.getCenter().matrix[0] + notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2)]);*/
    		//newPolygon.addRectangle([0,0], 200, 300, 8);
        	//newPolygon.closePath = true;
			
			stage_gameplayUI.achvBubbleTile.polygons = [];
			stage_gameplayUI.achvBubbleTile.polygons.push(newPolygon);
			//stage.layers[stage.memory.spawnPoint.layer].addText(text, position, {font: "Cookies", size: 20});

			stage_gameplayUI.achvBubbleTile.position.set(500,570).add(0,-75);
			stage_gameplayUI.achvBubbleTile.getBox();
			
			stage_gameplayUI.sequences["Open Achv"].start();
            
            if(autoClose){
			    stage_gameplayUI.sequences["Auto Close Achv"].start();
            }
		},
		closeAchv: function(){
			stage_gameplayUI.sequences["Close Achv"].start();
		},
		endAchv: function(){
			stage_gameplayUI.achvBubbleTileOpen = false;	
		},
        openHelp: function(text, autoClose){
    		this.callAction("openAchv", text, autoClose, true);
		},
        setAlpha: function(val){
            pyro.getStage("Gameplay UI").alpha = val;
        }
	},
	sequences: {
		'AnimateScore': [
			["actions.resizeScore", [1.1], 1],
			["actions.resizeScore", [1.15], 1],
    		["actions.resizeScore", [1.1], 1],
    		["actions.resizeScore", [1.05], 1],
			["actions.resizeScore", [1], 1]
		],
		'AnimateLives': [
			["actions.resizeLives", [24], 1],
			["actions.resizeLives", [26], 1],
			["actions.resizeLives", [22], 1]
		],
    	'Open Achv': [
			["actions.resizeAchv", [0], 1],
			["actions.resizeAchv", [0.1], 1],
			["actions.resizeAchv", [0.5], 1],
			["actions.resizeAchv", [0.7], 1],
			["actions.resizeAchv", [0.8], 1],
			["actions.resizeAchv", [0.9], 1],
			["actions.resizeAchv", [1], 1]
		],
		'Close Achv': [
			["actions.resizeAchv", [0.9], 1],
			["actions.resizeAchv", [0.8], 1],
			["actions.resizeAchv", [0.7], 1],
			["actions.resizeAchv", [0.6], 1],
			["actions.resizeAchv", [0.5], 1],
			["actions.resizeAchv", [0.1], 1],
			["actions.resizeAchv", [0], 1],
			["actions.endAchv", [], 1]
		],
    	'Auto Close Achv': [
    		["actions.wait", [], 60],
			["actions.resizeAchv", [0.9], 1],
			["actions.resizeAchv", [0.8], 1],
			["actions.resizeAchv", [0.7], 1],
			["actions.resizeAchv", [0.6], 1],
			["actions.resizeAchv", [0.5], 1],
			["actions.resizeAchv", [0.1], 1],
			["actions.resizeAchv", [0], 1],
			["actions.endAchv", [], 1]
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
