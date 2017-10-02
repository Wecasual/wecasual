function createScheduleSubmit(scheduleRepo, teamsRepo, req, res){
  //console.log(req.body);
  scheduleRepo.createGame(req.body.team1, req.body.team2, req.body.date, function(err, id){
    if(err){
      res.send({
        success: false,
        error: 'Error scheduling game'
      });
    }
    else{
      res.send({
        success: true,
        message: 'Game scheduled with id: ' + id
      });
    }
  });
}

function getAllSchedule(scheduleRepo, req, res){
  scheduleRepo.getAllSchedule(function(err, result){
    if(err){
      res.send({
        success: false,
        error: 'Error fetching schedule'
      });
    }
    else{
      res.send({
        success: true,
        data: result
      });
    }
  });
}

module.exports = (scheduleRepo, teamsRepo) => {
  return{
    createScheduleSubmit: {
      route: '/schedule/create-schedule/submit',
      handler: createScheduleSubmit.bind(null, scheduleRepo, teamsRepo)
    },
    getAllSchedule: {
      route:'/schedule/getAllSchedule',
      handler: getAllSchedule.bind(null, scheduleRepo)
    }
  }
}
