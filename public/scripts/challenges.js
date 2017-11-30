$(document).ready(function(){
  var availChallenge;
  var playerChallenge;
  var playerChallengeid = new Array();
  var selectedChallenge;

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
        $('#yourChallenges').html(ychtml);
        $('#completedChallenges').html(cchtml);

        availChallenge = res.data.availChallenge;
        tachtml = "";//Populate takeAChallenge list
        availChallenge.forEach(function(challenge){
          if(playerChallengeid.indexOf(challenge.challengeid) == -1){
            tachtml += ' <div class="challenge-card p-1 mb-1 tac-card" id="challenge-' + challenge.challengeid + '">' + challenge.name +
            '<div class="challenge-points"><img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + '</div></div>';
          }
        });
        $('#takeAChallenge').html(tachtml);
      }
    }
  });

  //Populate challenge info on click
  $(document).on('click', '.tac-card', function(){
    selectedChallenge = showCard('tac', availChallenge, this.id);
    $('#tac-button')[0].innerHTML = '<div  class="pink-btn btn btn-primary text-center mt-3" id="challenge-signup">Take this challenge</div>';
  });

  //Close challenge info dialog when click outside of box
  $(document).on('click', '#tac-opacity', function(){
    hideCard('tac');
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
    $('#yc-button')[0].innerHTML = '<div  class="pink-btn btn btn-primary text-center mt-3" id="challenge-complete">Mark as complete</div>';
  });

  //Close challenge info dialog when click outside of box
  $(document).on('click', '#yc-opacity', function(){
    hideCard('yc');
  });

  $(document).on('click', '#challenge-complete', function(){
    var wecasualpoints = getChallenge(selectedChallenge, playerChallenge).wecasualpoints;
    $.ajax({
      type: 'POST',
      url: '/challenge/completeChallenge',
      data: {
        challengeid: selectedChallenge,
        wecasualpoints: wecasualpoints
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
  $(document).on('click', '#cc-opacity', function(){
    hideCard('cc');
  });
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


//Populate a card in specified list (yc, tac, or cc)
function showCard(list, array, id){
  var selectedChallenge = id.split('-')[1];
  var challenge = getChallenge(selectedChallenge, array);
  $('#' + list + '-container').css('min-height', '200px');
  $('#' + list + '-opacity').fadeIn('fast');
  $('#' + list + '-info').slideDown('fast');
  $('#' + list + '-name')[0].innerHTML = challenge.name;
  $('#' + list + '-desc')[0].innerHTML = challenge.description;
  $('#' + list + '-reward')[0].innerHTML = '<img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + " Wecasual Points";
  if(list != 'cc'){
    var date = new Date(challenge.startdate);
    date.setDate(date.getDate()+7);
    $('#' + list + '-expiry')[0].innerHTML = 'Expires: ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
  }
  else{
    var date = new Date(challenge.completeddate);
    $('#' + list + '-expiry')[0].innerHTML = 'Completed: ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
  }
  return selectedChallenge;
}

//Hide a card in specified list (yc, tac, or cc)
function hideCard(list){
  $('#' + list + '-container').css('min-height', '');
  $('#' + list + '-opacity').fadeOut('fast');
  $('#' + list + '-info').slideUp('fast');
}
