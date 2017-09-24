

//GET
function signup(req, res) {
  if(req.isAuthenticated() && !req.user.paid) {
    res.render('pages/signup', { user: req.user});
  }
  else{
    res.redirect('/auth/steam');
  }
}

function payment(keyPublishable, req, res) {
  res.render('pages/payment', { user:req.user, keyPublishable: keyPublishable });
}

//POST
function signupSubmit(req, res) {
  req.session.signupInfo = req.body;
  res.redirect('/payment');
}

function signupCharge(profiles, stripe, req, res) {
  let amount = 500;
  stripe.customers.retrieve(req.user.id.toString(), function(err, returningCustomer){
    if(err){
      stripe.customers.create({
        id: req.user.id,
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer =>
        stripe.charges.create({
          amount,
          description: "Wecasual league signup charge",
             currency: "usd",
             customer: customer.id
        }))
      .then(charge => {
        updateAfterCharge(profiles, req, res);
      });
    }
    else{
      stripe.charges.create({
          amount,
          description: "Wecasual league signup charge",
             currency: "usd",
             customer: returningCustomer.id,
      })
      .then(charge => {
        updateAfterCharge(profiles, req, res);
      });
    }
  })
}

function updateAfterCharge(profiles, req, res){
  req.user.paid = true;
  req.user.email = req.body.stripeEmail;
  req.user.skilllevel = req.session.signupInfo['skill-level'];
  var playerRequestsArray = req.session.signupInfo['player-request'];
  var playerRequestsJson = {};
  if(playerRequestsArray){
    playerRequestsArray.forEach(function(value, idx) {
      playerRequestsJson['player' + (idx + 1)] = value
    });
  }
  req.user.playerrequests = playerRequestsJson;
  profiles.updateInfo([{field: "email", value: req.user.email}, {field: "paid", value: req.user.paid}, {field: "playerrequests", value: JSON.stringify(req.user.playerrequests)}, {field: "skilllevel", value: req.user.skilllevel}], function(err){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  }, req, res);
}

module.exports = (profiles, stripe, keyPublishable) =>{
  return{
    signup: {
      route: '/signup',
      handler: signup.bind(null)
    },
    payment: {
      route: '/payment',
      handler: payment.bind(null, keyPublishable)
    },
    signupSubmit: {
      route: '/signup/submit',
      handler: signupSubmit.bind(null)
    },
    signupCharge: {
      route: '/signup/charge',
      handler: signupCharge.bind(null, profiles, stripe)
    }
  }
}
