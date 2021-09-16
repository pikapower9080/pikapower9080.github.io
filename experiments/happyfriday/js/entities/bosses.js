pyro.addEntityClass("Dragon Boss", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "chase",
			delayCount: 0,
            closeIn: 0
		},
		ROM:{
			fireballSpeed: 1200
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
                if(point.matrix[0] >= 94629){
                    velocity.matrix[0] = 0;
                }
			}

			if(Math.abs(vector.matrix[1]) > targetHeight) {
				velocity.matrix[1] = springConstant * vector.matrix[1];
			}

			this.bodies[0].setLinearVelocity(velocity.scale(0.5));
			this.flip(vector.matrix[0] < 0);
			
		},
		shootFireball: function(){
            var stage =  pyro.getStage("Gameplay");
			if(this.flipX) return;
            this.timelines.mouth.active = true;
            this.timelines.mouth.time = 0;
            var fireball = stage.layers[stage.spawnPoints[0].layer].addEntity("Fireball", this.position.clone().add(new pyro.Vertex(220,0)), {scale: new pyro.Vertex(1, 1), gravityScale: 0, linearVelocity: new pyro.Vertex(this.logic.memory.ROM.fireballSpeed, 0)})
            //fireball.logic.memory.RAM.shooter = this;
		}
	},
	onSpawn: function(entity, options, position){
        options.fixedRotation = true;
		this.memory.state = "chase";

		this.memory.RAM.originalPosition = new pyro.Vertex(position);
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
        if(objB.modelName == "Wheel Jewel 1"){
            this.memory.RAM.state = "die";    
        }
		
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		if(this.logic.memory.RAM.dead) return layer.remove(this);
        
        this.logic.memory.RAM.delayCount++;
        this.logic.memory.RAM.closeIn++;

        if(this.logic.memory.RAM.delayCount > 60){
        	this.callAction("shootFireball");
        	this.logic.memory.RAM.delayCount = 0;
        }

		var stage = pyro.getStage("Gameplay");
		var point = this.bodies[0].getPosition();

		if(this.logic.memory.RAM.state == "chase"){
			this.callAction("hover", stage.player.position.clone().sub(new pyro.Vector(800 - (Math.floor(this.logic.memory.RAM.closeIn / 2)),0)));
		}else if(this.logic.memory.RAM.state == "die"){
			this.callAction("hover", this.position.clone().add(0,10000));	
		}


		//this.flip(stage.player.position.matrix[0] - this.position.matrix[0] > 0);
	}
});