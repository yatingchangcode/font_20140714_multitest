var helper = require('./helper');

module.exports = function(socket,io){

    var game_id,stage_name,visitors;

    socket.on('down_location',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('down_location',msg)
        });
    });

    socket.on('move_location',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('move_location',msg)
        });
    });

    socket.on('up_location',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('up_location',msg)
        });
    });

    //
    socket.on('clear', function(msg){
        socket.broadcast.emit('clear',msg);
    })

    //
    socket.on('clearAll',function(){
        socket.broadcast.emit('clear');
    })

    socket.on('submit',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('submit',msg)
        });
    });

    socket.on('cancelSubmit',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('cancelSubmit',msg)
        });
    });

    //
    socket.on('set_gameinfo_to_socket',function(msg){
        game_id = msg.game;
        stage_name = msg.stage;
        visitors = msg.visitors.split(",");
    });

    //
    socket.on('action',function(msg){

        helper.emitUserId(msg.user_id,function(x){
            io.to(x).emit('action',msg)
        });
        helper.emitUserId('0',function(x){
            io.to(x).emit('action',msg)
        });
    });

    socket.on('right',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('right',msg.user_id)
        });
    });

    socket.on('removeO',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('removeO',msg.user_id)
        });
    });

    socket.on('reset',function(msg){
        socket.broadcast.emit('reset',msg);
    });

    //
    socket.on('continue_write',function(msg){
        helper.emitUserId(msg.user_id,function(x){
            io.to(x).emit('continue_write',msg)
        });
        helper.emitUserId('0',function(x){
            io.to(x).emit('continue_write',msg)
        });
    });

    socket.on('setCorrectCount',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('setCorrectCount',msg)
        });
    });

    socket.on('showCorrectUsers',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('showCorrectUsers',msg)
        });
    });

    socket.on('userOut',function(msg){
        helper.emitUserId('0',function(x){
            io.to(x).emit('userOut',msg)
        });
    });

    return socket;
}
