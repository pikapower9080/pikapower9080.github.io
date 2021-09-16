pyro.createStage({
	id: "Game Over",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: true,
	alpha: 0,
	onCreate: function(){
		//Load UI stage
		this.loadMap("ui_gameover");
		
		this.physicsEnabled = false;

		this.memory = new pyro.Memory("", {
			RAM: {
				livesText: this.layers[0].getObjectsByClass("LivesText")[0]
			}
		});
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
		//this.alpha = 1;
		pyro.getStage("Game Over").memory.RAM.livesText.text = pyro.getStage("Gameplay").memory.HDD.livesLeft + 1;
		this.sequences.DropLifeCount.start();
	},
	onUpdate: function(){

	},
	actions: {
        setAlpha: function(val){
            pyro.getStage("Game Over").alpha = val;
        },
		updateText: function(text){
			//Reset values
			pyro.getStage("Game Over").memory.RAM.livesText.text = (pyro.getStage("Gameplay").memory.HDD.livesLeft > -1) ? pyro.getStage("Gameplay").memory.HDD.livesLeft : ":(";
            pyro.getStage("Gameplay").audio.play({
				id: "primkilled"
			});
		},
		resizeLives: function(scale){
			var stage = pyro.getStage("Game Over");
			//Reset values
			stage.memory.RAM.livesText.scale.set(new pyro.Vertex(scale, scale));
		},
        pauseStage: function(){
        	pyro.getStage("Game Over").pause();
        },
		resumeGame: function(text){
            if(pyro.getStage("Gameplay").memory.HDD.livesLeft > -1){
        		pyro.getStage("Gameplay").callAction("retry");
    			pyro.getStage("Gameplay").resume();
            }else{
        		pyro.getStage("Gameplay").stop();
        		pyro.getStage("Game Over").stop();
        		pyro.getStage("Stage Select").start();
                pyro.getStage("Gameplay").memory.HDD.livesLeft = 3;
                pyro.getStage("Gameplay").memory.HDD.totalScore = 0;
                pyro.getStage("Gameplay").memory.save();
                
				_gaq.push(['_trackEvent', 'Gameplay - Gameover', pyro.getStage("Stage Select").memory.RAM.selectedStage]);
            }
		}
	},
	sequences: {
		'DropLifeCount': [
    		["sequences.FadeIn.start", [false], 5],
			["actions.resizeLives", [1], 15],
			["actions.resizeLives", [1.01], 1],
			["actions.updateText", [], 1],
			["actions.resizeLives", [1.02], 1],
			["actions.resizeLives", [1.03], 1],
			["actions.resizeLives", [1.09], 1],
			["actions.resizeLives", [1], 15],
			["actions.resumeGame", [], 1],
        	["sequences.FadeOut.start", [false], 5],
    		["actions.pauseStage", [], 1]
		],
        'FadeIn': [
            ["actions.setAlpha", [0], 1],
    		//["actions.setAlpha", [0.1], 1],
			["actions.setAlpha", [0.2], 1],
			//["actions.setAlpha", [0.3], 1],
			["actions.setAlpha", [0.4], 1],
			//["actions.setAlpha", [0.5], 1],
			["actions.setAlpha", [0.6], 1],
			//["actions.setAlpha", [0.7], 1],
    		["actions.setAlpha", [0.8], 1],
    		//["actions.setAlpha", [0.9], 1],
    		["actions.setAlpha", [1], 1]
        ],
        'FadeOut': [
            ["actions.setAlpha", [1], 1],
        	//["actions.setAlpha", [0.9], 1],
			["actions.setAlpha", [0.8], 1],
			//["actions.setAlpha", [0.7], 1],
			["actions.setAlpha", [0.6], 1],
			//["actions.setAlpha", [0.5], 1],
			["actions.setAlpha", [0.4], 1],
			//["actions.setAlpha", [0.3], 1],
    		["actions.setAlpha", [0.2], 1],
    		//["actions.setAlpha", [0.1], 1],
    		["actions.setAlpha", [0], 1]
        ]
	}
});