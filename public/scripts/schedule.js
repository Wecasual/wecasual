$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/schedule/getAllSchedule',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          $('#schedule-list').append('<tr class="games"><td>' + ele.gameid + '</td><td>' + ele.date + '</td><td>' + ele.team1.name + '</td><td>' + ele.team2.name + '</td>' + '</tr>');
        });
      }
    }
  });
});
