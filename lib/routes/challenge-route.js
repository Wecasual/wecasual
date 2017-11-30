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
          res.send({
            success: true,
            data: {
              availChallenge: availChallenge,
              playerChallenge: playerChallenge
            }
          });
        }
      });
    }
  });
}

function acceptChallenge(challengeRepo, req, res){
  challengeRepo.acceptChallenge(req.user.playerid, req.body.challengeid, function(err){
    if(err){
      console.log(err);
      req.session.message = 'Unable to accept challenge';
      res.send({
        success: false,
        error: 'Unable to accept challenge'
      });
    }
    else{
      req.session.message = 'Challenge accepted';
      res.send({
        success: true,
        message: 'Challenge accepted'
      });
    }
  });
}

function completeChallenge(challengeRepo, req, res){
  challengeRepo.completeChallenge(req.user.playerid, req.body.challengeid, req.body.wecasualpoints, function(err){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to mark challenge as complete'
      });
    }
    else{
      req.session.message = 'Challenge completed';
      res.send({
        success: true,
        message: 'Challenge completed'
      });
    }
  });
}

module.exports = (challengeRepo) =>{
  return{
    getChallenge: {
      route: '/challenge/getChallenge',
      handler: getChallenge.bind(null, challengeRepo)
    },
    acceptChallenge: {
      route: '/challenge/acceptChallenge',
      handler: acceptChallenge.bind(null, challengeRepo)
    },
    completeChallenge: {
      route: '/challenge/completeChallenge',
      handler: completeChallenge.bind(null, challengeRepo)
    }
  }
}
