function userLogin(base, profile, callback){
  getUser(base, profile._json.sub, function(err, record){
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
        updateUser(base, {"Email": profile.displayName, "Avatar": profile.picture, "Id": record.id}, record.id, function(err, new_record_fields){
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
        if(record.get('0Auth Id') == id){
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

function createUser(base, profile, callback){
  // console.log(profile);
  base('Users').create({
  "Email": profile.displayName,
  "0Auth Id": profile._json.sub,
  "Status": "Not Registered",
  "Avatar": profile.picture,
  }, function(err, record) {
    if (err) { callback && callback(err, null)}
    callback && callback(null, record);
  });
}

function updateUser(base, info, id, callback){
  base('Users').update(id, info, function(err, record) {
    if (err) { callback && callback(err, null)}
    callback && callback(null, record.fields);
  });
}



module.exports = base => {
  return {
    userLogin: userLogin.bind(null, base),
    updateUser: updateUser.bind(null, base)
    // getUser: getUser.bind(null, base)
    // getAllUsers: getAllUsers.bind(null, pool)
  }
}
