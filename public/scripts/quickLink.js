$(document).ready(function(){
  var pathname = window.location.pathname;
  var url = window.location.href;
  var gameid = url.split('=')[1];
  var domain = url.split('schedule')[0];
  var realm;
  if(pathname == "/schedule/dota/quickLink"){
    realm = "dota"
  }
  $.ajax({
    type: 'POST',
    url: '/schedule/getSingleGame',
    data: JSON.stringify({gameid: gameid}),
    contentType: 'application/json',
    success: function(res){
      if(!res.success){
        alert(res.error);
        window.location.href = domain + realm;
      }
      else if(res.success){
        // console.log(res.data);
        game = res.data;
        if(game.pubsession){
          $('#game-list').append('<tr><td><label><input class="pub" type="radio" name="game" value="' + game.gameid + '|' +
          game.team1 + '|' + game.team2 + '|' + "true" + '"></label></td><td>' +
          game.name + '</td><td>' +
          game.gametime + '</td><td>' +
          game.team1Slots + '</td><td>N/A</td></tr>');
        }
        else{
          $('#game-list').append('<tr><td><label><input type="radio" name="game" value="' + game.gameid + '|' +
          game.team1 + '|' + game.team2 + '|' + "true" + '"></label></td><td>' +
          game.name + '</td><td>' +
          game.gametime + '</td><td>' +
          game.team1Slots + '</td><td>' + game.team2Slots + '</td></tr>');
        }
        $('#game-signup').bootstrapValidator({
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            team: {
              validators: {
                notEmpty: {
                  message: 'Please select a team'
                }
              }
            },
            game: {
              validators: {
                notEmpty: {
                  message: 'Please select a game'
                }
              }
            }
          }
        });
      }
    }
  });
  $(document).on('change', 'input:radio[name="game"]', function(){
    if(this.className == 'pub'){
      $('#team2').prop('checked', false);
      $('#team2').attr('disabled', true);
      $('#team2').button("refresh");
    }
    else{
      $('#team2').attr('disabled', false);
    }
  });
});
