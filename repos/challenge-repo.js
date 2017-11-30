function getPlayerChallenge(pool, playerid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM challenge JOIN playerchallenge ON challenge.challengeid = playerchallenge.challengeid WHERE playerchallenge.playerid = $1';
      var values = [playerid]
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

function getAvailableChallenge(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM challenge WHERE NOW() < startdate + interval \'1 week\'';
      client.query(queryString, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

function acceptChallenge(pool, playerid, challengeid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO playerchallenge (playerid, challengeid) VALUES ($1, $2)';
      var values = [playerid, challengeid];
      client.query(queryString, values, function(err){
        client.release();
        if(err){
          callback && callback(err);
        }
        else {
          callback && callback(null);
        }
      });
    }
  });
}

function completeChallenge(pool, playerid, challengeid, wecasualpoints, matchid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'UPDATE playerchallenge SET (completed, completeddate, matchid) = (TRUE, NOW(), $3) WHERE playerid = $1 AND challengeid = $2';
      var values = [playerid, challengeid, matchid];
      client.query(queryString, values, function(err){
        if(err){
          client.release();
          callback && callback(err);
        }
        else {
          var queryString = 'UPDATE player SET wecasualpoints = wecasualpoints + $2 WHERE playerid = $1';
          var values = [playerid, wecasualpoints]
          client.query(queryString, values, function(err){
            client.release();
            if(err){
              callback && callback(err);
            }
            else {
              callback && callback(null);
            }
          });
        }
      });
    }
  });
}

module.exports = pool => {
  return{
    getPlayerChallenge: getPlayerChallenge.bind(null, pool),
    getAvailableChallenge: getAvailableChallenge.bind(null, pool),
    acceptChallenge: acceptChallenge.bind(null, pool),
    completeChallenge: completeChallenge.bind(null, pool)
  }
}
