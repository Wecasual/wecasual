function getTeam(pool, teamid, callback){

}

function getAllTeams(pool, callback){
  pool.connect(function(err, client){
    if(err) {
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT * FROM teams";
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

function createTeam(pool, roster, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "INSERT INTO teams (roster) VALUES (" + "'" + [JSON.stringify(roster)].join("','") + "'" + ") RETURNING id";
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null, result.rows[0].id);
        }
      });
    }
  });
}

function joinTeam(client, user, callback){

}

module.exports = pool => {
  return{
    getTeam: getTeam.bind(null, pool),
    getAllTeams: getAllTeams.bind(null, pool),
    createTeam: createTeam.bind(null, pool),
    joinTeam: joinTeam.bind(null, pool)
  }
}
