var mongodb = require('mongodb');

getUser: function(db, identifier){
  //check mongo for user with openID : identifier
  //If exists return user
  //Else return createUser()
},
createUser: function(db, identifier){
  //Create user object
  //Add to mongo
  //Return user
}

module.exports = (db, identifier) => {
  user: getUser(db, identifier)
};
