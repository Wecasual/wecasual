//Create user if user does not already exist in database
function createUser(client, id, profile, callback){
  var queryString = "INSERT INTO users (steamInfo) VALUES (" + "'" + [JSON.stringify(profile)].join("','") + "'" + ")";
  client.query(queryString, function(err, result){
     if(err){
       client.end();
       callback && callback(err);
     }
     else{
       var queryString = "SELECT row_to_json(users) FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
       client.query(queryString, function(err, result){
         if(err){
           client.end();
           callback && callback(err);
         }
         else{
           client.end();
           callback && callback(null, result.rows[0].row_to_json);
         }
       });
     }
   });
}

//When user logs in using steam login, grab steam profile info, create new user if user does not exist, update database with steam info, and return user
function userLogin(pool, identifier, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      id = identifier.slice(identifier.lastIndexOf('/')+1, identifier.length);
      var queryString = "SELECT * FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
      client.query(queryString, function(err, result){
        if(err){
          client.end();
          callback && callback(err);
        }
        else{
          if(result.rowCount == 0){
            createUser(client, id, profile, callback);
          }
          else{
            var queryString = "UPDATE users SET steaminfo = \'" + JSON.stringify(profile) + "\'WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
            client.query(queryString, function(err, result){
              if(err){
                client.end();
                callback && callback(err);
              }
              else{
                var queryString = "SELECT row_to_json(users) FROM users WHERE steaminfo @> \'{\"id\": \"" + id + "\"}\'";
                client.query(queryString, function(err, result){
                  if(err){
                    client.end();
                    callback && callback(err);
                  }
                  else{
                    client.end();
                    callback && callback(null, result.rows[0].row_to_json);
                  }
                });
              }
            });
          }
        }
      });
    }
  });
}

//info: Info to update
//Formatted as an array of objects [{field: "email", value: "example@example.com"}, {field": paid, value: true}];
//id: id of user that info is being updated for
//*note* this does not update req.user information. It only updates the database
function updateUser(pool, info, id, callback, req, res){
  pool.connect(function(err, client){
    if(err){
      callback && callback(err);
    }
    var count = 0;
    info.forEach(function(ele) {
      var queryString = "UPDATE users SET " + ele.field + " = \'" + ele.value + "\'WHERE id=" + id;
      client.query(queryString, function(err, result){
        if(err){
          callback && callback(err);
        }
        else{
          count++;
          if(count == info.length) {
            client.end();
            callback && callback();
          }
        }
      });
    });
  });
}

//Returns data for single user
function getUser(pool, id, callback, req, res){

}

//Returns all user data
function getAllUsers(pool, callback, req, res){
  pool.connect(function(err, client){
    if(err) {
      callback && callback(err);
    }
    else{
      var queryString = "SELECT * FROM users";
      client.query(queryString, function(err, result){
        if(err){
          client.end();
          callback && callback(err);
        }
        else{
          client.end();
          callback && callback(null, result.rows);
        }
      });
    }
  });
}


module.exports = pool => {
  return {
    userLogin: userLogin.bind(null, pool),
    updateUser: updateUser.bind(null, pool),
    getUser: getUser.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool)
  }
}
