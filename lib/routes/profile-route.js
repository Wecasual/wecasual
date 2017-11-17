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
          return user.playerid == req.body.id;
      })[0];
      if(user){
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
          data: {friendsList: friendsList, friendRequests: friendRequests, users: users}
        })
      }
      else{
        res.send({
          success: false,
          error: 'Unable to get user'
        })
      }
    }
  });
}

function getAllUsers(profilesRepo, req, res){
  // console.log(req.body.id);
  profilesRepo.getAllUsers(function(err, users){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get users'
      })
    }
    else {
      res.send({
        success: true,
        data: users
      });
    }
  });
}


function acceptFriend(profilesRepo, req, res){
  var friendRequestIds = req.body.friendRequestIds;
  var friendRequests = req.body.friendRequests;
  var friendIds = req.body.friendIds;
  var newFriendId = friendRequestIds[req.body.index];
  var newFriend = friendRequests[friendRequestIds.indexOf(newFriendId)];
  friendIds.push(newFriendId);
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

      var newFriendFriendIds = newFriend['Friends']
      if(newFriendFriendIds==null){
        newFriendFriendIds = new Array();
      }
      newFriendFriendIds.push(req.body.id);
      var info = {"Friends": newFriendFriendIds};
      profilesRepo.updateUser(info, newFriendId, function(err){
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
        error: 'Unable to update friend request'
      });
    }
    else{
      res.send({
        success: true
      });
    }
  });
}

function sendFriendRequest(profilesRepo, req, res){
  var currentRequests = req.body.currentRequests;
  if(currentRequests == null){
    currentRequests =  new Array();
  }
  currentRequests.push(req.body.requesterId);
  var info = {"Friend Requests": currentRequests};
  profilesRepo.updateUser(info, req.body.id, function(err){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to send friend request'
      });
    }
    else{
      res.send({
        success: true,
        message: 'Friend request sent'
      });
    }
  });
}

function updateUser(profilesRepo, req, res, callback){
  profilesRepo.getUser(req.user.playerid, function(err, user){
    if(err){
      callback && callback(err);
    }
    else{
      req.user = user;
      callback && callback(null);
    }
  })
}

module.exports = (profilesRepo) =>{
  return{
    getFriends: {
      route: '/profile/getFriends',
      handler: getFriends.bind(null, profilesRepo)
    },
    acceptFriend: {
      route: '/profile/acceptFriend',
      handler: acceptFriend.bind(null, profilesRepo)
    },
    declineFriend: {
      route: '/profile/declineFriend',
      handler: declineFriend.bind(null, profilesRepo)
    },
    sendFriendRequest: {
      route: '/profile/sendFriendRequest',
      handler: sendFriendRequest.bind(null, profilesRepo)
    },
    getAllUsers: {
      route: '/profile/getAllUsers',
      handler: getAllUsers.bind(null, profilesRepo)
    },
    updateUser: updateUser.bind(null, profilesRepo)

  }
}
