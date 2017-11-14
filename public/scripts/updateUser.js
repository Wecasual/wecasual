$(document).ready(function() {
  //Update user profile
  $.ajax({
    type: 'POST',
    url: '/profile/updateUser',
  });
});
