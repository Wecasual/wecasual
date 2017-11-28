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

module.exports = pool => {
  return{
    getPlayerChallenge: getPlayerChallenge.bind(null, pool),
    getAvailableChallenge: getAvailableChallenge.bind(null, pool),
  }
}
