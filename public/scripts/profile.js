$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/profile/upcomingGames',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        toDateString(),
      }
    }
  });
  $(document).on('submit', '#teammate-request-update', function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/profile/updatePlayerRequests',
      data: $('#teammate-request-update').serialize(),
      success: function(res) {
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          alert(res.message);
        }
      }
    });
  });
});
