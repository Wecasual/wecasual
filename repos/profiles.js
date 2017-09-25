function createUser(client, id, profile, callback){
  var queryString = "INSERT INTO users (steamInfo) VALUES (" + "'" + [JSON.stringify(profile)].join("','") + "'" + ")";
  client.query(queryString, function(err, result){
     if(err){
       callback && callback(err);
       return console.error("Error creating new user", err);
     }
     console.log("Added user");
   });
}

function getUser(pool, identifier, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      client.end();
      callback && callback(err);
      return console.error("Error connecting", err);
    }
    id = identifier.slice(identifier.lastIndexOf('/')+1, identifier.length);
    var queryString = "SELECT * FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
    client.query(queryString, function(err, result){
      if(err){
        callback && callback(err);
        return console.error("Error selecting user", err);
      }
      if(result.rowCount == 0){
        createUser(client, id, profile, callback);
      }
      else{
        var queryString = "UPDATE users SET steaminfo = \'" + JSON.stringify(profile) + "\'WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
        client.query(queryString, function(err, result){
          if(err){
            callback && callback(err);
            return console.error("Error updating user info", err);
          }
        });
      }
      var queryString = "SELECT row_to_json(users) FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
      client.query(queryString, function(err, result){
        if(err){
          callback && callback(err);
          return console.error("Error fetching user info", err);
        }
        client.end();
        callback && callback(null, result.rows[0].row_to_json);
      });
    });
  });
}
function updateInfo(pool, info, callback, req, res){
  pool.connect(function(err, client){
    if(err){
      client.end();
      callback && callback(err);
      return console.error(err);
    }
    var count = 0;
    info.forEach(function(ele) {
      var queryString = "UPDATE users SET " + ele.field + " = \'" + ele.value + "\'WHERE id=" + req.user.id;
      client.query(queryString, function(err, result){
        if(err){
          callback && callback(err);
          return console.error(err);
        }
        req.user[ele.field] = ele.value;
        count++;
        if(count == info.length) {
          client.end();
          callback && callback();
        }
      });
    });
  });
}

function getAllUsers(pool, callback, req, res){
  pool.connect(function(err, client){
    if(err) {
      client.end();
      callback && callback(err);
      return console.error(err);
    }
    var queryString = "SELECT * FROM users";
    client.query(queryString, function(err, result){
      if(err){
        callback && callback(err);
        return console.error(err);
      }
      client.end();
      callback && callback(null, result.rows);
    });
  });
}

module.exports = pool => {
  return {
    getUser: getUser.bind(null, pool),
    updateInfo: updateInfo.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool)
  }
}
