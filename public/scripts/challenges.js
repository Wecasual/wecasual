$(document).ready(function(){
  var availChallenge;
  var playerChallenge;
  var playerChallengeid = new Array();
  var selectedChallenge;

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
    selectedChallenge = this.id.split('-')[1];
    var challenge = getChallenge(selectedChallenge, availChallenge);
    $('#tac-opacity').fadeIn('fast');
    $('#tac-info').slideDown('fast');
    $('#tac-name')[0].innerHTML = challenge.name;
    $('#tac-desc')[0].innerHTML = challenge.description;
    $('#tac-reward')[0].innerHTML = '<img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + " Wecasual Points";
    $('#tac-button')[0].innerHTML = '<div  class="pink-btn btn btn-primary text-center mt-3" id="challenge-signup">Take this challenge</div>';
  });

  //Close challenge info dialog when click outside of box
  $(document).on('click', '#tac-opacity', function(){
    $('#tac-opacity').fadeOut('fast');
    $('#tac-info').slideUp('fast');
  });

  $(document).on('click', '#challenge-signup', function(){
    console.log(selectedChallenge);
  });

  //Populate challenge info on click
  $(document).on('click', '.yc-card', function(){
    selectedChallenge = this.id.split('-')[1];
    var challenge =getChallenge(selectedChallenge, playerChallenge);
    $('#yc-opacity').fadeIn('fast');
    $('#yc-info').slideDown('fast');
    $('#yc-name')[0].innerHTML = challenge.name;
    $('#yc-desc')[0].innerHTML = challenge.description;
    $('#yc-reward')[0].innerHTML = '<img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + " Wecasual Points";
  });

  //Close challenge info dialog when click outside of box
  $(document).on('click', '#yc-opacity', function(){
    $('#yc-opacity').fadeOut('fast');
    $('#yc-info').slideUp('fast');
  });

//Populate challenge info on click
  $(document).on('click', '.cc-card', function(){
    selectedChallenge = this.id.split('-')[1];
    var challenge = getChallenge(selectedChallenge, playerChallenge);
    $('#cc-opacity').fadeIn('fast');
    $('#cc-info').slideDown('fast');
    $('#cc-name')[0].innerHTML = challenge.name;
    $('#cc-desc')[0].innerHTML = challenge.description;
    $('#cc-reward')[0].innerHTML = '<img height="20" width="39" src=/images/coins-gold-dark.png> ' + challenge.wecasualpoints + " Wecasual Points";
  });

  //Close challenge info dialog when click outside of box
  $(document).on('click', '#cc-opacity', function(){
    $('#cc-opacity').fadeOut('fast');
    $('#cc-info').slideUp('fast');
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
