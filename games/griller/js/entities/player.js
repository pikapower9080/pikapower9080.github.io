(function() {
    pyro.addEntityClass("Hamburger", {
		memory: new pyro.Memory("", {
			RAM: {
				health: 100,
				state: "Idle",
				baddies: 0,
				direction: 1,
                damageCounter: 0,
                scoreMultiplierAir: 1,
                scoreMultiplierTimed: 1,
                scoreMultiplierTimedTime: 0,
                fireTimer: 0,
                powerupBacon: false,
                powerupBBQ: false,
                powerupKetchup: false,
                powerupMustard: false,
                stepTime: 0, //Temp, should be replaced once animation is in
                stepCount: 0,
                lookDirection: 0
			},
			ROM: {
				runForce: 600, //800 * 4
				runForceJumping: 2400,
				runOffDelay: 3,
				linearDampingRun: 2,
				jumpForce: 1500, //1500
				jumpImpulse: 700, //700,
    			fireForce: 2000, //700,
			}

		}),
		actions: {
			hover: function(args) {

			},
			walk: function(direction) {
                direction = new pyro.Vector(direction);
				this.logic.memory.RAM.direction = direction;
                
                this.applyForce(direction.clone().mul(this.logic.memory.ROM.runForce, this.logic.memory.ROM.runForce));
                
                this.logic.memory.RAM.state = "Running";
			},
            fire: function(target) {
                if(this.logic.memory.RAM.fireTimer > 0) return;
                this.logic.memory.RAM.fireTimer = 4;
                
                target = new pyro.Vector(target);
                var angleBetweenTwoPoints = function(center_x, center_y, p1_x, p1_y) {
            		var p0 = {x: center_x, y: center_y - Math.sqrt(Math.abs(p1_x - center_x) * Math.abs(p1_x - center_x)
        			+ Math.abs(p1_y - center_y) * Math.abs(p1_y - center_y))};
                    return Math.round(2 * Math.atan2(p1_y - p0.y, p1_x - p0.x) * 100) / 100;// * 180 / Math.PI;
        		}
                
                if(stage_gameplay.input.gamepadConnected) this.logic.memory.RAM.lookDirection = angleBetweenTwoPoints(0, 0, stage_gameplay.input.gamepadAxes[2], stage_gameplay.input.gamepadAxes[3]);
                if(target.matrix[0]) this.logic.memory.RAM.lookDirection = angleBetweenTwoPoints(this.position.matrix[0], this.position.matrix[1], target.matrix[0], target.matrix[1]);
                var angle = this.logic.memory.RAM.lookDirection;
                var vel_x = Math.sin(angle) * this.logic.memory.ROM.fireForce;		
                var vel_y = -Math.cos(angle) * this.logic.memory.ROM.fireForce;
                
                if(this.logic.memory.RAM.powerupBacon){
                    fireballEmitter = stage_gameplay.fireballEmitterBig;
                }else{
                    fireballEmitter = stage_gameplay.fireballEmitter;
                }
                
                newPosition = this.position.clone();
                newPosition.orientation = angle - (Math.PI / 2);
                fireball = fireballEmitter.emit(newPosition, new pyro.Vector([vel_x, vel_y]));
                
                if(this.logic.memory.RAM.powerupBBQ){
                    //From the back!
                    newPosition.orientation = angle + (Math.PI / 2);
                    fireball = fireballEmitter.emit(newPosition, new pyro.Vector([-vel_x, -vel_y]));
                }
                
                if(this.logic.memory.RAM.powerupMustard){
                    //Two more!
                    secondaryAngle = angle - (Math.PI / 4);
                    var vel_x = Math.sin(secondaryAngle) * this.logic.memory.ROM.fireForce;        
                    var vel_y = -Math.cos(secondaryAngle) * this.logic.memory.ROM.fireForce;
                    
                    newPosition.orientation = secondaryAngle - (Math.PI / 2);
                    fireball = fireballEmitter.emit(newPosition, new pyro.Vector([vel_x, vel_y]));
                    
                    //Two more!
                    secondaryAngle = angle + (Math.PI / 4);
                    var vel_x = Math.sin(secondaryAngle) * this.logic.memory.ROM.fireForce;        
                    var vel_y = -Math.cos(secondaryAngle) * this.logic.memory.ROM.fireForce;
                    
                    newPosition.orientation = secondaryAngle - (Math.PI / 2);
                    fireball = fireballEmitter.emit(newPosition, new pyro.Vector([vel_x, vel_y]));
                }
                
                stage_gameplay.audio.play({id: "fireball", location: fireball.position});
                
				this.setAnimation("Shoot", "shoot", false);
                this.timelines['Shoot'].time = 0;
            },
			wait: function() {

			}
		},
		onSpawn: function(entity) {
			this.state = "Idle";
		},
		onDestroy: function() {

        },
		beginContact: function(objA, objB, fixtureA, fixtureB, contact) {
			if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;
			//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
			var shapeA = objA.findShapeByFixture(fixtureA);
			var shapeB = objB.findShapeByFixture(fixtureB);

			var gameStage = pyro.getStage("Gameplay");

			//solid -- hit detection

			//sensor -- donut detection
            if(!fixtureB.IsSensor()){
				if(objB.entityClass == "T-Bone") this.memory.RAM.health = 0;
    		}else{
                switch(objB.bodies[0].shapes[0].material.sensor){
                    case 'Power-up Bacon':
                        stage_dialog.callAction("openDialog", "Bacon!", objB.position, true);
                        stage_gameplay.sequences.BaconTime.start();
                        objB.decay = 0;
                        break;
                    case 'Power-up BBQ':
                        stage_dialog.callAction("openDialog", "BBQ!", objB.position, true);
                        stage_gameplay.sequences.BBQTime.start();
                        objB.decay = 0;
                        break;
                    case 'Power-up Ketchup':
                        stage_dialog.callAction("openDialog", "Ketchup!", objB.position, true);
                        stage_gameplay.sequences.KetchupTime.start();
                        objB.decay = 0;
                        break;
                    case 'Power-up Mustard':
                        stage_dialog.callAction("openDialog", "Mustard!", objB.position, true);
                        stage_gameplay.sequences.MustardTime.start();
                        objB.decay = 0;
                        break;
                }
             
    		}
            
			//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		},
		endContact: function(objA, objB, fixtureA, fixtureB, contact) {
			if (!(fixtureB.GetFilterData().get_maskBits() & 0x0FFF)) return;
			//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
			var shapeA = objA.findShapeByFixture(fixtureA);
			var shapeB = objB.findShapeByFixture(fixtureB);

			if (fixtureA.IsSensor()) {
				if (shapeA) {
					switch (shapeA.material.sensor) {
						case 'ground':
							index = this.memory.RAM.groundContacts.indexOf(shapeB);
							if (index !== -1) this.memory.RAM.groundContacts.splice(index, 1);
							if (!this.memory.RAM.groundContacts.length) {
								this.memory.RAM.touchingGround = false;
								if (this.memory.RAM.state == "Running") {
									this.memory.RAM.runOff = this.memory.ROM.runOffDelay;
								}
							}
							break;
					}
				}
			}
			//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
		},
		postSolve: function(objA, objB, fixtureA, fixtureB, contact) {

		},
		update: function(layer) {
            var gameStage = pyro.getStage("Gameplay");
			var ROM = this.logic.memory.ROM;
			var RAM = this.logic.memory.RAM;
            
            this.logic.memory.RAM.scoreMultiplierTimedTimer--;
            if(this.logic.memory.RAM.scoreMultiplierTimedTimer <= 0){
                this.logic.memory.RAM.scoreMultiplierTimed = 1;
            }

            if(RAM.damageCounter){
                if(RAM.damageCounter == 30) {
                    RAM.health -= 50;
                    gameStage.audio.play({
        				id: "poof",
    					location: this.position
    				});
                }
                RAM.damageCounter--;
                this.alpha = 1 - ((RAM.damageCounter % 2) * 0.9)
            }else{
                this.alpha = 1;
            }
            
            if(Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) + Math.abs(this.bodies[0].getLinearVelocity().matrix[1]) < 15){
                this.logic.memory.RAM.state = "Idle";
            }
            
            //AI
    		switch(this.logic.memory.RAM.state){
				case "Idle":
                    this.timelines["Idle"].active = true;
                    this.timelines["Run"].active = false;
                    
                    break;
                case "Running":
                    this.timelines["Idle"].active = false;
                    this.timelines["Run"].active = true;
    				this.timelines["Run"].speed = (Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) + Math.abs(this.bodies[0].getLinearVelocity().matrix[1])) / 325;
                    
                    this.logic.memory.RAM.stepTime -= 1 * ((Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) + Math.abs(this.bodies[0].getLinearVelocity().matrix[1])) / 200);
                    
                    if(this.logic.memory.RAM.stepTime <= 0){
                        if(this.logic.memory.RAM.stepCount == 0){
                            this.logic.memory.RAM.stepCount = 1;
                            gameStage.audio.play({
                        		id: "step1",
            					location: this.position
            				});
                        }else{
                            this.logic.memory.RAM.stepCount = 0;
                            gameStage.audio.play({
                        		id: "step2",
            					location: this.position
            				});
                        }
                        this.logic.memory.RAM.stepTime = 10;
                    }
                    
                    var lookDirection = 180;
                    
                    this.bones[3].position.matrix[0] += 10;
                    break;
    		}
            
            if(stage_gameplay.player.timelines['Shoot'].time == 6){
                stage_gameplay.player.timelines['Shoot'].time = 0;
                stage_gameplay.player.timelines['Shoot'].active = false;
            };
            
            // Set glow color
            if(this.logic.memory.RAM.powerupBacon || this.logic.memory.RAM.powerupBBQ || this.logic.memory.RAM.powerupMustard || this.logic.memory.RAM.powerupKetchup){
                if(!this.effects.outline) this.effects.outline = new pyro.Color(87,193,217,0.5);
            }else{
                this.effects.outline = "";
            }
		}
	})
})()