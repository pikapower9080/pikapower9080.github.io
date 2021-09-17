pyro.createStage({
    id: "Stage Select",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: true,
	alpha: 0,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Stage Select");
		
		this.selectedChoice = 0;
        
        this.memory = new pyro.Memory("Stage Select", {
    		RAM: {
				selectedStage: "gr_1",
				selectedStageIndex: 0,
				selectedWorldIndex: 0
			},
			ROM: {
				stages: ['gr_1', 'gr_2', 'gr_3', 'gr_4x', 'tai5'],
				stageTimerLength: 100,
				runForce: 8000
			},
			HDD: {
				//Customize?!
			}
		});
		
		this.input.bind({
			alias: "MoveUp",
			keys: { firstDown: [87,38] },
			mouse: {
				clicked: [0,1],
				area: [0,0,1000,100]
			},
			callback: function(stage, events){
				stage.selectedChoice--;
				if(stage.selectedChoice < 0) stage.selectedChoice = stage.layers[0].getObjectsByClass("Choice").length - 1;
			}
		});	
		
		this.input.bind({
			alias: "MoveDown",
			keys: {	firstDown: [83,40] },
			mouse: {
				click: [0,1],
				area: [0,462,1000,562]
			},
			callback: function(stage, events){
				stage.selectedChoice++;
				if(stage.selectedChoice > stage.layers[0].getObjectsByClass("Choice").length - 1) stage.selectedChoice = 0;
			}
		});
		
		
		
		this.input.bind({
			alias: "Choose",
			mouse: {
				hover: true,
				textClass: "Choice"
			},
			callback: function(stage, events){
				if(events[0].entity) stage.selectedChoice = stage.layers[0].getObjectsByClass("Choice").indexOf(events[0].entity);
			}
		});
		
		this.input.bind({
			alias: "Press Choice",
			keys: {down: [13, 32]},
			mouse: {
				down: [0, 1],
				textClass: "Choice"
			},
			callback: function(stage, events){
				stage.layers[0].getObjectsByClass("Choice")[stage.selectedChoice].scale.matrix[0] = 0.9;
				stage.layers[0].getObjectsByClass("Choice")[stage.selectedChoice].scale.matrix[1] = 0.9;
			}
		});

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1],
				textClass: "Choice"
			},
			callback: function(stage, events){
				if(events[0].entity) stage.selectedChoice = stage.layers[0].getObjectsByClass("Choice").indexOf(events[0].entity);
				
				if(stage.selectedChoice > -1){
					pyro.getStage("Stage Select").memory.RAM.selectedStage = pyro.getStage("Stage Select").memory.ROM.stages[stage.selectedChoice];
					stage.pause();
					pyro.getStage("Gameplay").callAction("startLevel");
					pyro.getStage("Gameplay").start();
				}
			}
		});
		
		
	},
	onReady: function(){
		
	},
	onStop: function(){
		this.alpha = 1;
	},
	onPause: function(){
		this.alpha = 0;
	},
	onResume: function(){
		this.alpha = 1;
		this.selectedChoice = 0;
		
		var choices = this.layers[0].getObjectsByClass("Choice");
		for(var i = 0; i < choices.length; i++){
			if(i != this.selectedChoice){
				choices[i].scale.matrix[0] /= 1;
				choices[i].scale.matrix[1] /= 1;
			}else{
				choices[i].scale.matrix[0] = 1.1;
				choices[i].scale.matrix[1] = 1.1;
			}
		}
	},
	onUpdate: function(){
		var choices = this.layers[0].getObjectsByClass("Choice");
		
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
	}
});