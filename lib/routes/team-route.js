//Returns all info for all teams
function getAllTeams(teamRepo, req, res){
  var select = '*';
  teamRepo.getAllTeams(select, function(err, teams){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: "Unable to get teams"
      });
    }
    else{
      res.send({
        success: true,
        data: teams
      });
    }
  });
}

function getTeam(teamRepo, req, res){
  teamRepo.getTeam(req.body.teamid, function(err, team){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: "Unable to get team info"
      });
    }
    else{
      res.send({
        success: true,
        data: team
      });
    }
  });
}

module.exports = (teamRepo) =>{
  return{
    getAllTeams: {
      route:  '/team/getAllTeams',
      handler: getAllTeams.bind(null, teamRepo)
    },
    getTeam: {
      route: '/team/getTeam',
      handler: getTeam.bind(null, teamRepo)
    }
  }
}
