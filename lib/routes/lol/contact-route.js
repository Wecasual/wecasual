function contact(req, res){
  res.render('pages/lol/contact', {user: req.user})
}

function submit(contactRepo, req, res){
  if(req.user){
    contactRepo.submit(req.body.message, req.body.subject, [req.user['Id']], null, function(err){
      if(err){
        console.log(err);
        res.send({
          success: false,
          error: "Error sending message."
        });
      }
      else{
        res.send({
          success: true,
          message: "Message sent successfully."
        });
      }
    });
  }
  else{
    contactRepo.submit(req.body.message, req.body.subject, null, req.body.email, function(err){
      if(err){
        console.log(err);
        res.send({
          success: false,
          error: "Error sending message."
        });
      }
      else{
        res.send({
          success: true,
          message: "Message sent successfully."
        });
      }
    });
  }

}

module.exports = (contactRepo) =>{
  return{
    contact: {
      route: '/lol/contact',
      handler: contact.bind(null)
    },
    submit: {
      route: '/lol/contact/submit',
      handler: submit.bind(null, contactRepo)
    }
  }
}
