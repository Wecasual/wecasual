$(document).ready(function(){
  var rosterID = new Array();
  var rosterName = new Array();
  $.ajax({
    type: 'POST',
    url: '/players/getPlayers',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          if(ele.team == 'No team'){
            $('#player-list').append('<tr class="add-player" id="' + ele.id + '"><th scope="row"><img class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.displayName +
            '</td><td>' + ele.playerRequests.player1 + ', ' + ele.playerRequests.player2 + ', ' + ele.playerRequests.player3 + ', ' +
            ele.playerRequests.player4 + '</td></tr>');
          }
        });
      }
    }
  });
  $(document).on("click", ".add-player", function(){
    if(!rosterID.includes(this.id) && rosterID.length < 4){
      $('#roster').append('<div class="remove-player" id="user-' + this.id + '">' + this.cells[0].innerHTML + ' ' + this.cells[1].innerHTML + '</div>');
      rosterID.push(this.id);
      rosterName.push(this.cells[1].innerHTML);
    }
  });
  $(document).on("click", ".remove-player", function(){
    id = this.id.replace("user-", "");
    var i = rosterID.indexOf(id);
    if(i != -1) {
    	rosterID.splice(i, 1);
      rosterName.splice(i, 1);
      $("#user-" + id).remove();
    }
  });
  $(document).on("click", "#create-team", function(){
    if(confirm("Are you sure?")){
      var data = {};
      for(var i = 0; i < 5; i++){
          data['p' + (i + 1)] = {id: rosterID[i], displayName: rosterName[i]};
      }
      $.ajax({
        type: 'POST',
        url: '/teams/create-team/submit',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            alert(res.message);
            rosterID = new Array();
            rosterName = new Array();
            $(".remove-player").remove();
          }
        }
      });
    }
  });
});
