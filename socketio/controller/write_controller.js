
module.exports = function(socket,emitUserId){


    var game_id,stage_name,visitors;

    socket.on('down_location',function(msg){
        emitUserId('0','down_location',msg);
    });

    socket.on('move_location',function(msg){
        emitUserId('0','move_location',msg);
    });

    socket.on('up_location',function(msg){
        emitUserId('0','up_location',msg);
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
        emitUserId('0','submit',msg);
    });

    socket.on('cancelSubmit',function(msg){
        emitUserId('0','cancelSubmit',msg);
    });

    //
    socket.on('set_gameinfo_to_socket',function(msg){
        game_id = msg.game;
        stage_name = msg.stage;
        visitors = msg.visitors.split(",");
    });

    //
    socket.on('action',function(msg){
        emitUserId(msg.user_id,'action', msg);
        emitUserId('0','action',msg);
    });

    socket.on('right',function(msg){
        emitUserId('0','right',msg.user_id);
    });

    socket.on('removeO',function(msg){
        emitUserId('0','removeO',msg.user_id);
    });

    socket.on('reset',function(msg){
        socket.broadcast.emit('reset',msg);
    });

    //
    socket.on('continue_write',function(msg){
        emitUserId(msg.user_id,'continue_write', msg);
        emitUserId('0','continue_write',msg);
    });

    socket.on('setCorrectCount',function(msg){
        emitUserId('0','setCorrectCount',msg);
    });

    socket.on('showCorrectUsers',function(msg){
        emitUserId('0','showCorrectUsers',msg);
    });

    socket.on('userOut',function(msg){
        emitUserId('0','userOut',msg);
    });

    return socket;
}
