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
          $('#player-list').append('<tr><th scope="row"><img class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.displayName + '</td><td>' + ele.team + '</td> ' + '</tr>');
        });
      }
    }
  });
});
