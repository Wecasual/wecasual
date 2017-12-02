//EVENT LISTENERS
var availChallenge;
var playerChallenge;
var playerChallengeid = new Array();
var selectedChallenge;
var playerid = $("#userid").html();

/*Note
yc - your challenges
tac - take a challenge
cc - completed challenges
*/

//Get all player challenges
//Get all other available challenges
$.ajax({
  type: 'POST',
  url: '/challenge/getChallenge',
  success: function(res){
    if(!res.success){
      alert(res.error);
    }
    else if(res.success){
      playerChallenge = res.data.playerChallenge;
      var ychtml = "";//Populate yourChallenges list
      var cchtml = "";//Populate completeChallenges list
      playerChallenge.forEach(function(challenge){
        if(!challenge.completed){
          ychtml += ' <div class="challenge-card p-1 mb-1 yc-card" id="challenge-' + challenge.challengeid + '">' + challenge.name +
          '<div class="challenge-points"><img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + '</div></div>';
        }
        else{
          cchtml += ' <div class="challenge-card p-1 mb-1 cc-card" id="challenge-' + challenge.challengeid + '">' + challenge.name +
          '<div class="challenge-points"><img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + '</div></div>';
        }

        playerChallengeid.push(challenge.challengeid);
      });
      if(ychtml){
        $('#yourChallenges').html(ychtml);
      }
      else{
        $('#yourChallenges').html('<p>You have not taken any challenges</p>');
      }
      if(cchtml){
        $('#completedChallenges').html(cchtml);
      }
      else{
        $('#completedChallenges').html('<p>You have not completed any challenges</p>');
      }


      availChallenge = res.data.availChallenge;
      tachtml = "";//Populate takeAChallenge list
      availChallenge.forEach(function(challenge){
        if(playerChallengeid.indexOf(challenge.challengeid) == -1){
          tachtml += ' <div class="challenge-card p-1 mb-1 tac-card" id="challenge-' + challenge.challengeid + '">' + challenge.name +
          '<div class="challenge-points"><img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + '</div></div>';
        }
      });
      if(tachtml){
        $('#takeAChallenge').html(tachtml);
      }
      else{
        $('#takeAChallenge').html('<p>There are currently no available challenges</p>');
      }

    }
  }
});

//Populate challenge info on click
$(document).on('click', '.tac-card', function(){
  selectedChallenge = showCard('tac', availChallenge, this.id);
  var html = '<div  class="pink-btn btn btn-primary text-center mt-2 mb-1" id="challenge-signup">Take this challenge</div>';
  $('#challenge-actions').html(html);
});

//Take a challenge
$(document).on('click', '#challenge-signup', function(){
  $.ajax({
    type: 'POST',
    url: '/challenge/acceptChallenge',
    data: {
      challengeid: selectedChallenge
    },
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        location.reload();
      }
    }
  });
});

//Populate challenge info on click
$(document).on('click', '.yc-card', function(){
  selectedChallenge = showCard('yc', playerChallenge, this.id);
  var challenge = getChallenge(selectedChallenge, playerChallenge);
  var dStart = new Date(challenge.startdate);
  var dEnd = new Date();
  dEnd.setDate(dEnd.getDate()+1);
  $('#challenge-complete-form-container').show();
  $.ajax({
    type: 'POST',
    url: 'schedule/getRangeSchedule',
    data: {
      startDate: dStart.getFullYear() + '/' + (dStart.getMonth()+1) + '/' + dStart.getDate() + 'T00:00:00 -0500',
      endDate: dEnd.getFullYear() + '/' + (dEnd.getMonth()+1) + '/' + dEnd.getDate() + 'T00:00:00 -0500'
    },
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var html = '<option value="" disabled selected>Select a game</option>';
        res.data.forEach(function(game){
          if((game.team1.indexOf(parseInt(playerid)) != -1 || game.team2.indexOf(parseInt(playerid)) != -1) && checkGame(game.gameid, playerChallenge)){
              html += '<option value = "' + game.gameid + '" >' + game.name + ' - ' + game.gametime + '</option>';
          }
        });
        $('#challenge-game').html(html);
      }
      //
    }
  });
});

//Setup challenge complete form validator
$('#challenge-complete-form').bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    challengeGame: {
      validators: {
        notEmpty: {
          message: 'Select the game the challenge was completed in'
        }
      }
    }
    // matchid: {
    //   validators: {
    //     notEmpty: {
    //       message: 'Input the match id for the match the challenge was completed in'
    //     },
    //     integer: {
    //       message: 'Invalid match id'
    //     },
    //     stringLength: {
    //       message: 'Invalid match id',
    //       min: 10,
    //       max: 10
    //     }
    //   }
    // }
  }
})
.on('error.field.bv', function(e, data) {
  data.element
    .data('bv.messages')
    // Hide all the messages
    .find('.help-block[data-bv-for="' + data.field + '"]').hide()
    // Show only message associated with current validator
    .filter('[data-bv-validator="' + data.validator + '"]').show();
})
.on('success.form.bv', function(e){
  e.preventDefault();
  var wecasualpoints = getChallenge(selectedChallenge, playerChallenge).wecasualpoints;
  $.ajax({
    type: 'POST',
    url: '/challenge/completeChallenge',
    data: {
      challengeid: selectedChallenge,
      wecasualpoints: wecasualpoints,
      gameid: $('#challenge-game').val()
    },
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        location.reload();
      }
    }
  });
});


//Populate challenge info on click
$(document).on('click', '.cc-card', function(){
  selectedChallenge = showCard('cc', playerChallenge, this.id);
});

//Close challenge info dialog when click outside of box
$(document).on('click', '#challenge-opacity', function(){
  $('#challenge-opacity').fadeOut('fast');
  $('#challenge-info').slideUp('fast');
  $('#challenge-complete-form-container').hide();
});

//Find challenge by challengeid in speicified array
function getChallenge(challengeid, array){
  var i = 0;
  do{
    if(array[i].challengeid == challengeid){
      return array[i];
    }
    i++;
  }while(i < array.length);
  return -1;
}

function checkGame(gameid, array){
  var i = 0;
  do{
    if(array[i].gameid == gameid){
      return false;
    }
    i++;
  }while(i < array.length);
  return true;
}

//Populate a card in specified list (yc, tac, or cc)
function showCard(list, array, id){
  var selectedChallenge = id.split('-')[1];
  var challenge = getChallenge(selectedChallenge, array);
  $('#challenge-name').html(challenge.name);
  $('#challenge-desc').html(challenge.description);
  $('#challenge-reward').html('<img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + " Wecasual Points");
  if(list != 'cc'){
    var date = new Date(challenge.startdate);
    date.setDate(date.getDate()+14);
    $('#challenge-expiry').html('Expires: ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate());
  }
  else{
    var date = new Date(challenge.completeddate);
    $('#challenge-expiry').html('Completed: ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate());
  }
  $('#challenge-opacity').fadeIn('fast');
  $('#challenge-info').slideDown('fast');
  return selectedChallenge;
}
