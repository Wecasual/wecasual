function createGame(pool, team1, team2, date, attendance1, attendance2, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      // console.log(attendance1);
      var queryString = "INSERT INTO schedule (team1, team2, date, attendance1, attendance2) VALUES (" + team1 + "," + team2 + ",\'" + date + "\',\'" + JSON.stringify(attendance1) + "\',\'" + JSON.stringify(attendance2) + "\') RETURNING id";
      // console.log(queryString);
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null, result.rows[0].id);
        }
      });
    }
  });
}

function getAllSchedule(pool, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT\
                            t.name,\
                            t.id,\
                            s.date,\
                            s.id AS gameID\
                          FROM schedule AS s\
                          INNER JOIN teams AS t ON s.team1 = t.id\
                          OR\
                          s.team2 = t.id\
                          WHERE\
                          s.date > now();";
      //console.log(queryString);
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          var data = new Array();
          var sorted = result.rows.sort(function(a,b){
            var c = new Date(a.gameid);
            var d = new Date(b.gameid);
            return c-d;
          });
          //console.log(result.rows);
          for(var i = 0; i < result.rows.length;  i+=2){
            var row1= sorted[i];
            var row2= sorted[i+1];
            data.push({
              team1: {
                name: row1.name,
                id: row1.id
              },
              team2: {
                name: row2.name,
                id: row2.id
              },
              date: row1.date.toDateString(),
              gameid: row1.gameid
            });
          }
          data.sort(function(a,b){
            var c = new Date(a.date);
            var d = new Date(b.date);
            return c-d;
          });
          callback && callback(null, data);
        }
      });
    }
  });
}

function getOneSchedule(pool, teamid, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "SELECT\
                          t.name,\
                          t.id,\
                          s.team1,\
                          s.team2,\
                          s.date,\
                          s.id AS gameID,\
                          s.attendance1,\
                          s.attendance2\
                        FROM schedule AS s\
                        INNER JOIN teams AS t ON s.team1 = t.id\
                        OR\
                        s.team2 = t.id\
                        WHERE\
                        team1 = " + teamid + "\
                        OR\
                        team2 = " + teamid + "\
                        AND\
                        s.date > now();";
      // "SELECT schedule.date, schedule.team1, schedule.team2, teams.name FROM schedule\
      //                   WHERE\
      //                   team1 = " + teamid + "\
      //                   OR\
      //                   team2 = " + teamid + "\
      //                   AND\
      //                   date > now()";
      //console.log(queryString);
      client.query(queryString, function(err, result){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          var data = new Array();
          var sorted = result.rows.sort(function(a,b){
            var c = new Date(a.gameid);
            var d = new Date(b.gameid);
            return c-d;
          });
          //console.log(result.rows);
          for(var i = 0; i < result.rows.length;  i+=2){
            var row1= sorted[i];
            var row2= sorted[i+1];
            var playerObj = {
              date: row1.date.toDateString(),
              gameid: row1.gameid,
              attendance1: row1.attendance1,
              attendance2: row1.attendance2
            };
            if(row1.team1 == row1.id){
              playerObj.team1 = {
                name: row1.name,
                id: row1.id
              }
              playerObj.team2 = {
                name: row2.name,
                id: row2.id
              }
            }
            else if(row1.team2 == row1.id){
              playerObj.team2 = {
                name: row1.name,
                id: row1.id
              }
              playerObj.team1 = {
                name: row2.name,
                id: row2.id
              }
            }
            data.push(playerObj);
          }
          //console.log(data);
          data.sort(function(a,b){
            var c = new Date(a.date);
            var d = new Date(b.date);
            return c-d;
          });
          callback && callback(null, data);
        }
      });
    }
  });
}

function updateAttendance(pool, gameid, userid, attendance, teamNum, callback){
  //console.log(gameid, userid, attendance, teamNum);
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "UPDATE schedule\
                        SET attendance" + teamNum + " = attendance" + teamNum + " || '{\"" + userid + "\": \"" + attendance + "\"}'\
                        WHERE id = " + gameid;
      //console.log(queryString);
      client.query(queryString, function(err){
        if(err){
          client.release();
          console.log(err);
          callback && callback(err);
        }
        else{
          client.release();
          callback && callback(null);
        }
      });
    }
  });
}


module.exports = pool => {
  return{
    createGame: createGame.bind(null, pool),
    getAllSchedule: getAllSchedule.bind(null, pool),
    getOneSchedule: getOneSchedule.bind(null, pool),
    updateAttendance: updateAttendance.bind(null, pool)
  }
}
