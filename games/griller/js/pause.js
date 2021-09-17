pyro.createStage({
	id: "Paused",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: true,
	alpha: 0,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Pause");
		
		this.selectedChoice = 0;
		
		this.input.bind({
			alias: "Unpause",
			keys: {	firstDown: 27 },
            gamepad: {
                firstDown: [9],
            },
			callback: function(stage, events){
				pyro.getStage("Gameplay").resume();
				stage.pause();
				return;
			}
		});
		
		this.input.bind({
			alias: "MoveUp",
			keys: { firstDown: [87,38] },
			mouse: {
				clicked: [0,1],
				area: [0,0,1000,100]
			},
            gamepad: {
                firstDown: [12],
                firstAxes: [0, -0.15]
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
            gamepad: {
                firstDown: [13],
                firstAxes: [0, 0.15]
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
            gamepad: {
                down: [0],
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
            gamepad: {
                up: [0],
            },
			callback: function(stage, events){
				if(events[0].entity) stage.selectedChoice = stage.layers[0].getObjectsByClass("Choice").indexOf(events[0].entity);
				
				switch(stage.selectedChoice){
					case 0:
						pyro.getStage("Gameplay").resume();
						break;
					case 1:
                        stage_transition.sequences.FadeIn.start(false, function(){
					        pyro.getStage("Gameplay").callAction("startLevel");
						    pyro.getStage("Gameplay").resume();
                        });
						break;
					case 2:
                        stage_transition.sequences.FadeIn.start(false, function(){
						    pyro.getStage("Gameplay").stop();
						    pyro.getStage("Title Screen").start();
                        });
						break;
				}
			}
		});
		
		this.input.bind({
			alias: "Select Graphics",
			mouse: {
				click: [0,1],
				textClass: "Settings Graphics"
			},
			callback: function(stage, events){
				if(events[0].entity) stage.selectedGraphicsChoice = stage.layers[0].getObjectsByClass("Settings Graphics").indexOf(events[0].entity);
				
				switch(stage.selectedGraphicsChoice){
					case 0:
						pyro.setGraphicsScale(0.5);
						break;
					case 1:
						pyro.setGraphicsScale(1);
						break;
					case 2:
						pyro.setGraphicsScale(2);
						break;
				}
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
					choices[i].scale.matrix[0] /= 1.02;
					choices[i].scale.matrix[1] /= 1.02;
				}
				if(Math.abs(choices[i].scale.matrix[0]) < 1){
					choices[i].scale.matrix[0] = 1;
					choices[i].scale.matrix[1] = 1;
				}
			}else{
				if(choices[i].scale.matrix[0] < 1.1){
					choices[i].scale.matrix[0] *= 1.02;
					choices[i].scale.matrix[1] *= 1.02;
				}
				if(Math.abs(choices[i].scale.matrix[0]) > 1.1){
					choices[i].scale.matrix[0] = 1.1;
					choices[i].scale.matrix[1] = 1.1;
				}
			}
		}
		
		var graphicsChoices = this.layers[0].getObjectsByClass("Settings Graphics");
		if(pyro.getGraphicsScale() == 0.5) graphicsChoiceSelected = 0;
		if(pyro.getGraphicsScale() == 1) graphicsChoiceSelected = 1;
		if(pyro.getGraphicsScale() == 2) graphicsChoiceSelected = 2;
		
		for(var i = 0; i < graphicsChoices.length; i++){
			if(i != graphicsChoiceSelected){
				if(graphicsChoices[i].scale.matrix[0] > 1){
					graphicsChoices[i].scale.matrix[0] /= 1.02;
					graphicsChoices[i].scale.matrix[1] /= 1.02;
				}
				if(Math.abs(graphicsChoices[i].scale.matrix[0]) < 1){
					graphicsChoices[i].scale.matrix[0] = 1;
					graphicsChoices[i].scale.matrix[1] = 1;
				}
			}else{
				if(graphicsChoices[i].scale.matrix[0] < 1.1){
					graphicsChoices[i].scale.matrix[0] *= 1.02;
					graphicsChoices[i].scale.matrix[1] *= 1.02;
				}
				if(Math.abs(graphicsChoices[i].scale.matrix[0]) > 1.1){
					graphicsChoices[i].scale.matrix[0] = 1.1;
					graphicsChoices[i].scale.matrix[1] = 1.1;
				}
			}
		}
	}
});