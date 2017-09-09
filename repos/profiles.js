var mongodb = require('mongodb');

function createUser(db, id, profile, callback){
  user = {
    steamInfo: profile,
    wcInfo: {
      team: null
    }
  };
  db.collection("users").insertOne(user, function(err, response){
     if(err){
       Alert("Error signing in");
     }
     else{
         callback && callback(user);
     }
   });
}

module.exports = {
  getUser: function(db, identifier, profile, callback){
    id = identifier.slice(identifier.lastIndexOf('/')+1, identifier.length);
    db.collection("users").findOne(  {"steamInfo.id": id}, function(err, doc){
      if(err){
        Alert("Error connecting to database");
      }
      else{
        if(doc){
          doc.steamInfo = profile;
          db.collection("users").update(  {"_id": doc._id}, {"steamInfo": profile, "wcInfo": doc.wcInfo}, { upsert: true })
          callback && callback(doc);
        }
        else{
          createUser(db, id, profile, callback);
        }
      }
    });
  }
}
