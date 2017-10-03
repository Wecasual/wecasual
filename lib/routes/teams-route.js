var gf = require('./../../repos/globalFuncs')();
//GET
// function joinTeam(req, res){
//   res.render('pages/join-team', { user: req.user});
// }
//
// function createTeam(profilesRepo, req, res){
//   // if(req.user.registered){
//   //   profilesRepo.getAllUsers(function(err, allUsers){
//   //     if(err){
//   //       //alert("Unable to fetch users");
//   //     }
//   //     req.session.userList = new Array();
//   //     allUsers.forEach(function(ele){
//   //       if(!ele.team){
//   //         var singleUser = {
//   //           id: ele.id,
//   //           displayName: ele.steaminfo.displayName,
//   //           avatar: ele.steaminfo._json.avatar
//   //         }
//   //         req.session.userList.push(singleUser);
//   //       }
//   //     });
//   //     res.render('pages/create-team', { user: req.user, userList: req.session.userList});
//   //   });
//   // }
//   // else{
//   //   //redirect to payment
//   //   res.redirect('/profile');
//   // }
// }

function teamsPage(teamsRepo, req, res) {
	res.render('pages/teams', { user: req.user});
}

//POST
function createTeamSubmit(teamsRepo, profilesRepo, req, res){
  var roster = req.body;
	for(var i = 0; i < 5; i++){
		roster["p" + (i+1)].displayName = gf.addEscape(roster["p" + (i+1)].displayName);
	}
  teamsRepo.createTeam(roster, function(err, id){
    if(err){
      res.send({
        success: false,
        error: 'Error creating team'
      });
    }
    else{
      for(var i = 0; i < 5; i++){
        if(roster["p" + (i+1)]){
          profilesRepo.updateUser([{field: "team", value: '\'{"name": "No Name", "id": ' + id + '}\''}], roster["p" + (i+1)].id, function(err){
            if(err){
              res.send({
                success: false,
                error: 'Error creating team'
              });
            }
          });
        }
      }
      res.send({
        success: true,
        message: 'Team created with id: ' + id
      });
    }
  });
}

function getTeams(teamsRepo, req, res){
  teamsRepo.getAllTeams(function(err, result){
    if(err){
      res.send({
        success: false,
        error: 'Unable to fetch teams'
      });
    }
    else{
      teamList = new Array();
      result.forEach(function(ele){
        var singleTeam = {
          id: ele.id,
          name: ele.name,
          p1: ele.roster.p1,
          p2: ele.roster.p2,
          p3: ele.roster.p3,
          p4: ele.roster.p4,
          p5: ele.roster.p5
        };
        teamList.push(singleTeam);
      });
      res.send({
        success: true,
        data: teamList
      });
    }
  });
}

function getTeam(teamsRepo, req, res){
  teamsRepo.getTeam(req.body.id, function(err, result){
    if(err){
      res.send({
        success: false,
        error: 'Unable to fetch teams'
      });
    }
    else{
      var singleTeam = {
        id: result.id,
        name: result.name,
        p1: result.roster.p1,
        p2: result.roster.p2,
        p3: result.roster.p3,
        p4: result.roster.p4,
        p5: result.roster.p5
      };
      res.send({
        success: true,
        data: singleTeam
      });
    }
  });
}



module.exports = (teamsRepo, profilesRepo) => {
  return{
    // joinTeam: {
    //   route: '/join-team',
    //   handler: joinTeam.bind(null)
    // },
    // createTeam: {
    //   route: '/create-team',
    //   handler: createTeam.bind(null, profilesRepo)
    // },
    teams: {
      route: '/teams',
      handler: teamsPage.bind(null, teamsRepo)
    },
    createTeamSubmit: {
      route: '/teams/create-team/submit',
      handler: createTeamSubmit.bind(null, teamsRepo, profilesRepo)
    },
    getTeams: {
      route: '/teams/getTeams',
      handler: getTeams.bind(null, teamsRepo)
    },
		getTeam: {
      route: '/teams/getTeam',
      handler: getTeam.bind(null, teamsRepo)
    }
  }
}
