

//GET
function signup(req, res) {
  if(req.isAuthenticated()) {
    res.render('pages/signup', { user: req.user});
  }
  else {
    req.session.pressedJoin = true;
    res.redirect('/auth/steam');
  }
}

function payment(keyPublishable, req, res) {
  res.render('pages/payment', { user:req.user, keyPublishable: keyPublishable });
}

//POST
function signupSubmit(req, res) {
  req.session.signupInfo = req.body;
  console.log(req.session.signupInfo);
  res.redirect('/payment');
}

function signupCharge(stripe, req, res) {
  let amount = 500;
  stripe.customers.retrieve(req.user.id.toString())
    .then(returningCustomer => {
      if(!returningCustomer){
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
          req.user.paid = true;
          res.redirect('/')
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
          req.user.paid = true;
          res.redirect('/')
        });
      }
    });
}


module.exports = (stripe, keyPublishable) =>{
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
      handler: signupCharge.bind(null, stripe)
    }
  }
}
