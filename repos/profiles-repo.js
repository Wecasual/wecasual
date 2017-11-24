//Update or create row for user logging in
function userLogin(pool, profile, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO player (username, discordid, avatar, status) VALUES ($1, $2, $3, $4) ON CONFLICT (discordid) DO UPDATE SET (username, avatar) = ($1, $3) RETURNING *';
      var values = [profile.username, profile.id, 'https://cdn.discordapp.com/avatars/' + profile.id + '/' + profile.avatar + '.png', "Not Registered"];
      // console.log(queryString);
      client.query(queryString, values, function(err, player){
        if(err){
          client.release();
          callback && callback(err, null);
        }
        else {
          appendTeamInfo(client, player.rows[0], callback);
        }
      });
    }
  });
}

//Return user by playerid
function getUser(pool, playerid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{//Get player info
      var queryString = 'SELECT * FROM player WHERE playerid = ' + playerid;
      // console.log(queryString);
      client.query(queryString, function(err, player){
        if(err){
          client.release();
          callback && callback(err, null);
        }
        else {//Get team info for all teams player belongs to
          appendTeamInfo(client, player.rows[0], callback);
        }
      });
    }
  });
}

function appendTeamInfo(client, user, callback){
  var queryString = 'SELECT * FROM team JOIN playerteam ON team.teamid = playerteam.teamid WHERE playerteam.playerid = $1';
  var values = [user.playerid];
  // console.log(queryString);
  client.query(queryString, values, function(err, team){
    client.release();
    if(err){
      callback && callback(err, null);
    }
    else{
      //Format info
      user.activeTeam = new Array();
      user.nonActiveTeam = new Array();
      for(var i = 0; i<team.rows.length; i++){
        if(team.rows[i].active){
          user.activeTeam.push(team.rows[i]);
        }
        else{
          user.nonActiveTeam.push(team.rows[i]);
        }
      }
      console.log(user);
      callback && callback(null, user);
    }
  });
}

//Return all users that are not "Not Registered"
function getAllUsers(pool, select, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT ' + select + ' FROM player WHERE status != $1 AND status != $2 ORDER BY username';
      // console.log(queryString);
      var values = ["Not Registered", "League of Legends"];
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

//info: Info to update
//Formatted as an array of objects [{field: "email", value: "example@example.com"}, {field: "paid", value: true}];
//ANY STRING FIELD VALUES MUST BE IN QUOTES
//id: id of user that info is being updated for
//*note* this does not update req.user information. It only updates the database
function updateUser(pool, info, playerid, callback){
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
      queryString = queryString + ' WHERE playerid = ' + playerid;
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

//Return all friends for player with playerid = playerid
function getFriends(pool, playerid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM player LEFT OUTER JOIN playerfriend ON player.playerid = playerfriend.friendid WHERE playerfriend.playerid = $1';
      var values = [playerid];
      // console.log(queryString);
      // console.log(values);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

//Return all friend requests for player with playerid = id
function getFriendReq(pool, playerid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT * FROM player LEFT OUTER JOIN playerfrreq ON player.playerid = playerfrreq.reqid WHERE playerfrreq.playerid = $1';
      var values = [playerid];
      // console.log(queryString);
      // console.log(values);
      client.query(queryString, values, function(err, result){
        client.release();
        if(err){
          callback && callback(err, null);
        }
        else {
          // console.log(result.rows[0]);
          // console.log(games);
          callback && callback(null, result.rows);
        }
      });
    }
  });
}

function sendFriendReq(pool, playerid, reqid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'INSERT INTO playerfrreq (playerid, reqid) VALUES ($1, $2)';
      var values = [playerid, reqid]
      // console.log(queryString);
      client.query(queryString, values, function(err){
        client.release();
        if(err){
          callback && callback(err);
        }
        else {
          callback && callback(null);
        }
      });
    }
  });
}

function acceptFriendReq(pool, playerid, reqid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      //Insert friend row for player
      var queryString = 'INSERT INTO playerfriend (playerid, friendid) VALUES ($1, $2)';
      var values = [playerid, reqid]
      // console.log(queryString);
      client.query(queryString, values, function(err){
        if(err){
          client.release();
          callback && callback(err);
        }
        else {
          //Insert friend row for the friend
          var queryString = 'INSERT INTO playerfriend (playerid, friendid) VALUES ($1, $2)';
          var values = [reqid, playerid]
          // console.log(queryString);
          client.query(queryString, values, function(err){
            if(err){
              client.release();
              callback && callback(err);
            }
            else {
              //Remove friend request
              var queryString = 'DELETE FROM  playerfrreq WHERE playerid = $1 AND reqid = $2';
              var values = [playerid, reqid]
              // console.log(queryString);
              client.query(queryString, values, function(err){
                client.release();
                if(err){
                  callback && callback(err);
                }
                else {
                  callback && callback(null);
                }
              });
            }
          });
        }
      });
    }
  });
}

function declineFriendReq(pool, playerid, reqid, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'DELETE FROM  playerfrreq WHERE playerid = $1 AND reqid = $2';
      var values = [playerid, reqid]
      // console.log(queryString);
      client.query(queryString, values, function(err){
        client.release();
        if(err){
          callback && callback(err);
        }
        else {
          callback && callback(null);
        }
      });
    }
  });
}

function getUsers(pool, select, userids, callback){
  pool.connect(function(err, client) {
    if(err){
      callback && callback(err);
    }
    else{
      var queryString = 'SELECT ' + select + ' FROM player WHERE playerid = ANY($1)';
      // console.log(queryString);
      var values = [userids];
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

module.exports = pool => {
  return {
    userLogin: userLogin.bind(null, pool),
    updateUser: updateUser.bind(null, pool),
    getAllUsers: getAllUsers.bind(null, pool),
    getUser: getUser.bind(null, pool),
    getFriends: getFriends.bind(null, pool),
    getFriendReq: getFriendReq.bind(null, pool),
    sendFriendReq: sendFriendReq.bind(null, pool),
    acceptFriendReq: acceptFriendReq.bind(null, pool),
    declineFriendReq: declineFriendReq.bind(null, pool),
    getUsers: getUsers.bind(null, pool)
  }
}
