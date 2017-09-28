function players(req, res){
    res.render('pages/players', { user: req.user});
}

function getPlayers(profilesRepo, req, res){
  profilesRepo.getAllUsers(function(err, result){
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
            avatar: ele.steaminfo.avatar,
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
      res.send({
        success: true,
        data: playerList
      });
    }
  });
}

module.exports = (profilesRepo) => {
  return{
    players: {
      route: '/players',
      handler: players.bind(null)
    },
    getPlayers: {
      route: '/players/getPlayers',
      handler: getPlayers.bind(null, profilesRepo)
    }
  }
}
