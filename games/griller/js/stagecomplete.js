stage_complete = pyro.createStage({
	id: "Stage Complete",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: true,
	alpha: 0,
	hasAudio: true,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Stage Complete - New");
		
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
				stage_gameplay.start();
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
				stage_gameplay.start();
				stage.pause();
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
				    stage_leaderboard.callAction("submitScores", function(){
				        stage_leaderboard.callAction("refreshLeaderboards");
				    });
				});
			}
		});
        
        this.input.bind({
    		alias: "Quit",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1],
				textClass: "Quit"
			},
            gamepad: {
                up: [0]  
            },
			callback: function(stage, events){
                stage_transition.sequences.FadeIn.start(false, function(){
				    stage_complete.pause();
				    pyro.getStage("Title Screen").start();
                });
			}
		});
        
        this.onlineRank = "Wait...";
        
        this.backgroundMusic = this.audio.cacheAudio({url: "audio/music/gameover.ogg", isMusic: true, defaultGain: 0.15, loop: true});
	},
	onReady: function(){
		this.alpha = 1;
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
		
		gpg.authorizeSilent(function(){
		    stage_leaderboard.callAction("submitScores", function(){
		        stage_leaderboard.callAction("refreshLeaderboards");
		    });
		});
        
        //this.layers[1].getObjectsByClass("Final Score")[0].text = stage_gameplay.memory.RAM.baddiesDefeated;
        this.layers[1].getObjectsByClass("Total Score")[0].text = numberWithCommas(this.callAction("calculateScore"));
        this.layers[1].getObjectsByClass("Top Score")[0].text = numberWithCommas(stage_gameplay.memory.HDD.highScore);
        
        this.layers[1].getObjectsByClass("Time Bonus")[0].text = moment(stage_gameplay.memory.RAM.timePlayed * 30).format("m:ss.SS");
        this.layers[1].getObjectsByClass("Best Time")[0].text = moment(stage_gameplay.memory.HDD.bestTime * 30).format("m:ss.SS");
        
        this.layers[1].getObjectsByClass("Baddies Defeated")[0].text = stage_gameplay.memory.RAM.baddiesDefeated;
        this.layers[1].getObjectsByClass("Most Baddies Defeated")[0].text = stage_gameplay.memory.HDD.bestBaddyCount;
        
        this.layers[1].getObjectsByClass("Combo Bonus")[0].text = stage_gameplay.memory.RAM.highestCombo;
        this.layers[1].getObjectsByClass("Best Combo")[0].text = stage_gameplay.memory.HDD.highestCombo;
        
        stage_transition.sequences.FadeOut.start();
	},
	onUpdate: function(){
	    
	    this.layers[2].alpha = (gpg.authorized)?0:1;
        
        this.layers[0].position.matrix[0] += 2;
        this.layers[0].position.matrix[1] += 2;
        if(this.layers[0].position.matrix[0] > 96){
            //this.layers[0].position.set([0,0]);
            this.layers[0].position.matrix[0] = 0;
            this.layers[0].position.matrix[1] = 0;
        }
        
        //this.layers[1].getObjectsByClass("Online Rank")[0].text = this.onlineRank;
        if((function(){
            for(var i = 0; i < 4; i++){
                if(!stage_leaderboard.memory.HDD.leaderboards[i][0] || !stage_leaderboard.memory.HDD.leaderboards[i][1] || !stage_leaderboard.memory.HDD.leaderboards[i][0].playerScore || !stage_leaderboard.memory.HDD.leaderboards[i][1].playerScore) return false;
            }
            return true;
        })()){
        	for(var i = 0; i < 4; i++){
        		for(var j = 0; j < 2; j++){
        			if(!stage_leaderboard.memory.HDD.leaderboards[i][j].playerScore.formattedScoreRank) stage_leaderboard.memory.HDD.leaderboards[i][j].playerScore.formattedScoreRank = "N/A";
        		}
        	}

            this.layers[1].getObjectsByClass("Public Rank Score")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[0][0].playerScore.formattedScoreRank);
            this.layers[1].getObjectsByClass("Social Rank Score")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[0][1].playerScore.formattedScoreRank);
    
            this.layers[1].getObjectsByClass("Public Rank Time")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[1][0].playerScore.formattedScoreRank);
            this.layers[1].getObjectsByClass("Social Rank Time")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[1][1].playerScore.formattedScoreRank);
    
            this.layers[1].getObjectsByClass("Public Rank Baddies")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[2][0].playerScore.formattedScoreRank);
            this.layers[1].getObjectsByClass("Social Rank Baddies")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[2][1].playerScore.formattedScoreRank);
            
            this.layers[1].getObjectsByClass("Public Rank Combo")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[3][0].playerScore.formattedScoreRank);
            this.layers[1].getObjectsByClass("Social Rank Combo")[0].text = parseInt(stage_leaderboard.memory.HDD.leaderboards[3][1].playerScore.formattedScoreRank);
            
            this.layers[1].getObjectsByClass("Public Rank Score Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[0][0].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
            this.layers[1].getObjectsByClass("Social Rank Score Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[0][1].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
    
            this.layers[1].getObjectsByClass("Public Rank Time Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[1][0].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
            this.layers[1].getObjectsByClass("Social Rank Time Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[1][1].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
    
            this.layers[1].getObjectsByClass("Public Rank Baddies Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[2][0].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
            this.layers[1].getObjectsByClass("Social Rank Baddies Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[2][1].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
            
            this.layers[1].getObjectsByClass("Public Rank Combo Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[3][0].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
            this.layers[1].getObjectsByClass("Social Rank Combo Suffix")[0].text = stage_leaderboard.memory.HDD.leaderboards[3][1].playerScore.formattedScoreRank.replace(/[0-9]/g, '');
        }
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
        calculateScore: function(){
            totalScore = stage_gameplay.memory.RAM.totalScore;//(stage_gameplay.memory.RAM.totalScore + (stage_gameplay.memory.RAM.timePlayed * 100) + (stage_gameplay.memory.RAM.baddiesDefeated * 100)) * stage_gameplay.memory.RAM.highestCombo;
            if(totalScore > stage_gameplay.memory.HDD.highScore) stage_gameplay.memory.HDD.highScore = totalScore;
            return totalScore;
        }
    }
});