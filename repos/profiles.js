//When user logs in using steam login, grab steam profile info, create new user if user does not exist, update database with steam info
function userLogin(pool, identifier, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var steaminfo = {
        avatar: profile._json.avatar,
        displayName: profile.displayName
      }
      var queryString = 'INSERT INTO users (steaminfo, id) VALUES (\'' + JSON.stringify(steaminfo) + '\', ' + '\'' + profile.id + '\') ON CONFLICT (id) DO UPDATE SET steaminfo = \'' + JSON.stringify(steaminfo) + '\'';
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else {
          client.release();
          callback && callback();
        }
      });
    }
  });
}

//info: Info to update
//Formatted as an array of objects [{field: "email", value: "example@example.com"}, {field: "paid", value: true}];
//ANY STRING FIELD VALUES MUST BE IN QUOTES
//id: id of user that info is being updated for
//*note* this does not update req.user information. It only updates the database
function updateUser(pool, info, id, callback, req, res){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    var queryString = 'UPDATE users SET ';
    for(var i = 0; i < info.length; i++){
      queryString = queryString + info[i].field + '=' + info[i].value;
      if(i < info.length -1){
         queryString = queryString + ', ';
      }
    }
    queryString = queryString + ' WHERE id=\'' + id + '\'';
    console.log("Query String");
    client.query(queryString, function(err, result){
      if(err){
        client.release();
        console.log(err);
        callback && callback(err);
      }
      else{
        client.release();
        console.log("Update success");
        callback && callback();
      }
    });
  });
}

//Returns data for single user
function getUser(pool, id, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT row_to_json(users) FROM users WHERE id = \'" + id + '\'';
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null, result.rows[0].row_to_json);
        }
      });
    }
  });
}

//Returns all user data
function getAllUsers(pool, callback, req, res){
  pool.connect(function(err, client){
    if(err) {
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT * FROM users";
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


module.exports = pool => {
  return {
    userLogin: userLogin.bind(null, pool),
    updateUser: updateUser.bind(null, pool),
    getUser: getUser.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool)
  }
}
