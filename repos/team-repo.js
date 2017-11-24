function getTeam(pool, teamid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT playergame.team, playergame.playerid, game.gameid, game.name, game.gametime, game.discordroom, game.pubsession FROM game LEFT OUTER JOIN playergame ON game.gameid = playergame.gameid WHERE game.gametime >= $1 AND game.gametime <= $2 ORDER BY game.gameid ';
      var values = [startDate, endDate];
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
    getTeam: getTeam.bind(null, pool)
  }
}
