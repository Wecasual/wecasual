function gameSignup(scheduleRepo, req, res){
  var data = req.body.game.split("|");
  var game_id = data[0].split(",")[0];
  var team1 = data[1].split(",");
  var team2 = data[2].split(",");
  var table = data[3].split(",")[0];
  if(team1[0] == 'undefined'){
    team1 = new Array();
  }
  if(team2[0] == 'undefined'){
    team2 = new Array();
  }
  // console.log(team1);
  // console.log(team2);
  scheduleRepo.gameSignup(req.body.team, game_id, req.user['Id'], team1, team2, table, function(err){
    if(err){
      console.log(err);
      req.session.message = "Error signing up."
    }
    else{
      // console.log("Success");
      req.session.message = "Signed up on " + req.body.team;
      if(req.session.realm == "dota"){
        res.redirect('/dota');
      }
      else if(req.session.realm == "lol"){
        res.redirect('/lol');
      }
    }
  });
}

function getAllSchedule(scheduleRepo, req, res){
  scheduleRepo.getAllSchedule(req.body.table, function(err, schedule){
    // console.log('test');
    // console.log(schedule);
    var other_games = new Array();
    var my_games = new Array();
    // console.log(schedule);
    var date = new Date();
    schedule.forEach(function(ele){
      if(new Date(ele.fields['Game Time']) >= date)
      {
        var alreadySignedUp = false;
        if(ele.fields['Team 1']){
          if(ele.fields['Team 1'].includes(req.user['Id'])){
            alreadySignedUp = true;
          }
        }
        if(ele.fields['Team 2']){
          if(ele.fields['Team 2'].includes(req.user['Id'])){
            alreadySignedUp = true;
          }
        }
        if(!alreadySignedUp){
          other_games.push(ele);
        }
        if(alreadySignedUp){
          my_games.push(ele);
        }
      }
    });
    other_games.sort(function(a,b){
      var c = new Date(a.fields['Game Time']);
      var d = new Date(b.fields['Game Time']);
      return c-d;
    });
    my_games.sort(function(a,b){
      var c = new Date(a.fields['Game Time']);
      var d = new Date(b.fields['Game Time']);
      return c-d;
    });
    if(err){
      res.send({
        success: false,
        error: 'Unable to retrieve game schedule'
      });
    }
    else{
      res.send({
        success: true,
        data: {
          user_id: req.user['Id'],
          other_games: other_games,
          my_games: my_games
        }
      });
    }
  });
}

module.exports = (scheduleRepo) => {
  return{
    gameSignup: {
      route: '/schedule/gameSignup',
      handler: gameSignup.bind(null, scheduleRepo)
    },
    getAllSchedule: {
      route:'/schedule/getAllSchedule',
      handler: getAllSchedule.bind(null, scheduleRepo)
    }
  }
}
