function createUser(client, id, profile, callback){
  var queryString = "INSERT INTO users (steamInfo) VALUES (" + "'" + [JSON.stringify(profile)].join("','") + "'" + ")";
  client.query(queryString, function(err, result){
     if(err){
       callback && callback(err);
       return console.error(err);
     }
     console.log("Added user");
   });
}

function getUser(pool, identifier, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      client.end();
      callback && callback(err);
      return console.error(err);
    }
    id = identifier.slice(identifier.lastIndexOf('/')+1, identifier.length);
    var queryString = "SELECT * FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
    client.query(queryString, function(err, result){
      if(err){
        callback && callback(err);
        return console.error(err);
      }
      if(result.rowCount == 0){
        createUser(client, id, profile, callback);
      }
      else{
        var queryString = "UPDATE users SET steaminfo = \'" + JSON.stringify(profile) + "\'WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
        client.query(queryString, function(err, result){
          if(err){
            callback && callback(err);
            return console.error(err);
          }
        });
      }
      var queryString = "SELECT row_to_json(users) FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
      client.query(queryString, function(err, result){
        if(err){
          callback && callback(err);
          return console.error(err);
        }
        callback && callback(result.rows[0].row_to_json);
      });
    });
    client.end();
  });
}

// function updateEmail(pool, newEmail, callback, req, res){
//   pool.connect(function(err, client){
//     if(err){
//       callback && callback(true);
//       return console.error('error', err);
//     }
//     var queryString = "UPDATE users SET email = \'" + newEmail + "\'WHERE id=" + req.user.id;
//     client.query(queryString, function(err, result){
//       if(err){
//         callback && callback(true);
//         return console.error('error', err);
//       }
//       client.end();
//       callback && callback(false);
//     });
//   });
// }

function updateInfo(pool, info, callback, req, res){
  pool.connect(funtion(err, client){
    if(err){
      client.end();
      callback && callback(false);
      return console.error(err);
    }
    info.forEach(function(ele) {
      var queryString = "UPDATE users SET " + ele.field + " = \'" + ele.val + "\'WHERE id=" + req.user.id;
      client.query(queryString, function(err, result){
        if(err){
          callback && callback(err);
          return console.error(err);
        }
      });
    }).then(function(){
      callback && callback();
    }).catch(function(err){
      callback && callback(err);
      return console.error(err);
    });
    client.end();
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
      callback && callback(null, result.rows);
    });
    client.end();
  });
}

module.exports = pool => {
  return {
    getUser: getUser.bind(null, pool),
    updateInfo: updateInfo.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool)
  }
}
