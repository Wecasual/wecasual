var url = require('url');
var moment = require('moment-timezone');

function gameSignup(scheduleRepo, req, res){
  var data = req.body.game.split("|");
  var team = req.body.team;
  var playerid = req.user.playerid;
  var gameid = data[0].split(",")[0];
  // var team1 = data[1].split(",");
  // var team2 = data[2].split(",");
  // var table = data[3].split(",")[0];
  var quickLink = data[3].split(",")[0];
  scheduleRepo.gameSignup(playerid, gameid, team, quickLink, function(err){
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
      req.session.message = "Signed up on team " + req.body.team;
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
  // var info = {};
  // scheduleRepo.getSingleGame(table, game_id, function(err, game){
  //   if(err){
  //     console.log(err);
  //     req.session.message = "Error signing up.";
  //     if(req.session.realm == "dota"){
  //       res.redirect('/dota');
  //     }
  //     else if(req.session.realm == "lol"){
  //       res.redirect('/lol');
  //     }
  //     else if(req.session.realm == "dota/quickLink"){
  //       res.redirect('/dota');
  //     }
  //   }
  //   else{
  //     var team1 = game.fields['Team 1'];
  //     var team2 = game.fields['Team 2'];
  //     // console.log(team2);
  //     if(team1 === undefined){
  //       team1 = new Array();
  //     }
  //     if(team2 === undefined){
  //       team2 = new Array();
  //     }
  //     // console.log(team1);
  //     // console.log(team2);
  //     if(team == "Team 1"){
  //       team1.unshift(user_id);
  //       info['Team 1'] = team1;
  //     }
  //     else if(team == "Team 2"){
  //       team2.unshift(user_id);
  //       info['Team 2'] = team2;
  //     }
  //     info['Quick Link Signups'] = parseInt(game.fields['Quick Link Signups']);
  //     // console.log(quickLink);
  //     if(quickLink === "true"){
  //       info['Quick Link Signups']++;
  //     }
  //     scheduleRepo.gameSignup(game_id, info, table, function(err){
  //       if(err){
  //         console.log(err);
  //         req.session.message = "Error signing up.";
  //         if(req.session.realm == "dota"){
  //           res.redirect('/dota');
  //         }
  //         else if(req.session.realm == "lol"){
  //           res.redirect('/lol');
  //         }
  //         else if(req.session.realm == "dota/quickLink"){
  //           res.redirect('/dota');
  //         }
  //       }
  //       else{
  //         req.session.message = "Signed up on " + req.body.team;
  //         if(req.session.realm == "dota"){
  //           res.redirect('/dota');
  //         }
  //         else if(req.session.realm == "lol"){
  //           res.redirect('/lol');
  //         }
  //         else if(req.session.realm == "dota/quickLink"){
  //           res.redirect('/dota');
  //         }
  //       }
  //     });
  //   }
  // });
}

function scheduleGame(scheduleRepo, discordBot, req, res){
  var date = req.body.date.split("-");
  var time = req.body.time.split(":");
  var formattedDate = moment.tz(req.body.date + " " + req.body.time, 'America/Toronto');
  var info = {
    "name": req.body.gameType,
    "discordroom": req.body.discordRoom,
    "gametime": formattedDate,//new Date(date[0], date[1]-1, date[2], time[0], time[1]),
    "pubsession": (req.body.pubSession === 'true')
  };
  // console.log("Time: ", info['Time']);
  // info['Time'] = toTimeZone(info['Time'], 'America/Toronto');
  // console.log("Game scheduled at", info['Time']);
  scheduleRepo.scheduleGame(info, function(err, game){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: "Unable to schedule game time"
      });
    }
    else{
      if(req.body.announce === 'true'){
        discordBot.postQuickLink([req.body.gameType, game.gametime, game.gameid, req.body.username]);
      }
      res.send({
        success: true,
        game: game,
        message: "Game scheduled"
      });
    }
  });
}

function toTimeZone(time, zone) {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment(time, format).tz(zone).format('YYYY/MM/DD hh:mmA ZZ');
}

function dotaQuickLink(req, res){
  res.render('pages/quick-link-signup', {user: req.user});
}

function getSingleGame(scheduleRepo, req, res){
  scheduleRepo.getSingleGame(req.body.gameid, function(err, game){
    if(err){
      res.send({
        success: false,
        error: 'Unable to retrieve game'
      });
    }
    else{
      var team1 = new Array();
      var team2 = new Array();
      var prevPlayergame
      game.forEach(function(playergame){
          if(playergame.team == 1){team1.push(playergame.playerid);}
          else if(playergame.team == 2){team2.push(playergame.playerid);}
          prevPlayergame = playergame;
      });
      var gameInfo = {gameid: prevPlayergame.gameid,
      name: prevPlayergame.name,
      gametime: toTimeZone(prevPlayergame.gametime,'America/Toronto'),
      discordroom: prevPlayergame.discordroom,
      pubsession: prevPlayergame.pubsession,
      team1: team1,
      team2: team2,
      team1Slots: team1.length + "/5",
      team2Slots: team2.length + "/5"};
      if(team1.includes(req.user.playerid) || team2.includes(req.user.playerid)){
        res.send({
          success: false,
          error: 'You have already signed up for this game'
        });
      }
      else if(gameInfo.gametime < new Date()){
        res.send({
          success: false,
          error: 'Signup is closed for this game'
        });
      }
      else{
        res.send({
          success: true,
          data: gameInfo
        });
      }
    }
  });
}

function getAllSchedule(scheduleRepo, req, res){
  scheduleRepo.getAllGame(function(err, schedule){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to retrieve game schedule'
      });
    }
    else{
      var myGames = new Array();
      var otherGames = new Array();
      if(schedule.length){
        var currentGameid = schedule[0].gameid;
        var team1 = new Array();
        var team2 = new Array();
        var prevPlayergame;
        schedule.forEach(function(playergame){
          // console.log(playergame.name);
          if(playergame.gameid == currentGameid){
            if(playergame.team == 1){team1.push(playergame.playerid);}
            else if(playergame.team == 2){team2.push(playergame.playerid);}
            prevPlayergame = playergame;
          }
          else{
            var gameInfo = {gameid: prevPlayergame.gameid,
            name: prevPlayergame.name,
            gametime: toTimeZone(prevPlayergame.gametime,'America/Toronto'),
            discordroom: prevPlayergame.discordroom,
            pubsession: prevPlayergame.pubsession,
            team1: team1,
            team2: team2,
            team1Slots: team1.length + "/5",
            team2Slots: team2.length + "/5"};
            if(team1.includes(req.user.playerid) || team2.includes(req.user.playerid)){ myGames.push(gameInfo);}
            else{ otherGames.push(gameInfo);}
            team1 = new Array();
            team2 = new Array();
            if(playergame.team == 1){team1.push(playergame.playerid);}
            else if(playergame.team == 2){team2.push(playergame.playerid);}
            currentGameid = playergame.gameid
            prevPlayergame = playergame;
          }
        });

        //Push the last game onto the list
        var gameInfo = {gameid: prevPlayergame.gameid,
        name: prevPlayergame.name,
        gametime: toTimeZone(prevPlayergame.gametime,'America/Toronto'),
        discordroom: prevPlayergame.discordroom,
        pubsession: prevPlayergame.pubsession,
        team1: team1,
        team2: team2,
        team1Slots: team1.length + "/5",
        team2Slots: team2.length + "/5"};
        if(team1.includes(req.user.playerid) || team2.includes(req.user.playerid)){ myGames.push(gameInfo);}
        else{ otherGames.push(gameInfo);}

        otherGames.sort(function(a, b) {
          return a.gametime>b.gametime ? -1 : a.gametime<b.gametime ? 1 : 0;
        });
        myGames.sort(function(a, b) {
          return a.gametime>b.gametime ? -1 : a.gametime<b.gametime ? 1 : 0;
        });
      }
      res.send({
       success: true,
       data: {
         otherGames: otherGames,
         myGames: myGames,
         playerid: req.user.playerid
       }
     });
    }
  });
}

function getRangeSchedule(scheduleRepo, req, res){
  console.log(req.body.startDate);
  console.log(req.body.endDate);
  scheduleRepo.getRangeGame(req.body.startDate, req.body.endDate, function(err, schedule){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to retrieve game schedule'
      });
    }
    else{
      var games = new Array();
      if(schedule.length){
        var currentGameid = schedule[0].gameid;
        var team1 = new Array();
        var team2 = new Array();
        var prevPlayergame;
        schedule.forEach(function(playergame){
          // console.log(playergame.name);
          if(playergame.gameid == currentGameid){
            if(playergame.team == 1){team1.push(playergame.playerid);}
            else if(playergame.team == 2){team2.push(playergame.playerid);}
            prevPlayergame = playergame;
          }
          else{
            var gameInfo = {gameid: prevPlayergame.gameid,
            name: prevPlayergame.name,
            gametime: toTimeZone(prevPlayergame.gametime,'America/Toronto'),
            discordroom: prevPlayergame.discordroom,
            pubsession: prevPlayergame.pubsession,
            team1: team1,
            team2: team2,
            team1Slots: team1.length + "/5",
            team2Slots: team2.length + "/5"};
            games.push(gameInfo);
            team1 = new Array();
            team2 = new Array();
            if(playergame.team == 1){team1.push(playergame.playerid);}
            else if(playergame.team == 2){team2.push(playergame.playerid);}
            currentGameid = playergame.gameid
            prevPlayergame = playergame;
          }
        });

        //Push the last game onto the list
        var gameInfo = {gameid: prevPlayergame.gameid,
        name: prevPlayergame.name,
        gametime: toTimeZone(prevPlayergame.gametime,'America/Toronto'),
        discordroom: prevPlayergame.discordroom,
        pubsession: prevPlayergame.pubsession,
        team1: team1,
        team2: team2,
        team1Slots: team1.length + "/5",
        team2Slots: team2.length + "/5"};
        games.push(gameInfo);

        games.sort(function(a, b) {
          return a.gametime>b.gametime ? -1 : a.gametime<b.gametime ? 1 : 0;
        });
      }
      res.send({
       success: true,
       data: games
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
    },
    getRangeSchedule: {
      route: '/schedule/getRangeSchedule',
      handler: getRangeSchedule.bind(null, scheduleRepo)
    }
  }
}
