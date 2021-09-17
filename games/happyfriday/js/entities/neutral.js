pyro.addEntityClass("Explode Particle", {
    memory: new pyro.Memory("", {
    	RAM:{
			life: 0
		},
		ROM:{
            lifeSpan: 15
		}
	}),
	onSpawn: function(){
    	this.memory.RAM.life = 0;
	},
	update: function(layer){
		this.logic.memory.RAM.life++;
        
        this.alpha = 1 - (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan);
        
        //this.setScale(1 + (2 * (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan)), 1 + (2 * (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan)));
	}
});

pyro.addEntityClass("Smoke Particle", {
    memory: new pyro.Memory("", {
		RAM:{
			life: 0
		},
		ROM:{
            lifeSpan: 10
		}
	}),
	onSpawn: function(){
    	this.memory.RAM.life = 0;
	},
	update: function(layer, dt){
		this.logic.memory.RAM.life += dt;
        
        this.alpha = 1 - (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan);
        
        //this.setScale(1 + (4 * (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan)), 1 + (4 * (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan)));
        //this.polygons[0].lines[0].anchor1.matrix[0] = 10 * (1 + (4 * (this.logic.memory.RAM.life / this.logic.memory.ROM.lifeSpan)));
	}
});

pyro.addEntityClass("Butterfly", {
	memory: new pyro.Memory("", {
		RAM:{
			health: 100,
			state: "Idle",
			horizontalForce: 500, //Flying force
			verticalForce: 100,    //Flying force
			floatingTimer: undefined
		},
		ROM:{
			horizontalForce: 800
		}
	}),
	actions: {
		hover: function(destination){ //SMP Attempt
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

			this.bodies[0].setLinearVelocity(velocity.scale(0.5));
			this.flip(vector.matrix[0] > 0);
		},
		xhover: function(destination){
			//entity.physics.setLinearVelocity([entity.physics.velocity.x,-entity.properties.verticalForce]);

			var targetHeight = 0;//0.01;
			var targetWidth = 0;//0.01;
			var springConstant = 6.5;
			var springConstantX = 5.5;

			var startOfRay = this.position;
			var endOfRay = destination;

			var distanceAboveGround = -(startOfRay.matrix[1] - endOfRay.matrix[1]) - 1;//(startOfRay - cb.m_point).Length();
			//distanceAboveGround /= 900;

			if(Math.abs(distanceAboveGround) > targetHeight) {
				var distanceAwayFromTargetHeight = -(targetHeight - distanceAboveGround);
				var force = springConstant * distanceAwayFromTargetHeight;

				if(Math.abs(force) < 70){
					if(force < 0) force = -70;
					//if(force > 0) force = 50;
				}

				//if(Math.abs(force) < 5) force = 5;
				this.applyForce(new pyro.Vertex(0,force));
			}

			var distanceAwayFromMiddle = -(startOfRay.matrix[0] - endOfRay.matrix[0]);//(startOfRay - cb.m_point).Length();

			if(Math.abs(distanceAwayFromMiddle) > targetWidth) {
				var distanceAwayFromTargetHeight = -(targetHeight - distanceAwayFromMiddle);

				var force = springConstantX * distanceAwayFromTargetHeight;
				if(Math.abs(force) < 50){
					if(force < 0) force = -50;
					if(force > 0) force = 50;
				}

				this.applyForce(new pyro.Vertex(force, 0)); 

				//this.flip(distanceAwayFromMiddle > 0);    
				//this.bodies[0].setLinearDamping(1.95);
			}
			
		},
		fly: function(){

		}
	},
	onSpawn: function(){
		this.memory.state = "Idle";

		
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");
		var player = gameStage.player;
		var force = this.logic.memory.ROM.horizontalForce;

		this.setAnimation("Main", "flutterby butterfly", true);
		this.timelines["Main"].speed = 1;	

		if(player && player.logic.memory.RAM.health == 100){
			if(!this.renderedLastFrame || (this.timelines["Main"].animation && this.timelines["Main"].time < 1 && this.timelines["Main"].animation.frames.indexOf(this.timelines["Main"].frame) == 0)){
				this.callAction("hover", player.position.clone().sub(0,100));
			}
		}else if(player){
			//Fly away!
			this.setLinearVelocity(new pyro.Vector(this.logic.memory.RAM.horizontalForce * (this.position.clone().sub(player.position).matrix[0] < 0 ? -1 : 1), -this.logic.memory.RAM.verticalForce));				
            this.flip((this.position.clone().sub(player.position).matrix[0] < 0 ? false : true));
		}
	}
});

pyro.addEntityClass("Checkpoint", {
	memory: new pyro.Memory("", {
		RAM:{
			state: "closed"
		},
		ROM:{

		}
	}),
	actions: {
		bloom: function(){
			var stage = pyro.getStage("Gameplay");

			if(this.logic.memory.RAM.state == "closed")	{
				this.logic.memory.RAM.state = "open";
				this.setAnimation("Main", "bloom");
				stage.player.logic.memory.RAM.health = 100;
				stage.memory.checkpoint = stage.layers[stage.memory.spawnPoint.layer].getObjectsByClass("Checkpoint").indexOf(this);
			}
		}
	},
	onSpawn: function(){
		this.memory.RAM.state = "closed";		
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		if(objB == stage.player){
			stage.memory.saveState();
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var stage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "open" && stage.player.position.vector.distance(this.position) > 500){
			this.logic.memory.RAM.state = "closed"
			this.timelines["Main"].time = 0;
			this.timelines["Main"].active = false;
			this.isStatic = true;;
		}
	}
});

pyro.addEntityClass("Sheep", {
	memory: new pyro.Memory("", {
		RAM:{
			state: "eating grass"
		},
		ROM:{

		}
	}),
	actions: {

	},
	onSpawn: function(){
	
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		if(objB == stage.player){
            pyro.getStage("Gameplay").audio.play({id: "sheep", location: objA.position});
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
	    if(Math.abs(this.position.orientation) > 0.1){
	        this.logic.memory.RAM.state = "pushed";
	    }else{
	        this.logic.memory.RAM.state = "eating grass";
	    }
	    
		this.setAnimation("Main", this.logic.memory.RAM.state, true);
	}
});

pyro.addEntityClass("Trampoline", {
	memory: new pyro.Memory("", {
		RAM:{
			
		},
		ROM:{

		}
	}),
	actions: {

	},
	onSpawn: function(){
	
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		if(objB == stage.player){
			objA.setAnimation("Main", "bounce", false);
			stage.player.callAction("bounce", 2.8, new pyro.Vector(Math.cos(objA.position.orientation - Math.PI / 2), Math.sin(objA.position.orientation - Math.PI / 2)));
            pyro.getStage("Gameplay").audio.play({id: "trampoline", location: objB.position});
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		
	}
});

pyro.addEntityClass("Box", {
	memory: new pyro.Memory("", {
		RAM:{
			state: "Idle",
            durability: 500
		},
		ROM:{
			
		}
	}),
	actions: {

	},
	onSpawn: function(){

	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		// if(objB == stage.player){
		// 	objA.logic.memory.RAM.state = "Break";
  //           pyro.getStage("Gameplay").audio.play({id: "box_fall", location: objB.position});
		// }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;

		//Get velocity in direction of object
		var v = objB.bodies[0].getLinearVelocity();
		var d = objA.position.clone().sub(objB.position);
		var m = objB.bodies[0].b2Body.GetMass();
		var speed = v.dot2D(d) / v.length();
		if(speed * m > objA.logic.memory.RAM.durability){
			contact.SetEnabled(false);
			objA.logic.memory.RAM.state = "Break";
		}
		//console.log(speed);
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "Break"){
			gameStage.actions.explode(this);
			return;
		}
	}
});

pyro.addEntityClass("boss wall 1", {
    memory: new pyro.Memory("", {
		RAM:{
			state: "Idle",
            durability: 100
		},
		ROM:{
		    
		}
	}),
	actions: {

	},
	onSpawn: function(entity, options, position){
        entity.bodies[0].type = 0;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		// if(objB == stage.player){
		// 	objA.logic.memory.RAM.state = "Break";
  //           pyro.getStage("Gameplay").audio.play({id: "box_fall", location: objB.position});
		// }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;

		//Get velocity in direction of object
		var v = objB.bodies[0].getLinearVelocity();
		var d = objA.position.clone().sub(objB.position);
		var m = objB.bodies[0].b2Body.GetMass();
		var speed = v.dot2D(d) / v.length();
		if(speed * m > objA.logic.memory.RAM.durability){
			contact.SetEnabled(false);
			objA.logic.memory.RAM.state = "Break";
		}
		//console.log(speed);
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "Break"){
			gameStage.actions.explode(this);
			return;
		}
	}
});

pyro.addEntityClass("boss wall 2", {
    memory: new pyro.Memory("", {
    	RAM:{
			state: "Idle",
            durability: 100000
		},
		ROM:{
		    
		}
	}),
	actions: {

	},
	onSpawn: function(entity, options, position){
        entity.bodies[0].type = 0;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		// if(objB == stage.player){
		// 	objA.logic.memory.RAM.state = "Break";
  //           pyro.getStage("Gameplay").audio.play({id: "box_fall", location: objB.position});
		// }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;

		//Get velocity in direction of object
		var v = objB.bodies[0].getLinearVelocity();
		var d = objA.position.clone().sub(objB.position);
		var m = objB.bodies[0].b2Body.GetMass();
		var speed = v.dot2D(d) / v.length();
		if(speed * m > objA.logic.memory.RAM.durability){
			contact.SetEnabled(false);
			objA.logic.memory.RAM.state = "Break";
		}
		//console.log(speed);
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "Break"){
			gameStage.actions.explode(this);
			return;
		}
	}
});

pyro.addEntityClass("boss wall 3", {
    memory: new pyro.Memory("", {
    	RAM:{
			state: "Idle",
            durability: 1000
		},
		ROM:{
		    
		}
	}),
	actions: {

	},
	onSpawn: function(entity, options, position){
        entity.bodies[0].type = 0;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		// if(objB == stage.player){
		// 	objA.logic.memory.RAM.state = "Break";
  //           pyro.getStage("Gameplay").audio.play({id: "box_fall", location: objB.position});
		// }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;

		//Get velocity in direction of object
		var v = objB.bodies[0].getLinearVelocity();
		var d = objA.position.clone().sub(objB.position);
		var m = objB.bodies[0].b2Body.GetMass();
		var speed = v.dot2D(d) / v.length();
		if(speed * m > objA.logic.memory.RAM.durability){
			contact.SetEnabled(false);
			objA.logic.memory.RAM.state = "Break";
		}
		//console.log(speed);
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "Break"){
			gameStage.actions.explode(this);
			return;
		}
	}
});

pyro.addEntityClass("breakable wall", {
    memory: new pyro.Memory("", {
    	RAM:{
			state: "Idle",
            durability: 500
		},
		ROM:{
			
		}
	}),
	actions: {

	},
	onSpawn: function(entity, options, position){
        entity.bodies[0].type = 0;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		// if(objB == stage.player){
		// 	objA.logic.memory.RAM.state = "Break";
  //           pyro.getStage("Gameplay").audio.play({id: "box_fall", location: objB.position});
		// }
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		if(!(fixtureA.GetFilterData().get_maskBits() & fixtureB.GetFilterData().get_categoryBits())) return;

		//Get velocity in direction of object
		var v = objB.bodies[0].getLinearVelocity();
		var d = objA.position.clone().sub(objB.position);
		var m = objB.bodies[0].b2Body.GetMass();
		var speed = v.dot2D(d) / v.length();
		if(speed * m > objA.logic.memory.RAM.durability){
			contact.SetEnabled(false);
			objA.logic.memory.RAM.state = "Break";
		}
		//console.log(speed);
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var gameStage = pyro.getStage("Gameplay");

		if(this.logic.memory.RAM.state == "Break"){
			gameStage.actions.explode(this);
			return;
		}
	}
});

pyro.addEntityClass("Goal", {
	memory: new pyro.Memory("", {
		RAM:{
			explode: false
		},
		ROM:{

		}
	}),
	onSpawn: function(){
			
	},
	onDestroy: function(){
		
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var stage = pyro.getStage("Gameplay");
		
		if(objB == stage.player){
			stage.callAction("stageComplete");
			this.memory.RAM.explode = true;
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
    	var stage = pyro.getStage("Gameplay");
        
		if(this.logic.memory.RAM.explode){
			stage.actions.explode(this);
		}
	}
});


pyro.addEntityClass("Yetti", {
	memory: new pyro.Memory("", {
		RAM:{
			groundContacts: []
		},
		ROM:{
			jumpImpulse: 100,
			moveForce: 50
		}
	}),
	actions: {
		jump: function(){
			var force = this.logic.memory.ROM.jumpImpulse;
							
			if(this.logic.memory.RAM.touchingGround){
				var point = this.bodies[0].getPosition();
				this.applyImpulse(new pyro.Vector(0, -force * 2), point);
			}
		},
		move: function(direction){
			if(!this.logic.memory.RAM.touchingGround){
				var force = this.logic.memory.ROM.moveForce;
				var point = this.bodies[0].getPosition();
				if(Math.abs(this.bodies[0].getLinearVelocity().matrix[0]) < 250){
					this.applyImpulse(new pyro.Vector(force * direction, 0), point);
				}
			}
		},
		bounce: function(multiplier){
			var force = this.logic.memory.ROM.jumpImpulse;
			this.setLinearVelocity(new pyro.Vector(this.bodies[0].getLinearVelocity().matrix[0], -force  * (multiplier || 1)));
			this.timelines["primary"].time = 0;
			this.logic.memory.RAM.jumpSequence.time = 0
		}
	},
	onSpawn: function(entity, options){	
		this.memory.RAM.groundContacts.length = 0;
		this.memory.RAM.jumpSequence = new pyro.Sequence([new pyro.Action("callAction", ["jump"], 39)], 39);
		this.memory.RAM.jumpSequence.start(true);
		this.memory.RAM.jumpSequence.time = entity.id;
		entity.setAnimation("primary", "hop", true)
		entity.timelines["primary"].time = entity.id;
	},
	onDestroy: function(){
		//Add to score
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){
		var shapeA = objA.findShapeByFixture(fixtureA);
		var shapeB = objB.findShapeByFixture(fixtureB);
		
		if(fixtureA.IsSensor()){
			
			if(shapeA){
				switch(shapeA.material.sensor){
					case 'ground':
						if(this.memory.RAM.groundContacts.indexOf(shapeB) === -1) this.memory.RAM.groundContacts.push(shapeB);
						this.memory.RAM.touchingGround = true;
						break;
				}
			}
		}
	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){
		var shapeA = objA.findShapeByFixture(fixtureA);
			var shapeB = objB.findShapeByFixture(fixtureB);

			if(fixtureA.IsSensor()){
				if(shapeA){
					switch(shapeA.material.sensor){
						case 'ground':
							index = this.memory.RAM.groundContacts.indexOf(shapeB);
							if(index !== -1) this.memory.RAM.groundContacts.splice(index, 1);
							if(!this.memory.RAM.groundContacts.length) {
								this.memory.RAM.touchingGround = false;
							}
							break;
					}
				}
			}
	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		var stage = pyro.getStage("Gameplay");

		this.logic.memory.RAM.jumpSequence.update(1, this);

		if(stage.player && stage.player.position.vector.distance(this.position) < 1000){
			this.callAction("move", (stage.player.position.matrix[0] - this.position.matrix[0] > 0 ? 1: -1));
			this.flip(stage.player.position.matrix[0] - this.position.matrix[0] > 0);
		}else{
            if(this.logic.memory.RAM.touchingGround){
                if(!this.logic.memory.RAM.decidedFlip){
                    //Clear contacts (flipping will only create beginContact, not endContact)
                    //if(f != this.flipX) this.logic.memory.RAM.groundContacts.length = 0;
                    this.flip(Math.random() > 0.5);
                    
                    this.logic.memory.RAM.decidedFlip = true;
                }
            }else{
                this.logic.memory.RAM.decidedFlip = false;
            }
    		this.callAction("move", (this.flipX)?1:-1);
		}
	}
});

pyro.addEntityClass("Falling Platform", {
	onSpawn: function(entity, options, position){
		entity.bodies[0].type = 1;
		options.fixedRotation = true;
		options.gravityScale = 0.05;
	},
	onDestroy: function(){
		
	},
	beginContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	endContact: function(objA, objB, fixtureA, fixtureB, contact){

	},
	preSolve: function(objA, objB, fixtureA, fixtureB, contact){
		
	},
	postSolve: function(objA, objB, fixtureA, fixtureB, contact){

	},
	update: function(layer){
		
	}
});