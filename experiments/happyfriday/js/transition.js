stage_transition = pyro.createStage({
    id: "Transition",
	viewport: "main",
	camera: "ui",
	enabled: true,
	paused: false,
	onCreate: function(){
		this.backgroundColor = "#FFF";
    },
	onReady: function(){
        this.sequences.FadeOut.start();
	},
	onStop: function(){
        
	},
	onPause: function(){
        
	},
	onResume: function(){
        
	},
	onUpdate: function(){
        
	},
    actions: {
        setAlpha: function(percent){
            //easeIn:    function(a,b,percent) { return a + (b-a)*Math.pow(percent,2);                           },
        	//easeOut:   function(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
    		//easeInOut: function(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
            pyro.getStage("Transition").alpha = 0 + (1-0)*(1-Math.pow(1-percent,2));
        },
    },
    sequences: {
        'FadeIn': [
            ["actions.setAlpha", [0], 1],
            ["actions.setAlpha", [0.1], 1],
            ["actions.setAlpha", [0.2], 1],
			["actions.setAlpha", [0.3], 1],
			["actions.setAlpha", [0.4], 1],
			["actions.setAlpha", [0.5], 1],
			["actions.setAlpha", [0.6], 1],
			["actions.setAlpha", [0.7], 1],
            ["actions.setAlpha", [0.8], 1],
            ["actions.setAlpha", [0.9], 1],
            ["actions.setAlpha", [1], 3]
        ],
        'FadeOut': [
            ["actions.setAlpha", [1], 1],
            ["actions.setAlpha", [0.9], 1],
			["actions.setAlpha", [0.8], 1],
			["actions.setAlpha", [0.7], 1],
			["actions.setAlpha", [0.6], 1],
			["actions.setAlpha", [0.5], 1],
			["actions.setAlpha", [0.4], 1],
			["actions.setAlpha", [0.3], 1],
            ["actions.setAlpha", [0.2], 1],
            ["actions.setAlpha", [0.1], 1],
            ["actions.setAlpha", [0], 1]
        ]
	}
});