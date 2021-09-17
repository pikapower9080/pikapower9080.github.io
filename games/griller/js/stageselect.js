stage_stageSelect = pyro.createStage({
	id: "Stage Select",
	viewport: "main",
	camera: "main",
	enabled: false,
	paused: true,
	alpha: 0,
	onCreate: function(){
		this.camera.primaryStage = this;
        
        this.memory = new pyro.Memory("Stage Select", {
    		RAM: {
				selectedStage: "gr_1",
				selectedStageIndex: 0,
				selectedWorldIndex: 0,
    			goldDonuts: this.getObjectsByClass("Gold Donut")
			},
			ROM: {
				stages: ['gr_1', 'gr_2', 'gr_3', 'gr_4', 'tai5'],
    			stageNames: ['Falls', 'Dam', 'Peak', 'Lair', 'Tai'],
        		worldNames: ['Greenrock', 'Empire', 'Alpine', 'Seastorm', 'Gauntlet'],
				stageLayers: [[0,2,4,6,8,9,10,11,12], [1,3,5,7]],
				stageTimerLength: 100,
				runForce: 8000
			},
			HDD: {
				//Customize?!
			}
		});

		this.input.bind({
			alias: "MoveLeft",
			keys: {	down: [65,37] },
			mouse: {
				down: [0,1],
				area: [0,0,100,562]
			},
            gamepad: {
                down: [14],
                axes: [-0.15] 
            },
			callback: function(stage, events){
                if(this.alpha < 1) return;
				stage.player.callAction("walk", -1);
			}
		});	
		
		//Just keys
		this.input.bind({
			alias: "MoveRight",
			keys: { down: [68,39] },
			mouse: {
				down: [0,1],
				area: [900,0,1000,562]
			},
            gamepad: {
                down: [15],
                axes: [0.15]
            },
			callback: function(stage, events){
                if(this.alpha < 1) return;
				stage.player.callAction("walk", 1);
			}
		});	
		
		this.input.bind({
			alias: "Jump Hold",
			keys: { down: [87,38] },
			mouse: {
				down: [0,1],
				area: [0,0,1000,100]
			},
			callback: function(stage, events){
				//if(!stage.input.keyFirstDown[87] && !stage.input.keyFirstDown[38])
				//stage.player.callAction("jump_hold", 1);
				
			}
		});	
		
		this.input.bind({
			alias: "Jump Initial",
			keys: { firstDown: [87,38] },
			mouse: {
				firstDown: [0,1],
				area: [0,0,1000,100]
			},
            gamepad: {
                firstDown: [12],
                firstAxes: [0, -0.15]
            },
			callback: function(stage, events){
                if(stage.alpha < 1) return;
				//stage.player.callAction("jump_initial", 1);
				if(stage.memory.RAM.selectedStageIndex > 0) stage.memory.RAM.selectedStage = stage.memory.ROM.stages[stage.memory.RAM.selectedStageIndex - 1];
			}
		});	
		
		this.input.bind({
			alias: "Transform",
			keys: {	firstDown: [83,40] },
			mouse: {
				firstDown: [0,1],
				area: [0,462,1000,562]
			},
            gamepad: {
                firstDown: [13],
                firstAxes: [0, 0.15]
            },
			callback: function(stage, events){
                if(stage.alpha < 1) return;
				/*if(stage.player.modelName == "model_prim"){
					stage.actions.transformPrim("model_prim_ball");
				}else{
					stage.actions.transformPrim("model_prim");
				}*/
		
				if(stage.memory.RAM.selectedStageIndex < 3) stage.memory.RAM.selectedStage = stage.memory.ROM.stages[stage.memory.RAM.selectedStageIndex + 1];
			}
		});
        
        this.input.bind({
    		alias: "Hover Choice",
			mouse: {
				hover: true,
				textClass: "Choice Stage"
			},
			callback: function(stage, events){
                if(stage.alpha < 1) return;
				if(events[0].objects && events[0].objects.length > -1) stage.memory.RAM.selectedStageIndex = stage.getObjectsByClass("Choice Stage").indexOf(events[0].objects[0]);
                stage.memory.RAM.selectedStage = stage.memory.ROM.stages[stage.memory.RAM.selectedStageIndex];
			}
		});
		
		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1,9],
				textClass: "Choice Stage"
			},
            gamepad: {
                firstDown: [0]  
            },
			callback: function(stage, events){
                if(stage.alpha < 1) return;
                if(events[0].objects && events[0].objects.length > -1) stage.memory.RAM.selectedStageIndex = stage.getObjectsByClass("Choice Stage").indexOf(events[0].objects[0]);
    			
				if(stage.memory.RAM.selectedStageIndex > -1 && stage.memory.RAM.selectedWorldIndex == 0 && (stage.memory.RAM.selectedStageIndex == 0 || pyro.getStage("Gameplay").memory.HDD.stagesComplete[stage.memory.RAM.selectedStageIndex - 1])){
					stage.memory.RAM.selectedStage = stage.memory.ROM.stages[stage.memory.RAM.selectedStageIndex];
                    stage.callAction("startGame");
				}
			}
		});
		
		this.particlePool = [];
		this.particlePoolIndex = 0;
		
		var newEntity = new pyro.Entity();
		var newPolygon = new pyro.Polygon(null, "#F00");
		newPolygon.lineWidth = 0;
		
		newPolygon.addArc([0,0], [10,0,0,0], [0,0,0,Math.PI * 2]);
		newPolygon.closePath = true;
		newPolygon.alpha = 0.75;
		
		newEntity.polygons.push(newPolygon);
		
		var shape = new pyro.Shape({radius: 10, material: new pyro.Material({filter: new pyro.Filter(0x80, 0x8)})});
		var body = new pyro.Body();
		body.shapes.push(shape);
		
		newEntity.bodies.push(body);
		body.bind("position");
		
		this.explosionParticle = newEntity;
		
	},
	onReady: function(){
    	this.alpha = 1;
        stage_transition.sequences.FadeOut.start();
		this.camera.primaryStage = this;
		
		this.callAction("startLevel");
        if(!this.backgroundMusic || (this.backgroundMusic.isPaused || this.backgroundMusic.isStopped)) this.backgroundMusic = this.audio.cacheAudio({url: "audio/music/title.ogg", isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: true});
        
        var layers = this.memory.ROM.stageLayers;
    	for(var i = 0; i < this.layers.length - 1; i++){
			if(layers[this.memory.RAM.selectedWorldIndex].indexOf(i) > -1){
				if(this.layers[i].position.matrix[1] > 0) this.layers[i].position.matrix[1] = 0;
				if(this.layers[i].position.matrix[1] < 0) this.layers[i].position.matrix[1] = 0;
			}else{
				if(this.layers[i].position.matrix[1] < 1000) this.layers[i].position.matrix[1] = 1000;
				if(this.layers[i].position.matrix[1] > 1000) this.layers[i].position.matrix[1] = 1000;
			}
		}
	},
	onStop: function(){
		this.alpha = 0;
        if(this.backgroundMusic) this.backgroundMusic.stop();
	},
	onPause: function(){
		this.alpha = 0;
	},
	onResume: function(){
        stage_transition.sequences.FadeOut.start();
	},
	onUpdate: function(){
		var choices = this.getObjectsByClass("Choice Stage");
    	var gameplayMemory = pyro.getStage("Gameplay").memory;
        
        this.memory.RAM.goldDonuts = this.getObjectsByClass("Gold Donut");
		
		this.memory.RAM.selectedStageIndex = this.memory.ROM.stages.indexOf(this.memory.RAM.selectedStage);
		
		for(var i = 0; i < choices.length; i++){
			if(this.memory.RAM.selectedStageIndex == i){
				choices[i].fill = "#FFF";
			}else{
                if(i == 0 || gameplayMemory.HDD.stagesComplete[i - 1]){
				    choices[i].fill = "#888";
                }else{
    			    choices[i].fill = "#555";
                }
			}
		}
		
		var layers = this.memory.ROM.stageLayers;
		for(var i = 0; i < this.layers.length - 1; i++){
			if(layers[this.memory.RAM.selectedWorldIndex].indexOf(i) > -1){
				if(this.layers[i].position.matrix[1] > 0) this.layers[i].position.matrix[1] -= 20;
				if(this.layers[i].position.matrix[1] < 0) this.layers[i].position.matrix[1] = 0;
			}else{
				if(this.layers[i].position.matrix[1] < 1000) this.layers[i].position.matrix[1] += 20;
				if(this.layers[i].position.matrix[1] > 1000) this.layers[i].position.matrix[1] = 1000;
			}
		}
        
        for(var i = 0; i < 12; i++){
    		if(!gameplayMemory.HDD.totalGoldenDonutsCollected[i]){
				this.memory.RAM.goldDonuts[i].effects.HSL = [0,-100,10];
				this.memory.RAM.goldDonuts[i].alpha = 0.2;
			}else{
				this.memory.RAM.goldDonuts[i].effects.HSL = false;
				this.memory.RAM.goldDonuts[i].alpha = 1;
			}
		}
	},
	actions: {
		reset: function(){
			var stage = pyro.getStage("Gameplay");
			//Reset values
			stage.memory.reset();
		},
		wait: function(){
			//Take a nap
		},
		retry: function(){
			var stage = pyro.getStage("Gameplay");
			//Reset values
			stage.memory.loadState();
			stage.callAction("startLevel", pyro.getStage("Stage Select").memory.RAM.selectedStage, true);
		},
        startGame: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stage_stageSelect.stop();
    			pyro.getStage("Gameplay").callAction("startLevel");
    			pyro.getStage("Gameplay").start();
            });
        },
		startLevel: function(){
			this.loadMap("Stage Selectx");
			
			//Take control of player
			this.player = this.getObjectsByClass("Prim")[0];
        	this.player.bodies[0].b2Body.SetFixedRotation(true);
	
			/*stage.butterly = stage.layers[stage.memory.spawnPoint.layer].addEntity("model_butterfly", spawnPointPosition, { //this.spawnLocations[0]
				entityClass: "Butterfly",
				scale: stage.memory.ROM.butterflyScale,
				gravityScale: stage.memory.ROM.butterflyWeight,
				fixedRotation: true
				//filter: 
			});*/
			
			//Golden donuts
			/*var goldenDonuts = pyro.getStage("Gameplay").layers[stage.memory.spawnPoint.layer].getObjectsByModelName("Donut Golden");
			for(var i = 0; i < goldenDonuts.length; i++){
				goldenDonuts[i].tag = i;
				if(stage.memory.RAM.goldenDonutsCollected[i] == true){
					goldenDonuts[i].effects.HSL = [0,-100,10];
					goldenDonuts[i].alpha = 0.5;
				}
			}*/
			
			//Emitter
			this.explosionEmitter = this.getObjectsLayer(this.player).addEmitter(this.explosionParticle, [0,0], {max: 100, life: 15});
			
			this.camera.follow(this.player);
			this.camera.zoom = 0.49;
	
			this.actions.reset();
            stage_transition.sequences.FadeOut.start();
		},
		explode: function(entity, color, volume, particle, scale, explosionVel, followvelocity, relativePosition){			
			stage = pyro.getStage("Stage Select");
			
			explosionVel = explosionVel || 1;
			volume = volume || 20;
			particle = particle || "circle";
			scale = scale || 1;
					
			if(explosionVel != 0){
				for(var i = 0; i < volume; i++){
					stage.particlePoolIndex++;
					if(stage.particlePoolIndex > 500) stage.particlePoolIndex = 0;
					
					rndScale = scale + 0.25 - (Math.random() / 2);
					
					//Choose a random polygon
					rndPoly = entity.polygons[Math.round(Math.random() * (entity.polygons.length - 1))];
					
					if(!relativePosition){
						posx = entity.position.matrix[0];// + (Math.round(Math.random() * rndPoly.width));// + rndPoly.position.matrix[0]);
						posy = entity.position.matrix[1];// + (Math.round(Math.random() * rndPoly.height));// + rndPoly.position.matrix[1]);
					}else{
						relativePosition = new pyro.Vertex(relativePosition);
						posx = entity.position.matrix[0] + relativePosition.X;
						posy = entity.position.matrix[1] + relativePosition.Y;
					}
					
					vel_x = (explosionVel * Math.random()) * 1000;
					vel_y = (explosionVel * Math.random()) * 1200;
					if(Math.round(Math.random() * 1)) vel_x = -vel_x;
					if(Math.round(Math.random() * 1)) vel_y = -vel_y;

					if(followvelocity){
						vel_x += entity.Velocity.X;
						vel_y += entity.Velocity.Y;
					}
					
					particle = stage.explosionEmitter.emit(new pyro.Vector(posx, posy), new pyro.Vector(vel_x * (rndScale * 2), vel_y * (rndScale * 2)));
					particle.polygons[0].fill = color || rndPoly.fill.clone();
					particle.setScale(new pyro.Vector(rndScale, rndScale));
					
					
					//newEntity.scale()
					//newEntity.decay(7, true).Polygons[0].FillStyle = (color)?color:rndPoly.FillStyle;
					
					//newEntity.Type = "Particle";
				}
			}	

			stage.audio.play({id: "poof", location: entity.position});
		},
		playerIdle: function(){
			var stage = pyro.getStage("Stage Select");
			stage.player.logic.memory.RAM.substate = "Idle";
		},
		playerDance: function(){
			var stage = pyro.getStage("Stage Select");
			stage.player.logic.memory.RAM.substate = "Dance";
		},
		startSequence: function(reference){
			var stage = pyro.getStage("Stage Select");
			stage.getReference(reference).start();
		},
		transformPrim: function(model){
			var stage = pyro.getStage("Stage Select");
			var stageGameplay = pyro.getStage("Gameplay");
			var playerLayer = stage.getObjectsLayer(stage.player);
			
			//copy memory
			var position = stage.player.position.clone();
				position.orientation = 0;
				position.originalOrientation = 0;

			var memory = stage.player.logic.memory;
			var velocity = stage.player.bodies[0].getLinearVelocity();
			
			playerLayer.remove(stage.player);
			
			if(model == "model_prim"){
				stage.player = playerLayer.addEntity(model, position, { //this.spawnLocations[0]
					entityClass: "Prim",
					scale: stageGameplay.memory.ROM.primScale,
					gravityScale: stageGameplay.memory.ROM.primWeight,
					fixedRotation: true
				});
                pyro.getStage("Gameplay").audio.play({id: "puffup", location: position});
			}
			
			if(model == "model_prim_ball"){
				stage.player = playerLayer.addEntity(model, position, { //this.spawnLocations[0]
					entityClass: "Prim",
					scale: stageGameplay.memory.ROM.primBallScale,
					gravityScale: stageGameplay.memory.ROM.primBallWeight,
					fixedRotation: false
				});
                pyro.getStage("Gameplay").audio.play({id: "puffdown", location: position});
			}

			stage.player.logic.memory = memory;
			stage.player.bodies[0].setLinearVelocity(velocity);
			stage.player.flip(stage.player.bodies[0].getLinearVelocity().matrix[0] < 0);
			stage.camera.follow(stage.player);
			
			stage.callAction("explode", stage.player, new pyro.Color(215,215,215,0.5), 5, "Circle", 4);
		},
		dialog: function(text, trigger){
			pyro.getStage("Gameplay Dialog").callAction("openDialog", text, trigger.position);
		},
		closeDialog: function(trigger){
			pyro.getStage("Gameplay Dialog").callAction("closeDialog");
		},
		hideLayers: function(layers){
			var stage = pyro.getStage("Gameplay");

			layers = layers.split(",");
			for(var l in layers){
				stage.layers[layers[l]].alpha = 0;
			}
		},
		showLayers: function(layers, bgColor){
			var stage = pyro.getStage("Gameplay");

			layers = layers.split(",");
			for(var l in layers){
				stage.layers[layers[l]].alpha = 1;
			}
            
            if(bgColor) stage.backgroundColor = bgColor;
		},

		wakeEntities: function(className){
			var stage = pyro.getStage("Gameplay");
			
			var entities = stage.getObjectsByClass(className);
			for(var e in entities){
				entities[e].bodies[0].b2Body.SetGravityScale(1);
				entities[e].bodies[0].b2Body.SetAwake(true);
			}
		},
        
        activateEmitters: function(className){
           var stage = pyro.getStage("Gameplay");
    		
			var emitters = stage.getObjectsByClass(className);
			for(var e in emitters){
				emitters[e].emit();
			} 
        },
        
        enableMotors: function(className, val){
           var stage = pyro.getStage("Gameplay");
        	
			var joints = stage.getObjectsByClass(className);
			for(var j in joints){
				joints[j].enableMotor(val); // true if undefined
			} 
        },
        changeWorld: function(worldIndex){
			var stage = pyro.getStage("Stage Select");
        	
        	stage.memory.RAM.selectedWorldIndex = worldIndex;
            
            switch(worldIndex){
                case 0:
                    stage.backgroundColor = "#afebf7";
                    break
                case 1:
                    stage.backgroundColor = "#EDDA74";
                    break;
            }
        },
        setAlpha: function(val){
            pyro.getStage("Stage Select").alpha = val;
        }
	},
	sequences: {
		'Dance': [
			["actions.playerIdle", null, 240],
			["actions.playerDance", null, 240]
		]
	}
});