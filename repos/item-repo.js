function buyItem(pool, playerid, itemid, wecasualpoints, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'UPDATE player SET wecasualpoints = (wecasualpoints - $1) WHERE playerid = $2 AND wecasualpoints >= $1';
      var values = [wecasualpoints, playerid]
      client.query(queryString, values, function(err, result){
        if(err){
          client.release();
          callback && callback(err, null);
        }
        else if(result.rowCount == 0) {      //Check if player had enough points
          client.release();
          callback && callback(true, result);
        }
        else{
          var queryString = 'INSERT INTO playeritem (playerid, itemid) VALUES ($1, $2)';
          var values = [playerid, itemid]
          client.query(queryString, values, function(err){
            client.release();
            if(err){

              callback && callback(err);
            }
            else {
              callback && callback(null, result);
            }
          });
        }
      });
    }
  });
}

function getItem(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM item ORDER BY wecasualpoints';
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

function getPlayerItem(pool, playerid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM item JOIN playeritem ON item.itemid = playeritem.itemid WHERE playeritem.playerid = $1';
      var values = [playerid];
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

module.exports = pool => {
  return{
    buyItem: buyItem.bind(null, pool),
    getItem: getItem.bind(null, pool),
    getPlayerItem: getPlayerItem.bind(null, pool)
  }
}
