$(document).ready(function() {
  var retrievedPlay = false;
  var retrievedProfile = false;
  var retrievedChallenges = false;
  var retrievedShop = false;

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
          $.getScript('/schedule.js');
          $.getScript('/calendar-week.js');
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
          $.getScript('/profile.js');
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
          $.getScript('/challenges.js');
        }
      });
    }
  }

  var shop = function(){
    history.pushState(null, '', '/dota?shop');
    if(!retrievedShop){
      retrievedShop = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/shop.ejs',
        success: function(res){
          $("#list-shop").html(res);
          $.getScript('/shop.js');
        }
      });
    }
  }

  if(tab){
    if(tab.indexOf("profile")!=-1){
      $('#list-profile-list').tab('show');
    }
    else if(tab.indexOf("challenges")!=-1){
      $('#list-challenges-list').tab('show');
    }
    else if(tab.indexOf("shop")!=-1){
      $('#list-shop-list').tab('show');
    }
    else{
      $('#list-play-list').tab('show');
    }
  }
  else{
    $('#list-play-list').tab('show');
  }

  $('#list-play-list').on('shown.bs.tab', play);
  $('#list-profile-list').on('shown.bs.tab', profile);
  $('#list-challenges-list').on('shown.bs.tab', challenges);
  $('#list-shop-list').on('shown.bs.tab', shop);

  //Set quote carousel interval
  $('.carousel').carousel({
    interval: 5000
  });
  //Enable tooltip
  $('[data-toggle="tooltip"]').tooltip();
});
