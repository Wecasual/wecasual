function players(req, res){
    res.render('pages/players', { user: req.user});
}

function getPlayers(profiles, req, res){
  if(!req.session.userList){
    profiles.getAllUsers(function(err, result){
      if(err){
        res.send({
          success: false,
          error: 'Unable to fetch users'
        });
      }
      else{
        playerList = new Array();
        result.forEach(function(ele){
          if(ele.registered){
            var singleUser = {
              id: ele.id,
              displayName: ele.steaminfo.displayName,
              avatar: ele.steaminfo._json.avatar,
              playerRequests: ele.playerrequests
            };
            if(ele.team){
              singleUser.team = ele.team;
            }
            else{
              singleUser.team = 'No team';
            }
            playerList.push(singleUser);
          }
        });
        req.session.userList = playerList;
        res.send({
          success: true,
          data: playerList
        });
      }
    },req, res);
  }
  else{
    res.send({
      success: true,
      data: req.session.userList
    });
  }
}

module.exports = (profiles) => {
  return{
    players: {
      route: '/players',
      handler: players.bind(null)
    },
    getPlayers: {
      route: '/players/getPlayers',
      handler: getPlayers.bind(null, profiles)
    }
  }
}
