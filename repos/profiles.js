function createUser(client, id, profile, callback){
  var queryString = "INSERT INTO users (steamInfo) VALUES (" + "'" + [JSON.stringify(profile)].join("','") + "'" + ")";
  client.query(queryString, function(err, result){
     if(err){
       return console.error('error', err);
     }
     console.log("Added user");
   });
}

function getUser(pool, identifier, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      return console.error('error', err);
    }
    id = identifier.slice(identifier.lastIndexOf('/')+1, identifier.length);
    var queryString = "SELECT * FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
    client.query(queryString, function(err, result){
      if(err){
        return console.error('error', err);
      }

      if(result.rowCount == 0){
        createUser(client, id, profile, callback);
      }
      else{
        var queryString = "UPDATE users SET steaminfo = \'" + JSON.stringify(profile) + "\'WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
        client.query(queryString, function(err, result){
          if(err){
            return console.error('error', err);
          }
        });
      }
      var queryString = "SELECT row_to_json(users) FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
      client.query(queryString, function(err, result){
        if(err){
          return console.error('error', err);
        }
        callback && callback(result.rows[0].row_to_json);
        client.end();
      });
    });
  });
}

function updateEmail(pool, newEmail, callback, req, res){
  pool.connect(function(err, client){
    if(err){
      callback && callback(true);
      return console.error('error', err);
    }
    var queryString = "UPDATE users SET email = \'" + newEmail + "\'WHERE id=" + req.user.id;
    client.query(queryString, function(err, result){
      if(err){
        callback && callback(true);
        return console.error('error', err);
      }
      callback && callback(false);
      client.end();
    });
  });
}

function getAllUsers(pool, callback, req, res){
  pool.connect(function(err, client){
    if(err) {
      callback && callback();
      return console.error('error', err);
    }
    var queryString = "SELECT * FROM users";
    client.query(queryString, function(err, result){
      if(err){
        callback && callback();
        return console.error('error', err);
      }
      callback && callback(result.rows);
    });
  });
}

module.exports = pool => {
  return {
    getUser: getUser.bind(null, pool),
    updateEmail: updateEmail.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool)
  }
}
