$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/profile/upcomingGames',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          $('#schedule-list').append('<tr class="games"><td>' + ele.date + '</td><td>' + ele.team1.name + '</td><td>' + ele.team2.name + '</td>' + '</tr>');
        });
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
