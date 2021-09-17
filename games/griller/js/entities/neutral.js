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

pyro.addEntityClass("Fire Ball", {
    memory: new pyro.Memory("", {
    	RAM:{
            dead: false
		}
	}),
	update: function(layer, dt){
        cameraPosition = pyro.getCamera("main").position;
        if(this.position.matrix[0] < cameraPosition.matrix[0] ||
            this.position.matrix[1] < cameraPosition.matrix[1]  || 
            this.position.matrix[0] > cameraPosition.matrix[0] + 1000  ||
            this.position.matrix[1] > cameraPosition.matrix[1] + 562){
                stage_gameplay.getObjectsLayer(this).remove(this);
                //stage_gameplay.memory.RAM.currentCombo = 0;
                return;
		}       
        if(this.logic.memory.RAM.dead){
                stage_gameplay.getObjectsLayer(this).remove(this);
    	}
	}
});