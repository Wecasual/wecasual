function userLogin(base, profile, callback){
  getUser(base, profile.id, function(err, record){
    if (err) { callback && callback(err, null)}
    else{
      if(!record){
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
        updateUser(base, {"Username": profile.username, "Avatar": "https://cdn.discordapp.com/avatars/" + profile.id + "/" + profile.avatar + ".png", "Id": record.id}, record.id, function(err, new_record_fields){
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
        if(record.get('Discord Id') == id){
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
        if(ele.fields['Status'] != "Not Registered"){
          users.push(ele.fields);
        }
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
  base('Users').create({
  "Username": profile.username,
  "Discord Id": profile.id,
  "Status": "Not Registered",
  "Avatar": "https://cdn.discordapp.com/avatars/" + profile.id + "/" + profile.avatar + ".png",
  "Original Username": profile.username
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
