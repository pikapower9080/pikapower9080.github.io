// === G O O G L E   A N A L Y T I C S ===
if(!window.chrome){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-40610196-1x']);
    _gaq.push(['_trackPageview']);
    
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}else{
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-41282664-2']);
    _gaq.push(['_trackPageview']);
}


// === G O O G L E   P L A Y   G A M E S ===

gapiIsLoaded = function() {
  //window.setTimeout(startGameForReal, 1);
}

gpg = {
    authorized: false,
    leaderboards: [],
    
    authorize: function(callback){
        if(gapi === undefined || !gapi) return;
        gapi.auth.authorize({client_id: '1044657023273-75c3qq3834h9fb7dm1rb4jmg88q845or.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/games',
            immediate: true},
          function(result){
              if (result && !result.error) {
                // Start the game!
                gpg.authorized = true;
                gpg.getGamesAPI(function(){ if(callback) callback(result); });
                
              } else {
                gpg.authorized = false;
                // Display the login link or button
                gpg.authorizeDialog(callback);
              }
          });
    },
    
    authorizeSilent: function(callback){
        if(gapi === undefined || !gapi) return;
        gapi.auth.authorize({client_id: '1044657023273-75c3qq3834h9fb7dm1rb4jmg88q845or.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/games',
            immediate: true},
          function(result){
              if (result && !result.error) {
                gpg.authorized = true;
                gpg.getGamesAPI(function(){ if(callback) callback(result); });
              } else {
                gpg.authorized = false;
              }
          });
    },
    
    authorizeDialog: function(callback){
        if(gapi === undefined || !gapi) return;
        gapi.auth.authorize({client_id: '1044657023273-75c3qq3834h9fb7dm1rb4jmg88q845or.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/games',
            immediate: false},
          function(result){
              if (result && !result.error) {
                gpg.authorized = true;
                gpg.getGamesAPI(function(){ if(callback) callback(result); });
              } else {
                gpg.authorized = false;
              }
          });
    },
    
    getGamesAPI: function(callback){
        if(gapi === undefined || !gapi) return;
		
		// Ready to make calls!
		gpg.getLeaderboards();
		if(callback) callback();
    },
    
    getLeaderboards: function(callback){
        if(gapi === undefined || !gapi) return;
        gapi.client.request({
			path: "/games/v1/leaderboards",
          	params: {maxResults: 5},
			callback: function(response){
				// Do something interesting with the response
				console.log(response);
				gpg.leaderboards = response.items;
				if(callback) callback();
			}
        });
    },
    
    getAllTimeHighScore: function(leaderboardId, callback){
        if(gapi === undefined || !gapi) return;
		gapi.client.request({
			path: "/games/v1/leaderboards/" + (leaderboardId || gpg.leaderboards[0].id),
          	params: {
				playerId: "me",
				timeSpan: "ALL_TIME",
				includeRankType: "ALL",
				leaderboardId: gpg.leaderboards[0].id
			},
			callback: function(response){
				console.log(response);
				if(callback) callback(response);
			}
        });
    },
    
    listScores: function(leaderboardId, timeSpan, rankType, callback){
        if(gapi === undefined || !gapi) return;
		gapi.client.request({
			path: "/games/v1/leaderboards/" + (leaderboardId || gpg.leaderboards[0].id) + "/window/" + (rankType || "PUBLIC"),
          	params: {timeSpan: timeSpan || "ALL_TIME"},
			callback: function(response){
				console.log(response);
				if(callback) callback(response);
			}
        });
    },
    
    submitScore: function(playerScore, leaderboardId, callback){
        if(gapi === undefined || !gapi) return;
		gapi.client.request({
			method: "POST",
			path: "/games/v1/leaderboards/" + (leaderboardId || gpg.leaderboards[0].id) + "/scores",
          	params: {score : playerScore, leaderboardId: leaderboardId || gpg.leaderboards[0].id},
			callback: function(response){
				console.log(response);
				if(callback) callback(response);
			}
        });
    }
}



