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
            playerRequests: ele.playerrequests,
            skillLevel: ele.skilllevel
          };
          if(ele.team){
            singleUser.team = ele.team.name;
          }
          else{
            singleUser.team = 'No team';
          }
          playerList.push(singleUser);
        }
      });
      playerList = playerList.sort(function(a, b) {
        return compareStrings(a.displayName, b.displayName);
      })
      res.send({
        success: true,
        data: playerList
      });
    }
  });
}

function compareStrings(a, b) {
// Assuming you want case-insensitive comparison
a = a.toLowerCase();
b = b.toLowerCase();

return (a < b) ? -1 : (a > b) ? 1 : 0;
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
