$(document).ready(function(){
  var index;
  var teamid;
  var teams = new Array();
  $.ajax({
    type: 'POST',
    url: '/teams/getTeams',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var i = 0;
        res.data.forEach(function(ele){
          var appendString = '<tr class="add-row teams" id="index-' + i + '"><td scope="row"> </td><td id="' + ele.id + '">' + ele.name + '</td>' + '<td>' + ele.id + '</td>';
          for(var j = 0; j < 5; j++){
            if(ele["p" + (j+1)]){
              appendString = appendString + '<td id="' + ele["p" + (j+1)].id + '">' + '<img class="rounded-circle" src=' + ele["p" + (j+1)].avatar + '> ' + ele["p" + (j+1)].displayName + '</td>';
            }
            else{
              appendString = appendString + '<td>No player</td>';
            }
          }
          appendString = appendString + '</tr>';
          $('#team-list').append(appendString);
          teams.push(ele);
          i++;
        });
      }
    }
  });
  $(document).on("click", ".teams", function(){
    $('#team-modal').modal('show');
    index = this.id.substring(6, this.id.length);
    var team = teams[index];
    teamid = team.id;

    $('#modal-header-teams').append('<h4 class="modal-title modal-add" id="title-team-name">' + team.name + '</h4>');
    $('#modal-body-teams').append('<h5 class="modal-add">Team Name Change\
    <form method="POST" action="/teams/changeName" id="team-name-change">\
     <input type="text" name="teamName" class="my-3 form-control" value=\"' + team.name + '\">\
     <input type="submit" value="Submit" class = "btn btn-default" id="submit-team-name-change">\
     <hr>\
     <h5>Team ID</h5>\
     <input type="text" name="teamid" class="my-3 form-control" id="team-id" value=\"' + teamid + '\" readonly>\
    </form>\
    <hr>\
    <h5 class="modal-add" id="roster">Roster\
      <h6 class="modal-add">\
        <table class="table table-striped">\
          <thead>\
            <tr>\
              <th></th>\
              <th></th>\
              <th></th>\
            </tr>\
          </thead>\
          <tbody id="player-list"></tbody>\
        </table>\
      </h6>\
    </h5>\
    <hr class="modal-add">\
    <button class = "btn modal-add" id="add-player">Add Player</button>\
    <h2 style="display:none;" id="teamid">' + teamid + '</h2>\
    <hr class="modal-add">\
    <hr class="modal-add">\
    <button class = "btn btn-danger modal-add" id="delete-team">Delete Team</button>\
    <hr class="modal-add">\
    </h5>');
    for(var i = 0; i < 5; i++){
      var player = team["p" + (i+1)];
      $('#player-list').append('<tr id="user-' + player.id + '">' + '<td><img class="rounded-circle" src=' + player.avatar + '></td><td>'
      + player.displayName +
      '</td><td><button class="btn remove-user" id="remove-user-' + player.id + '">Remove</button></td></tr>');
    }
  });
  $(document).on('hide.bs.modal','#team-modal', function(){
    $(".modal-add").remove();
  });
  $(document).on('submit', '#team-name-change', function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/teams/changeName',
      data: $('#team-name-change').serialize(),
      success: function(res) {
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          alert(res.message);
          document.getElementById(res.data.teamid).innerHTML = res.data.teamName;
          document.getElementById('title-team-name').innerHTML = res.data.teamName;
          teams[index].name = res.data.teamName;
        }
      }
    });
  });
  $(document).on('click', '#add-player', function(e){
    $('#player-modal').modal('show');
  });
  $(document).on('click', '#delete-team', function(e){
    if(confirm("Are you sure?")){
      $.ajax({
        type: 'POST',
        url: '/teams/deleteTeam',
        data: {teamid: teamid},
        success: function(res) {
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
  $(document).on('click', '.remove-user', function(e){
    if(confirm("Are you sure?")){
      $.ajax({
        type: 'POST',
        url: '/teams/removePlayer',
        data: {teamid: teamid, playerid: this.id.substring(12, this.id.length)},
        success: function(res) {
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
