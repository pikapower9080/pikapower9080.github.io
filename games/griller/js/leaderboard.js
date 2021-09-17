stage_leaderboard = pyro.createStage({
    id: "Leaderboard",
	viewport: "main",
	camera: "ui",
	enabled: false,
	paused: true,
	alpha: 0,
	hasAudio: true,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Leaderboard");
        
        this.memory = new pyro.Memory("Leaderboard", {
        	RAM:{
    			loadingScores: true,
                leaderboardIndex: 0,
                ranking: "PUBLIC"
    		},
    		ROM:{
        		disabledColor: pyro.themeManager.colors[0],
    			leaderboardColors: [pyro.themeManager.colors[3], pyro.themeManager.colors[4], pyro.themeManager.colors[6], pyro.themeManager.colors[5]]
    		},
    		HDD:{
    		    leaderboards: [[]]
    		}
    	}),
		
		this.selectedChoice = 1;
		
		this.input.bind({
			alias: "MoveUp",
			keys: { firstDown: [87,38] },
			mouse: {
				clicked: [0,1],
				area: [0,0,1000,25]
			},
            gamepad: {
                firstDown: [12],
                firstAxes: [0, -0.15]
            },
			callback: function(stage, events){
				stage.selectedChoice--;
				if(stage.selectedChoice < 0) stage.selectedChoice = stage.layers[1].getObjectsByClass("Choice").length - 1;
			}
		});	
		
		this.input.bind({
			alias: "MoveDown",
			keys: {	firstDown: [83,40] },
			mouse: {
				click: [0,1],
				area: [0,537,1000,562]
			},
            gamepad: {
                firstDown: [13],
                firstAxes: [0, 0.15]
            },
			callback: function(stage, events){
				stage.selectedChoice++;
				if(stage.selectedChoice > stage.layers[1].getObjectsByClass("Choice").length - 1) stage.selectedChoice = 0;
			}
		});
		
		
		
		this.input.bind({
			alias: "Choose",
			mouse: {
				hover: true,
				textClass: "Choice"
			},
			callback: function(stage, events){
			//	if(events[0].entity) stage.selectedChoice = stage.layers[1].getObjectsByClass("Choice").indexOf(events[0].entity);
			}
		});
		
		this.input.bind({
			alias: "Press Choice",
			keys: {down: [13, 32]},
			mouse: {
				down: [0, 1],
				textClass: "Choice"
			},
            gamepad: {
                down: [0]  
            },
			callback: function(stage, events){
    			stage_gameplay.callAction("startLevel");
				stage_gameplay.resume();
				stage.pause();
			}
		});

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1],
				textClass: "Replay"
			},
            gamepad: {
                up: [0]  
            },
			callback: function(stage, events){
				stage_gameplay.callAction("startLevel");
				stage_gameplay.resume();
				stage.pause();
			}
		});
        
        this.input.bind({
    		alias: "Return",
			keys: {up: [27]},
			mouse: {
				click: [0,1],
				textClass: "Return"
			},
            gamepad: {
                up: [0]  
            },
			callback: function(stage, events){
				stage_transition.sequences.FadeIn.start(false, function(){
				    stage_leaderboard.stop();
				    stage_title.start();
    			    stage_title.resume();
                });
			}
		});
        
        this.input.bind({
        	alias: "Select Leaderboard",
			mouse: {
				click: [0,1],
				textClass: "Leaderboard"
			},
			callback: function(stage, events){
                stage.memory.RAM.leaderboardIndex = stage.getObjectsByClass("Leaderboard").indexOf(events[0].objects[0]);
                stage.memory.RAM.loadingScores = true;
				stage.callAction("listScores", stage.memory.RAM.leaderboardIndex, stage.memory.RAM.ranking);
			}
		});
        
        this.input.bind({
            alias: "Select Ranking",
			mouse: {
				click: [0,1],
				textClass: "Ranking"
			},
			callback: function(stage, events){
                switch(stage.getObjectsByClass("Ranking").indexOf(events[0].objects[0])){
                    case 0:
                        stage.memory.RAM.ranking = "PUBLIC";
                        break;
                    case 1:
                        stage.memory.RAM.ranking = "SOCIAL";
                        break;
                    
                }
                stage.memory.RAM.loadingScores = true;
				stage.callAction("listScores", stage.memory.RAM.leaderboardIndex, stage.memory.RAM.ranking);
			}
		});

		this.input.bind({
			alias: "Sign In",
			mouse: {
				click: [0,1],
				textClass: "SignIn"
			},
			callback: function(stage, events){
				gpg.authorize(function(){
				    stage.callAction("listScores", stage.memory.RAM.leaderboardIndex, stage.memory.RAM.ranking);
				});
			}
		});
        
        
        this.backgroundMusic = this.audio.cacheAudio({url: "audio/music/leaderboard.ogg", isMusic: true, defaultGain: 0.10, loop: true});
                        
        
        this.onlineRank = "Wait...";
	},
	onReady: function(){
		this.alpha = 1;
		if(this.backgroundMusic) this.backgroundMusic.play();
        stage_transition.sequences.FadeOut.start();
        
        this.getLayersByClass("Scores")[0].position.matrix[0] = 1000;
        
        this.callAction("listScores", this.memory.RAM.leaderboardIndex, this.memory.RAM.ranking);
	},
	onStop: function(){
		this.alpha = 0;
		if(this.backgroundMusic) this.backgroundMusic.stop();
	},
	onPause: function(){
		this.alpha = 0;
		if(this.backgroundMusic) this.backgroundMusic.stop();
	},
	onResume: function(){
		this.alpha = 1;
		if(this.backgroundMusic) this.backgroundMusic.play();
        stage_transition.sequences.FadeOut.start();
        
        this.getLayersByClass("Scores")[0].position.matrix[0] = 1000;
        
        this.callAction("listScores", this.memory.RAM.leaderboardIndex, this.memory.RAM.ranking);
	},
	onUpdate: function(){
        var layers = this.getLayersByClass("Backgrounds");
        
        //Scrolling bg
        for(var i = 0; i < layers.length; i++){
            layers[i].position.matrix[0] += 2;
            layers[i].position.matrix[1] += 2;
            if(layers[i].position.matrix[0] > 96){
                //layers[i].position.set([0,0]);
                layers[i].position.matrix[0] = 0;
                layers[i].position.matrix[1] = 0;
            }
        }
        
        var navLayer = this.getLayersByClass("Navigation")[0];
        var scoreLayer = this.getLayersByClass("Scores")[0];
        var rankingLayer = this.getLayersByClass("Ranking")[0];
        var loadingLayer = this.getLayersByClass("Loading")[0];
        var signInLayer = this.getLayersByClass("Sign In")[0];
        
        var scoreBackgrounds = scoreLayer.getObjectsByClass("Score Background");
        
        if(this.memory.RAM.loadingScores){
            if(scoreLayer.position.matrix[0] < 1000) scoreLayer.position.matrix[0] = 1000 + (scoreLayer.position.matrix[0]-1000)*(1-Math.pow(1-0.475,2));
            if(rankingLayer.position.matrix[1] > -64) rankingLayer.position.matrix[1] = -64 + (rankingLayer.position.matrix[1]- -64)*(1-Math.pow(1-0.475,2));
            if(loadingLayer.alpha < 1) loadingLayer.alpha = 1 + (loadingLayer.alpha-1)*(1-Math.pow(1-0.375,2));
            if(signInLayer.alpha < 1) signInLayer.alpha = 1 + (signInLayer.alpha-1)*(1-Math.pow(1-0.375,2));
            
            if(gpg.authorized){
                signInLayer.alpha = 0;
            }else{
                loadingLayer.alpha = 0;
            }
        }else{
            if(scoreLayer.position.matrix[0] > 0) scoreLayer.position.matrix[0] = 0 + (scoreLayer.position.matrix[0]-0)*(1-Math.pow(1-0.475,2));
            if(rankingLayer.position.matrix[1] < 0) rankingLayer.position.matrix[1] = 0 + (rankingLayer.position.matrix[1]-0)*(1-Math.pow(1-0.475,2));
            if(loadingLayer.alpha > 0) loadingLayer.alpha = 0 + (loadingLayer.alpha-0)*(1-Math.pow(1-0.375,2));
            
            switch(this.memory.RAM.ranking){
                case "PUBLIC":
                    rankingLayer.getObjectsByClass("Rank Button")[0].polygons[0].fill = this.memory.ROM.leaderboardColors[this.memory.RAM.leaderboardIndex];
                    rankingLayer.getObjectsByClass("Rank Button")[1].polygons[0].fill = this.memory.ROM.disabledColor;
                    break;
                case "SOCIAL":
                    rankingLayer.getObjectsByClass("Rank Button")[0].polygons[0].fill = this.memory.ROM.disabledColor;
                    rankingLayer.getObjectsByClass("Rank Button")[1].polygons[0].fill = this.memory.ROM.leaderboardColors[this.memory.RAM.leaderboardIndex];
                    break;
            }
                    
            for(var i = 0; i < scoreBackgrounds.length; i++){
                scoreBackgrounds[i].polygons[0].fill = this.memory.ROM.leaderboardColors[this.memory.RAM.leaderboardIndex];
            }
        }
        
        var indicators = navLayer.getObjectsByClass("Indicator");
        var indicatorShadows = navLayer.getObjectsByClass("Indicator Shadow");
        for(var i = 0; i < indicators.length; i++){
            if(i == this.memory.RAM.leaderboardIndex){
                if(indicators[i].position.matrix[0] < 177) indicators[i].position.matrix[0] = 177 + (indicators[i].position.matrix[0]-177)*(1-Math.pow(1-0.475,2));
                if(indicatorShadows[i].position.matrix[0] < 177) indicatorShadows[i].position.matrix[0] = 177 + (indicatorShadows[i].position.matrix[0]-177)*(1-Math.pow(1-0.475,2));
            }else{
                if(indicators[i].position.matrix[0] > 131) indicators[i].position.matrix[0] = 131 + (indicators[i].position.matrix[0]-131)*(1-Math.pow(1-0.475,2));
                if(indicatorShadows[i].position.matrix[0] > 131) indicatorShadows[i].position.matrix[0] = 131 + (indicatorShadows[i].position.matrix[0]-131)*(1-Math.pow(1-0.475,2));
            }
        }
        		
        //this.backgroundColor.adjustHSL(1,0,0);
        //this.layers[1].getObjectsByClass("Online Rank")[0].text = this.onlineRank;
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stageSelect.memory.RAM.selectedStage = stageSelect.memory.ROM.stages[nextStageIndex];
                stageSelect.memory.RAM.selectedStageIndex = nextStageIndex;
    			pyro.getStage("Stage Complete").pause();
    			pyro.getStage("Gameplay").callAction("startLevel");
    			pyro.getStage("Gameplay").resume();
            });
        },
        listScores: function(leaderboardIndex, rankType, timeSpan){
            stage_leaderboard.memory.RAM.loadingScores = true;
            
            gpg.authorize(function(){
                gpg.getLeaderboards(function(){
                    gpg.listScores(gpg.leaderboards[leaderboardIndex].id, timeSpan, rankType, function(scoresList){
                        var layer = stage_leaderboard.getLayersByClass("Scores")[0];
                        var scores = layer.getObjectsByClass("Score");
                        var leaders = layer.getObjectsByClass("Leader");
                        var places = layer.getObjectsByClass("Place");
                        var avatars = layer.getObjectsByClass("Avatar");
                        
                        for(var i = 0; i < 10; i++){
                            if(scoresList.items && scoresList.items[i]){
                                scores[i].text = scoresList.items[i].formattedScore;
                                leaders[i].text = scoresList.items[i].player.displayName;
                                places[i].text = scoresList.items[i].formattedScoreRank + " Place";
                                avatars[i].texture = scoresList.items[i].player.avatarImageUrl;
                            }else{
                                scores[i].text = "...";
                                leaders[i].text = "...";
                                places[i].text = "Place TBD";
                                avatars[i].texture = "";
                            }
                        }
                        
                        layer.getObjectsByClass("Updated")[0].text = "Last Update: " + new Date().toLocaleString();
                        stage_leaderboard.memory.RAM.loadingScores = false;
                    });
                });
            });
        },
        submitScores: function(callback){
            gpg.getLeaderboards(function(){
                gpg.submitScore(stage_gameplay.memory.HDD.highScore, gpg.leaderboards[0].id, function(){
                    gpg.submitScore(stage_gameplay.memory.HDD.bestTime * 30, gpg.leaderboards[1].id, function(){
                        gpg.submitScore(stage_gameplay.memory.HDD.bestBaddyCount, gpg.leaderboards[2].id, function(){
                            gpg.submitScore(stage_gameplay.memory.HDD.highestCombo, gpg.leaderboards[3].id,function(){
                                if(callback) callback();
                            });
                        });
                    });
                });
            });
        },
        refreshLeaderboards: function(){
            if(!gpg.authorized) return;
            
            gpg.submitScore(stage_gameplay.memory.HDD.highScore, gpg.leaderboards[0].id);
            gpg.submitScore(stage_gameplay.memory.HDD.bestTime * 30, gpg.leaderboards[1].id);
            gpg.submitScore(stage_gameplay.memory.HDD.bestBaddyCount, gpg.leaderboards[2].id);
            gpg.submitScore(stage_gameplay.memory.HDD.highestCombo, gpg.leaderboards[3].id);
            
            gpg.getLeaderboards(function(){
                for(var i = 0; i < 4; i++){
                    stage_leaderboard.memory.HDD.leaderboards[i] = [];
                    (function(i){
                        gpg.listScores(gpg.leaderboards[i].id, null, "PUBLIC", function(scoresList){
                            stage_leaderboard.memory.HDD.leaderboards[i][0] = scoresList;
                        });
                    })(i);
                }
                for(var i = 0; i < 4; i++){
                    (function(i){
                        gpg.listScores(gpg.leaderboards[i].id, null, "SOCIAL", function(scoresList){
                            stage_leaderboard.memory.HDD.leaderboards[i][1] = scoresList;
                        });
                    })(i);
                }
                
                stage_leaderboard.memory.save();
            })
        }
    }
});