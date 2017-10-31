function getFriends(profilesRepo, req, res){
  // console.log(req.body.id);
  profilesRepo.getAllUsers(function(err, users){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get user'
      })
    }
    else {
      var user = users.filter(function (user) {
          return user['Id'] == req.body.id;
      })[0];
      var friendsList = new Array();
      var friendRequests = new Array();
      if(user['Friends']){

        user['Friends'].forEach(function (friend){
          friendsList.push(users.filter(function (user){
            return user['Id'] == friend;
          })[0]);
        });
      }
      if(user['Friend Requests']){
        user['Friend Requests'].forEach(function (friendRequest){
          friendRequests.push(users.filter(function (user){
            return user['Id'] == friendRequest;
          })[0]);
        });
      }
      res.send({
        success: true,
        data: {friendsList: friendsList, friendRequests: friendRequests}
      })
    }
  });
}

function acceptFriend(profilesRepo, req, res){
  console.log(req.body);
  var friendRequestIds = req.body.friendRequestIds;
  var friendIds = req.body.friendIds;
  friendIds.push(friendRequestIds[req.body.index])
  //Remove the new friend from friend requests
  if(friendRequestIds.length == 1){
    friendRequestIds = [];
  }
  else{
    friendRequestIds.splice(req.body.index, 1);
  }
  var info = {"Friends": friendIds, "Friend Requests": friendRequestIds};
  profilesRepo.updateUser(info, req.body.id, function(err){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable update friend request'
      });
    }
    else{
      res.send({
        success: true
      });
    }
  });
}


function declineFriend(profilesRepo, req, res){
  var friendRequestIds = req.body.friendRequestIds;
  //Remove request from request ids
  if(friendRequestIds.length == 1){
    friendRequestIds = [];
  }
  else{
    friendRequestIds.splice(req.body.index, 1);
  }
  var info = {"Friend Requests": friendRequestIds};
  profilesRepo.updateUser(info, req.body.id, function(err){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable update friend request'
      });
    }
    else{
      res.send({
        success: true
      });
    }
  });
}


module.exports = (profilesRepo) =>{
  return{
    getFriends: {
      route: '/dota/profile/getFriends',
      handler: getFriends.bind(null, profilesRepo)
    },
    acceptFriend: {
      route: '/dota/profile/acceptFriend',
      handler: acceptFriend.bind(null, profilesRepo)
    },
    declineFriend: {
      route: '/dota/profile/declineFriend',
      handler: declineFriend.bind(null, profilesRepo)
    }
  }
}
