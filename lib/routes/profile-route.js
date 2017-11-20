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
function getFriends(profilesRepo, req, res){
  profilesRepo.getFriends(req.body.playerid, function(err, friend){
    // console.log(friends);
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get friends'
      })
    }
    else {
      res.send({
        success: true,
        data: friend
      });
    }
  });
}

function getFriendReq(profilesRepo, req, res){
  profilesRepo.getFriendReq(req.body.playerid, function(err, friendReq){
    // console.log(friends);
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get friend requests'
      })
    }
    else {
      res.send({
        success: true,
        data: friendReq
      });
    }
  });
}

function acceptFriend(profilesRepo, req, res){
  profilesRepo.acceptFriendReq(req.body.playerid, req.body.reqid, function(err){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to accept friend request'
      })
    }
    else {
      res.send({
        success: true,
        message: 'Friend request accepted'
      });
    }
  });
}


function declineFriend(profilesRepo, req, res){
  profilesRepo.declineFriendReq(req.body.playerid, req.body.reqid, function(err){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to decline friend request'
      })
    }
    else {
      res.send({
        success: true,
        message: 'Friend request declined'
      });
    }
  });
}

function sendFriendReq(profilesRepo, req, res){
  profilesRepo.sendFriendReq(req.body.playerid, req.body.reqid, function(err){
    // console.log(friends);
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to send friend request'
      })
    }
    else {
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
    getFriendReq: {
      route: '/profile/getFriendReq',
      handler: getFriendReq.bind(null, profilesRepo)
    },
    acceptFriend: {
      route: '/profile/acceptFriend',
      handler: acceptFriend.bind(null, profilesRepo)
    },
    declineFriend: {
      route: '/profile/declineFriend',
      handler: declineFriend.bind(null, profilesRepo)
    },
    sendFriendReq: {
      route: '/profile/sendFriendReq',
      handler: sendFriendReq.bind(null, profilesRepo)
    },
    getAllUsers: {
      route: '/profile/getAllUsers',
      handler: getAllUsers.bind(null, profilesRepo)
    },
    updateUser: updateUser.bind(null, profilesRepo)

  }
}
