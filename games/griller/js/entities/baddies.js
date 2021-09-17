pyro.addEntityClass("T-Bone", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle"
		},
		ROM:{
			horizontalForce: 400
		}
	}),
	actions: {
		walk: function(){
            var angleBetweenTwoPoints = function(center_x, center_y, p1_x, p1_y) {
            	var p0 = {x: center_x, y: center_y - Math.sqrt(Math.abs(p1_x - center_x) * Math.abs(p1_x - center_x)
    			+ Math.abs(p1_y - center_y) * Math.abs(p1_y - center_y))};
                return Math.round(2 * Math.atan2(p1_y - p0.y, p1_x - p0.x) * 100) / 100;// * 180 / Math.PI;
    		}
            
            var angle = angleBetweenTwoPoints(this.position.matrix[0], this.position.matrix[1], stage_gameplay.player.position.matrix[0], stage_gameplay.player.position.matrix[1]);
            var vel_x = Math.sin(angle) * this.logic.memory.ROM.horizontalForce;		
            var vel_y = -Math.cos(angle) * this.logic.memory.ROM.horizontalForce;
            
            if(this.timelines["Main"] && this.timelines["Main"].animation && (
                (this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) >= 2 && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) <= 5) ||
                (this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) >= 7 && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) <= 9) ||
                (this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0)
                )){
            //if(this.timelines["Main"] && this.timelines["Main"].animation && this.timelines["Main"].time == 0){
                this.applyForce(new pyro.Vector(vel_x, vel_y));
            }
			
            if(Math.abs(this.position.matrix[0] - stage_gameplay.player.position.matrix[0]) > 5)
			    this.flip(vel_x < 0);
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
		if(fixtureB.IsSensor() && objB.bodies[0].shapes[0].material.sensor === true && !objB.logic.memory.RAM.dead){
			this.memory.RAM.dead = true;
            
            if(objB.scale.matrix[0] <= stage_gameplay.memory.ROM.projectileScale[0]) objB.logic.memory.RAM.dead = true;
            stage.memory.RAM.comboTimer = stage.memory.ROM.comboTime;
            stage.memory.RAM.baddiesDefeated++;
            stage.memory.RAM.currentCombo++;
            if(stage.memory.RAM.currentCombo > stage.memory.RAM.highestCombo) stage.memory.RAM.highestCombo = stage.memory.RAM.currentCombo
            
            score = 100 * stage.memory.RAM.currentCombo;
            stage.memory.RAM.totalScore += score;
            if(stage.memory.RAM.totalScore > stage.memory.HDD.totalScore) stage.memory.HDD.totalScore = stage.memory.RAM.totalScore;
            
            pyro.getStage("Gameplay Dialog").callAction("showScore", score, objA.position);
            
            switch(stage.memory.RAM.baddiesDefeated){
                case 1:
                    stage_gameplayUI.callAction("openAchv", "Big mistake... You're dead meat now!", true);
                    break;
                case 20:
                    stage_gameplayUI.callAction("openAchv", "20 down! Feeling Saucy?", true);
                    break;
                case 100:
                    stage_gameplayUI.callAction("openAchv", "100 down! Well Done!", true);
                    break;
                case 250:
                    stage_gameplayUI.callAction("openAchv", "250! You are on a ROLL!", true);
                    break;
            }
            
            stage_gameplayUI.sequences['AnimateScore'].start();
            if(objB.logic && objB.logic.memory.RAM.scoreMultiplierAir) objB.logic.memory.RAM.scoreMultiplierAir++
		}
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;
        
        //this.bodies[0].setLinearDamping(6); //TODO
        this.bodies[0].setLinearDamping(5); //TODO
		
		
		if(this.logic.memory.RAM.dead){
			gameStage.actions.explode(this);
            
            //Drop power-ups
            var chance = Math.ceil(Math.random() * 32);
    						
			if(chance == 1){
                var item = Math.ceil(Math.random() * 16);
                
                var drop = "Ketchup";
                if(item >= 5 && item < 10) drop = "Mustard";
                if(item >= 10 && item < 14) drop = "BBQ";
                if(item >= 14 && item < 16) drop = "Bacon";
                
                stage_gameplay.layers[0].addEntity("Power-up " + drop, this.position);
			}
			return;
		}
        
        this.callAction("walk", [(this.position.matrix[0] < player.position.matrix[0])?1:-1, (this.position.matrix[1] < player.position.matrix[1])?1:-1]);
        
        this.logic.memory.RAM.state = "Walk";
        
        switch(this.logic.memory.RAM.state){
			case "Walk":
				//this.setAnimation("Main", "Walk", true);
				this.timelines["Main"].speed = 2;
				break;
		}
		
//		switch(this.logic.memory.RAM.state){
//			case "Idle":
//				this.setAnimation("Main", "Walk", true);
//				this.timelines["Main"].speed = 0.25;
//
//				//Move if within 600 of player and is on 1st frame
//                if(Math.abs(this.position.matrix[0] - player.position.matrix[0]) <= 600 && Math.abs(this.position.matrix[1] - player.position.matrix[1]) <= 200){ // && this.CurrentKeyFrame == 0
//                    if((this.logic.memory.RAM.substate == "Left" || !this.logic.memory.RAM.substate) && this.position.matrix[0] - player.position.matrix[0] > 0 ||
//                        this.logic.memory.RAM.substate == "Right" && this.position.matrix[0] - player.position.matrix[0] < 0){
//                        this.logic.memory.RAM.state = 'Surprise';
//                        //Wave.Timers.add(function(entity){
//                            this.logic.memory.RAM.state = 'Chase';
//                        //}, 10, false, 0, this);
//                    }
//                }
//                
//                //Move if within 600 of player and is on 1st frame
//                if(Math.abs(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0]) >= 200 && this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 01){
//                    if(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0] > 0){
//                        this.logic.memory.RAM.substate = "Left";
//                    }else if(this.position.matrix[0] - this.logic.memory.RAM.originalPosition.matrix[0] < 0){
//                        this.logic.memory.RAM.substate = "Right";    
//                    }
//                }
//                
//                if(this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){// && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){
//                    if(this.logic.memory.RAM.substate == "Right") force = -force;
//                    this.applyForce(new pyro.Vertex(force / 1.35, 0));
//                    this.flip(this.logic.memory.RAM.substate == "Right");
//                }
//
//				break;
//			case "Surprise":
//				this.setAnimation("Main", "RUN", true);
//				this.timelines["Main"].speed = ((Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) + Math.abs(this.bodies[0].getLinearVelocity().matrix[1])) / 850).round(0.1); //-refVelocityX
//				break;
//			case "Chase":
//				//return;//SMP Temp
//				this.setAnimation("Main", "Walk", true);
//				this.timelines["Main"].speed = 0.75;
//            
//                //Move if within 600 of player and is on 1st frame
//                if(Math.abs(this.position.matrix[0] - player.position.matrix[0]) <= 600 && Math.abs(this.position.matrix[1] - player.position.matrix[1]) <= 20 && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){//0){ //  && this.CurrentKeyFrame == 0
//                    if(this.position.matrix[0] - player.position.matrix[0] <= 0) force = -force;
//                    this.applyForce(new pyro.Vertex(force * 1.25, 0));
//                    this.flip(this.position.matrix[0] - player.position.matrix[0] <= 0);
//                }else if(this.timelines["Main"].animation && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0){
//                    this.logic.memory.RAM.state = "Idle";
//                }
//				break;
//		}
	}
})

pyro.addEntityClass("T-Bone Title", {
    memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle"
		},
		ROM:{
			horizontalForce: 900
		}
	}),
	actions: {
		walk: function(direction){
            directionVector = new pyro.Vector(direction);
            
            this.applyForce(directionVector.mul(this.logic.memory.ROM.horizontalForce, 0));
			
		    //this.flip(this.logic.memory.RAM.substate == "Left");
		}
	},
	onSpawn: function(entity, options, position){
		this.memory.RAM.state = "Idle";
		this.memory.RAM.originalPosition = position.clone();
		options.fixedRotation = true;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
				
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){       
        this.bodies[0].setLinearDamping(6); //TODO
        
        this.callAction("walk", [(this.flipX)?-1:1, 0]);
        
        this.logic.memory.RAM.state = "Walk";
        
        switch(this.logic.memory.RAM.state){
    		case "Walk":
				this.setAnimation("Main", "Walk", true);
				this.timelines["Main"].speed = 1;
				break;
		}
        
        if(this.position.matrix[0] > 1500) this.setPosition(-300, this.position.matrix[1]);
        if(this.position.matrix[0] < -500) this.setPosition(1500, this.position.matrix[1]);
        
		
        return;
	}
})