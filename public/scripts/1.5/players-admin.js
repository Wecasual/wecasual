$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/players/getPlayers',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var i = 1;
        res.data.forEach(function(ele){
          if(ele.team == 'No team'){
            $('#player-list').append('<tr class="add-row" id="' + ele.id + '"><td>' + i + '</td><th scope="row"><img class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.displayName +
            '</td><td>' + ele.skillLevel + '</td><td>' + ele.playerRequests.player1 + ', ' + ele.playerRequests.player2 + ', ' + ele.playerRequests.player3 + ', ' +
            ele.playerRequests.player4 + '</td></tr>');
            i++;
          }
        });
      }
    }
  });
});
