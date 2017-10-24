function gameSignup(base, team, game_id, user_id, team1, team2, callback){
  if(team == "Team 1"){
    team1.unshift(user_id);
    base('Schedule').update(game_id, {
      "Team 1": team1
    }, function(err) {
      if (err) { callback && callback(err, null)}
      callback && callback(null, null);
    });
  }
  else if(team == "Team 2"){
    team2.unshift(user_id);
    // console.log(team2);
    base('Schedule').update(game_id, {
      "Team 2": team2
    }, function(err) {
      if (err) { callback && callback(err, null)}
      callback && callback(null, null);
    });
  }

}

function getAllSchedule(base, callback){
  var schedule = new Array();
  base('Schedule').select({
    view: 'Grid view'
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
        schedule.push(record);
      });
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(err) {
    if (err) { callback && callback(err, null) }
    else{
      callback && callback(null, schedule);
    }
  });
}

module.exports = base => {
  return{
    gameSignup: gameSignup.bind(null, base),
    // createGame: createGame.bind(null, pool),
    getAllSchedule: getAllSchedule.bind(null, base)
    // getOneSchedule: getOneSchedule.bind(null, pool),
    // updateAttendance: updateAttendance.bind(null, pool)
  }
}
