$(document).ready(function(){
  var team1 = null;
  var team2 = null;
  $(document).on("click", ".add-row", function(){
    if(!team1 && team1 != this.cells[1].id && team2 != this.cells[1].id){
      $('#team1').append('<div class="remove-row" id="team-' + this.cells[1].id + '">' + this.cells[1].innerHTML + '</div>');
      team1 = this.cells[1].id;
    }
    else if(!team2 && team2 != this.cells[1].id && team1 != this.cells[1].id){
      $('#team2').append('<div class="remove-row" id="team-' + this.cells[1].id + '">' + this.cells[1].innerHTML + '</div>');
      team2 = this.cells[1].id;
    }
  });
  $(document).on("click", ".remove-row", function(){
    if(this.parentElement.id == "team1"){
      team1= null;
      $('#' + this.id).remove();
    }
    else if(this.parentElement.id == "team2"){
      team2= null;
      $('#' + this.id).remove();
    }
  });
  $(document).on("click", "#schedule-game", function(){
    if(team1 != null && team2 != null){
      if(confirm("Are you sure?")){
        var date = document.querySelector('input[type="date"]').value;
        $.ajax({
          type: 'POST',
          url: '/schedule/create-schedule/submit',
          data: JSON.stringify({
            date: date,
            team1: team1,
            team2: team2
          }),
          contentType: "application/json",
          success: function(res){
            if(!res.success){
              alert(res.error);
            }
            else if(res.success){
              alert(res.message);
              team1 = null;
              team2 = null;
              $(".remove-row").remove();
              $(".games").remove();
              $.ajax({
                type: 'POST',
                url: '/schedule/getAllSchedule',
                success: function(res) {
                  if(!res.success){
                    alert(res.error);
                  }
                  else if(res.success){
                    res.data.forEach(function(ele){
                        $('#schedule-list').append('<tr class="games"><td>' + ele.gameid + '</td><td>' + ele.date + '</td><td>' + ele.team1.name +
                        ' (' + ele.team1.id + ')' + '</td><td>' + ele.team2.name + ' (' + ele.team2.id + ')' + '</td>' + '</tr>');
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
    else{
      alert("Select 2 teams");
    }

  });
});
