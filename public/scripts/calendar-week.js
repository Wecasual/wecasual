var games;
//Calendar stuff
var Cal = function(divId) {
  //Store div id
  this.divId = divId;

  // Days of week, starting on Sunday
  this.DaysOfWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  // Months, stating on January
  this.Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  // Set the current month, year
  var d = new Date();

  this.currMonth = d.getMonth();
  this.currYear = d.getFullYear();
  this.currDate = d.getDate();
  this.currDay = d.getDay();
  this.weekStart = d.getDate()-this.currDay;
  //Number of weeks to display
  this.weeks = 2;
};


// Goes to next month
Cal.prototype.nextWeek = function() {
  var d = new Date(this.currYear, this.currMonth, this.weekStart);
  d.setDate(d.getDate()+7*this.weeks);
  this.currYear = d.getFullYear();
  this.currMonth = d.getMonth();
  this.weekStart = d.getDate();
  this.showcurr();
};

// Goes to previous month
Cal.prototype.previousWeek = function() {
  var d = new Date(this.currYear, this.currMonth, this.weekStart);
  d.setDate(d.getDate()-7*this.weeks);
  this.currYear = d.getFullYear();
  this.currMonth = d.getMonth();
  this.weekStart = d.getDate();
  this.showcurr();
};

// Show current month
Cal.prototype.showcurr = function() {
  this.showWeek(this.currYear, this.currMonth, this.weekStart);
};

// Show month (year, month)
Cal.prototype.showWeek = function(y, m, d) {

  //Create start date for week
  var dStart = new Date(y, m, d);

  //Create end date for week
  var dEnd = new Date(y, m, d);
  dEnd.setDate(dEnd.getDate()+7*this.weeks);


  var html = '';

  // Write week range to header
  html += '<thead><tr>';
  html += '<td class="calendar" colspan="7">' + this.Months[dStart.getMonth()] + ' ' +
  dStart.getDate() + ' - ' + this.Months[dEnd.getMonth()] + ' ' + dEnd.getDate() + ', ' + dEnd.getFullYear() +
    '<button id="btnPrev" type="button">&#9664</button><button id="btnNext" type="button">&#9654</button></td>';
  html += '</tr></thead>';


  // Write the header of the days of the week
  html += '<tr>';
  for(var i=0; i < this.DaysOfWeek.length;i++) {
    html += '<td class="days"><div class="m-1">' + this.DaysOfWeek[i] + '</div></td>';
  }

  //Close row and begin days
  html += '</tr><tr>';

  var today = new Date();
  // Write the days
  for(var i = 0; i < (7*this.weeks); i++){
    //If at end of week but not 0 then close the row
    if(i%7 == 0 && i != 0){
      html += '</tr>';
      //If not last week being displayed, open another row
      if(i != (7*this.weeks-1)){
        html += '<tr>';
      }
    }
    //Write the current day in the loop
    //If the date is today then set class to today (highlights the date)
    if (today.getFullYear() == dStart.getFullYear() && today.getMonth() == dStart.getMonth() && today.getDate() == dStart.getDate()) {
      html += '<td class="calendar today"><div class="m-1">' + dStart.getDate() + '</div><div id="' + dStart.getFullYear() + '-' +
      addZero(dStart.getMonth()+1) + '-' + addZero(dStart.getDate()) + '"></div></td>';
    } else {
      html += '<td class="calendar normal"><div class="m-1">' + dStart.getDate() + '</div><div id="' + dStart.getFullYear() + '-' +
      addZero(dStart.getMonth()+1) + '-' + addZero(dStart.getDate()) + '"></div></td>';
    }
    //Increment the date to the next day of the week
    dStart.setDate(dStart.getDate()+1);

  }
  // Closes table


  // Write HTML to the div
  document.getElementById(this.divId).innerHTML = html;
};

// Start on load
$(document).ready(function(){
  // Start calendar
  var c = new Cal("divCal");
  c.showcurr();
  getRangeSchedule(c.currYear, c.currMonth, c.weekStart, c.weeks);

  // Bind next and previous button clicks
  $(document).on('click', '#btnNext', function() {
    c.nextWeek();
    getRangeSchedule(c.currYear, c.currMonth, c.weekStart, c.weeks);
  });
  $(document).on('click', '#btnPrev', function() {
    c.previousWeek();
    getRangeSchedule(c.currYear, c.currMonth, c.weekStart, c.weeks);
  });

  //Display game info when a game is clicked on
  $(document).on('click', '.calendar-card', function(){
    $('.game-info-opacity').fadeIn('fast');
    $('.game-info').slideDown('fast');
    var game = getGame(this.id.substring(7, this.id.length));

    //Add header
    $('#game-title')[0].innerHTML = game.name;
    $('#game-time')[0].innerHTML = game.gametime;
    $('#team1-slots')[0].innerHTML = game.team1Slots;
    $('#team2-slots')[0].innerHTML = game.team2Slots;
    $('#signup-link')[0].innerHTML = '<a class="pink-btn btn btn-primary" href="/schedule/dota/quickLink?id=' + game.gameid + '">Play in this game</a>'
    $.ajax({
      type: 'POST',
      url: '/profile/getUsers',
      data: JSON.stringify({
        team1: game.team1,
        team2: game.team2
      }),
      contentType: 'application/json',
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          //Add teams
          for(var i = 1; i <= 2; i++){
            html = "";
            res.data["team" + i].forEach(function(player){
              var avatar = player.avatar;
              if(avatar.includes('null')){
                avatar='/images/avatar-default.png';
              }
              else{
                html += '<a class="roster-link" href="dota/players?playerid=' + player.playerid + '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' + player.username + '</div></a>';
              }
            });
            $('#team' + i + '-roster')[0].innerHTML = html;
          }
        }
      }
    });
  });

  //Close game info dialog when click outside of box
  $(document).on('click', '.game-info-opacity', function(){
    $('.game-info-opacity').fadeOut('fast');
    $('.game-info').slideUp('fast');
  });

});

//Return games within a date range starting from startYear/startMonth/weekStart to weekStart+7*weeks (2 weeks from weekStart)
function getRangeSchedule(startYear, startMonth, weekStart, weeks){
  var dStart = new Date(startYear, startMonth, weekStart);
  var dEnd = new Date(startYear, startMonth, weekStart);
  dEnd.setDate(dEnd.getDate()+7*weeks);
  $.ajax({
    type: 'POST',
    url: '/schedule/getRangeSchedule',
    data: {
      startDate: dStart.getFullYear() + '/' + (dStart.getMonth()+1) + '/' + dStart.getDate() + 'T00:00:00 -0500',
      endDate: dEnd.getFullYear() + '/' + (dEnd.getMonth()+1) + '/' + dEnd.getDate() + 'T00:00:00 -0500',
    },
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        games = res.data;
        games.forEach(function(game){
          var elementid = '#' + game.gametime.substring(0, 10).replace(/\//g, '-');
          $(elementid).append('<div id="gameid-' + game.gameid + '"class="card rounded calendar-card m-1 pl-1"><div class="calendar-game-time">' + game.gametime.substring(10, 18) + '</div><div>' + game.name + '</div></div>');
        });
      }
    }
  });
}

//Find game by gameid in games array
function getGame(gameid){
  var i = 0;
  do{
    if(games[i].gameid == gameid){
      return games[i];
    }
    i++;
  }while(i < games.length);
  return -1;

}

//Add a 0 before a date if it is a one digit number
function addZero(num){
  if(num.toString().length < 2){
    return "0" + num.toString();
  }
  return num;
}

// Get element by id
function getId(id) {
  return document.getElementById(id);
}
