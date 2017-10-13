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
            $('#player-list').append('<tr class="add-row add-row-player" id="' + ele.id + '"><td>' + i + '</td><th scope="row"><img class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.displayName +
            '</td><td>' + ele.skillLevel + '</td><td>' + ele.playerRequests.player1 + ', ' + ele.playerRequests.player2 + ', ' + ele.playerRequests.player3 + ', ' +
            ele.playerRequests.player4 + '</td></tr>');
            i++;
          }
        });
      }
    }
  });
  $(document).on("click", ".add-row-player", function(){
    if(confirm("Are you sure?")){
      var data = {
        id: this.id,
        displayName: this.cells[2].innerHTML,
        avatar: this.cells[1].getElementsByTagName('img')[0].src,
        teamid: $("#teamid").html()
      }
      $.ajax({
        type: 'POST',
        url: '/teams/addPlayer',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            alert(res.message);
            window.location.reload();
          }
        }
      });
    }
  });
});
