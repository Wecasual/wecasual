function getTeam(pool, teamid, callback){
  pool.connect(function(err, client){
    if(err) {
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT * FROM teams WHERE id = " + teamid;
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null, result.rows[0]);
        }
      });
    }
  });
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
      var queryString = "INSERT INTO teams (name, roster) VALUES ('No Name', " + "'" + [JSON.stringify(roster)].join("','") + "'" + ") RETURNING id";
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

function updateTeam(pool, info, teamid, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    var queryString = 'UPDATE teams SET ';
    for(var i = 0; i < info.length; i++){
      queryString = queryString + info[i].field + '=' + info[i].value;
      if(i < info.length -1){
         queryString = queryString + ', ';
      }
    }
    queryString = queryString + ' WHERE id=\'' + teamid + '\'';
    //console.log(queryString);
    client.query(queryString, function(err, result){
      if(err){
        client.release();
        console.log(err);
        callback && callback(err);
      }
      else{
        client.release();
        //console.log("Update success");
        callback && callback();
      }
    });
  });
}

function deleteTeam(pool, teamid, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    var queryString = 'DELETE FROM teams WHERE id=' + teamid;
    console.log(queryString);
    client.query(queryString, function(err, result){
      if(err){
        client.release();
        console.log(err);
        callback && callback(err);
      }
      else{
        client.release();
        callback && callback(null);
      }
    });
  });
}
module.exports = pool => {
  return{
    getTeam: getTeam.bind(null, pool),
    getAllTeams: getAllTeams.bind(null, pool),
    createTeam: createTeam.bind(null, pool),
    joinTeam: joinTeam.bind(null, pool),
    updateTeam: updateTeam.bind(null, pool),
    deleteTeam: deleteTeam.bind(null, pool)
  }
}
