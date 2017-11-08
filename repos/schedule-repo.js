function gameSignup(base, game_id, info, table, callback){
  base(table).update(game_id, info, function(err) {
    if (err) { callback && callback(err)}
    else { callback && callback(null); }
  });
}

function scheduleGame(base, info, table, callback){
  base(table).create(info, function(err, record) {
    if (err) { callback && callback(err, null)}
    else{
      callback && callback(null, record);
    }
  });
}

function getAllSchedule(base, table, callback){
  var schedule = new Array();
  base(table).select({
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
    else{ callback && callback(null, schedule); }
  });
}

function getSingleGame(base, table, id, callback){
  base(table).find(id, function(err, record){
    if (err) { callback && callback(err, null)}
    else { callback && callback(null, record) }
  });
}

module.exports = base => {
  return{
    gameSignup: gameSignup.bind(null, base),
    scheduleGame: scheduleGame.bind(null, base),
    getAllSchedule: getAllSchedule.bind(null, base),
    getSingleGame: getSingleGame.bind(null, base)
  }
}
