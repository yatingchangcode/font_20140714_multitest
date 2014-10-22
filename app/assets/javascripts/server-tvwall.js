      function showCorrectUsers(users) {
            users.sort(function(a,b) {
              return parseInt(a) - parseInt(b);
            });
            
            for (var i in users) { 
              setTimeout( (function(a){
                return function() {
                  console.log(a);
                  $("#yes_img_"+a).show();
                }
              })(users[i]), 400 * i);
            }
            users = null;
      }