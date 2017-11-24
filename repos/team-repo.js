//Returns selected data from all teams
function getAllTeams(pool, select, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT ' + select + 'FROM team';
      // console.log(queryString);
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

function getTeam(pool, teamid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM team WHERE teamid = $1';
      var values = [teamid];
      // console.log(queryString);
      client.query(queryString, values, function(err, team){
        if(err){
          client.release();
          callback && callback(err, null);
        }
        else {
          appendPlayerInfo(client, team.rows[0], callback);
        }
      });
    }
  });
}

function appendPlayerInfo(client, team, callback){
  var queryString = 'SELECT * FROM player JOIN playerteam ON player.playerid = playerteam.playerid WHERE playerteam.teamid = $1';
  var values = [team.teamid];
  client.query(queryString, values, function(err, player){
    client.release();
    if(err){
      callback && callback(err, null);
    }
    else {
      //Format info
      team.activeRoster = new Array();
      team.nonActiveRoster = new Array();
      for(var i = 0; i<player.rows.length; i++){
        if(player.rows[i].active){
          team.activeRoster.push(player.rows[i]);
        }
        else{
          team.nonActiveRoster.push(player.rows[i]);
        }
      }
      callback && callback(null, team);
    }
  });
}

module.exports = pool => {
  return{
    getAllTeams: getAllTeams.bind(null, pool),
    getTeam: getTeam.bind(null, pool)
  }
}
