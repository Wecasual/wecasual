//GET
function joinTeam(req, res){
  res.render('pages/join-team', { user: req.user});
}

function createTeam(profiles, req, res){
  if(req.user.paid){
    profiles.getAllUsers(function(err, allUsers){
      if(err){
        //alert("Unable to fetch users");
      }
      req.session.userList = new Array();
      allUsers.forEach(function(ele){
        if(!ele.team){
          var singleUser = {
            id: ele.id,
            displayName: ele.steaminfo.displayName,
            avatar: ele.steaminfo._json.avatar
          }
          req.session.userList.push(singleUser);
        }
      });
      res.render('pages/create-team', { user: req.user, userList: req.session.userList});
    });
  }
  else{
    //redirect to payment
    res.redirect('/profile');
  }

}

function teamsPage(teams, req, res) {
	res.render('pages/teams', { user: req.user});
}

//POST
function createTeamSubmit(teams, req, res){
  teams.createTeam(req.user, req.session.userList, req.body, function(err){
    if(err){
      alert("Unable to create team");
    }
  });
}



module.exports = (teams, profiles) => {
  return{
    joinTeam: {
      route: '/join-team',
      handler: joinTeam.bind(null)
    },
    createTeam: {
      route: '/create-team',
      handler: createTeam.bind(null, profiles)
    },
    teamsPage: {
      route: '/teams',
      handler: teamsPage.bind(null, teams)
    },
    createTeamSubmit: {
      route: '/create-team/submit',
      handler: createTeamSubmit.bind(null, teams)
    }
  }
}
