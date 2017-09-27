function getTeam(pool, teamid, callback){

}

function getAllTeams(pool, callback){

}

function createTeam(pool, roster, callback){
  pool.connect(function(err, client){
    if(err){
      callback && callback(err);
      return console.error(err);
    }
    var queryString = "INSERT INTO teams (roster) VALUES (" + "'" + [JSON.stringify(roster)].join("','") + "'" + ")";
    client.query(queryString, function(err, result){
      if(err){
        callback && callback(err);
        return console.error(err);
      }
      callback && callback(null);
      client.end();
    });
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
