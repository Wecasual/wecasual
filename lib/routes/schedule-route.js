var url = require('url');

function gameSignup(scheduleRepo, req, res){
  var data = req.body.game.split("|");
  var team = req.body.team;
  var user_id = req.user['Id'];
  var game_id = data[0].split(",")[0];
  var team1 = data[1].split(",");
  var team2 = data[2].split(",");
  var table = data[3].split(",")[0];
  var quickLinkSignups = data[4].split(",")[0];
  var info = {};
  if(team1[0] == 'undefined'){
    team1 = new Array();
  }
  if(team2[0] == 'undefined'){
    team2 = new Array();
  }
  // console.log(team1);
  // console.log(team2);
  if(team == "Team 1"){
    team1.unshift(user_id);
    info['Team 1'] = team1;
  }
  else if(team == "Team 2"){
    team2.unshift(user_id);
    info['Team 2'] = team2;
  }
  info['Quick Link Signups'] = parseInt(quickLinkSignups);
  scheduleRepo.gameSignup(game_id, info, table, function(err){
    if(err){
      console.log(err);
      req.session.message = "Error signing up.";
      if(req.session.realm == "dota"){
        res.redirect('/dota');
      }
      else if(req.session.realm == "lol"){
        res.redirect('/lol');
      }
      else if(req.session.realm == "dota/quickLink"){
        res.redirect('/dota');
      }
    }
    else{
      req.session.message = "Signed up on " + req.body.team;
      if(req.session.realm == "dota"){
        res.redirect('/dota');
      }
      else if(req.session.realm == "lol"){
        res.redirect('/lol');
      }
      else if(req.session.realm == "dota/quickLink"){
        res.redirect('/dota');
      }
    }
  });
}

function scheduleGame(scheduleRepo, discordBot, req, res){
  var date = req.body.date.split("-");
  var time = req.body.time.split(":");
  var info = {
    "Game": req.body.gameType,
    "Discord Room": req.body.discordRoom,
    "Time": new Date(date[0], date[1]-1, date[2], time[0], time[1]),
    "Pub Session": (req.body.pubSession === 'true'),
    "Quick Link Signups": 0
  };
  scheduleRepo.scheduleGame(info, req.body.table, function(err, record){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: "Unable to schedule game time"
      });
    }
    else{
      if(req.body.announce === 'true'){
        discordBot.postQuickLink([req.body.gameType, record.fields['Game Time'], record.id]);
      }
      res.send({
        success: true,
        message: "Game scheduled"
      });
    }
  });
}

function dotaQuickLink(req, res){
  res.render('pages/quick-link-signup', {user: req.user});
}

function getSingleGame(scheduleRepo, req, res){
  scheduleRepo.getSingleGame(req.body.table, req.body.id, function(err, game){
    if(err){
      res.send({
        success: false,
        error: 'Unable to retrieve game'
      });
    }
    else{
      var date = new Date();
      if(new Date(game.fields['Game Time']) >= date)
      {
        var alreadySignedUp = false;
        if(game.fields['Team 1']){
          if(game.fields['Team 1'].includes(req.user['Id'])){
            alreadySignedUp = true;
          }
        }
        if(game.fields['Team 2']){
          if(game.fields['Team 2'].includes(req.user['Id'])){
            alreadySignedUp = true;
          }
        }
        if(alreadySignedUp){
          res.send({
            success: false,
            error: 'You have already signed up for this game'
          });
        }
        else{
          res.send({
            success: true,
            data: game
          });
        }
      }
      else{
        res.send({
          success: false,
          error: 'Signup is closed for this game'
        });
      }
    }
  });
}

function getAllSchedule(scheduleRepo, req, res){
  scheduleRepo.getAllSchedule(req.body.table, function(err, schedule){
    if(err){
      res.send({
        success: false,
        error: 'Unable to retrieve game schedule'
      });
    }
    else{
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

module.exports = (scheduleRepo, discordBot) => {
  return{
    gameSignup: {
      route: '/schedule/gameSignup',
      handler: gameSignup.bind(null, scheduleRepo)
    },
    scheduleGame: {
      route: '/schedule/scheduleGame',
      handler: scheduleGame.bind(null, scheduleRepo, discordBot)
    },
    dotaQuickLink: {
      route: '/schedule/dota/quickLink',
      handler: dotaQuickLink.bind(null)
    },
    getSingleGame: {
      route: '/schedule/getSingleGame',
      handler: getSingleGame.bind(null, scheduleRepo)
    },
    getAllSchedule: {
      route:'/schedule/getAllSchedule',
      handler: getAllSchedule.bind(null, scheduleRepo)
    }
  }
}
