var schedule;
var userTeamNum;
$(document).ready(function(){
  var userid = $("#uid").html();
  var gameid;
  $.ajax({
    type: 'POST',
    url: '/profile/upcomingGames',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        schedule = res.data;
        schedule.forEach(function(ele){
          $('#schedule-list').append('<tr class="games add-row" id="game-' + ele.gameid + '"><td>' + ele.date + '</td><td>' + ele.team1.name + '</td><td>' + ele.team2.name + '</td>' + '</tr>');
        });
      }
    }
  });
  $(document).on("click", ".games", function(){
    gameid = this.id.substring(5, this.id.length);
    var result = schedule.filter(function (game) {
      //console.log(game.gameid);
      return game.gameid == gameid;
    })[0];
    $('#game-modal').modal('show');
    $('.modal-header').append('<h4 class="modal-title modal-add">' + this.cells[1].innerHTML  + ' vs ' + this.cells[2].innerHTML + '</h4>');
    $('#team1-header').append('<h4 class="modal-add">' + this.cells[1].innerHTML + '</h4>');
    $('#team2-header').append('<h4 class="modal-add">' + this.cells[2].innerHTML + '</h4>');
    $.ajax({
      type: 'POST',
      url: '/teams/getTeam',
      data: {id: result.team1.id},
      success: function(res) {
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          for(var i = 0; i < 5; i++){
            var player = res.data["p"+(i+1)];
            displayAttendance('#player-list-1', userid, player, result.attendance1, 1);
          }
        }
      }
    });
    $.ajax({
      type: 'POST',
      url: '/teams/getTeam',
      data: {id: result.team2.id},
      success: function(res) {
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          for(var i = 0; i < 5; i++){
            var player = res.data["p"+(i+1)];
            displayAttendance('#player-list-2', userid, player, result.attendance2, 2);
          }
        }
      }
    });

  });
  $(document).on('hide.bs.modal','#game-modal', function(){
    $(".modal-add").remove();
  });
  $(document).on('click','#attendance-yes', function(){
    //console.log(userTeamNum);
    updateAttendance(gameid, userid, "Yes", userTeamNum);
  });
  $(document).on('click','#attendance-no', function(){
    updateAttendance(gameid, userid, "No", userTeamNum);
  });

});

function displayAttendance(listid, userid, player, attendance, teamNum){
  if(userid == player.id){
    $(listid).append('<tr class="modal-add"><td><img class="rounded-circle" src=' + player.avatar + '> ' +
    player.displayName + '</td>\
    <td id="' + player.id + '">' + attendance[player.id] + '</td>\
    <td><button type="button" class="btn btn-success" id="attendance-yes">&#10004;</button>\
    <button type="button" class="btn btn-danger" id="attendance-no">&#10008;</button></td></tr>');
    userTeamNum = teamNum;
  }
  else{
    $(listid).append('<tr class="modal-add"><td><img class="rounded-circle" src=' + player.avatar + '> ' +
    player.displayName + '</td>\
    <td id="' + player.id + '">' + attendance[player.id] + '</td></tr>');
  }
}

function updateAttendance(gameid, userid, attendance, teamNum){
  $.ajax({
    type: 'POST',
    url: '/profile/updateAttendance',
    data: {gameid: gameid, userid: userid, attendance: attendance, teamNum: teamNum},
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        document.getElementById(userid).innerHTML = attendance;
        for(var i = 0; i < schedule.length; i++){
          if(schedule[i].gameid == gameid){
            schedule[i]["attendance" + teamNum][userid] = attendance;
          }
        }
      }
    }
  });
}
