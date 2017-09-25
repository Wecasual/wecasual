function getTeam(pool, teamid, callback){

}

function getAllTeams(pool, callback){

}

function createTeam(pool, user, userList, body, callback){
  pool.connect(function(err, client){
    if(err){
      callback && callback(true);
      return console.error('error', err);
    }
    console.log(body.email);
    console.log(body.password);
    console.log(body.checkbox);
    client.end();
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
