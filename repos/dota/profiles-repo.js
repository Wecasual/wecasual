// var gf = require('./globalFuncs')();
//
// //When user logs in using steam login, grab steam profile info, create new user if user does not exist, update database with steam info
// function userLogin(pool, identifier, profile, callback){
//   pool.connect(function(err, client) {
//     if(err){
//       console.log(err);
//       callback && callback(err);
//     }
//     else{
//       //Check name for apostrophes and add escape apostrophe if needed
//       var displayName = gf.addEscape(profile.displayName);
//
//
//       var steaminfo = {
//         avatar: profile._json.avatar,
//         displayName: displayName
//       }
//       var queryString = 'INSERT INTO users (steaminfo, id) VALUES (\'' + JSON.stringify(steaminfo) + '\', ' + '\'' + profile.id + '\') ON CONFLICT (id) DO UPDATE SET steaminfo = \'' + JSON.stringify(steaminfo) + '\'';
//       client.query(queryString, function(err, result){
//         if(err){
//           client.release();
//           console.log(err);
//           callback && callback(err);
//         }
//         else {
//           client.release();
//           callback && callback();
//         }
//       });
//     }
//   });
// }
//
// //info: Info to update
// //Formatted as an array of objects [{field: "email", value: "example@example.com"}, {field: "paid", value: true}];
// //ANY STRING FIELD VALUES MUST BE IN QUOTES
// //id: id of user that info is being updated for
// //*note* this does not update req.user information. It only updates the database
// function updateUser(pool, info, id, callback){
//   pool.connect(function(err, client){
//     if(err){
//       console.log(err);
//       callback && callback(err);
//     }
//     var queryString = 'UPDATE users SET ';
//     for(var i = 0; i < info.length; i++){
//       queryString = queryString + info[i].field + '=' + info[i].value;
//       if(i < info.length -1){
//          queryString = queryString + ', ';
//       }
//     }
//     queryString = queryString + ' WHERE id=\'' + id + '\'';
//     //console.log(queryString);
//     client.query(queryString, function(err, result){
//       if(err){
//         client.release();
//         console.log(err);
//         callback && callback(err);
//       }
//       else{
//         client.release();
//         //console.log("Update success");
//         callback && callback();
//       }
//     });
//   });
// }
//
// //Returns data for single user
// function getUser(pool, id, callback){
//   pool.connect(function(err, client){
//     if(err){
//       console.log(err);
//       callback && callback(err);
//     }
//     else{
//       var queryString = "SELECT row_to_json(users) FROM users WHERE id = \'" + id + '\'';
//       client.query(queryString, function(err, result){
//         if(err){
//           client.release();
//           console.log(err);
//           callback && callback(err);
//         }
//         else{
//           client.release();
//           callback && callback(null, result.rows[0].row_to_json);
//         }
//       });
//     }
//   });
// }
//
// //Returns all user data
// function getAllUsers(pool, callback){
//   pool.connect(function(err, client){
//     if(err) {
//       console.log(err);
//       callback && callback(err);
//     }
//     else{
//       var queryString = "SELECT * FROM users";
//       client.query(queryString, function(err, result){
//         if(err){
//           client.release();
//           console.log(err);
//           callback && callback(err);
//         }
//         else{
//           client.release();
//           callback && callback(null, result.rows);
//         }
//       });
//     }
//   });
// }

function userLogin(base, identifier, profile, callback){
  getUser(base, profile.id, function(err, record){
    if (err) { callback && callback(err, null)}
    else{
      if(!record){
        // console.log('creating user');
        createUser(base, profile, function(err, new_record){
          if (err) { callback && callback(err, null)}
          else{
            // console.log(user);
            new_record.fields['Id'] = new_record.id;
            callback && callback(null, new_record.fields);
          }
        });
      }
      else{
        // console.log(record);
        updateUser(base, {"Steam Name": profile.displayName, "Avatar": profile._json.avatar, "Id": record.id}, record.id, function(err, new_record_fields){
          if (err) { callback && callback(err, null)}
          else{
            callback && callback(null, new_record_fields);
          }
        });
      }
    }
  })
}

function getUser(base, id, callback){
  var found = false;
  base('Users').select({
      // Selecting the first 3 records in Value by Stage:
      view: "Grid View"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
        if(record.get('Steam Id') == id){
          found = true;
          callback && callback(null, record);
        }
      });
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(err) {
    if(!found){
      callback && callback(null, null);
    }
    if (err) { callback && callback(err, null) }
  });
}

function getUserByRowId(base, id, callback){
  base('Users').find(id, function(err, record) {
    if (err) { callback && callback(err, null)}
    else{
      callback && callback(null, record.fields);
    }
  });
}

function getAllUsers(base, callback){
  var users = new Array();
  base('Users').select({
      // Selecting the first 3 records in Value by Stage:
      view: "Grid View"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(ele){
        users.push(ele.fields);
      });
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

  }, function done(err) {
    if (err) { callback && callback(err, null) }
    else{ callback && callback(null, users) }
  });
}

function createUser(base, profile, callback){
  // console.log(profile);
  base('Users').create({
  "Steam Name": profile.displayName,
  "Steam Id": profile.id,
  "Status": "Not Registered",
  "Avatar": profile._json.avatar,
  "Original Steam Name": profile.displayName
  }, function(err, record) {
    if (err) { callback && callback(err, null)}
    else{
      callback && callback(null, record);
    }
  });
}

function updateUser(base, info, id, callback){
  base('Users').update(id, info, function(err, record) {
    if (err) { callback && callback(err, null)}
    else{
      callback && callback(null, record.fields);
    }
  });
}



module.exports = base => {
  return {
    userLogin: userLogin.bind(null, base),
    updateUser: updateUser.bind(null, base),
    getUser: getUser.bind(null, base),
    getUserByRowId: getUserByRowId.bind(null, base),
    getAllUsers: getAllUsers.bind(null, base)
    // getUser: getUser.bind(null, base)
    // getAllUsers: getAllUsers.bind(null, pool)
  }
}
