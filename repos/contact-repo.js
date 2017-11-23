function submit(base, message, subject, id, email, callback){
  base('Contact').create({
    "User": id,
    "Email": email,
    "Subject": subject,
    "Message": message
  }, function(err) {
    if (err) { callback && callback(err)}
    callback && callback(null);
  });
}

module.exports = base => {
  return {
    submit: submit.bind(null, base),
  }
}
