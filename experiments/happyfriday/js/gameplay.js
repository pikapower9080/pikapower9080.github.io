pyro.createStage({
	id: "Gameplay",
	viewport: "main",
	camera: "main",
	enabled: false,
	paused: true,
	alpha: 0,
	onCreate: function(){
		this.camera.primaryStage = this;
		
		this.memory = new pyro.Memory("Game", {
			RAM: {
				timePlayed: 0, //20(M) * 60(S) * 30(CPS)
				donutsCollected: 0,
				goldenDonutsCollected: [false, false, false],
				donutsTotal: 0,
				baddiesTotal: 0,
				//livesCollected: 0,
				checkpoint: -1
			},
			ROM: {
				primScale: [0.25, 0.25],
				primWeight: 2.9,
				primBallScale: [0.33, 0.33],
				primBallWeight: 2.4,
				butterflyScale: [0.10, 0.10],
				butterflyWeight: 1, //2.9
				stageTimerLength: 100
			},
			HDD: {
				livesLeft: 3,
				stagesComplete: [],
				totalGoldenDonutsCollected: [],
				totalDonutsCollected: 0,
				totalNumberOfJumps: 0,
				totalGameplayTime: 0,
                totalScore: 0,
                worldsUnlocked: [],
                donated: 0,
                dateInstalled: new Date()
			}
		});

		this.checkpointMemory = new pyro.Memory("Game checkpoint", {
			RAM: {
				spawn: 0
			}
		})

		this.input.bind({
			alias: "Pause",
			keys: {	firstDown: 27 },
            gamepad: {
                firstDown: [9],
            },
			callback: function(stage, events){
				if(stage.player.logic.memory.RAM.health <= 0) return;
                pyro.getStage("Paused").resume();
				stage.pause();
				return;
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
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				stage.player.callAction("walk", (events[0].axes)?events[0].axes[0]:-1);
                return;
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
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				stage.player.callAction("walk", (events[0].axes)?events[0].axes[0]:1);
                return;
			}
		});	
		
		this.input.bind({
			alias: "Jump Hold",
			keys: { down: [87,38] },
			mouse: {
				down: [0,1],
				area: [0,0,1000,100]
			},
            gamepad: {
                down: [0]  
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				if(!stage.input.keyFirstDown[87] && !stage.input.keyFirstDown[38])
				stage.player.callAction("jump_hold", 1);
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
                firstDown: [0]  
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				stage.player.callAction("jump_initial", 1);
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
                firstDown: [2]  
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				if(stage.player.modelName == "model_prim"){
					stage.actions.transformPrim("model_prim_ball");
				}else{
					stage.actions.transformPrim("model_prim");
				}
			}
		});

		this.input.bind({
			alias: "Debug Text",
			keys: {	firstDown: [118] },
			callback: function(stage, events){
				pyro.getStage("Gameplay UI").memory.RAM.displayDebugText = !pyro.getStage("Gameplay UI").memory.RAM.displayDebugText;
			}
		});

		this.input.bind({
			alias: "Debug Draw",
			keys: {	firstDown: [120] },
			callback: function(stage, events){
				stage.layers[stage.memory.spawnPoint.layer].physicsDebugDraw = !stage.layers[stage.memory.spawnPoint.layer].physicsDebugDraw;
			}
		});
		
		this.input.bind({
			alias: "Debug Culling",
			keys: {	firstDown: [119] },
			callback: function(stage, events){
				pyro.getViewport("main").culling = !pyro.getViewport("main").culling;
			}
		});

		this.audio.cacheAudio({id: "pop", url: "audio/sfx/pop.ogg", defaultGain: 0.5});
		this.audio.cacheAudio({id: "box_fall", url: "audio/sfx/box_fall.ogg"});
		this.audio.cacheAudio({id: "crunch", url: "audio/sfx/crunch.ogg"});
		this.audio.cacheAudio({id: "donut", url: "audio/sfx/donut.ogg"});
		this.audio.cacheAudio({id: "jump", url: "audio/sfx/jump.ogg"});
		this.audio.cacheAudio({id: "landed", url: "audio/sfx/landed.ogg"});
		this.audio.cacheAudio({id: "poof", url: "audio/sfx/poof.ogg"});
		this.audio.cacheAudio({id: "primpop", url: "audio/sfx/primpop.ogg", defaultGain: 0.5});
		this.audio.cacheAudio({id: "puffdown", url: "audio/sfx/puffdown.ogg", defaultGain: 0.5});
		this.audio.cacheAudio({id: "puffup", url: "audio/sfx/puffup.ogg"});
		this.audio.cacheAudio({id: "select", url: "audio/sfx/select.ogg", defaultGain: 0.75});
		this.audio.cacheAudio({id: "select2", url: "audio/sfx/select2.ogg"});
		this.audio.cacheAudio({id: "selectPick", url: "audio/sfx/selectPick.ogg"});
		this.audio.cacheAudio({id: "sheep", url: "audio/sfx/sheep.ogg", defaultGain: 0.1});
		this.audio.cacheAudio({id: "sizzle", url: "audio/sfx/sizzle.ogg"});
		this.audio.cacheAudio({id: "thud", url: "audio/sfx/thud.ogg"});
		this.audio.cacheAudio({id: "trampoline", url: "audio/sfx/trampoline.ogg"});
		this.audio.cacheAudio({id: "wallhit", url: "audio/sfx/wallhit.ogg"});
		this.audio.cacheAudio({id: "checkpoint", url: "audio/sfx/checkpoint.ogg"});
		this.audio.cacheAudio({id: "goldendonut", url: "audio/sfx/goldendonut.ogg"});
		this.audio.cacheAudio({id: "1up", url: "audio/sfx/1up.ogg"});
		this.audio.cacheAudio({id: "primkilled", url: "audio/sfx/primkilled.ogg", defaultGain: 1.5});
		this.audio.cacheAudio({id: "health", url: "audio/sfx/health.ogg"});
		
		this.particlePool = [];
		this.particlePoolIndex = 0;
		
        //Explosion particles
		var newEntity = new pyro.Entity();
        newEntity.entityClass = "Explode Particle";
		var newPolygon = new pyro.Polygon(null, new pyro.Color(230,230,230,1));
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
    	
        //Smoke particles
		var newEntity = new pyro.Entity();
        newEntity.entityClass = "Smoke Particle";
        newEntity.polygons.push(newPolygon);
    	
		var shape = new pyro.Shape({radius: 10, gravityScale: 0, position: new pyro.Vertex(0,0), material: new pyro.Material({filter: new pyro.Filter(0x80, 0x8)})});
		var body = new pyro.Body();
		body.shapes.push(shape);
		
		newEntity.bodies.push(body);
		body.bind("position");
        
		this.smokeParticle = newEntity;
	},
	onReady: function(){
		this.alpha = 1;
		this.camera.primaryStage = this;

		//Load stage
		//this.actions.startLevel(pyro.getStage("Stage Select").memory.RAM.selectedStage);
    	if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").start();
		if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").start();
    	if(pyro.getStage("Paused")) pyro.getStage("Paused").start();
    	if(pyro.getStage("Paused")) pyro.getStage("Paused").pause();
        if(pyro.getStage("Game Over")) pyro.getStage("Game Over").start();
    	if(pyro.getStage("Game Over")) pyro.getStage("Game Over").pause();
	},
	onStop: function(){
		this.alpha = 0;
        if(this.backgroundMusic) this.backgroundMusic.stop();
        if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").stop();
    	if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").stop();
        if(pyro.getStage("Paused")) pyro.getStage("Paused").stop();
	},
	onPause: function(){
		if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").pause();
		if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").pause();
	},
	onResume: function(){
    	//this.alpha = 1;
		pyro.getStage("Gameplay Dialog").resume();
		pyro.getStage("Gameplay UI").resume();
        pyro.getStage("Paused").pause();
	},
	onUpdate: function(){
		this.memory.RAM.timePlayed++;

		//this.camera.position.set(this.player.position);

		if(this.player.position.matrix[1] > this.height) this.player.logic.memory.RAM.health = 0;
		
		if(this.player.logic.memory.RAM.health <= 0){
            if(this.getObjectsLayer(this.player)){
                this.callAction("explode", this.player);
    			this.sequences.gameover.start();
            }

			return;
		}
	},
	actions: {
		reset: function(){
			var stage = pyro.getStage("Gameplay");
			//Reset values
			//stage.memory.reset();
		},
		wait: function(){
			//Take a nap
		},
        blank: function(){
            if(typeof stage_transition != "undefined") stage_transition.alpha = 1;
        },
        fadeIn: function(){
            if(typeof stage_transition != "undefined") stage_transition.sequences.FadeOut.start();
            pyro.getStage("Gameplay").resume();
        },
        gameover: function(){
    		var stage = pyro.getStage("Gameplay");
            stage.memory.HDD.livesLeft--;
    		stage.memory.save();
			
			pyro.getStage("Game Over").resume();

			stage.pause();
        },
		retry: function(){
			var stage = pyro.getStage("Gameplay");
			//Reset values
			stage.memory.loadState();
			stage.callAction("startLevel", pyro.getStage("Stage Select").memory.RAM.selectedStage, true);
		},
		startLevel: function(map, isRetry, debug){
			var stage = pyro.getStage("Gameplay");
        	var stageSelect = pyro.getStage("Stage Select");
			map = map || stageSelect.memory.RAM.selectedStage;
    		
			stage.loadMap(map);
			
			if(!isRetry){
				this.memory.reset();	
				stage.memory.checkpoint = -1;
                if(stage.backgroundMusicFile){
                    stage.backgroundMusic = stage.audio.cacheAudio({url: "audio/music/" + this.backgroundMusicFile, isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: true});
                }
                stage.memory.load();
        	    stage.memory.RAM.goldenDonutsCollected[0] = stage.memory.HDD.totalGoldenDonutsCollected[stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3];
        	    stage.memory.RAM.goldenDonutsCollected[1] = stage.memory.HDD.totalGoldenDonutsCollected[(stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3) + 1];
                stage.memory.RAM.goldenDonutsCollected[2] = stage.memory.HDD.totalGoldenDonutsCollected[(stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3) + 2];
			
                stage.memory.RAM.donutsTotal = stage.getObjectsByClass("Coin").length;
        		this.memory.saveState();
			}else{
    			this.memory.loadState();
			}
			
			stage.memory.spawnPoint = stage.spawnPoints[0];
			
			spawnPointLayer = stage.spawnPoints[0].layer;
			spawnPointPosition = stage.spawnPoints[0].position.clone();
			if(debug) spawnPointPosition = stage.spawnPoints[stage.spawnPoints.length - 1].position.clone();
			
			if(stage.memory.checkpoint > -1 && isRetry){
				spawnPointPosition.set(stage.layers[stage.memory.spawnPoint.layer].getObjectsByClass("Checkpoint")[stage.memory.checkpoint].position);
			}
    		
			//Emitters
			this.explosionEmitter = stage.layers[stage.memory.spawnPoint.layer].addEmitter(stage.explosionParticle, [0,0], {max: 100, life: 15});
			this.smokeEmitter = stage.layers[stage.memory.spawnPoint.layer].addEmitter(stage.smokeParticle, [0,0], {max: 25, life: 10});

			//Reset player and add him to the stage
			stage.player = stage.layers[stage.memory.spawnPoint.layer].addEntity("model_prim", spawnPointPosition, { //this.spawnLocations[0]
				entityClass: "Prim",
				scale: stage.memory.ROM.primScale,
				gravityScale: stage.memory.ROM.primWeight,
				fixedRotation: true
			});
	
			stage.butterfly = stage.layers[stage.memory.spawnPoint.layer].addEntity("model_butterfly", spawnPointPosition, { //this.spawnLocations[0]
				entityClass: "Butterfly",
				scale: stage.memory.ROM.butterflyScale,
				gravityScale: stage.memory.ROM.butterflyWeight,
				fixedRotation: true
				//filter: 
			});
            stage.butterfly.setAnimation("Main", "flutterby butterfly", true);
			
			//Golden donuts
			var goldenDonuts = pyro.getStage("Gameplay").layers[stage.memory.spawnPoint.layer].getObjectsByModelName("Donut Golden");
			for(var i = 0; i < goldenDonuts.length; i++){
				goldenDonuts[i].tag = i;
				if(stage.memory.RAM.goldenDonutsCollected[i] == true){
					goldenDonuts[i].effects.HSL = [0,-100,10];
					goldenDonuts[i].alpha = 0.5;
				}
			}
			
			stage.camera.follow(stage.player);
			stage.camera.zoom = 0.49;
	
			stage.actions.reset();
            
            stage.sequences.Present.start();
            stage.pause();
            
            if(!isRetry){
				_gaq.push(['_trackEvent', 'Gameplay - Stage Start', map]);
			}else{
				_gaq.push(['_trackEvent', 'Gameplay - Stage Retry', map]);
			}
		},
		stageComplete: function(){
			var stageGameplay = pyro.getStage("Gameplay");
			var stageComplete = pyro.getStage("Stage Complete");
    		var stageSelect = pyro.getStage("Stage Select");
            
            stageGameplay.memory.HDD.totalGoldenDonutsCollected[stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3] = stageGameplay.memory.RAM.goldenDonutsCollected[0];
			stageGameplay.memory.HDD.totalGoldenDonutsCollected[(stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3) + 1] = stageGameplay.memory.RAM.goldenDonutsCollected[1];
            stageGameplay.memory.HDD.totalGoldenDonutsCollected[(stageSelect.memory.ROM.stages.indexOf(stageSelect.memory.RAM.selectedStage) * 3) + 2] = stageGameplay.memory.RAM.goldenDonutsCollected[2];
            
            stageGameplay.memory.HDD.stagesComplete[stageSelect.memory.RAM.selectedStageIndex] = true;
            
			stageGameplay.memory.save();
			//Make invincible, pause, etc?
			stageComplete.resume();
            if(stageGameplay.backgroundMusic) stageGameplay.backgroundMusic.stop();
            stage.backgroundMusic = stage.audio.cacheAudio({url: "audio/music/stage_complete.ogg", isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: false});
            
			_gaq.push(['_trackEvent', 'Gameplay - Stage Complete', stageSelect.memory.RAM.selectedStage]);
		},
		explode: function(entity, color, volume, particle, scale, explosionVel, followvelocity, relativePosition, dontPop){			
			stage = pyro.getStage("Gameplay");
			
			if(typeof entity === "string"){
				var entities = stage.getObjectsByClass(entity);
				for(var i = 0; i < entities.length; i++){
					stage.callAction("explode", entities[i], color, volume, particle, scale, explosionVel, followvelocity, relativePosition);
				}
				return;
			}
			
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

			if(!dontPop) stage.audio.play({id: "poof", location: entity.position});
            //pyro.getCamera("main").shake(4, 20, "Static");
            stage.getObjectsLayer(entity).remove(entity);
		},
		playerIdle: function(){
			var stage = pyro.getStage("Gameplay");
			stage.player.logic.memory.RAM.substate = "Idle";
		},
		playerDance: function(){
			var stage = pyro.getStage("Gameplay");
			stage.player.logic.memory.RAM.substate = "Dance";
		},
		startSequence: function(reference){
			var stage = pyro.getStage("Gameplay");
			stage.getReference(reference).start();
		},
		transformPrim: function(model){
			var stage = pyro.getStage("Gameplay");
			
			//copy memory
			var position = stage.player.position.clone();
				position.orientation = 0;
				position.originalOrientation = 0;

			var memory = stage.player.logic.memory;
			var velocity = stage.player.bodies[0].getLinearVelocity();
			                            //entity,     color,                     volume, particle, scale, explosionVel, followvelocity, relativePosition, dontPop
            stage.callAction("explode", stage.player, new pyro.Color(215,215,215,0.5), 5, "Circle", 4, undefined, undefined, undefined, true);
			
			if(model == "model_prim"){
				stage.player = stage.layers[stage.memory.spawnPoint.layer].addEntity(model, position, { //this.spawnLocations[0]
					entityClass: "Prim",
					scale: stage.memory.ROM.primScale,
					gravityScale: stage.memory.ROM.primWeight,
					fixedRotation: true
				});
                pyro.getStage("Gameplay").audio.play({id: "puffdown", location: position});
			}
			
			if(model == "model_prim_ball"){
				stage.player = stage.layers[stage.memory.spawnPoint.layer].addEntity(model, position, { //this.spawnLocations[0]
					entityClass: "Prim",
					scale: stage.memory.ROM.primBallScale,
					gravityScale: stage.memory.ROM.primBallWeight,
					fixedRotation: false
				});
                pyro.getStage("Gameplay").audio.play({id: "puffup", location: position});
			}

			stage.player.logic.memory = memory;
			stage.player.bodies[0].setLinearVelocity(velocity);
			stage.player.flip(stage.player.bodies[0].getLinearVelocity().matrix[0] < 0);
			stage.camera.follow(stage.player);
			
			
		},
        setAlpha: function(val){
            pyro.getStage("Gameplay").alpha = val;
            pyro.getStage("Gameplay UI").alpha = val;
            pyro.getStage("Gameplay Dialog").alpha = val;
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
        setDurability: function(className, val){
            var stage = pyro.getStage("Gameplay");
            var objects = stage.getObjectsByClass(className);
            
            for(var o in objects){
                objects[o].logic.memory.RAM.durability = val;
            }
        }
	},
	sequences: {
        'Present': [
    		["actions.blank", null, 0],
        	["actions.wait", null, 10],
			["actions.fadeIn", null, 0]
        ],
        'gameover': [
    		["actions.wait", null, 30],
			["actions.gameover", null, 0]
        ],
		'Dance': [
			["actions.playerIdle", null, 240],
			["actions.playerDance", null, 240]
		],
        'bossBattle_gr_1': [
            ['actions.activateEmitters', "Boss Battle", 1]
        ]
	}
});