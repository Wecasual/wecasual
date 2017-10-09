$(document).ready(function(){
  var rosterID = new Array();
  var rosterName = new Array();
  var rosterPic = new Array();
  var toRemove = new Array();
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
  $(document).on("click", ".add-row", function(){
    if(!rosterID.includes(this.id) && rosterID.length < 5){
      $('#roster').append('<div class="remove-row" id="user-' + this.id + '">' + this.cells[0].innerHTML + '&nbsp; &nbsp;' + this.cells[1].innerHTML + '&nbsp; | &nbsp;' + this.cells[2].innerHTML + '</div>');
      rosterID.push(this.id);
      rosterName.push(this.cells[1].innerHTML);
      rosterPic.push(this.cells[0].getElementsByTagName('img')[0].src);
      toRemove.push(this);
    }
  });
  $(document).on("click", ".remove-row", function(){
    id = this.id.replace("user-", "");
    var i = rosterID.indexOf(id);
    if(i != -1) {
    	rosterID.splice(i, 1);
      rosterName.splice(i, 1);
      rosterPic.splice(i, 1);
      toRemove.splice(i, 1);
      $("#user-" + id).remove();
    }
  });
  $(document).on("click", "#create-team", function(){
    if(confirm("Are you sure?")){
      var data = {};
      for(var i = 0; i < 5; i++){
          data['p' + (i + 1)] = {id: rosterID[i], displayName: rosterName[i], avatar: rosterPic[i]};
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
            rosterPic = new Array();
            $(".remove-row").remove();
            toRemove.forEach(function(ele){
              ele.remove();
            })
            toRemove = new Array();
          }
        }
      });
    }
  });
});
