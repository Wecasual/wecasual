$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/schedule/getSchedule',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          $('#schedule-list').append('<tr><th>' + ele.gameid + '</th><td>' + ele.date + '</td><td>' + ele.team1.name +
          ' (' + ele.team1.id + ')' + '</td><td>' + ele.team2.name + ' (' + ele.team2.id + ')' + '</td>' + '</tr>');
        });
      }
    }
  });
});
