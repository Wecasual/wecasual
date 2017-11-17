function userLogin(pool, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO player (username, discordid, avatar) VALUES ($1, $2, $3) ON CONFLICT (discordid) DO UPDATE SET (username, avatar) = ($1, $3) RETURNING *';
      var values = [profile.username, profile.id, 'https://cdn.discordapp.com/avatars/' + profile.id + '/' + profile.avatar + '.png'];
      // console.log(queryString);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          callback && callback(null, result.rows[0]);
        }
      });
    }
  });
  // getUser(pool, profile.id, function(err, record){
  //   if (err) { callback && callback(err, null)}
  //   else{
  //     if(!record){
  //       createUser(pool, profile, function(err, new_record){
  //         if (err) { callback && callback(err, null)}
  //         else{
  //           // console.log(user);
  //           new_record.fields['Id'] = new_record.id;
  //           callback && callback(null, new_record.fields);
  //         }
  //       });
  //     }
  //     else{
  //       // console.log(record);
  //       updateUser(pool, {"Username": profile.username, "Avatar": "https://cdn.discordapp.com/avatars/" + profile.id + "/" + profile.avatar + ".png", "Id": record.id}, record.id, function(err, new_record_fields){
  //         if (err) { callback && callback(err, null)}
  //         else{
  //           callback && callback(null, new_record_fields);
  //         }
  //       });
  //     }
  //   }
  // })
}


function getUser(pool, id, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM player WHERE playerid = ' + id;
      // console.log(queryString);
      client.query(queryString, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows[0]);
          callback && callback(null, result.rows[0]);
        }
      });
    }
  });
}
// function getUser(pool, id, callback){
//   var found = false;
//   pool('Users').select({
//       // Selecting the first 3 records in Value by Stage:
//       view: "Grid View"
//   }).eachPage(function page(records, fetchNextPage) {
//       // This function (`page`) will get called for each page of records.
//       records.forEach(function(record) {
//         if(record.get('Discord Id') == id){
//           found = true;
//           callback && callback(null, record);
//         }
//       });
//       // To fetch the next page of records, call `fetchNextPage`.
//       // If there are more records, `page` will get called again.
//       // If there are no more records, `done` will get called.
//       fetchNextPage();
//
//   }, function done(err) {
//     if(!found){
//       callback && callback(null, null);
//     }
//     if (err) { callback && callback(err, null) }
//   });
// }

// function getUserByRowId(pool, id, callback){
//   pool('Users').find(id, function(err, record) {
//     if (err) { callback && callback(err, null)}
//     else{
//       callback && callback(null, record.fields);
//     }
//   });
// }

function getAllUsers(pool, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM player WHERE status != $1';
      // console.log(queryString);
      var values = ["Not Registered"];
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows);
          callback && callback(null, result.rows);
        }
      });
    }
  });
}
// function getAllUsers(pool, callback){
//   var users = new Array();
//   pool('Users').select({
//       // Selecting the first 3 records in Value by Stage:
//       view: "Grid View"
//   }).eachPage(function page(records, fetchNextPage) {
//       // This function (`page`) will get called for each page of records.
//       records.forEach(function(ele){
//         if(ele.fields['Status'] != "Not Registered"){
//           ele.fields['Email'] = null; //Remove email for security reasons
//           users.push(ele.fields);
//         }
//       });
//       // To fetch the next page of records, call `fetchNextPage`.
//       // If there are more records, `page` will get called again.
//       // If there are no more records, `done` will get called.
//       fetchNextPage();
//
//   }, function done(err) {
//     if (err) { callback && callback(err, null) }
//     else{ callback && callback(null, users) }
//   });
// }

// function createUser(pool, profile, callback){
//   pool('Users').create({
//   "Username": profile.username,
//   "Discord Id": profile.id,
//   "Status": "Not Registered",
//   "Avatar": "https://cdn.discordapp.com/avatars/" + profile.id + "/" + profile.avatar + ".png",
//   "Original Username": profile.username
//   }, function(err, record) {
//     if (err) { callback && callback(err, null)}
//     else{
//       callback && callback(null, record);
//     }
//   });
// }

//info: Info to update
//Formatted as an array of objects [{field: "email", value: "example@example.com"}, {field: "paid", value: true}];
//ANY STRING FIELD VALUES MUST BE IN QUOTES
//id: id of user that info is being updated for
//*note* this does not update req.user information. It only updates the database
function updateUser(pool, info, id, callback){
  pool.connect(function(err, client){
    if(err){
      callback && callback(err);
    }
    else{
      // console.log(info);
      var queryString = 'UPDATE player SET ';
      var values = new Array();
      for(var i = 0; i < info.length; i++){
        queryString = queryString + info[i].field + ' = $' + (i+1);
        values.push(info[i].value);
        if(i < info.length -1){
           queryString = queryString + ', ';
        }
      }
      queryString = queryString + ' WHERE playerid = ' + id;
      // console.log(queryString);
      // console.log(values);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err);
        }
        else{
          callback && callback();
        }
      });
    }
  });
}
// function updateUser(pool, info, id, callback){
//   pool('Users').update(id, info, function(err, record) {
//     if (err) { callback && callback(err, null)}
//     else{
//       callback && callback(null, record.fields);
//     }
//   });
// }



module.exports = pool => {
  return {
    userLogin: userLogin.bind(null, pool),
    updateUser: updateUser.bind(null, pool),
    // getUserByRowId: getUserByRowId.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool),
    getUser: getUser.bind(null, pool)
    // getAllUsers: getAllUsers.bind(null, pool)
  }
}
