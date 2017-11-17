function gameSignup(pool, game_id, info, table, callback){
  pool(table).update(game_id, info, function(err) {
    if (err) { callback && callback(err)}
    else { callback && callback(null); }
  });
}

function scheduleGame(pool, info, table, callback){
  pool(table).create(info, function(err, record) {
    if (err) { callback && callback(err, null)}
    else{
      callback && callback(null, record);
    }
  });
}

function getAllSchedule(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT playergame.team, playergame.playerid, game.gameid, game.name, game.gametime, game.discordroom, game.pubsession FROM game INNER JOIN playergame ON game.gameid = playergame.gameid ORDER BY game.gameid';
      //WHERE game.gametime > NOW() '
      // console.log(queryString);
      client.query(queryString, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows[0]);
          // console.log(games);
          callback && callback(null, result.rows);
        }
      });
    }
  });
}
// function getAllSchedule(pool, table, callback){
//   var schedule = new Array();
//   pool(table).select({
//     view: 'Grid view'
//   }).eachPage(function page(records, fetchNextPage) {
//       // This function (`page`) will get called for each page of records.
//       records.forEach(function(record) {
//         schedule.push(record);
//       });
//       // To fetch the next page of records, call `fetchNextPage`.
//       // If there are more records, `page` will get called again.
//       // If there are no more records, `done` will get called.
//       fetchNextPage();
//
//   }, function done(err) {
//     if (err) { callback && callback(err, null) }
//     else{ callback && callback(null, schedule); }
//   });
// }

function getPlayerSchedule(pool, id, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM game INNER JOIN playergame ON game.gameid = playergame.gameid WHERE playergame.playerid = $1';
      //AND game.gametime > NOW() ORDER BY game.gametime';
      var values = [id];
      // console.log(queryString);
      // console.log(values);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows);
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

function getSingleGame(pool, table, id, callback){
  pool(table).find(id, function(err, record){
    if (err) { callback && callback(err, null)}
    else { callback && callback(null, record) }
  });
}

module.exports = pool => {
  return{
    gameSignup: gameSignup.bind(null, pool),
    scheduleGame: scheduleGame.bind(null, pool),
    getAllSchedule: getAllSchedule.bind(null, pool),
    getSingleGame: getSingleGame.bind(null, pool),
    getPlayerSchedule: getPlayerSchedule.bind(null, pool)
  }
}
