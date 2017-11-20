function gameSignup(pool, playerid, gameid, team, quickLink, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO playergame (playerid, gameid, team) VALUES ($1, $2, $3)';
      var values = [playerid, gameid, team];
      //WHERE game.gametime > NOW() '
      // console.log(queryString);
      client.query(queryString, values, function(err){
        if(err){
          client.release();
          callback && callback(err);
        }
        else {
          if(quickLink){
            var queryString = 'UPDATE game SET quicklinksignups = quicklinksignups + 1 WHERE gameid = $1';
            var values = [gameid];
            //WHERE game.gametime > NOW() '
            // console.log(queryString);
            client.query(queryString, values, function(err){
              client.release();
              if(err){
                callback && callback(err);
              }
              else{
                callback && callback(null);
              }
            });
          }
          else{
            client.release();
            callback && callback(null);
          }
        }
      });
    }
  });
}
// function gameSignup(pool, game_id, info, table, callback){
//   pool(table).update(game_id, info, function(err) {
//     if (err) { callback && callback(err)}
//     else { callback && callback(null); }
//   });
// }
function scheduleGame(pool, info, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO game (name, gametime, discordroom, pubsession) VALUES ($1, $2, $3, $4) RETURNING *';
      var values = [info.name, info.gametime, info.discordroom, info.pubsession];
      //WHERE game.gametime > NOW() '
      // console.log(queryString);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows[0]);
          // console.log(games);
          callback && callback(null, result.rows[0]);
        }
      });
    }
  });
}

// function scheduleGame(pool, info, table, callback){
//   pool(table).create(info, function(err, record) {
//     if (err) { callback && callback(err, null)}
//     else{
//       callback && callback(null, record);
//     }
//   });
// }

function getAllGame(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      // var queryString = 'SELECT * FROM game';
      var queryString = 'SELECT playergame.team, playergame.playerid, game.gameid, game.name, game.gametime, game.discordroom, game.pubsession FROM game LEFT OUTER JOIN playergame ON game.gameid = playergame.gameid WHERE game.gametime > NOW() ORDER BY game.gameid ';
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

// function getPlayerSchedule(pool, id, callback){
//   pool.connect(function(err, client) {
//     if(err){
//       callback && callback(err);
//     }
//     else{
//       var queryString = 'SELECT * FROM game INNER JOIN playergame ON game.gameid = playergame.gameid WHERE playergame.playerid = $1 AND game.gametime > NOW() ORDER BY game.gametime';
//       //';
//       var values = [id];
//       // console.log(queryString);
//       // console.log(values);
//       client.query(queryString, values, function(err, result){
//         client.release();
//         if(err){
//           callback && callback(err, null);
//         }
//         else {
//           // console.log(result.rows);
//           callback && callback(null, result.rows);
//         }
//       });
//     }
//   });
// }

function getSingleGame(pool, gameid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      // var queryString = 'SELECT * FROM game';
      var queryString = 'SELECT playergame.team, playergame.playerid, game.gameid, game.name, game.gametime, game.discordroom, game.pubsession FROM game LEFT OUTER JOIN playergame ON game.gameid = playergame.gameid WHERE game.gameid = $1 ORDER BY game.gameid ';
      var values = [gameid];
      // console.log(queryString);
      client.query(queryString, values, function(err, result){
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

module.exports = pool => {
  return{
    gameSignup: gameSignup.bind(null, pool),
    scheduleGame: scheduleGame.bind(null, pool),
    getAllGame: getAllGame.bind(null, pool),
    getSingleGame: getSingleGame.bind(null, pool),
    // getPlayerSchedule: getPlayerSchedule.bind(null, pool)
  }
}
