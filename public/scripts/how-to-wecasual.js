$(document).ready(function() {
  var retrievedStart = false;
  var retrievedFAQ = false;
  var retrievedGeneralRules = false;
  var retrievedGamemodeRules = false;

  var url = window.location.href;
  var tab = url.split('?')[1];
  var page = url.split('?')[0];
  console.log(page);

  var start = function(){
    history.pushState(null, '', '/how-to-wecasual?start');
    if(!retrievedStart){
      retrievedStart = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/start.ejs',
        success: function(res){
          $("#list-start").html(res);
        }
      });
    }
  }
  var FAQ = function(){
    history.pushState(null, '', '/how-to-wecasual?FAQ');
    if(!retrievedFAQ){
      retrievedFAQ = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/FAQ.ejs',
        success: function(res){
          $("#list-FAQ").html(res);
        }
      });
    }
  }
  var generalRules = function(){
    history.pushState(null, '', '/how-to-wecasual?general-rules');
    if(!retrievedGeneralRules){
      retrievedGeneralRules = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/general-rules.ejs',
        success: function(res){
          $("#list-general-rules").html(res);
        }
      });
    }
  }

  var gamemodeRules = function(){
    history.pushState(null, '', '/how-to-wecasual?gamemode-rules');
    if(!retrievedGamemodeRules){
      retrievedGamemodeRules = true;
      $.ajax({
        async: true,
        type: 'POST',
        url: '/gamemode-rules.ejs',
        success: function(res){
          $("#list-gamemode-rules").html(res);
        }
      });
    }
  }

  if(tab){
    if(tab.indexOf("FAQ")!=-1){
      $('#list-FAQ-list').tab('show');
    }
    else if(tab.indexOf("general-rules")!=-1){
      $('#list-general-rules-list').tab('show');
    }
    else if(tab.indexOf("gamemode-rules")!=-1){
      $('#list-gamemode-rules-list').tab('show');
    }
    else{
      $('#list-start-list').tab('show');
    }
  }
  else{
    $('#list-start-list').tab('show');
  }

  $('#list-start-list').on('shown.bs.tab', start);
  $('#list-FAQ-list').on('shown.bs.tab', FAQ);
  $('#list-general-rules-list').on('shown.bs.tab', generalRules);
  $('#list-gamemode-rules-list').on('shown.bs.tab', gamemodeRules);

  //Enable tooltip
  $('[data-toggle="tooltip"]').tooltip();
});
