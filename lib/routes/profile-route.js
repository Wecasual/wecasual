function getAllUsers(profilesRepo, req, res){
  // console.log(req.body.id);
  var select = "playerid, username";//, avatar, registrationdate, wecasualpoints, team, totalgames, premium"
  profilesRepo.getAllUsers(select, function(err, users){
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
    if(err || !user){
      callback && callback(err||"Error");
    }
    else{
      req.user = user;
      callback && callback(null);
    }
  })
}

function getUsers(profilesRepo, req, res){
  //Specify what data we want to fetch for each user
  var select = "playerid, username, avatar";
  profilesRepo.getUsers(select, req.body.team1, function(err, team1){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get team 1'
      })
    }
    else {
      profilesRepo.getUsers(select, req.body.team2, function(err, team2){
        if(err) {
          console.log(err);
          res.send({
            success: false,
            error: 'Unable to get team 2'
          })
        }
        else{
          res.send({
            success: true,
            data: {
              team1: team1,
              team2: team2
            }
          });
        }
      });
    }
  });
}

function getUserInfo(profilesRepo, teamsRepo, req, res){
  profilesRepo.getUser(req.body.playerid, function(err, player){
    if(err) {
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to get user info'
      });
    }
    else{

    }
  })
}

module.exports = (profilesRepo, teamsRepo) =>{
  return{
    getFriends: {//Return friends for a specified user
      route: '/profile/getFriends',
      handler: getFriends.bind(null, profilesRepo)
    },
    getFriendReq: {//Returns friend requests for a specified user
      route: '/profile/getFriendReq',
      handler: getFriendReq.bind(null, profilesRepo)
    },
    acceptFriend: {//Accepts specified friend request
      route: '/profile/acceptFriend',
      handler: acceptFriend.bind(null, profilesRepo)
    },
    declineFriend: {//Declines specified friend request
      route: '/profile/declineFriend',
      handler: declineFriend.bind(null, profilesRepo)
    },
    sendFriendReq: {//Sends friend request from specified user to specified user
      route: '/profile/sendFriendReq',
      handler: sendFriendReq.bind(null, profilesRepo)
    },
    getAllUsers: {//Returns the playerids and usernames of all users
      route: '/profile/getAllUsers',
      handler: getAllUsers.bind(null, profilesRepo)
    },
    updateUser: updateUser.bind(null, profilesRepo),//Updates session user with new database values
    getUsers: {//Returns the playerids, usernames, and avatars of an array of users
      route: '/profile/getUsers',
      handler: getUsers.bind(null, profilesRepo)
    },
    getUserInfo: {//Returns all user info for a specified user (including team info)
      route: '/profile/getUserInfo',
      handler: getUserInfo.bind(null, profilesRepo, teamsRepo)
    }

  }
}
