

//GET
function signup(req, res) {
  if(req.isAuthenticated() && !req.user.registered) {
    res.render('pages/signup', { user: req.user});
  }
  else{
    res.redirect('/auth/steam');
  }
}

function payment(keyPublishable, profilesRepo, req, res) {
  console.log(req.session.signupInfo);
  var playerRequestsArray = req.session.signupInfo['player-request'];
  if(!playerRequestsArray){
    playerRequestsArray = ['', '', '', ''];
  }
  if(typeof playerRequestsArray === 'string'){
    playerRequestsArray = [playerRequestsArray, '', '', ''];
  }
  var playerRequestsJson = {};
  for(var i = 0; i < 4; i++){
    if(i < playerRequestsArray.length){
      playerRequestsJson['player' + (i + 1)] = playerRequestsArray[i];
    }
    else{
      playerRequestsJson['player' + (i + 1)] = '';
    }
  }
  profilesRepo.updateUser([{field: "email", value: '\'' + req.session.signupInfo.email + '\''}, {field: "registered", value: true}, {field: "playerrequests", value: '\'' + JSON.stringify(playerRequestsJson) + '\''}, {field: "skilllevel", value: '\'' + req.session.signupInfo['skill-level'] + '\''}], req.user.id, function(err){
    if(err){
      console.log(err);
    }
    req.user.registered = true;
    req.user.email = req.session.signupInfo.email;
    req.user.skilllevel = req.session.signupInfo['skill-level'];
    req.user.playerrequests = playerRequestsJson;
    res.redirect('/');
  });
  //No payement for free beta
  // if(!req.user.paid){
  //     res.render('pages/payment', { user:req.user, keyPublishable: keyPublishable });
  // }
  // else{
  //   res.redirect('/');
  // }
}

//POST
function submit(req, res) {
  req.session.signupInfo = req.body;
  res.redirect('/signup/payment');
}

//No payment for free beta
// function signupCharge(profilesRepo, stripe, req, res) {
//   let amount = 500;
//   stripe.customers.retrieve(req.user.id.toString(), function(err, returningCustomer){
//     if(err){
//       stripe.customers.create({
//         id: req.user.id,
//         email: req.body.stripeEmail,
//         source: req.body.stripeToken
//       })
//       .then(customer =>
//         stripe.charges.create({
//           amount,
//           description: "Wecasual league signup charge",
//              currency: "usd",
//              customer: customer.id
//         }))
//       .then(charge => {
//         updateAfterCharge(profilesRepo, req, res);
//       });
//     }
//     else{
//       stripe.charges.create({
//           amount,
//           description: "Wecasual league signup charge",
//              currency: "usd",
//              customer: returningCustomer.id,
//       })
//       .then(charge => {
//         updateAfterCharge(profilesRepo, req, res);
//       });
//     }
//   })
// }
//
// function updateAfterCharge(profilesRepo, req, res){
//   var playerRequestsArray = req.session.signupInfo['player-request'];
//   if(!playerRequestsArray){
//     playerRequestsArray = ['', '', '', ''];
//   }
//   if(typeof playerRequestsArray === 'string'){
//     playerRequestsArray = [playerRequestsArray, '', '', ''];
//   }
//   var playerRequestsJson = {};
//   for(var i = 0; i < 4; i++){
//     if(i < playerRequestsArray.length){
//       playerRequestsJson['player' + (i + 1)] = playerRequestsArray[i];
//     }
//     else{
//       playerRequestsJson['player' + (i + 1)] = '';
//     }
//   }
//   playerRequestsArray.forEach(function(value, idx) {
//
//   });
//   profilesRepo.updateUser([{field: "email", value: req.body.stripeEmail}, {field: "registered", value: true}, {field: "playerrequests", value: JSON.stringify(playerRequestsJson)}, {field: "skilllevel", value: req.session.signupInfo['skill-level']}], req.user.id, function(err){
//     if(err){
//       console.log(err);
//     }
//     req.user.registered = true;
//     req.user.email = req.body.stripeEmail;
//     req.user.skilllevel = req.session.signupInfo['skill-level'];
//     req.user.playerrequests = JSON.stringify(playerRequestsJson);
//
//     res.redirect('/');
//   }, req, res);
// }

module.exports = (profilesRepo, stripe, keyPublishable) =>{
  return{
    signup: {
      route: '/signup',
      handler: signup.bind(null)
    },
    payment: {
      route: '/signup/payment',
      handler: payment.bind(null, keyPublishable, profilesRepo)
    },
    submit: {
      route: '/signup/submit',
      handler: submit.bind(null)
    }
    // signupCharge: {
    //   route: '/signup/charge',
    //   handler: signupCharge.bind(null, profilesRepo, stripe)
    // }
  }
}
