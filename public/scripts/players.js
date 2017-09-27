$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/players/getPlayers',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          $('#player-list').append('<p><img class="rounded-circle" src=' + ele.avatar + '> ' + ele.displayName + ' ' + ele.team + ' ' + '</p>');
        });
      }
    }
  });
});
