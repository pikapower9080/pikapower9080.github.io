stage_title = pyro.createStage({
	id: "Title Screen",
	viewport: "main",
	camera: "titleScreen",
	enabled: false,
	paused: true,
	hasAudio: true,
	onCreate: function(){
		//Load UI stage
		this.loadMap("Title Screen - Dark");

		this.input.bind({
			alias: "Select",
			keys: {up: [13, 32]},
			mouse: {
				click: [0,1],
                textClass: "Start Game"
			},
            gamepad: {
                firstDown: [0,1,2,3,4,5,6,7,8,9,10,11]  
            },
			callback: function(stage, events){
                if(events[0].objects && events[0].objects[0].textClass != this.mouse.textClass) return; 
                stage.callAction("moveOn");
			}
		});
        
        this.input.bind({
            alias: "Leaderboards",
            mouse: {
    			click: [0,1],
                textClass: "Leaderboards"
            },
            callback: function(stage, events){
                if(events[0].objects[0].textClass != this.mouse.textClass) return;
                stage_transition.sequences.FadeIn.start(false, function(){
                    stage_title.stop();
                    stage_leaderboard.start();
                });
            }
        });
        
        this.input.bind({
            alias: "Facebook",
            mouse: {
    			click: [0,1],
                entityClass: "Facebook"
            },
            callback: function(stage, events){
                window.open("https://www.facebook.com/happyfridaygame");
            }
        });
        
        pyro.getCamera("titleScreen").zoom = 1;
        pyro.getCamera("titleScreen").boundToStage = false;
         //pyro.getCamera("titleScreen").followType = "Static";
        this.backgroundMusic = this.audio.cacheAudio({url: "audio/music/title.ogg", isMusic: true, playOnComplete: false, defaultGain: 0.45, loop: true});
       },
	onReady: function(){
    	this.alpha = 1;
        stage_transition.sequences.FadeOut.start();
    	this.sequences.Present.start();
        
        gpg.authorizeSilent(function(){
            gpg.getLeaderboards(function(){
                
            });
        });
        
        pyro.getCamera("titleScreen").position.matrix[0] = -1000;
        this.presentationProgress = 0;
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
		this.sequences['Present'].start();
	},
	onUpdate: function(){
        this.presentationProgress += 0.5;
        cameraY = pyro.getCamera("titleScreen").position.matrix[0];
        if(cameraY < 0){
            percent = this.presentationProgress / 100;
            pyro.getCamera("titleScreen").position.matrix[0] = cameraY + (0-cameraY)*(1-Math.pow(1-percent,2));
            //return a + (b-a)*(1-Math.pow(1-percent,2)); 
	    }
	},
    actions: {
        wait: function(){
            //Do nothing
        },
        moveOn: function(){
            stage_transition.sequences.FadeIn.start(false, function(){
                stage_title.stop();
                stage_gameplay.start();
            });
        },
        playMusic: function(val){
		    if(stage_title.backgroundMusic) stage_title.backgroundMusic.play();
        }
    },
    sequences: {
        'Present': [
            ["actions.wait", null, 4],
            ["actions.playMusic", [1], 30]
        ]
	}
});