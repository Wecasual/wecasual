$(document).ready(function() {
  var retrievedPlay = false;
  var retrievedProfile = false;
  var retrievedChallenges = false;

  var url = window.location.href;
  var tab = url.split('?')[1];
  var page = url.split('?')[0];

  var play = function(){
    history.pushState(null, '', '/dota?play');
    if(!retrievedPlay){
      retrievedPlay = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/play.ejs',
        success: function(res){
          $("#list-play").html(res);
        }
      });
    }
  }
  var profile = function(){
    history.pushState(null, '', '/dota?profile');
    if(!retrievedProfile){
      retrievedProfile = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/profile.ejs',
        success: function(res){
          $("#list-profile").html(res);
        }
      });
    }
  }
  var challenges = function(){
    history.pushState(null, '', '/dota?challenges');
    if(!retrievedChallenges){
      retrievedChallenges = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/challenges.ejs',
        success: function(res){
          $("#list-challenges").html(res);
        }
      });
    }
  }

  if(tab === "profile"){
    $('#list-profile-list').tab('show');
  }
  else if(tab === "challenges"){
    $('#list-challenges-list').tab('show');
  }
  else{
    $('#list-play-list').tab('show');
  }

  $('#list-play-list').on('shown.bs.tab', play);
  $('#list-profile-list').on('shown.bs.tab', profile);
  $('#list-challenges-list').on('shown.bs.tab', challenges);
});
