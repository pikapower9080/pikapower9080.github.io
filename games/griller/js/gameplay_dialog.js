stage_dialog = pyro.createStage({
	id: "Gameplay Dialog",
	viewport: "main",
	camera: "main",
	enabled: true,
	paused: true,
	alpha: 0,
	onCreate: function(){
		this.physicsEnabled = false;
		
		this.addLayer();
		
		this.speechBubbleTile = this.layers[0].addTile(new pyro.Tile());
		this.speechBubbleOpen = false;
        
        this.scoreTexts = [];
	},
	onReady: function(){
		this.alpha = 1;
	},
	onStop: function(){
		this.alpha = 0;
	},
	onPause: function(){
		this.alpha = 0;
	},
	onResume: function(){
		this.alpha = 1;
	},
	onUpdate: function(){
		for(var i = 0; i < this.scoreTexts.length; i++){
            this.scoreTexts[i].decay--;
            
            this.scoreTexts[i].alpha -= 1 / 25;
            this.scoreTexts[i].position.add(0,-7);
            
    	    if(this.scoreTexts[i].decay <= 0){
               this.layers[0].remove(this.scoreTexts[i]);
    	    }
		}
	},
	actions: {
		resizeDialog: function(scale){
			var stage = pyro.getStage("Gameplay Dialog");
			
			dialogStage.speechBubbleTile.setScale(new pyro.Vector(scale, scale));
			dialogStage.speechBubbleTile.alpha = scale;
		},
        wait: function(){
            
        },
		openDialog: function(text, position, autoClose){
			gameplayStage = pyro.getStage("Gameplay");
			dialogStage = pyro.getStage("Gameplay Dialog");
			
			if(dialogStage.speechBubbleOpen) return;
			dialogStage.speechBubbleOpen = true;
						
			newText = new pyro.Text(text, [0,0], "#FFF", null, "Droid Serif Bold", 20);
			newText.textBaseline = "middle";
			newText.getBoxPixel();
			
			this.speechBubbleTile.texts = [];
			this.speechBubbleTile.texts.push(newText);
			
			var padding = 20;
			var notchSize = 15;
			newPolygon = new pyro.Polygon();
			newPolygon.fill = "#57C1D9";
			newPolygon.stroke = "#FFF";
			newPolygon.lineWidth = 3;
			newPolygon.addRectangle([0,0], newText.box.getWidth() + padding, newText.box.getHeight() + padding, 8);
			newPolygon.addMove([newText.box.getCenter().matrix[0] - notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2)]);
			newPolygon.addLine([newText.box.getCenter().matrix[0], newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2) + notchSize]);
			newPolygon.addLine([newText.box.getCenter().matrix[0] + notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2)]);
    		//newPolygon.addRectangle([0,0], 200, 300, 8);
        	//newPolygon.closePath = true;
			
			this.speechBubbleTile.polygons = [];
			this.speechBubbleTile.polygons.push(newPolygon);
			//stage.layers[stage.memory.spawnPoint.layer].addText(text, position, {font: "Cookies", size: 20});
            
    		//notchSize -= newPolygon.lineWidth;
    		newPolygon = new pyro.Polygon();
			newPolygon.fill = "#57C1D9";
    		newPolygon.stroke = "#FFF";
			newPolygon.lineWidth = 3;
            newPolygon.addMove([newText.box.getCenter().matrix[0] - notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding - newPolygon.lineWidth) / 2)]);
    		newPolygon.addLine([newText.box.getCenter().matrix[0], newText.box.center.matrix[1] + ((newText.box.getHeight() + padding) / 2) + notchSize]);
			newPolygon.addLine([newText.box.getCenter().matrix[0] + notchSize, newText.box.center.matrix[1] + ((newText.box.getHeight() + padding - newPolygon.lineWidth) / 2)]);
    		this.speechBubbleTile.polygons.push(newPolygon);

			dialogStage.speechBubbleTile.position.set(position).add(0,-75);
			dialogStage.speechBubbleTile.getBox();
			
			dialogStage.sequences["Open Dialog"].start();
            
            if(autoClose){
			    dialogStage.sequences["Auto Close Dialog"].start();
            }
		},
		closeDialog: function(){
			dialogStage = pyro.getStage("Gameplay Dialog");
			dialogStage.sequences["Close Dialog"].start();
		},
		endDialog: function(){
			dialogStage = pyro.getStage("Gameplay Dialog");
			dialogStage.speechBubbleOpen = false;	
		},
        showScore: function(score, position){
    		dialogStage = pyro.getStage("Gameplay Dialog");
            
            newTile = this.layers[0].addTile(new pyro.Tile());
            
            newText = new pyro.Text(score, [0,0], "rgb(87,193,217)", null, "Droid Serif Bold", 32);
    		newText.textBaseline = "middle";
            newText.stroke = "#FFF";
            newText.lineWidth = 4;
			newText.getBoxPixel();
            
            newTile.texts.push(newText);
            
            newTile.position.set(position);
            newTile.position.orientation = 0;
            
            newTile.decay = 25;
            
            this.scoreTexts.push(newTile);
        }
	},
	sequences: {
		'Open Dialog': [
			["actions.resizeDialog", [0], 1],
			["actions.resizeDialog", [0.1], 1],
			["actions.resizeDialog", [0.5], 1],
			["actions.resizeDialog", [0.7], 1],
			["actions.resizeDialog", [0.8], 1],
			["actions.resizeDialog", [0.9], 1],
			["actions.resizeDialog", [1], 1]
		],
		'Close Dialog': [
			["actions.resizeDialog", [0.9], 1],
			["actions.resizeDialog", [0.8], 1],
			["actions.resizeDialog", [0.7], 1],
			["actions.resizeDialog", [0.6], 1],
			["actions.resizeDialog", [0.5], 1],
			["actions.resizeDialog", [0.1], 1],
			["actions.resizeDialog", [0], 1],
			["actions.endDialog", [], 1]
		],
    	'Auto Close Dialog': [
    		["actions.wait", [], 60],
			["actions.resizeDialog", [0.9], 1],
			["actions.resizeDialog", [0.8], 1],
			["actions.resizeDialog", [0.7], 1],
			["actions.resizeDialog", [0.6], 1],
			["actions.resizeDialog", [0.5], 1],
			["actions.resizeDialog", [0.1], 1],
			["actions.resizeDialog", [0], 1],
			["actions.endDialog", [], 1]
		]
	}
});