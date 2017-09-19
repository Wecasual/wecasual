function  joinTeam(req, res){
  res.render('pages/join-team', { user: req.user});
}

function createTeam(req, res){
  if(req.user.paid){
    res.render('pages/create-team', { user: req.user});
  }
  else{
    //redirect to payment
    res.redirect('/account');
  }

}

function createTeamSubmit(teams, req, res){
  teams.createTeam(req.user, req.body, function(){

  });
}


module.exports = (teams) => {
  return{
    joinTeam: {
      route: '/join-team',
      handler: joinTeam.bind(null)
    },
    createTeam: {
      route: '/create-team',
      handler: createTeam.bind(null)
    },
    createTeamSubmit: {
      route: '/create-team/submit',
      handler: createTeamSubmit.bind(null, teams)
    }
  }
}
