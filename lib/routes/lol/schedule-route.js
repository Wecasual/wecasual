// var gf = require('./../../repos/globalFuncs')();
//
// function createScheduleSubmit(scheduleRepo, teamsRepo, req, res){
//   //console.log(req.body);
//   teamsRepo.getTeam(req.body.team1, function(err, team1Info){
//     if(err){
//       res.send({
//         success: false,
//         error: 'Error scheduling game'
//       });
//     }
//     else{
//       teamsRepo.getTeam(req.body.team2, function(err, team2Info){
//         if(err){
//           res.send({
//             success: false,
//             error: 'Error scheduling game'
//           });
//         }
//         else{
//           var attendance1 = {};
//           var attendance2 = {};
//           for(var i = 0; i < 5; i++){
//             attendance1[team1Info.roster["p"+(i+1)].id] = "No Response";
//             attendance2[team2Info.roster["p"+(i+1)].id] = "No Response";
//           }
//           // console.log(attendance1);
//           // console.log(attendance2);
//           scheduleRepo.createGame(req.body.team1, req.body.team2, req.body.date, attendance1, attendance2, function(err, id){
//             if(err){
//               res.send({
//                 success: false,
//                 error: 'Error scheduling game'
//               });
//             }
//             else{
//               res.send({
//                 success: true,
//                 message: 'Game scheduled with id: ' + id
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// }
//
// function getAllSchedule(scheduleRepo, req, res){
//   scheduleRepo.getAllSchedule(function(err, result){
//     if(err){
//       res.send({
//         success: false,
//         error: 'Error fetching schedule'
//       });
//     }
//     else{
//       res.send({
//         success: true,
//         data: result
//       });
//     }
//   });
// }

function gameSignup(scheduleRepo, req, res){
  var data = req.body.game.split("|");
  var game_id = data[0].split(",")[0];
  var team1 = data[1].split(",");
  var team2 = data[2].split(",");
  if(team1[0] == 'undefined'){
    team1 = new Array();
  }
  if(team2[0] == 'undefined'){
    team2 = new Array();
  }
  // console.log(team1);
  // console.log(team2);
  scheduleRepo.gameSignup(req.body.team, game_id, req.user['Id'], team1, team2, function(err){
    if(err){
      console.log(err);
      req.session.message = "Error signing up."
    }
    else{
      // console.log("Success");
      req.session.message = "Signed up on " + req.body.team;
      res.redirect('/');
    }
  });
}

function getAllSchedule(scheduleRepo, req, res){
  scheduleRepo.getAllSchedule(function(err, schedule){
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
    // createScheduleSubmit: {
    //   route: '/schedule/create-schedule/submit',
    //   handler: createScheduleSubmit.bind(null, scheduleRepo, teamsRepo)
    // },
    getAllSchedule: {
      route:'/schedule/getAllSchedule',
      handler: getAllSchedule.bind(null, scheduleRepo)
    }
  }
}
