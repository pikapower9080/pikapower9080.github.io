pyro.addEntityClass("Purple", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle"
		},
		ROM:{
			horizontalForce: -1200
		}
	}),
	actions: {
		walk: function(direction){
			var force = this.logic.memory.ROM.runForce * direction;
			
			if(this.logic.memory.RAM.touchingGround){
				this.logic.memory.RAM.state = "Running";
				var force = this.logic.memory.ROM.runForce * direction;
			}else{
				var force = this.logic.memory.ROM.runForceJumping * direction;
			}
			
			if((force > 0 && this.bodies[0].getLinearVelocity().matrix[0] < 550) || (force < 0 && this.bodies[0].getLinearVelocity().matrix[0] > -550)){
				this.applyForce(new pyro.Vertex(force,0));
			}
			
			this.flip(direction < 0);
			
		}
	},
	onSpawn: function(entity, options, position){
		this.memory.RAM.state = "Idle";
        this.memory.RAM.substate = "Left";
		this.memory.RAM.originalPosition = position.clone();
		options.fixedRotation = true;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
		
		//solid -- hit detection
		
		//sensor -- donut detection
		if(fixtureA.IsSensor()){
			
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'hurt':
						if(fixtureB.IsSensor()){
							if(shapeB){
								switch(shapeB.material.sensor){
									case 'ground':
										this.memory.RAM.dead = true;
										if(objB.logic && objB.logic.actions.bounce) objB.callAction("bounce");
                                        
                                        score = (objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) ? 100 * objB.logic.memory.RAM.scoreMultiplierAir : 100;
                                        stage.memory.HDD.totalScore += score;
                                        pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
                                        
                                        if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
										break;
								}
							}
						}
						break;
				}
			}
		}
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;
		var force = this.logic.memory.ROM.horizontalForce;
		
		
		if(this.logic.memory.RAM.dead){
			gameStage.actions.explode(this);
			return;
		}
		
		
		switch(this.logic.memory.RAM.state){
			case "Idle":
				this.setAnimation("Main", "Walk", true);
				this.timelines["Main"].speed = 0.25;

				//Move if within 600 of player and is on 1st frame
                if(Math.abs(this.position.matrix[0] - player.position.matrix[0]) <= 600 && Math.abs(this.position.matrix[1] - player.position.matrix[1]) <= 200){ // && this.CurrentKeyFrame == 0
                    if((this.logic.memory.RAM.substate == "Left" || !this.logic.memory.RAM.substate) && this.position.matrix[0] - player.position.matrix[0] > 0 ||
                        this.logic.memory.RAM.substate == "Right" && this.position.matrix[0] - player.position.matrix[0] < 0){
                        this.logic.memory.RAM.state = 'Surprise';
                        //Wave.Timers.add(function(entity){
                            this.logic.memory.RAM.state = 'Chase';
                        //}, 10, false, 0, this);
                    }
                }
                
                //Move if within 600 of player and is on 1st frame
                if(Math.abs(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0]) >= 200 && this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 01){
                    if(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0] > 0){
                        this.logic.memory.RAM.substate = "Left";
                    }else if(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0] < 0){
                        this.logic.memory.RAM.substate = "Right";    
                    }
                }
                
                if(this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){// && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){
                    if(this.logic.memory.RAM.substate == "Right") force = -force;
                    this.applyForce(new pyro.Vertex(force / 1.35, 0));
                    this.flip(this.logic.memory.RAM.substate == "Right");
                }

				break;
			case "Surprise":
				this.setAnimation("Main", "RUN", true);
				this.timelines["Main"].speed = ((Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) + Math.abs(this.bodies[0].getLinearVelocity().matrix[1])) / 850).round(0.1); //-refVelocityX
				break;
			case "Chase":
				//return;//SMP Temp
				this.setAnimation("Main", "Walk", true);
				this.timelines["Main"].speed = 0.75;
            
                //Move if within 600 of player and is on 1st frame
                if(Math.abs(this.position.matrix[0] - player.position.matrix[0]) <= 600 && Math.abs(this.position.matrix[1] - player.position.matrix[1]) <= 20 && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){//0){ //  && this.CurrentKeyFrame == 0
                    if(this.position.matrix[0] - player.position.matrix[0] <= 0) force = -force;
                    this.applyForce(new pyro.Vertex(force * 1.25, 0));
                    this.flip(this.position.matrix[0] - player.position.matrix[0] <= 0);
                }else if(this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){
                    this.logic.memory.RAM.state = "Idle";
                }
				break;
		}
	}
})

pyro.addEntityClass("Flying", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle"
		},
		ROM: {
			maxVelocity: 600
		}
	}),
	actions: {
		hover: function(destination){
			var vector = destination.clone().sub(this.position);
			var point = this.bodies[0].getPosition();
			var velocity = this.bodies[0].getLinearVelocity();

			var targetHeight = 0;//0.01;
			var targetWidth = 50;//0.01;
			var springConstant = 6.5;
			var springConstantX = 5.5;

			if(Math.abs(vector.matrix[0]) > targetWidth) {
				velocity.matrix[0] = springConstantX * vector.matrix[0];
			}

			if(Math.abs(vector.matrix[1]) > targetHeight) {
				velocity.matrix[1] = springConstant * vector.matrix[1];
			}

			if(Math.abs(vector.matrix[0]) > this.logic.memory.ROM.maxVelocity) vector.matrix[0] = this.logic.memory.ROM.maxVelocity * (vector.matrix[0] < 0 ? -1 : 1);
			if(Math.abs(vector.matrix[1]) > this.logic.memory.ROM.maxVelocity) vector.matrix[1] = this.logic.memory.ROM.maxVelocity * (vector.matrix[1] < 0 ? -1 : 1);

			this.bodies[0].setLinearVelocity(velocity.scale(0.5));
			this.flip(vector.matrix[0] > 0);
			
		},
		fly: function(){

		}
	},
	onSpawn: function(entity, options, position){
		this.memory.state = "Idle";

		this.memory.RAM.originalPosition = new pyro.Vertex(position);
		options.fixedRotation = true;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
		
		//solid -- hit detection
		
		//sensor -- donut detection
		if(fixtureA.IsSensor()){
			
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'hurt':
						if(fixtureB.IsSensor()){
							if(shapeB){
								switch(shapeB.material.sensor){
									case 'ground':
										this.memory.RAM.dead = true;
										stage.player.callAction("bounce");
                                        
                                        score = (objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) ? 200 * objB.logic.memory.RAM.scoreMultiplierAir : 200;
                                        stage.memory.HDD.totalScore += score;
                                        pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
                                        
                                        if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
										break;
								}
							}
						}
						break;
				}
			}
		}
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var point = this.bodies[0].getPosition();

		this.setAnimation("Main", "fly", true);
		
		if(this.logic.memory.RAM.dead){
			gameStage.actions.explode(this);
			return;
		}

		if(gameStage.player.position.vector.distance(this.position) < 500){
			this.callAction("hover", gameStage.player.position);
            this.logic.memory.RAM.originalPosition.set(gameStage.player.position);
		}else if(this.logic.memory.RAM.originalPosition.vector.distance(point) > 50){
			this.callAction("hover", this.logic.memory.RAM.originalPosition);	
		}


		this.flip(gameStage.player.position.matrix[0] - this.position.matrix[0] > 0);
	}
});


pyro.addEntityClass("Red", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle"
		},
		ROM:{

		}
	}),
	actions: {
		walk: function(direction){
			
		}
	},
	onSpawn: function(entity, options, position){
		this.memory.state = "Idle";
		this.memory.RAM.originalPosition = position.clone();
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
		
		//solid -- hit detection
		
		//sensor -- donut detection
		if(fixtureA.IsSensor()){
			
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'hurt':
						if(fixtureB.IsSensor()){
							if(shapeB){
								switch(shapeB.material.sensor){
									case 'ground':
										this.memory.RAM.dead = true;
										if(objB.logic && objB.logic.actions.bounce) objB.callAction("bounce");
                                        
                                        score = (objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) ? 300 * objB.logic.memory.RAM.scoreMultiplierAir : 300;
                                        stage.memory.HDD.totalScore += score;
                                        pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
                                        
                                        if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
										break;
								}
							}
						}
						break;
				}
			}
		}
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;	

		this.setAnimation("Main", "hover", true);
		
		if(this.logic.memory.RAM.dead){
			gameStage.actions.explode(this);
			return;
		}
	}
})


pyro.addEntityClass("FireShooter", {
    memory: new pyro.Memory("", {
    	RAM:{
			health: 100,
			state: "Idle",
            interval: 0
		},
		ROM:{
            interval: 120,
            fireballOffset: 50,
    		fireballSpeed: 600
		}
	}),
	actions: {
		shoot: function(direction){
            var stage = pyro.getStage("Gameplay");
            var orientation = this.position.orientation - Math.PI;
            var vector = new pyro.Vertex(Math.cos(orientation), Math.sin(orientation));
            var position = this.position.clone().add(vector.clone().scale(this.logic.memory.ROM.fireballOffset));
			var velocity = vector.clone().scale(this.logic.memory.ROM.fireballSpeed);
            var fireball = stage.layers[stage.spawnPoints[0].layer].addEntity("Fireball", position, {entityClass: 'Fireball', scale: new pyro.Vertex(1, 1), gravityScale: 0, linearVelocity: velocity});
            fireball.logic.memory.RAM.shooter = this;
            fireball.flip(true);
		}
	},
	onSpawn: function(entity, options, position){
		this.memory.state = "Idle";
		this.memory.RAM.originalPosition = position.clone();
        this.memory.RAM.interval = Math.floor(position.matrix[0] / 32) % this.memory.ROM.interval;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
        if(fixtureA.IsSensor()){
    		
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'hurt':
						if(fixtureB.IsSensor()){
							if(shapeB){
								switch(shapeB.material.sensor){
									case 'ground':
										this.memory.RAM.dead = true;
										stage.player.callAction("bounce");
                                        
                                        score = (objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) ? 200 * objB.logic.memory.RAM.scoreMultiplierAir : 200;
                                        stage.memory.HDD.totalScore += score;
                                        pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
                                        
                                        if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
										break;
								}
							}
						}
						break;
				}
			}
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;	

		//this.setAnimation("Main", "hover", true);
		
		if(--this.logic.memory.RAM.interval <= 0){
            this.logic.memory.RAM.interval = this.logic.memory.ROM.interval;
			this.callAction('shoot');
		}
        
        if(this.logic.memory.RAM.dead){
    		gameStage.actions.explode(this);
			return;
		}
	}
})

pyro.addEntityClass("FireShooterFast", {
    memory: new pyro.Memory("", {
        RAM:{
			health: 100,
			state: "Idle",
            interval: 0
		},
		ROM:{
            interval: 60,
            fireballOffset: 50,
    		fireballSpeed: 1200
		}
	}),
	actions: {
		shoot: function(direction){
            var stage = pyro.getStage("Gameplay");
            var orientation = this.position.orientation - Math.PI;
            var vector = new pyro.Vertex(Math.cos(orientation), Math.sin(orientation));
            var position = this.position.clone().add(vector.clone().scale(this.logic.memory.ROM.fireballOffset));
			var velocity = vector.clone().scale(this.logic.memory.ROM.fireballSpeed);
            var fireball = stage.layers[stage.spawnPoints[0].layer].addEntity("Fireball", position, {entityClass: 'Fireball', scale: new pyro.Vertex(1, 1), gravityScale: 0, linearVelocity: velocity});
            fireball.logic.memory.RAM.shooter = this;
            fireball.flip(true);
		}
	},
	onSpawn: function(entity, options, position){
		this.memory.state = "Idle";
		this.memory.RAM.originalPosition = position.clone();
        this.memory.RAM.interval = Math.floor(position.matrix[0] / 32) % this.memory.ROM.interval;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
        
        if(fixtureA.IsSensor()){
    		
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'hurt':
						if(fixtureB.IsSensor()){
							if(shapeB){
								switch(shapeB.material.sensor){
									case 'ground':
										this.memory.RAM.dead = true;
										stage.player.callAction("bounce");
                                        
                                        score = (objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) ? 200 * objB.logic.memory.RAM.scoreMultiplierAir : 200;
                                        stage.memory.HDD.totalScore += score;
                                        pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
                                        
                                        if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
										break;
								}
							}
						}
						break;
				}
			}
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;	

		//this.setAnimation("Main", "hover", true);
		
		if(--this.logic.memory.RAM.interval <= 0){
            this.logic.memory.RAM.interval = this.logic.memory.ROM.interval;
			this.callAction('shoot');
		}
        
        if(this.logic.memory.RAM.dead){
    		gameStage.actions.explode(this);
			return;
		}
	}
})

pyro.addEntityClass("Fireball", {
    memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle",
            decay: 600,
            shooter: null,
		},
		ROM:{
            
		}
	}),
	actions: {

	},
	onSpawn: function(entity, options, position){
		this.memory.state = "Idle";
		this.memory.RAM.originalPosition = position.clone();
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
        
        if(objA.logic.memory.RAM.shooter && objB != objA.logic.memory.RAM.shooter && !fixtureB.IsSensor()) {
            objA.logic.memory.RAM.decay = 0;
        }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;	

		//this.setAnimation("Main", "hover", true);
		
		if(--this.logic.memory.RAM.decay <= 0){
            gameStage.actions.explode(this, "#FF7F00", 3, undefined, undefined, undefined, undefined, undefined, true);
		}
	}
})