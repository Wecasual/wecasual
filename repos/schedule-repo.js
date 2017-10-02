function createGame(pool, team1, team2, date, callback){
  pool.connect(function(err, client){
    if(err){
      console.log(err);
      callback && callback(err);
    }
    else{
      var queryString = "INSERT INTO schedule (team1, team2, date) VALUES (" + team1 + "," + team2 + ",\'" + date + "\') RETURNING id";
      //console.log(queryString);
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
                          s.date,\
                          s.id AS gameID\
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



module.exports = pool => {
  return{
    createGame: createGame.bind(null, pool),
    getAllSchedule: getAllSchedule.bind(null, pool),
    getOneSchedule: getOneSchedule.bind(null, pool)
  }
}
