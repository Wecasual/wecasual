var mongodb = require('mongodb');

function createUser(client, id, profile, callback){
  var queryString = "INSERT INTO users (steamInfo) VALUES (" + "'" + [JSON.stringify(profile)].join("','") + "'" + ")";
  client.query(queryString, function(err, result){
     if(err){
       return console.error('error', err);
     }
     else{
       console.log("Added user");
     }
   });
}

module.exports = {
  getUser: function(client, identifier, profile, callback){
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
      });
    });
  }
}
