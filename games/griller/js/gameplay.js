stage_gameplay = pyro.createStage({
	id: "Gameplay",
	viewport: "main",
	camera: "main",
	enabled: false,
	paused: true,
	alpha: 0,
	hasAudio: true,
	onCreate: function(){
		this.camera.primaryStage = this;
		
		this.memory = new pyro.Memory("Game", {
			RAM: {
                multiplayerState: "", 
				timePlayed: 0, //20(M) * 60(S) * 30(CPS)
				baddiesDefeated: 0,
                totalScore: 0,
                hasMoved: false,
                hasFired: false,
                comboTimer: 0,
                currentCombo: 0,
                highestCombo: 0,
                crosshair: null
			},
			ROM: {
				hamburgerWeight: 0,
    			hamburgerScale: [0.35, 0.35],
                projectileScale: [0.35, 0.35],
                projectileScaleBig: [0.55, 0.55],
                comboTime: 25
			},
			HDD: {
				totalBaddiesDefeated: 0,
                highScore: 0,
                bestBaddyCount: 0,
                highestCombo: 0,
                bestTime: 0,
                onlineRanking: [[]]
			}
		});

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
            gamepad: {
                down: [14],
                axes: [-0.15] 
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				stage.player.callAction("walk", [(events[0].axes)?events[0].axes[0]:-1, 0]);
                stage.memory.RAM.hasMoved = true;
                //return;
			}
		});	
		
		//Just keys
		this.input.bind({
			alias: "MoveRight",
			keys: { down: [68,39] },
            gamepad: {
                down: [15],
                axes: [0.15]
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
				stage.player.callAction("walk", [(events[0].axes)?events[0].axes[0]:1, 0]);
                stage.memory.RAM.hasMoved = true;
                //return;
			}
		});	
		
		this.input.bind({
			alias: "MoveUp",
			keys: { down: [87,38] },
            gamepad: {
                axes: [0, 0.15] 
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
    			stage.player.callAction("walk", [0, (events[0].axes)?events[0].axes[1]:-1]);
                stage.memory.RAM.hasMoved = true;
			}
		});	
		
		this.input.bind({
			alias: "MoveDown",
			keys: {	down: [83,40] },
            gamepad: {
                axes: [0, -0.15]
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
    			stage.player.callAction("walk", [0, (events[0].axes)?events[0].axes[1]:1]);
                stage.memory.RAM.hasMoved = true;
                //stage.sequences.BaconTime.start();
			}
		});
        
		this.input.bind({
			alias: "Fire",
			mouse: {
				firstDown: [0,1]
			},
            gamepad: {
                firstDown: [0,1,2,3,4,5,6,7]  
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0) return;
    			stage.player.callAction("fire", [events[0].mouseX, events[0].mouseY]);
                stage.memory.RAM.hasFired = true;
			}
		});
        
        this.input.bind({
    		alias: "Auto-Fire",
			mouse: {
				down: [0,1]
			},
            gamepad: {
                down: [0,1,2,3,4,5,6,7]  
            },
			callback: function(stage, events){
    			if(stage.player.logic.memory.RAM.health <= 0 || !stage.player.logic.memory.RAM.powerupKetchup) return;
    			stage.player.callAction("fire", [events[0].mouseX, events[0].mouseY]);
                stage.memory.RAM.hasFired = true;
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

		//this.audio.cacheAudio({id: "pop", url: "audio/sfx/pop.ogg"});
		//this.audio.cacheAudio({id: "box_fall", url: "audio/sfx/box_fall.ogg"});
//		this.audio.cacheAudio({id: "crunch", url: "audio/sfx/crunch.ogg"});
//		this.audio.cacheAudio({id: "donut", url: "audio/sfx/donut.ogg"});
//		this.audio.cacheAudio({id: "jump", url: "audio/sfx/jump.ogg"});
//		this.audio.cacheAudio({id: "landed", url: "audio/sfx/landed.ogg"});
		this.audio.cacheAudio({id: "poof", url: "audio/sfx/baddyexplode.wav", defaultGain: 0.2});
//		this.audio.cacheAudio({id: "primpop", url: "audio/sfx/primpop.ogg"});
//		this.audio.cacheAudio({id: "puffdown", url: "audio/sfx/puffdown.ogg"});
//		this.audio.cacheAudio({id: "puffup", url: "audio/sfx/puffup.ogg"});
		this.audio.cacheAudio({id: "select", url: "audio/sfx/select.ogg"});
		this.audio.cacheAudio({id: "select2", url: "audio/sfx/select2.ogg"});
		this.audio.cacheAudio({id: "selectPick", url: "audio/sfx/selectPick.ogg"});
//		this.audio.cacheAudio({id: "sheep", url: "audio/sfx/sheep.ogg", defaultGain: 0.1});
//		this.audio.cacheAudio({id: "sizzle", url: "audio/sfx/sizzle.ogg"});
//		this.audio.cacheAudio({id: "thud", url: "audio/sfx/thud.ogg"});
//		this.audio.cacheAudio({id: "trampoline", url: "audio/sfx/trampoline.ogg"});
//		this.audio.cacheAudio({id: "wallhit", url: "audio/sfx/wallhit.ogg"});
//		this.audio.cacheAudio({id: "checkpoint", url: "audio/sfx/checkpoint.ogg"});
//		this.audio.cacheAudio({id: "goldendonut", url: "audio/sfx/goldendonut.ogg"});
//		this.audio.cacheAudio({id: "1up", url: "audio/sfx/1up.ogg"});
//		this.audio.cacheAudio({id: "primkilled", url: "audio/sfx/primkilled.ogg"});
//		this.audio.cacheAudio({id: "health", url: "audio/sfx/health.ogg"});
    	this.audio.cacheAudio({id: "fireball", url: "audio/sfx/fireball.wav", defaultGain: 0.25});
        this.audio.cacheAudio({id: "step1", url: "audio/sfx/step.wav", defaultGain: 0.25});
        this.audio.cacheAudio({id: "step2", url: "audio/sfx/step2.wav", defaultGain: 0.25});
    	
        //this.audio.cacheAudio({id: "music_stage", url: "audio/music/stage.mp3", isMusic: true, defaultGain: 0.4});
        
        this.backgroundMusic = this.audio.cacheAudio({url: "audio/music/stage.ogg", isMusic: true, defaultGain: 0.45, loop: true});
		
		this.particlePool = [];
		this.particlePoolIndex = 0;
		
        //Explosion particles
		var newEntity = new pyro.Entity();
        newEntity.entityClass = "Explode Particle";
		var newPolygon = new pyro.Polygon(null, new pyro.Color(230,230,230,1));
		newPolygon.lineWidth = 0;
		
		newPolygon.addArc([0,0], [7.5,0,0,0], [0,0,0,Math.PI * 2]);
		newPolygon.closePath = true;
		newPolygon.alpha = 0.75;
		
		newEntity.polygons.push(newPolygon);
		
		var shape = new pyro.Shape({radius: 7.5, material: new pyro.Material({filter: new pyro.Filter(0x00, 0x0)})});
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
        
        this.projectile = new pyro.Entity();
        this.projectile.load("Fire Ball", {scale: this.memory.ROM.projectileScale, fixedRotation: true, entityClass: "Fire Ball", filter: 0x02});
        
        this.projectileBig = new pyro.Entity();
        this.projectileBig.load("Fire Ball", {scale: this.memory.ROM.projectileScaleBig, fixedRotation: true, entityClass: "Fire Ball", filter: 0x02}); 
        
        this.steak = new pyro.Entity();
        this.steak.load("T-Bone", {scale: [0.45, 0.45], fixedRotation: true, entityClass: "T-Bone"});
        this.steak.bodies[0].setLinearDamping(6);
	},
	onReady: function(){
		this.alpha = 1;
		this.camera.primaryStage = this;

		//Load stage
		this.actions.startLevel();
        if(this.backgroundMusic) this.backgroundMusic.play();
        
        //this.callAction('initMultiplayer');
        
    	if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").start();
		if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").start();
    	if(pyro.getStage("Paused")) pyro.getStage("Paused").start();
    	if(pyro.getStage("Paused")) pyro.getStage("Paused").pause();
	},
	onStop: function(){
		this.alpha = 0;
        if(this.backgroundMusic) this.backgroundMusic.stop();
        if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").stop();
    	if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").stop();
        if(pyro.getStage("Paused")) pyro.getStage("Paused").stop();
	},
	onPause: function(){
		//if(this.backgroundMusic) this.backgroundMusic.stop();
		if(pyro.getStage("Gameplay Dialog")) pyro.getStage("Gameplay Dialog").pause();
		if(pyro.getStage("Gameplay UI")) pyro.getStage("Gameplay UI").pause();
	},
	onResume: function(){
    	//this.alpha = 1;
		if(this.backgroundMusic) this.backgroundMusic.resume();
		pyro.getStage("Gameplay Dialog").resume();
		pyro.getStage("Gameplay UI").resume();
        pyro.getStage("Paused").pause();
	},
	onUpdate: function(dt){
		this.memory.RAM.timePlayed++; //= dt??
        this.player.logic.memory.RAM.fireTimer -= dt;
        
        if(this.memory.RAM.comboTimer > 0){
            this.memory.RAM.comboTimer--;
        }else{
            this.memory.RAM.currentCombo = 0;
        }
        
		//this.camera.position.set(this.player.position);
        if(this.memory.RAM.timePlayed == 90 && !this.memory.RAM.hasMoved) stage_gameplayUI.callAction("openHelp", "Press the arrow keys, or WADS to move.", true);
        if(this.memory.RAM.timePlayed >= 150 && this.memory.RAM.timePlayed <= 200 && !this.memory.RAM.hasFired)  stage_gameplayUI.callAction("openHelp", "Click or touch to fire.", true);
        
        
        //Reposition Emitter
        angle = Math.random() * (Math.PI * 2);
        px = Math.cos(angle) * 1200;
        py = Math.sin(angle) * 800;
        
        this.steakEmitter.position.set(px, py).add(pyro.getCamera("main").position);
        
        //Fire emitter
        stage_gameplay.steakEmitter.interval = Math.ceil(30 - (this.memory.RAM.timePlayed / 120));
        if(stage_gameplay.steakEmitter.interval < 7) stage_gameplay.steakEmitter.interval = 7;

        //Kill on exit ring
		if(this.player.position.matrix[0] < 0 || this.player.position.matrix[0] > this.width || this.player.position.matrix[1] < 0 || this.player.position.matrix[1] > this.height) this.player.logic.memory.RAM.health = 0;
		
		if(this.player.logic.memory.RAM.health <= 0){
            if(this.getObjectsLayer(this.player)){
                this.callAction("explode", this.player);
    			this.sequences.gameover.start();
            }

			return;
		}
        
        var entities = this.layers[0].entities;
        var drawables = this.layers[0].drawables;
        //Reorder entities
        var state = drawables.slice();
    	drawables.sort(function(a,b){
            if(!a || !b || a instanceof pyro.Entity == false || b instanceof pyro.Entity == false || Math.abs(a.position.matrix[1] - b.position.matrix[1]) <= 4) return state.indexOf(a) - state.indexOf(b);
            
            //if(a.position.matrix[1] == b.position.matrix[1]) return state.indexOf(a) - state.indexOf(b);
            return a.position.matrix[1] - b.position.matrix[1];
        });
        
        if(this.input.gamepadConnected  && (this.input.gamepadAxes[2] != 0 || this.input.gamepadAxes[3] != 0)){
            var angle = new pyro.Vector().angleBetween2d(new pyro.Vector(this.input.gamepadAxes[2], this.input.gamepadAxes[3]));
        }else{
	    	var angle = this.player.position.angleBetween2d(new pyro.Vector([this.input.mouseX, this.input.mouseY]));
        }
        stage_gameplay.memory.RAM.crosshair.lines[0].anchor1.orientation = angle - 0.2;
        stage_gameplay.memory.RAM.crosshair.lines[0].anchor2.orientation = angle + 0.2;
        
        this.callAction("sendState");
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
    	setSpeed: function(speed){
            stage_gameplay.speed = speed;
            console.log(stage_gameplay.speed);
        },
        blank: function(){
            if(typeof stage_transition != "undefined") stage_transition.alpha = 1;
        },
        fadeIn: function(){
            stage_transition.sequences.FadeOut.start();
            stage_gameplay.resume();
        },
        gameover: function(){
            stage_complete.callAction("calculateScore");
            
            if(stage_gameplay.memory.RAM.totalScore > stage_gameplay.memory.HDD.highScore) stage_gameplay.memory.HDD.highScore = stage_gameplay.memory.RAM.totalScore;
            if(stage_gameplay.memory.RAM.timePlayed > stage_gameplay.memory.HDD.bestTime) stage_gameplay.memory.HDD.bestTime = stage_gameplay.memory.RAM.timePlayed;
            if(stage_gameplay.memory.RAM.baddiesDefeated > stage_gameplay.memory.HDD.bestBaddyCount) stage_gameplay.memory.HDD.bestBaddyCount = stage_gameplay.memory.RAM.baddiesDefeated;
            if(stage_gameplay.memory.RAM.highestCombo > stage_gameplay.memory.HDD.highestCombo) stage_gameplay.memory.HDD.highestCombo = stage_gameplay.memory.RAM.highestCombo;
            
            if(gpg.authorized){
                gpg.submitScore(stage_gameplay.memory.HDD.highScore, gpg.leaderboards[0].id);
                gpg.submitScore(stage_gameplay.memory.HDD.bestTime * 30, gpg.leaderboards[1].id);
                gpg.submitScore(stage_gameplay.memory.HDD.bestBaddyCount, gpg.leaderboards[2].id);
                gpg.submitScore(stage_gameplay.memory.HDD.highestCombo, gpg.leaderboards[3].id);
            }
            
        	stage_gameplay.memory.save();
            
            stage_transition.sequences.FadeIn.start(false, function(){
        		stage_complete.resume();
    			stage_gameplay.stop();
                if(gpg.authorized){
//                    gpg.getAllTimeHighScore(gpg.leaderboards[0].id, function(newScore){
//                        stage_complete.onlineRank = newScore.items[0].socialRank.formattedRank;
//                    });
                }else{
                    stage_complete.onlineRank = "N/A";
                }
            });
        },
		startLevel: function(map, isRetry, debug){
			stage_gameplay.loadMap("Stage 1");
            stage_gameplay.layers[0].world.setGravity([0, 0]);
            //stage_gameplay.layers[1].world.setGravity([0, 0]);
			
			stage_gameplay.memory.reset();	
            if(stage_gameplay.backgroundMusicFile){
                stage_gameplay.backgroundMusic = stage_gameplay.audio.cacheAudio({url: "audio/music/" + this.backgroundMusicFile, isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: true});
            }

    		stage_gameplay.memory.saveState();
			
			stage_gameplay.memory.spawnPoint = stage_gameplay.spawnPoints[0];
			
			spawnPointLayer = stage_gameplay.spawnPoints[0].layer;
			spawnPointPosition = stage_gameplay.spawnPoints[0].position.clone();
			
			//Emitters
			stage_gameplay.explosionEmitter = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEmitter(stage_gameplay.explosionParticle, [0,0], {max: 100, life: 15});
			stage_gameplay.smokeEmitter = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEmitter(stage_gameplay.smokeParticle, [0,0], {max: 25, life: 10});
            stage_gameplay.steakEmitter = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEmitter(stage_gameplay.steak, [0,0], {max: 150});
            stage_gameplay.fireballEmitter = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEmitter(stage_gameplay.projectile, [0,0], {max: 50, life: 300});
            stage_gameplay.fireballEmitterBig = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEmitter(stage_gameplay.projectileBig, [0,0], {max: 50, life: 300});

			//Reset player and add him to the stage
			stage_gameplay.player = stage_gameplay.layers[stage_gameplay.memory.spawnPoint.layer].addEntity("Hamburger Character", spawnPointPosition, { //this.spawnLocations[0]
				entityClass: "Hamburger",
				scale: stage_gameplay.memory.ROM.hamburgerScale,
				fixedRotation: true
			});
            stage_gameplay.player.bodies[0].setLinearDamping(6);
            //TODO Should be done in sketchpad?
            stage_gameplay.player.setAnimation("Idle", "idle", true);
            stage_gameplay.player.setAnimation("Run", "run", true);
            stage_gameplay.player.setAnimation("Shoot", "shoot", false);
			
			stage_gameplay.camera.follow(stage_gameplay.player);
			stage_gameplay.camera.zoom = 1;
	
			stage_gameplay.actions.reset();
            
            stage_gameplay.sequences.Present.start();
            //stage_gameplay.pause();
            
            stage_gameplay.steakEmitter.interval = 30;
            
            //Indicator
            var polygon = new pyro.Polygon();
	        polygon.addArc([0,0], [60,0,0,-0.3], [0,0,0,0.3]);
	        polygon.closePath = false;
	        polygon.fill = "";
	        polygon.stroke = "rgba(255,255,255,0.1)";
	        polygon.lineWidth = 15;
	        //polygon.static = true;
		    polygon.box.set(-(50 * 4), -(50 * 4), (50 * 4), (50 * 4));
		    
		    stage_gameplay.memory.RAM.crosshair = polygon;
			
			polygon.lines[0].point = stage_gameplay.player.position
		    
			stage_gameplay.layers[0].addDrawable(polygon);
            
			_gaq.push(['_trackEvent', 'Gameplay - Stage Start', map]);
		},
		stageComplete: function(){
			var stageGameplay = pyro.getStage("Gameplay");
			var stageComplete = pyro.getStage("Stage Complete");
    		var stageSelect = pyro.getStage("Stage Select");
            
			stageGameplay.memory.save();
			//Make invincible, pause, etc?
			stageComplete.resume();
            if(stageGameplay.backgroundMusic) stageGameplay.backgroundMusic.stop();
            stage.backgroundMusic = stage.audio.cacheAudio({url: "audio/music/stage_complete.ogg", isMusic: true, playOnComplete: true, defaultGain: 0.15, loop: false});
            
			_gaq.push(['_trackEvent', 'Gameplay - Stage Complete', stageSelect.memory.RAM.selectedStage]);
		},
		explode: function(entity, color, volume, particle, scale, explosionVel, followvelocity, relativePosition){			
			stage = pyro.getStage("Gameplay");
			
			if(typeof entity === "string"){
				var entities = stage.getObjectsByClass(entity);
				for(var i = 0; i < entities.length; i++){
					stage.callAction("explode", entities[i], color, volume, particle, scale, explosionVel, followvelocity, relativePosition);
				}
				return;
			}
			
			explosionVel = explosionVel || 1;
			volume = volume || 15;
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
					
					vel_x = (explosionVel * Math.random()) * 200;
					vel_y = (explosionVel * Math.random()) * 200;
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
            
            pyro.getCamera("main").shake(2, 10, "Static");

			stage.audio.play({id: "poof", location: entity.position});
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
		dialog: function(text, trigger){
			pyro.getStage("Gameplay Dialog").callAction("openDialog", text, trigger.position);
		},
		closeDialog: function(trigger){
			pyro.getStage("Gameplay Dialog").callAction("closeDialog");
		},
        enablePowerup: function(powerup){
            switch(powerup){
                case 'Bacon':
                    stage_gameplay.player.logic.memory.RAM.powerupBacon = true;
                    break;
                case 'BBQ':
                    stage_gameplay.player.logic.memory.RAM.powerupBBQ = true;
                    break;
                case 'Ketchup':
                    stage_gameplay.player.logic.memory.RAM.powerupKetchup = true;
                    break;
                case 'Mustard':
                    stage_gameplay.player.logic.memory.RAM.powerupMustard = true;
                    break;
            }
        },
        disablePowerup: function(powerup){
            switch(powerup){
                case 'Bacon':
                    stage_gameplay.player.logic.memory.RAM.powerupBacon = false;
                    break;
                case 'BBQ':
                    stage_gameplay.player.logic.memory.RAM.powerupBBQ = false;
                    break;
                case 'Ketchup':
                    stage_gameplay.player.logic.memory.RAM.powerupKetchup = false;
                    break;
                case 'Mustard':
                    stage_gameplay.player.logic.memory.RAM.powerupMustard = false;
                    break;
            }
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
        },
        readState: function(peerid, state){
            gameplayLayer = stage_gameplay.layers[0];
            
            //If state contains fireballs, update fireballs
            if(state.entities){
                //If fireball doesn't exist (check for ID), add it
                for(i in state.entities){
                    entity = state.entities[i];
                    obj = gameplayLayer.getObjectByID(peerid + ":" + entity.id); 
                    if(obj){
                        obj.setPosition(entity.x, entity.y);
                        obj.setLinearVelocity(entity.vx, entity.vy);
                    }else{
                        var m = gameplayLayer.addEntity(entity.m, new pyro.Vertex(entity.x, entity.y), {id: peerid + ":" + entity.id, entityClass: entity.c,  scale: new pyro.Vector(entity.sx, entity.sy), linearVelocity: new pyro.Vector(entity.vx, entity.vy)});
                        if(entity.c == "Hamburger"){
                            m.bodies[0].setLinearDamping(6);
                            //TODO Should be done in sketchpad?
                            m.setAnimation("Idle", "idle", true);
                            m.setAnimation("Run", "run", true);
                            m.setAnimation("Shoot", "shoot", false);
                        }
                    }
                }
            }
            
            return;
            
            //If state contains player, update second player
            if(state.player){
                //If player doesn't exist (check for ID), add them
                stage_gameplay.player.setPosition(state.player.x, state.player.y);
                stage_gameplay.player.setLinearVelocity(state.player.vx, state.player.vy);
            }
            
            //If state contains fireballs, update fireballs
            if(state.fireballs){
                //If fireball doesn't exist (check for ID), add it
                for(i in state.fireballs){
                    fireball = fireballs[i];
                    obj = gameplayLayer.getObjectByID(peerid + ":" + fireball.id); 
                    if(obj){
                        obj.setPosition(fireball.x, fireball.y);
                        obj.setLinearVelocity(fireball.vx, fireball.vy);
                    }else{
                        //obj.setPosition(state.fireball.x, state.fireball.y);
                        gameplayLayer.addEntity("Fireball", fireball.x, fireball.y, {id: peerid + ":" + fireball.id, linearVelocity: new pyro.Vector(fireball.vx, fireball.vy)});
                    }
                }
            }
            
            
            //If state contains baddies, update baddies
            if(state.baddies){
                //If baddy doesn't exist (check for ID), add it
                for(i in state.baddies){
                    baddy = baddies[i];
                    obj = gameplayLayer.getObjectByID(peerid + ":" + baddy.id); 
                    if(obj){
                        obj.setPosition(baddy.x, baddy.y);
                        obj.setLinearVelocity(baddy.vx, baddy.vy);
                    }else{
                        //obj.setPosition(state.fireball.x, state.fireball.y);
                        gameplayLayer.addEntity("T-Bone", baddy.x, baddy.y, {id: peerid + ":" + baddy.id, linearVelocity: new pyro.Vector(baddy.vx, baddy.vy)});
                        
                    }
                }
            }
        },
        sendState: function(){
            var state = {};
            
            var entities = stage_gameplay.layers[0].entities.filter(function(item, index){
                if(!item) return false;
                return ("" + item.id).indexOf(":") == -1;
            })
            
            state.entities = [];
            for(var i = 0; i < entities.length; i++){
                var entity = entities[i];
                if(entity.bodies[0].getLinearVelocity()){
                    state.entities.push({
                        id: entity.id,
                        c : entity.entityClass,
                        m : entity.modelName,
                        x: entity.position.matrix[0],
                        y: entity.position.matrix[1],
                        sx: entity.scale.matrix[0],
                        sy: entity.scale.matrix[1],
                        vx: entity.bodies[0].getLinearVelocity().x,
                        vy: entity.bodies[0].getLinearVelocity().y
                    });
                }
            };
            
            
            pyro.peer.sendData(state);
            return state;
            //Add player state
            state.player = {
                id: stage_gameplay.player.id, //?????
                x: stage_gameplay.player.position.matrix[0],
                y: stage_gameplay.player.position.matrix[1],
                vx: stage_gameplay.player.bodies[0].getLinearVelocity().matrix[0],
                vy: stage_gameplay.player.bodies[0].getLinearVelocity().matrix[1]
            }
            
            //Send fireballs
            var fireballs = stage_gameplay.layers[0].getObjectsByClass("Fire Ball");
            state.fireballs = [];
            for(i in fireballs){
                state.fireballs.push({
                    id: fireballs[i].id, //?????
                    x: fireballs[i].position.matrix[0],
                    y: fireballs[i].position.matrix[1],
                    vx: fireballs[i].bodies[0].getLinearVelocity().matrix[0],
                    vy: fireballs[i].bodies[0].getLinearVelocity().matrix[1]
                })
            }
            
            //If host, send baddies
            if(stage_gameplay.memory.RAM.multiplayerState == "Host"){
                var baddies = stage_gameplay.layers[0].getObjectsByClass("T-Bone");
                state.baddies = [];
                for(i in baddies){
                    state.baddies.push({
                        id: baddies[i].id, //?????
                        x: baddies[i].position.matrix[0],
                        y: baddies[i].position.matrix[1],
                        vx: baddies[i].bodies[0].getLinearVelocity().matrix[0],
                        vy: baddies[i].bodies[0].getLinearVelocity().matrix[1]
                    })
                }
            }
        },
        initMultiplayer: function() {
            pyro.peer.open({
                onOpen: function(peerid){
                    if(window.location.hash){
                        pyro.peer.connect(window.location.hash.replace('#',''));
                    }else{
                        window.location.hash = peerid;
                    }
                },
                onReceiveData: function(peerid, data){
                    stage_gameplay.callAction("readState", peerid, data.data);
                }
            
            })
            return true;
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
    	'BBQTime': [
    		["actions.enablePowerup", ["BBQ"], 1],
			["actions.wait", null, 240],
			["actions.disablePowerup", ["BBQ"], 1]
		],
        'KetchupTime': [
        	["actions.enablePowerup", ["Ketchup"], 1],
			["actions.wait", null, 240],
			["actions.disablePowerup", ["Ketchup"], 1]
		],
        'MustardTime': [
        	["actions.enablePowerup", ["Mustard"], 1],
			["actions.wait", null, 240],
			["actions.disablePowerup", ["Mustard"], 1]
		],
        'BaconTime': [
        	["actions.enablePowerup", ["Bacon"], 1],
    		/*["actions.setSpeed", [0.9], 1],
        	["actions.setSpeed", [0.8], 1],
        	["actions.setSpeed", [0.7], 1],
        	["actions.setSpeed", [0.6], 1],
        	["actions.setSpeed", [0.5], 1],*/
			["actions.wait", null, 240],
        	/*["actions.setSpeed", [0.6], 1],
        	["actions.setSpeed", [0.7], 1],
        	["actions.setSpeed", [0.8], 1],
        	["actions.setSpeed", [0.9], 1],
            ["actions.setSpeed", [1], 1],*/
    		["actions.disablePowerup", ["Bacon"], 1]
        ]
	}
});


pyro.peer = {
    _priv : {
        _log : [],
        _peerjs : null,
        _peerId : "",
        _connectedPeers : [],
        _onReceiveData: null,
        _eachConnection : function(fn){
            var checkedIds = {};
            
            for(j in this._connectedPeers){
                var peerId = this._connectedPeers[j];
            
                if (!checkedIds[peerId]) {
                    var conns = this._peerjs.connections[peerId];
                    for (var i = 0, ii = conns.length; i < ii; i += 1) {
                        var conn = conns[i];
                        fn(conn, peerId);
                    }
                }
                checkedIds[peerId] = 1;
            }
        },
        _establishConnection : function(connection){
            connection.on('error', function(err) { 
                console.error(err);
            })
            
            .on('open', function(data) {
                pyro.peer.appendToLog({status : {what: "connected", who: connection.peer, when: new Date()}});
                pyro.peer._priv._connectedPeers.push(connection.peer);
            })
            
            .on('data', function(data) {
                //console.log("Received DATA", data);
                
                if(pyro.peer._priv._onReceiveData) pyro.peer._priv._onReceiveData(connection.peer, data);
            })
            
            .on('close', function() {
                pyro.peer.appendToLog({status : {what: "left", who: connection.peer, when: new Date()}});
                pyro.peer._priv._connectedPeers.splice(pyro.peer._priv._connectedPeers.indexOf(connection.peer), 1);
            });
            
            //this._connectedPeers.push(connection.peer);
        }
    },
    get log(){
        return this._priv._log;
    },
    get peerId(){
        return this._priv._peerId;
    },
    get connectedPeers(){
        return this._priv._connectedPeers;
    },
    appendToLog : function(logObj){
        pyro.peer._priv._log.push(logObj);
    },
    open : function(){
        var fnOnOpen = (arguments[0])?arguments[0].onOpen:null;
        this._priv._onReceiveData = (arguments[0])?arguments[0].onReceiveData:null;
        
        this._priv._peerjs = new Peer({
            key: '574j0lf0ltf39pb9',
            debug: 3,
            logFunction: function() {
                //console.log(arguments);
            },
            config: {'iceServers': [ // Use a TURN server for more network support
                { url: 'stun:stun.l.google.com:19302' }
            ]} /* Sample servers, please use appropriate ones */
        })
        
        .on('open', function(Id){
            pyro.peer._priv._peerId = Id;
            if(fnOnOpen) fnOnOpen(Id);
        })
        
        .on('connection', function(connection){
            pyro.peer._priv._establishConnection(connection);
        });
        
        // Make sure things clean up properly.
        window.onunload = window.onbeforeunload = function(e) {
            if (!!pyro.peer._priv._peerjs && !pyro.peer._priv._peerjs.destroyed) {
                pyro.peer._priv._peerjs.destroy();
            }
        };
    },
    connect : function(peerId){
        var peerjs = this._priv._peerjs.connect(peerId, {
            label: 'chat',
            serialization: 'json'
        })
            
        .on('open', function() { 
            pyro.peer._priv._establishConnection(peerjs);
            
            // We're already connected, so we won't receive another 'open' event
            pyro.peer.appendToLog({status : {what: "connected", who: peerId, when: new Date()}});
            pyro.peer._priv._connectedPeers.push(peerId);
        });
    },
    sendData : function(data){
        var obj = {who: pyro.peer.peerId, data: data, when: new Date()}; //TODO recycle?
        
        this._priv._eachConnection(function(c) {
            if (c.label === 'chat') {
                c.send(obj);
            }
        });
    },
    sendMessage : function(message){
        var obj = {chat : {who: pyro.peer.peerId, message: message, when: new Date()}}; //TODO recycle?
        this.appendToLog(obj);
        
        this._priv._eachConnection(function(c) {
            if (c.label === 'chat') {
                c.send(obj);
            }
        });
    },
    recMessage : function(who, message, when){
        this.appendToLog({chat : {who: who, message: message, when: when}});
    },
    sendState : function(){
        this._priv._eachConnection(function(c) {
            if (c.label === 'chat') {
                c.send(lighthouse.video.currentState);
            }
        });
    },
    sendAction : function(action){
        this._priv._eachConnection(function(c) {
            if (c.label === 'chat') {
                c.send({action : action});
            }
        });
    },
    recAction : function(action){
        switch(action.type){
            default:
                console.log(action);
                break;
        }
    }
}
