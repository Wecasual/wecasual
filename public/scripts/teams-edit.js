$(document).ready(function(){
  var teamid;
  $(document).on("click", ".teams", function(){
    $('#team-modal').modal('show');
    $('.modal-header').append('<h4 class="modal-title modal-add" id="title-team-name">' + this.cells[1].innerHTML + '</h4>');
    $('.modal-body').append('<h5 class="modal-add">Team Name Change\
    <form method="POST" action="/teams/changeName" id="team-name-change">\
     <input type="text" name="teamName" class="my-3 form-control" value=\"' + this.cells[1].innerHTML + '\">\
     <input type="submit" value="Submit" class = "btn btn-default" id="submit-team-name-change">\
     <hr>\
     <h5>Team ID</h5>\
     <input type="text" name="teamid" class="my-3 form-control" id="team-id" value=\"' + this.cells[1].id + '\" readonly>\
    </form>\
    <hr>\
    <button class = "btn btn-danger" id="delete-team">Delete Team</button>\
    <hr>\
    </h5>');
    teamid = this.cells[1].id;
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
        }
      }
    });
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

          }
        }
      });
    }
  });
});
