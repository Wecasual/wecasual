$(document).ready(function(){
  var pathname = window.location.pathname;
  var url = window.location.href;
  var id = url.split('=')[1];
  var domain = url.split('schedule')[0];
  console.log(id);
  console.log(domain);
  var table;
  var realm;
  if(pathname == "/schedule/dota/quickLink"){
    table = "Schedule-Dota";
    realm = "dota"
  }
  $.ajax({
    type: 'POST',
    url: '/schedule/getSingleGame',
    data: JSON.stringify({table: table, id: id}),
    contentType: 'application/json',
    success: function(res){
      if(!res.success){
        alert(res.error);
        window.location.href = domain + realm;
      }
      else if(res.success){
        // console.log(res.data);
        game = res.data;
        if(game.fields['Pub Session']){
          $('#game-list').append('<tr><td><label><input class="pub" type="radio" name="game" value="' + game.id + '|' +
          game.fields['Team 1'] + '|' + game.fields['Team 2'] + '|' + table + '"></label></td><td>' +
          game.fields.Game + '</td><td>' +
          game.fields['Game Time'] + '</td><td>' +
          game.fields['Team 1 Slots'] + '</td><td>' + game.fields['Team 2 Slots'] + '</td></tr>');
        }
        else{
          $('#game-list').append('<tr><td><label><input type="radio" name="game" value="' + game.id + '|' +
          game.fields['Team 1'] + '|' + game.fields['Team 2'] + '|' + table + '"></label></td><td>' +
          game.fields.Game + '</td><td>' +
          game.fields['Game Time'] + '</td><td>' +
          game.fields['Team 1 Slots'] + '</td><td>' + game.fields['Team 2 Slots'] + '</td></tr>');
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
