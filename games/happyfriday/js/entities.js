(function() {
	pyro.addEntityClass("Prim", {
		memory: new pyro.Memory("", {
			RAM: {
				health: 100,
				lives: 3,
				touchingGround: false,
				state: "Idle",
				donuts: 0,
				goldDonuts: 0,
				runOff: Infinity,
				direction: 1,
                damageCounter: 0,
                scoreMultiplierAir: 1,
                scoreMultiplierTimed: 1,
                scoreMultiplierTimedTime: 0
			},
			ROM: {
				runForce: 8000, //800 * 4
				runForceJumping: 2400,
				runOffDelay: 3,
				linearDampingRun: 2,
				jumpForce: 1500, //1500
				jumpImpulse: 700, //700,
				rollTorque: 200,
				maxAngle: Math.PI / 4,
				maxAngleChange: Math.PI / 8,
				rayCastLength: 50,
				rayCasts: 1 // In both directions plus center (1 == 3 total, 4 == 9 total)
			}

		}),
		actions: {
			hover: function(args) {

			},
			walk: function(direction) {
				this.logic.memory.RAM.direction = direction;

				if (this.modelName == "model_prim") {
					//console.log("Walk: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);
					if (this.logic.memory.RAM.touchingGround && this.logic.memory.RAM.state != "Jumping") {
						this.logic.memory.RAM.state = "Running";
						//Apply goNormal
						var force = new pyro.Vector(-this.logic.memory.RAM.goNormal.matrix[1], this.logic.memory.RAM.goNormal.matrix[0]).scale(this.logic.memory.ROM.runForce * direction);
						this.bodies[0].setLinearDamping(this.logic.memory.ROM.linearDampingRun);
					} else {
						var force = new pyro.Vector(this.logic.memory.ROM.runForceJumping * direction, 0);
						this.bodies[0].setLinearDamping(0);

					}

					var v = this.bodies[0].getLinearVelocity();

					if ((force.matrix[0] > 0 && v.matrix[0] < 600) || (force.matrix[0] < 0 && v.matrix[0] > -600)) {
					
						var a = 600 - Math.abs(v.matrix[0]);
						var m = this.bodies[0].getMass();
						var f = m * a;

						if(a > 0 && Math.abs(force.matrix[0]) > f){
							force.matrix[0] = f * (force.matrix[0] > 0 ? 1 : -1);
						}
						this.applyForce(force);						
					}

					if (--this.logic.memory.RAM.runOff < 0 && this.logic.memory.RAM.state == "Running") {
						this.logic.memory.RAM.state = "Run Off"
					}
				} else {
					this.logic.memory.RAM.state = "Running";
					if (this.logic.memory.RAM.touchingGround){
                        this.logic.memory.RAM.substate = "Rolling";
                        
                        randomX = 1 - (Math.random() * 2);
                        randomY = 1 - (Math.random() * 2);
                        //var smokeParticle = pyro.getStage("Gameplay").smokeEmitter.emit(this.position.clone().add(randomX * 10, 120), new pyro.Vector(this.bodies[0].getLinearVelocity().matrix[0] + randomX * 10000, this.bodies[0].getLinearVelocity().matrix[1] + randomY * 1));
                        //smokeParticle.setLinearVelocity(this.bodies[0].getLinearVelocity().matrix[0] + (randomX * 100), this.bodies[0].getLinearVelocity().matrix[1]);
                        
                        randomX = 1 - (Math.random() * 2);
                        randomY = 1 - (Math.random() * 2);
                        //var smokeParticle = pyro.getStage("Gameplay").smokeEmitter.emit(this.position.clone().add(randomX * 10, 120), new pyro.Vector((this.bodies[0].getLinearVelocity().matrix[0] / 2) + randomX * 10000, this.bodies[0].getLinearVelocity().matrix[1] + randomY * 1));
                        //smokeParticle.setLinearVelocity(this.bodies[0].getLinearVelocity().matrix[0] + (randomX * 100), this.bodies[0].getLinearVelocity().matrix[1]);
					}
					this.bodies[0].applyTorque(this.logic.memory.ROM.rollTorque * direction);
					this.bodies[0].setLinearDamping(0);
				}

                //Flip, but prevent moonwalking
				if(this.modelName == "model_prim" && direction < 0 && !pyro.getStage("Gameplay").input.isFired("MoveRight")) this.flip(true);
                if(this.modelName == "model_prim" && direction > 0 && !pyro.getStage("Gameplay").input.isFired("MoveLeft")) this.flip(false);
				//console.log("Walk: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);


			},
			jump_initial: function() {
				//console.log("Jump Initial: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);
				var force = this.logic.memory.ROM.jumpImpulse;

				if (!this.logic.memory.RAM.touchingGround && this.logic.memory.RAM.substate != "Double Jump") {
					this.logic.memory.RAM.runOff = Infinity;
					this.logic.memory.RAM.state = "Jumping";
					this.logic.memory.RAM.substate = "Double Jump";
					this.setLinearVelocity(new pyro.Vector(this.bodies[0].getLinearVelocity().matrix[0], -force * 1.4));

					pyro.getStage("Gameplay").audio.play({
						id: "jump",
						location: this.position
					});
				} else if (this.logic.memory.RAM.touchingGround) {
					this.logic.memory.RAM.runOff = Infinity;
					//this.logic.memory.RAM.touchingGround = false; //SMP This needs to be here to keep subsequent event firings from f'ing up the state
					this.logic.memory.RAM.state = "Jumping";
					this.logic.memory.RAM.substate = "First Jump";

					var point = this.bodies[0].getPosition();
					var invMass = 1 / this.bodies[0].b2Body.GetMass();

					for (var c in this.logic.memory.RAM.groundContacts) {
						var body = this.logic.memory.RAM.groundContacts[c].body;
						body.applyImpulse(new pyro.Vector(0, force * ((1 / body.b2Body.GetMass()) / invMass)), point);
					}

					this.applyImpulse(new pyro.Vector(0, -force * 2), point);

					pyro.getStage("Gameplay").audio.play({
						id: "jump",
						location: this.position
					});
				}
				//console.log("Jump Initial: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);

			},
			jump_hold: function() {
				//console.log("Jump Hold: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);
				if (!this.logic.memory.RAM.touchingGround && this.logic.memory.RAM.state == "Jumping") {
					this.logic.memory.RAM.runOff = Infinity;
					var force = this.logic.memory.ROM.jumpForce;
					//if(this.modelName == "model_prim_ball") force = force * 2;
					this.applyForce(new pyro.Vertex(0, -force));
				}
				//console.log("Jump Hold: " + this.logic.memory.RAM.state + "|" + this.logic.memory.RAM.substate + "|" + this.logic.memory.RAM.touchingGround);
			},
			bounce: function(multiplier, angle) {
				var force = this.logic.memory.ROM.jumpImpulse * (multiplier || 1) * 1.4;
                
				this.logic.memory.RAM.state = "Jumping";
				this.logic.memory.RAM.substate = "First Jump";
                
                if(!angle) angle = new pyro.Vector(0, -1);
                else angle.normalize();
                
                angle.scale(force);
                angle.add(this.bodies[0].getLinearVelocity().matrix[0]);
                
				this.setLinearVelocity(angle);
                //this.setLinearVelocity(new pyro.Vector(this.bodies[0].getLinearVelocity().matrix[0], -force * 1.4 * (multiplier || 1)));
				
                if (this.modelName == "model_prim" && this.timelines["Main"]) //In case you're transforming and colliding at the same time 
				    this.timelines["Main"].time = 0;
			},
			wait: function() {

			}
		},
		onSpawn: function(entity) {
			//Set hover location
			this.memory.RAM.groundContacts = [];
			this.memory.RAM.goNormal = new pyro.Vector();
			this.memory.RAM.goVelocity = new pyro.Vector();
			this.memory.RAM.toClear = [];

			this.state = "Idle";
		},
		onDestroy: function() {
			//Add to score;
			this.memory.RAM.groundContacts.length = 0;
			this.memory.RAM.toClear.length = 0;
		},
		beginContact: function(objA, objB, fixtureA, fixtureB, contact) {
			if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;
			//console.log("beginContact: " + this.memory.RAM.state + "|" + this.memory.RAM.substate + "|" + this.memory.RAM.touchingGround);
			var shapeA = objA.findShapeByFixture(fixtureA);
			var shapeB = objB.findShapeByFixture(fixtureB);

			var gameStage = pyro.getStage("Gameplay");

			//solid -- hit detection

			//sensor -- donut detection
			if (fixtureA.IsSensor()) {

				if (shapeA) {
					switch (shapeA.material.sensor) {
						case 'ground':
							if (!fixtureB.IsSensor()) { //Dont want donuts changing the player state
								if (this.memory.RAM.groundContacts.indexOf(shapeB) === -1) this.memory.RAM.groundContacts.push(shapeB);
								if (!this.memory.RAM.touchingGround) {
									this.memory.RAM.touchingGround = true;
									this.memory.RAM.runOff = Infinity;
									if (this.memory.RAM.state == "Jumping") {
										this.memory.RAM.state = "Idle";
										this.memory.RAM.substate = "Idle";
									}
                                     this.memory.RAM.scoreMultiplierAir = 1;
								}
							}
							break;
						case 'pickup':
							if (fixtureB.IsSensor()) {
								if (shapeB) {
									switch (shapeB.material.sensor) {
										case 'donut':
											this.memory.RAM.donuts++;
											this.memory.RAM.toClear.push(objB);
											pyro.getStage("Gameplay UI").sequences.AnimateDonuts.start()
											gameStage.audio.play({
												id: "donut",
												location: objB.position
											});
                                            gameStage.memory.HDD.totalScore += 50 * this.memory.RAM.scoreMultiplierTimed;
                                            pyro.getStage("Gameplay Dialog").callAction("showScore", 50 * this.memory.RAM.scoreMultiplierTimed, objB.position);
                                            this.memory.RAM.scoreMultiplierTimed++;
                                            this.memory.RAM.scoreMultiplierTimedTimer = 15;
											break;
										case 'gold-donut':
											gameStage.memory.RAM.goldenDonutsCollected[objB.tag] = true;
											this.memory.RAM.toClear.push(objB);

											//pyro.getStage("Gameplay UI").sequences.AnimateGoldDonuts.start();
											gameStage.audio.play({
												id: "goldendonut",
												location: objB.position
											});
                                            gameStage.memory.HDD.totalScore += 1000;
                                            pyro.getStage("Gameplay Dialog").callAction("showScore", 1000, objB.position);
											break;
										case 'health':
											if (this.memory.RAM.health != 100) {
												this.memory.RAM.health = 100;
												gameStage.audio.play({
													id: "health",
													location: objB.position
												});
                                                gameStage.memory.HDD.totalScore += 500;
                                                pyro.getStage("Gameplay Dialog").callAction("showScore", 500, objB.position);
											}
											break;
										case 'pickup':
											if (objB.entityClass == "1Up") {
												gameStage.memory.HDD.livesLeft++;
												this.memory.RAM.toClear.push(objB);
												pyro.getStage("Gameplay UI").sequences.AnimateLives.start();
												gameStage.audio.play({
													id: "1up",
													location: objB.position
												});
                                                gameStage.memory.HDD.totalScore += 500;
                                                pyro.getStage("Gameplay Dialog").callAction("showScore", 500, objB.position);
											}
											break;
										case 'checkpoint':
											if (objB.entityClass == "Checkpoint") {
												gameStage.audio.play({
													id: "checkpoint",
													location: objB.position
												});
												objB.callAction("bloom");
											}
											break;
									}
								}
							}
							break;
						case 'hurt':
							if (fixtureB.IsSensor()) {
								if (shapeB && !objB.dead) {
									switch (shapeB.material.sensor) {
										case 'lethal':
                                            if(!this.memory.RAM.damageCounter) this.memory.RAM.damageCounter = 30;
											break;
										case 'death':
										    this.memory.RAM.health = 0;
											break;
									}
								}
							}
							break;
					}
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

			//Clear Donuts
			for (var i = 0; i < RAM.toClear.length; i++) {
				layer.remove(RAM.toClear[i]);
			}
			RAM.toClear.length = 0;
            
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
			//AI

			if (this.modelName == "model_prim") {

				if (this.logic.memory.RAM.touchingGround) {
					//RayCast Angle
					RAM.rayCastPoints = [];
					RAM.rayCastVelocities = [];

					//Calculate Gravity To Object Normals (GO Normal)
					var G = layer.world.toPixels(layer.world.b2World.GetGravity()).normalize();
					var S = (ROM.rayCastLength / 2) / ROM.rayCasts;

					var C = layer.world.toPixels(this.bodies[0].b2Body.GetPosition());
					var L = new pyro.Vector(-G.matrix[1], G.matrix[0]);
					var R = new pyro.Vector(G.matrix[1], -G.matrix[0]);

					var go = new pyro.Vector(-G.matrix[0], -G.matrix[1]);

					G.scale(this.bodies[0].shapes[4].radius + 50);

					var shape, cast;
					var p1 = C;
					var p2 = C.clone().add(G);
					for (var c = 0; c < RAM.groundContacts.length; c++) {
						shape = RAM.groundContacts[c];
						if (cast = shape.rayCast(p1, p2, 1)) {
							if (!RAM.rayCastPoints[0] || RAM.rayCastPoints[0].fraction > cast.fraction) {
								RAM.rayCastPoints[0] = cast;
								RAM.rayCastVelocities[0] = shape.body.getLinearVelocity();
							}
						}
					}

					for (var r = 1; r <= ROM.rayCasts; r++) {
						//Left
						p1 = L.clone().scale(r * S).add(C);
						p2 = p1.clone().add(G);
						for (var c = 0; c < RAM.groundContacts.length; c++) {
							shape = RAM.groundContacts[c];
							if (cast = shape.rayCast(p1, p2, 1)) {
								if (!RAM.rayCastPoints[-r] || RAM.rayCastPoints[-r].fraction > cast.fraction) {
									RAM.rayCastPoints[-r] = cast;
									RAM.rayCastVelocities[-r] = shape.body.getLinearVelocity();
								}
							}
						}
						//Right
						p1 = R.clone().scale(r * S).add(C);
						p2 = p1.clone().add(G);
						for (var c = 0; c < RAM.groundContacts.length; c++) {
							shape = RAM.groundContacts[c];
							if (cast = shape.rayCast(p1, p2, 1)) {
								if (!RAM.rayCastPoints[r] || RAM.rayCastPoints[r].fraction > cast.fraction) {
									RAM.rayCastPoints[r] = cast;
									RAM.rayCastVelocities[r] = shape.body.getLinearVelocity();
								}
							}
						}
					}

					RAM.goVelocity.set(0,0);
					for (var r in RAM.rayCastPoints) {
						var cast = RAM.rayCastPoints[r];
						var v = RAM.rayCastVelocities[r];
						if (cast) {
							go.add(cast.normal.scale(1 / (Math.abs(r) + 1)));
							RAM.goVelocity.add(v);
						}
					}
					RAM.goVelocity.div(ROM.rayCasts * 2 + 1);

					go.normalize();

					var a = Math.atan2(go.matrix[0], -go.matrix[1]);
					var b = Math.atan2(RAM.goNormal.matrix[0], -RAM.goNormal.matrix[1]);

					if (Math.abs(b) - Math.abs(a) > ROM.maxAngleChange){
						//a = ROM.maxAngleChange * (a < 0 ? -1 : 1);
					} 

					if (Math.abs(a) < ROM.maxAngle) {
						this.bodies[0].setAngle(a);
						RAM.goNormal.set(go);
					}else{
						RAM.goNormal.set(Math.sin(ROM.maxAngle * (a < 0 ? -1 : 1), Math.cos(ROM.maxAngle * (a < 0 ? -1 : 1))));
					}
				}else{
					RAM.goNormal.set(0, -1);
					this.bodies[0].setAngle(0);
				}

				//===End Raycast Angle=====================================
				//console.log(this.bodies[0].isTouchingGround());

				var relativeVelocity = this.bodies[0].b2Body && this.bodies[0].getLinearVelocity().sub(RAM.goVelocity);

				if (RAM.touchingGround) {
					this.bodies[0].setLinearDamping(2);
				} else {
					this.bodies[0].setLinearDamping(0);
				}

				if (RAM.touchingGround && relativeVelocity && Math.abs(relativeVelocity.matrix[0]) < 5 && RAM.groundContacts.length && RAM.state != "Jumping") {
					RAM.state = "Idle";
					gameStage.sequences.Dance.loop = true;
					gameStage.sequences.Dance.resume();
				} else if (RAM.touchingGround && relativeVelocity && relativeVelocity.matrix[0] * RAM.direction < -250 && relativeVelocity.matrix[1] > 50) {
					//console.log(this.bodies[0].getLinearVelocity().matrix[0]);
					RAM.substate = "Slide"
					gameStage.sequences.Dance.stop();
				} else if (RAM.touchingGround) {
					if (RAM.substate == "Slide") RAM.substate = "Idle";
					gameStage.sequences.Dance.stop();
				}


				switch (RAM.state) {
					case "Idle":
						if (RAM.substate == "Dance") {
							this.setAnimation("Main", "dance", true);
						} else if (RAM.substate == "Slide") {
							this.setAnimation("Main", "Slide", true)
							this.flip(RAM.direction > 0);
						} else {
							this.setAnimation("Main", "start of level", true);
						}
						this.timelines["Main"].speed = 1;
						break;
					case "Running":
						if (RAM.substate == "Slide") {
							this.setAnimation("Main", "Slide", true);
							this.flip(RAM.direction > 0);
						} else {
							this.setAnimation("Main", "RUN", true);

							this.timelines["Main"].speed = Math.abs(relativeVelocity.matrix[0]) / 850
						}
						break;
					case "Jumping":
						if (RAM.substate == "First Jump") {
							this.setAnimation("Main", "JUMP", true);
						} else if (RAM.substate == "Double Jump") {
							this.setAnimation("Main", "double jump", true);
						}
						this.timelines["Main"].speed = 1;
						break;
					case "Run Off":
						this.setAnimation("Main", "RUN OFF", true);
						this.timelines["Main"].speed = 1;
						break;
				}
			}
		}
	})
})()