function gameSignup(pool, playerid, gameid, team, quickLink, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO playergame (playerid, gameid, team) VALUES ($1, $2, $3)';
      var values = [playerid, gameid, team];
      client.query(queryString, values, function(err){
        if(err){
          client.release();
          callback && callback(err);
        }
        else {
          if(quickLink){
            var queryString = 'UPDATE game SET quicklinksignups = quicklinksignups + 1 WHERE gameid = $1';
            var values = [gameid];
            client.query(queryString, values, function(err){
              if(err){
                callback && callback(err);
              }
            });
          }
          var queryString = 'UPDATE player SET totalgames = totalgames + 1 WHERE playerid = $1';
          var values = [playerid];
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
      });
    }
  });
}

function scheduleGame(pool, info, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO game (name, gametime, discordroom, pubsession) VALUES ($1, $2, $3, $4) RETURNING *';
      var values = [info.name, info.gametime, info.discordroom, info.pubsession];
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

function getAllGame(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
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


function getSingleGame(pool, gameid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
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
  }
}
