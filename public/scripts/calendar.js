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
  this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  // Set the current month, year
  var d = new Date();

  this.currMonth = d.getMonth();
  this.currYear = d.getFullYear();
  this.currDay = d.getDate();

};

// Goes to next month
Cal.prototype.nextMonth = function() {
  if ( this.currMonth == 11 ) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
  }
  else {
    this.currMonth = this.currMonth + 1;
  }
  this.showcurr();
};

// Goes to previous month
Cal.prototype.previousMonth = function() {
  if ( this.currMonth == 0 ) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
  }
  else {
    this.currMonth = this.currMonth - 1;
  }
  this.showcurr();
};

// Show current month
Cal.prototype.showcurr = function() {
  this.showMonth(this.currYear, this.currMonth);
};

// Show month (year, month)
Cal.prototype.showMonth = function(y, m) {

  var d = new Date()
  // First day of the week in the selected month
  , firstDayOfMonth = new Date(y, m, 1).getDay()
  // Last day of the selected month
  , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
  // Last day of the previous month
  , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();


  var html = '<table class="table-calendar">';

  // Write selected month and year
  html += '<thead><tr>';
  html += '<td class="calendar" colspan="7">' + this.Months[m] + ' ' + y + '</td>';
  html += '</tr></thead>';


  // Write the header of the days of the week
  html += '<tr>';
  for(var i=0; i < this.DaysOfWeek.length;i++) {
    html += '<td class="days"><div class="m-1">' + this.DaysOfWeek[i] + '</div></td>';
  }
  html += '</tr>';

  // Write the days
  var i=1;
  do {

    var dow = new Date(y, m, i).getDay();

    // If Sunday, start new row
    if ( dow == 0 ) {
      html += '<tr>';
    }
    // If not Sunday but first day of the month
    // it will write the last days from the previous month
    else if ( i == 1 ) {
      html += '<tr>';
      var k = lastDayOfLastMonth - firstDayOfMonth+1;
      for(var j=0; j < firstDayOfMonth; j++) {
        html += '<td class="calendar not-current"></td>';
        // html += '<td class="calendar not-current"><div class="m-1">' + k + '</div><div class="card rounded calendar-game m-1 pl-1"></div></td>';
        k++;
      }
    }

    // Write the current day in the loop
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
      html += '<td class="calendar today"><div class="m-1">' + i + '</div><div id="' + this.currYear + '-' +
      addZero(this.currMonth+1) + '-' + addZero(i) + '"></div></td>';
    } else {
      html += '<td class="calendar normal"><div class="m-1">' + i + '</div><div id="' + this.currYear + '-' +
      addZero(this.currMonth+1) + '-' + addZero(i) + '"></div></td>';
    }
    // If Saturday, closes the row
    if ( dow == 6 ) {
      html += '</tr>';
    }
    // If not Saturday, but last day of the selected month
    // it will write the next few days from the next month
    else if ( i == lastDateOfMonth ) {
      var k=1;
      for(dow; dow < 6; dow++) {
        html += '<td class="calendar not-current"></td>';
        // html += '<td class="calendar not-current"><div class="m-1">' + k + '</div><div class="card rounded calendar-game m-1 pl-1"></div></td>';
        k++;
      }
    }

    i++;
  }while(i <= lastDateOfMonth);

  // Closes table
  html += '</table class="table-calendar">';

  // Write HTML to the div
  document.getElementById(this.divId).innerHTML = html;
};

// Start on load
$(document).ready(function(){
  // Start calendar
  var c = new Cal("divCal");
  c.showcurr();
  getRangeSchedule(c.currMonth, c.currYear);

  // Bind next and previous button clicks
  getId('btnNext').onclick = function() {
    c.nextMonth();
    getRangeSchedule(c.currMonth, c.currYear);
  };
  getId('btnPrev').onclick = function() {
    c.previousMonth();
    getRangeSchedule(c.currMonth, c.currYear);
  };
});

function getRangeSchedule(startMonth, startYear){
  var endMonth;
  var endYear = startYear;
  if ( startMonth == 11 ) {
    endMonth = 0;
    endYear = startYear + 1;
  }
  else {
    endMonth = startMonth + 1;
  }
  var startDate = new Date(startYear, startMonth);
  var endDate = new Date(endYear, endMonth);
  $.ajax({
    type: 'POST',
    url: '/schedule/getRangeSchedule',
    data: {
      startDate: startDate.getFullYear() + '/' + (startDate.getMonth()+1) + '/1T00:00:00 -0500',
      endDate: endDate.getFullYear() + '/' + (endDate.getMonth()+1) + '/1T00:00:00 -0500',
    },
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(game){
          var elementid = '#' + game.gametime.substring(0, 10).replace(/\//g, '-');
          $(elementid).append('<div id="gameid-' + game.gameid + '"class="card rounded calendar-game m-1 pl-1"><div class="calendar-game-time">' + game.gametime.substring(10, 18) + '</div><div>' + game.name + '</div></div>');
        });
      }
    }
  });
}

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
