        var gamers = {
            gamersList : [],
            last: null,
            next : function() {
                var newgamer = this.gamersList.shift();
                this.gamersList.push(newgamer);
                this.last = newgamer;
                return newgamer;
            },
            prev: function() {
                return this.last;
            },
            push : function(i) {
              this.gamersList.push(i);
            }, 
            remove : function(i) {
              var idx = this.gamersList.indexOf(i);
              if (idx > -1) {
                  this.gamersList.splice(idx, 1);
              }
            },

            all: function() {
              return this.gamersList.slice(0);
            },

            setActive: function(i) {
              this.last = i;
              var idx = this.gamersList.indexOf(i);
              var head = this.gamersList.splice(0, idx+1);
              this.gamersList = this.gamersList.concat(head);
              console.log(this.gamersList);
            }
        };