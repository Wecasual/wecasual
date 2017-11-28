function getChallenge(challengeRepo, req, res){
  challengeRepo.getAvailableChallenge(function(err, availChallenge){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to fetch challenges'
      });
    }
    else{
      challengeRepo.getPlayerChallenge(req.user.playerid, function(err, playerChallenge){
        if(err){
          console.log(err);
          res.send({
            success: false,
            error: 'Unable to fetch player challenges'
          });
        }
        else{
          console.log(playerChallenge);
        }
      });
    }
  });
}


module.exports = (challengeRepo) =>{
  return{
    getChallenge: {
      route: '/challenge/getChallenge',
      handler: getChallenge.bind(null, challengeRepo)
    }
  }
}
