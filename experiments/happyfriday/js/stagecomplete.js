pyro.createStage({
	id: "Stage Complete",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: true,
	alpha: 0,
	onCreate: function(){
		//Load UI stage
		this.loadMap("ui_stagecomplete");
		
		this.selectedChoice = 1;
		
		this.input.bind({
			alias: "MoveUp",
			keys: { firstDown: [87,38] },
			mouse: {
				clicked: [0,1],
				area: [0,0,1000,25]
			},
            gamepad: {
                firstDown: [12],
                firstAxes: [0, -0.15]
            },
			callback: function(stage, events){
			    if(stage.layers[0].position.matrix[0] != 0) return;
			    
				stage.selectedChoice--;
				if(stage.selectedChoice < 0) stage.selectedChoice = stage.layers[1].getObjectsByClass("Choice").length - 1;
                pyro.getStage("Gameplay").audio.play({id: "select"});
			}
		});	
		
		this.input.bind({
			alias: "MoveDown",
			keys: {	firstDown: [83,40] },
			mouse: {
				click: [0,1],
				area: [0,537,1000,562]
			},
            gamepad: {
                firstDown: [13],
                firstAxes: [0, 0.15]
            },
			callback: function(stage, events){
			    if(stage.layers[0].position.matrix[0] != 0) return;
			    
				stage.selectedChoice++;
				if(stage.selectedChoice > stage.layers[1].getObjectsByClass("Choice").length - 1) stage.selectedChoice = 0;
                pyro.getStage("Gameplay").audio.play({id: "select"});
			}
		});
		
		this.input.bind({
			alias: "Choose",
			mouse: {
				hover: true,
				textClass: "Choice"
			},
			callback: function(stage, events){
                if(stage.selectedChoice != stage.layers[1].getObjectsByClass("Choice").indexOf(events[0].entity)) pyro.getStage("Gameplay").audio.play({id: "select"});
				if(events[0].entity) stage.selectedChoice = stage.layers[1].getObjectsByClass("Choice").indexOf(events[0].entity);
			}
		});
		
		this.input.bind({
			alias: "Press Choice",
			keys: {down: [13, 32]},
			mouse: {
				down: [0, 1],
				textClass: "Choice"
			},
            gamepad: {
                down: [0]  
            },
			callback: function(stage, events){
			    if(stage.layers[0].position.matrix[0] != 0) return;
			    
				stage.layers[1].getObjectsByClass("Choice")[stage.selectedChoice].scale.matrix[0] = 0.9;
				stage.layers[1].getObjectsByClass("Choice")[stage.selectedChoice].scale.matrix[1] = 0.9;
			}
		});

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1],
				textClass: "Choice"
			},
            gamepad: {
                up: [0]  
            },
			callback: function(stage, events){
			    if(stage.layers[0].position.matrix[0] != 0) return;
			    
				if(events[0].entity) stage.selectedChoice = stage.layers[1].getObjectsByClass("Choice").indexOf(events[0].entity);
				
				switch(stage.selectedChoice){
					case 0:
						pyro.getStage("Gameplay").callAction("startLevel");
						pyro.getStage("Gameplay").resume();
						stage.pause();
						break;
					case 1:
						stageSelect = pyro.getStage("Stage Select");
						nextStageIndex = stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) + 1;
						if(nextStageIndex < 8){
        					stage.callAction("moveOn");
						}else{
                            stage.pause();
                        	pyro.getStage("Gameplay").stop();
                    		pyro.getStage("Game Over").stop();
                    		pyro.getStage("Stage Select").start();
                            pyro.getStage("Gameplay").memory.save();   
						}
						
						break;
				}
				
				if(stage.selectedChoice > -1){
					pyro.getStage("Gameplay").audio.play({id: "selectPick"});
				}
			}
		});
	},
	onReady: function(){
		this.alpha = 1;
    	this.selectedChoice = 1;
	},
	onStop: function(){
		this.alpha = 0;
	},
	onPause: function(){
		this.alpha = 0;
	},
	onResume: function(){
		this.alpha = 1;
		this.selectedChoice = 1;
		
		var choices = this.layers[1].getObjectsByClass("Choice");
		for(var i = 0; i < choices.length; i++){
			if(i != this.selectedChoice){
				choices[i].scale.matrix[0] /= 1;
				choices[i].scale.matrix[1] /= 1;
			}else{
				choices[i].scale.matrix[0] = 1.1;
				choices[i].scale.matrix[1] = 1.1;
			}
		}
		
		this.layers[0].position.matrix[0] = 1000;
		this.layers[1].position.matrix[0] = -1000;
		
		var gameplayStage = pyro.getStage("Gameplay");
		var goldDonuts = this.layers[1].getObjectsByClass("Gold Donut");
		var donutCount = this.layers[0].getObjectsByClass("Donut Count")[0];
		
		for(var i = 0; i < 3; i++){
			if(!gameplayStage.memory.RAM.goldenDonutsCollected[i]){
				goldDonuts[i].effects.HSL = [0,-100,10];
				goldDonuts[i].alpha = 0.2;
			}else{
				goldDonuts[i].effects.HSL = false;
				goldDonuts[i].alpha = 1;
			}
		}
		
		donutCount.text = 0 + " / " + 100;
	},
	onUpdate: function(){
		var gameplayStage = pyro.getStage("Gameplay");
		
		var choices = this.layers[1].getObjectsByClass("Choice");
		var donutCount = this.layers[0].getObjectsByClass("Donut Count")[0];
        
        this.layers[0].getObjectsByClass("World Name")[0].text = pyro.getStage("Stage Select").memory.ROM.worldNames[pyro.getStage("Stage Select").memory.RAM.selectedWorldIndex];
        this.layers[0].getObjectsByClass("Stage Name")[0].text = pyro.getStage("Stage Select").memory.ROM.stageNames[pyro.getStage("Stage Select").memory.RAM.selectedStageIndex];
		
		for(var i = 0; i < choices.length; i++){
			if(i != this.selectedChoice){
				if(choices[i].scale.matrix[0] > 1){
					choices[i].scale.matrix[0] /= 1.01;
					choices[i].scale.matrix[1] /= 1.01;
				}
				if(Math.abs(choices[i].scale.matrix[0]) < 1){
					choices[i].scale.matrix[0] = 1;
					choices[i].scale.matrix[1] = 1;
				}
			}else{
				if(choices[i].scale.matrix[0] < 1.1){
					choices[i].scale.matrix[0] *= 1.01;
					choices[i].scale.matrix[1] *= 1.01;
				}
				if(Math.abs(choices[i].scale.matrix[0]) > 1.1){
					choices[i].scale.matrix[0] = 1.1;
					choices[i].scale.matrix[1] = 1.1;
				}
			}
		}
		
		if(!pyro.getStage("Gameplay").isPaused){
			pyro.getStage("Gameplay").speed /= 1.15;
			if(pyro.getStage("Gameplay").speed <= 0.025){
				pyro.getStage("Gameplay").speed = 1;
				pyro.getStage("Gameplay").pause();
			};
			pyro.getCamera("main").zoom += 0.015;
		}else{
			if(this.layers[0].position.matrix[0] > 0) this.layers[0].position.matrix[0] -= 100;
			if(this.layers[1].position.matrix[0] < 0) this.layers[1].position.matrix[0] += 100;
			
			if(this.layers[0].position.matrix[0] == 0 && this.layers[1].position.matrix[0] == 0){
				if((donutCount.text.split(" / ")[0] | 0) < gameplayStage.player.logic.memory.RAM.donuts){
					donutCount.text = ((donutCount.text.split(" / ")[0] | 0) + 1) + " / " + gameplayStage.memory.RAM.donutsTotal;
					donutCount.scale.set(1.01, 1.01);
				}else{
					donutCount.scale.set(1,1);
				}
			}
		};
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stageSelect.memory.RAM.selectedStage = stageSelect.memory.ROM.stages[nextStageIndex];
                stageSelect.memory.RAM.selectedStageIndex = nextStageIndex;
    			pyro.getStage("Stage Complete").pause();
    			pyro.getStage("Gameplay").callAction("startLevel");
    			pyro.getStage("Gameplay").resume();
            });
        }
    }
});