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
  scheduleRepo.gameSignup(req.body.team, req.body.game, req.user['Id'], function(err){
    if(err){
      console.log(err);
    }
    else{
      // console.log("Success");
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
    schedule.forEach(function(ele){
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
